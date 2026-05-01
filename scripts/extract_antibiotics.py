#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
extract_antibiotics.py - antibiotic_books_raw.json から NotebookLM で抗菌薬JSONを生成

使い方:
  PYTHONUTF8=1 python scripts/extract_antibiotics.py              # 全薬剤
  PYTHONUTF8=1 python scripts/extract_antibiotics.py --ids 1 5 17 # 指定IDのみ
  PYTHONUTF8=1 python scripts/extract_antibiotics.py --from-id 20 # 20番以降

出力: data/antibiotics.json
事前準備: PYTHONUTF8=1 python scripts/scrape_antibiotics.py
"""

import asyncio
import json
import pathlib
import re
import sys
import argparse
import tempfile

from notebooklm import NotebookLMClient

REPO_ROOT   = pathlib.Path(__file__).parent.parent
RAW_PATH    = REPO_ROOT / "data" / "raw" / "antibiotic_books_raw.json"
OUTPUT_PATH = REPO_ROOT / "data" / "antibiotics.json"

# ============================================================
# 抗菌薬専用 抽出プロンプト
# ============================================================
ANTIBIOTIC_PROMPT = """\
以下の資料（抗菌薬インターネットブックの解説ページ）から、抗菌薬の情報を抽出してください。

【重要な指示】
- name は日本語一般名（塩酸塩・硫酸塩等の塩表記は除く）
- dose_us は成人標準用量（米国基準、IDSA等）を「1g IV q8h」形式で
- スペクトラム（mrsa/strep/entero/entero_bac/esbl/pseudo/anaerobe/atypical）は
  「+++」「++」「+」「△」「-」の5段階で評価
  +++: 第一選択レベル、++: 有効、+: 部分的/弱い、△: 耐性多い/条件付き、-: 効果なし
- first_line は IDSA・ATS・主要ガイドラインに基づく第一選択シナリオを簡潔に
  （例: 「CAP軽症・外来（IDSA）」「HAP/VAP緑膿菌カバー要（IDSA）」）
  なければ null
- off_label は添付文書上の適応はないが実臨床・IDSAガイドラインで使われる用途
  （例: 「MRSA皮膚感染（IDSA推奨）」）なければ null
- cross は βラクタム系のアレルギー交差反応を中心に記載。なければ null
- pkpd は「時間依存性（%T>MIC）」「濃度依存性（Cmax/MIC）」「AUC依存性（AUC/MIC）」のいずれか＋補足
- tdm は「要（バンコマイシンTDM）」のように記載。不要なら null
- caution は150字以内。主な副作用・禁忌・注意点
- category は以下のいずれか:
  ペニシリン系 / セファロスポリン第1世代 / セファロスポリン第2世代 /
  セファロスポリン第3世代 / セファロスポリン第4世代 / カルバペネム系 /
  モノバクタム系 / マクロライド系 / テトラサイクリン系 / フルオロキノロン系 /
  アミノグリコシド系 / グリコペプチド系 / リンコサミド系 / オキサゾリジノン系 /
  ST合剤 / ニトロイミダゾール系 / その他
- class はバッジ表示用の短い文字列（例: 「広域ペニシリン」「第3世代セフェム」「カルバペネム」）
- route は「経口」「注射」「経口/注射」のいずれか
- evidence_url は必ず null（ハルシネーション防止）
- 引用番号 [1][2] は除去する
- caution は150字以内

必ずJSON配列のみを返す（説明文・マークダウン記法は不要）:

[
  {
    "name": "薬剤名（日本語一般名、塩表記なし）",
    "brand": "商品名（複数なら「・」区切り）",
    "category": "カテゴリ（上記リストから選択）",
    "class": "クラスバッジ（短く）",
    "mechanism": "作用機序（100〜200字、改行は\\nで）",
    "pkpd": "PK/PD特性（例: 時間依存性（%T>MIC）。βラクタム系の基本特性）",
    "dose_us": "米国成人標準用量（例: 1g IV q8h）",
    "route": "経口 / 注射 / 経口/注射",
    "first_line": "第一選択シナリオ（なければnull）",
    "off_label": "適応外使用（IDSA推奨）（なければnull）",
    "cross": "交差アレルギー情報（なければnull）",
    "caution": "注意事項（150字以内）",
    "tdm": "TDM要否（不要ならnull）",
    "mrsa": "+++/++/+/△/-",
    "strep": "+++/++/+/△/-",
    "entero": "+++/++/+/△/-（腸球菌）",
    "entero_bac": "+++/++/+/△/-（腸内細菌科）",
    "esbl": "+++/++/+/△/-（ESBL産生菌）",
    "pseudo": "+++/++/+/△/-（緑膿菌）",
    "anaerobe": "+++/++/+/△/-（嫌気性菌）",
    "atypical": "+++/++/+/△/-（非定型菌）",
    "evidence_url": null
  }
]
"""


# ============================================================
# ユーティリティ
# ============================================================
def clean_citation(val):
    if isinstance(val, str):
        return re.sub(r'\s*\[[\d,\s\.\-–]+\]', '', val).strip()
    return val

def clean_drug(drug: dict) -> dict:
    return {k: clean_citation(v) for k, v in drug.items()}

def load_raw() -> list[dict]:
    if not RAW_PATH.exists():
        print(f"エラー: {RAW_PATH} が見つかりません。先にscrape_antibiotics.pyを実行してください。")
        sys.exit(1)
    with open(RAW_PATH, encoding='utf-8') as f:
        return json.load(f)

def load_existing() -> list[dict]:
    if OUTPUT_PATH.exists():
        with open(OUTPUT_PATH, encoding='utf-8') as f:
            return json.load(f)
    return []

def save_output(drugs: list[dict]):
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(drugs, f, ensure_ascii=False, indent=2)

def already_exists(name: str, existing: list[dict]) -> bool:
    normalized = re.sub(r'[　 ]*(塩酸塩|硫酸塩|フマル酸塩|臭化水素酸塩|水和物)$', '', name).strip()
    for d in existing:
        n = d.get('name', '')
        n_norm = re.sub(r'[　 ]*(塩酸塩|硫酸塩|フマル酸塩|臭化水素酸塩|水和物)$', '', n).strip()
        if n == name or n_norm == normalized:
            return True
    return False


# ============================================================
# NotebookLM 抽出
# ============================================================
async def extract_one(raw: dict, client) -> list[dict]:
    """1薬剤のrawコンテンツをNotebookLMで抽出してdict listを返す"""
    drug_name = raw['name']
    content   = raw['content']

    # テキストを一時ファイルとして保存
    with tempfile.NamedTemporaryFile(
        mode='w', suffix='.txt', encoding='utf-8', delete=False, prefix=f'antibiotic_{raw["id"]}_'
    ) as tmp:
        tmp.write(f"# {drug_name}\n\n{content}")
        tmp_path = pathlib.Path(tmp.name)

    nb_title = f"yakuapp-antibiotic-{raw['id']}-{drug_name[:20]}"
    print(f"  ノートブック作成: {nb_title}")

    nb = await client.notebooks.create(nb_title)
    nb_id = nb.id

    try:
        print(f"  テキスト投入中...")
        await client.sources.add_file(nb_id, tmp_path)
        await asyncio.sleep(30)

        print(f"  NotebookLMに質問中...")
        result = await client.chat.ask(nb_id, ANTIBIOTIC_PROMPT)
        raw_answer = result.answer.strip()

        # コードブロック除去
        if raw_answer.startswith("```"):
            raw_answer = raw_answer.split("\n", 1)[1].rsplit("```", 1)[0].strip()

        drugs = json.loads(raw_answer)
        if isinstance(drugs, dict):
            drugs = [drugs]

        return [clean_drug(d) for d in drugs]

    except json.JSONDecodeError:
        match = re.search(r'\[.*\]', raw_answer, re.DOTALL)
        if match:
            drugs = json.loads(match.group())
            return [clean_drug(d) for d in drugs]
        print(f"  [警告] JSONパース失敗: {raw_answer[:300]}")
        return []
    finally:
        await client.notebooks.delete(nb_id)
        tmp_path.unlink(missing_ok=True)
        print(f"  ノートブック削除完了")


async def run_extraction(target_ids: list[int] | None = None, from_id: int = 0):
    raw_list  = load_raw()
    existing  = load_existing()

    # フィルタリング
    if target_ids:
        raw_list = [r for r in raw_list if r['id'] in target_ids]
    elif from_id:
        raw_list = [r for r in raw_list if r['id'] >= from_id]

    print(f"抽出対象: {len(raw_list)}件")
    added_total = 0

    async with await NotebookLMClient.from_storage() as client:
        for raw in raw_list:
            drug_name = raw['name']
            print(f"\n[{raw['id']:3d}] {drug_name}")

            if already_exists(drug_name, existing):
                print(f"  [スキップ・重複] {drug_name}")
                continue

            try:
                drugs = await extract_one(raw, client)

                for d in drugs:
                    name = d.get('name', drug_name)
                    if already_exists(name, existing):
                        print(f"  [スキップ・重複] {name}")
                    else:
                        existing.append(d)
                        added_total += 1
                        print(f"  [追加] {name}（{d.get('category', '')}）")

                # 途中経過を随時保存（クラッシュ対策）
                save_output(existing)

            except Exception as e:
                print(f"  [エラー] {drug_name}: {e}")
                continue

    print(f"\n=== 完了: {added_total}件追加 / 合計{len(existing)}件 → {OUTPUT_PATH} ===")


# ============================================================
# メイン
# ============================================================
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='抗菌薬 NotebookLM 抽出スクリプト')
    parser.add_argument('--ids', type=int, nargs='+', help='処理するIDを指定（例: --ids 1 5 17）')
    parser.add_argument('--from-id', type=int, default=0, help='このID以降を処理（例: --from-id 20）')
    args = parser.parse_args()

    asyncio.run(run_extraction(
        target_ids=args.ids if args.ids else None,
        from_id=args.from_id,
    ))
