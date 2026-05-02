#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
extract_antifungals.py - antifungal_books_raw.json から NotebookLM で抗真菌薬JSONを生成

使い方:
  PYTHONUTF8=1 python scripts/extract_antifungals.py              # 全薬剤
  PYTHONUTF8=1 python scripts/extract_antifungals.py --ids 1001 1002
  PYTHONUTF8=1 python scripts/extract_antifungals.py --from-id 1005

出力: data/antifungals.json
事前準備: PYTHONUTF8=1 python scripts/scrape_antifungals.py
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
RAW_PATH    = REPO_ROOT / "data" / "raw" / "antifungal_books_raw.json"
OUTPUT_PATH = REPO_ROOT / "data" / "antifungals.json"

ANTIFUNGAL_PROMPT = """\
以下の資料（抗菌薬インターネットブックの抗真菌薬解説ページ）から情報を抽出してください。

【必須ルール】
- name: 日本語一般名（塩酸塩等の塩表記は除く）。カタカナ表記。
- brand: 商品名（複数なら「・」区切り）
- category: 下記リストから1つ選択:
    ポリエン系 / トリアゾール系 / イミダゾール系 / エキノカンジン系 / その他
- class: バッジ用短文字列（例: ポリエン、トリアゾール、エキノカンジン、フルシトシン）
- mechanism: 作用機序（100〜200字、改行は\nで）
- pkpd: 「時間依存性（%T>MIC）」「濃度依存性（Cmax/MIC）」「AUC依存性（AUC/MIC）」のいずれか＋補足
- half_life: 血中半減期（例: 約30時間、約6〜8時間）
- bioavailability: 経口バイオアベイラビリティ（例: 約90%、0%（IV専用）、カプセル: 約55% / 内用液: >90%）
  - 経口投与できない（注射のみ）の場合は「0%（IV専用）」
  - 外用のみの場合は「全身吸収はほぼなし（外用専用）」
- route: 「経口」「注射」「経口/注射」「外用」「経口/外用」のいずれか
- dose_us: 成人標準用量（米国基準・IDSA等）を日本語で記載
  （例: 「400mg 経口 1日1回」「3〜5mg/kg 点滴 1日1回」「200mg 経口 1日2回（初日400mg）」）
- first_line: IDSAガイドラインに基づく第一選択シナリオ（なければ null）
  （例: 「カンジダ血症・非好中球減少（IDSA）」「クリプトコッカス髄膜炎（IDSA）」）
- off_label: 添付文書適応外だがIDSA等で推奨される用途（なければ null）
- cross: CYP酵素による薬物相互作用を中心に記載（なければ null）
  （例: 「CYP3A4阻害→シクロスポリン・タクロリムスAUC増加」「CYP2C9/3A4阻害→ワルファリン増強」）
- caution: 主な副作用・禁忌・注意点（150字以内）
  （例の副作用: 腎毒性・低K血症（AMPH-B）、視覚障害・肝毒性（VRCZ）、催奇形性（アゾール全般））
- tdm: TDM要否。要なら詳細記載（例: 「要（トラフ1〜5.5mg/L、IDSA推奨）」）。不要なら null
- candida: カンジダ属全般への活性（+++/++/+/△/-）
  +++: 第一選択レベル、++: 有効、+: 部分的/弱い、△: 一部耐性あり、-: 効果なし
- aspergillus: アスペルギルス属への活性（同上）
- crypto: クリプトコッカス属への活性（同上）
- mucor: 接合菌（ムコール目）への活性（同上）
- dermatophyte: 皮膚糸状菌（白癬菌等）への活性（同上）
- evidence_url: 必ず null（ハルシネーション防止）
- 引用番号 [1][2] は除去する

必ずJSON配列のみを返す（説明文・マークダウン記法は一切不要）:

[
  {
    "name": "薬剤名（日本語一般名、塩表記なし）",
    "brand": "商品名",
    "category": "ポリエン系 / トリアゾール系 / イミダゾール系 / エキノカンジン系 / その他",
    "class": "短いクラス名",
    "mechanism": "作用機序",
    "pkpd": "PK/PD特性",
    "half_life": "血中半減期",
    "bioavailability": "経口BA（注射のみなら0%（IV専用））",
    "route": "経口 / 注射 / 経口/注射 / 外用",
    "dose_us": "米国成人標準用量（日本語）",
    "first_line": "第一選択シナリオ（なければnull）",
    "off_label": "適応外（なければnull）",
    "cross": "薬物相互作用（なければnull）",
    "caution": "注意事項（150字以内）",
    "tdm": "TDM（不要ならnull）",
    "candida": "+++/++/+/△/-",
    "aspergillus": "+++/++/+/△/-",
    "crypto": "+++/++/+/△/-",
    "mucor": "+++/++/+/△/-",
    "dermatophyte": "+++/++/+/△/-",
    "evidence_url": null
  }
]
"""


def clean_citation(val):
    if isinstance(val, str):
        return re.sub(r'\s*\[[\d,\s\.\-–]+\]', '', val).strip()
    return val

def clean_drug(drug: dict) -> dict:
    return {k: clean_citation(v) for k, v in drug.items()}

def load_raw() -> list[dict]:
    if not RAW_PATH.exists():
        print(f"エラー: {RAW_PATH} が見つかりません。先にscrape_antifungals.pyを実行してください。")
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


async def extract_one(raw: dict, client) -> list[dict]:
    drug_name = raw['name']
    content   = raw['content']

    with tempfile.NamedTemporaryFile(
        mode='w', suffix='.txt', encoding='utf-8', delete=False, prefix=f'antifungal_{raw["id"]}_'
    ) as tmp:
        tmp.write(f"# {drug_name}\n\n{content}")
        tmp_path = pathlib.Path(tmp.name)

    nb_title = f"yakuapp-antifungal-{raw['id']}-{drug_name[:20]}"
    print(f"  ノートブック作成: {nb_title}")

    nb = await client.notebooks.create(nb_title)
    nb_id = nb.id

    try:
        print(f"  テキスト投入中...")
        await client.sources.add_file(nb_id, tmp_path)
        await asyncio.sleep(25)

        # リトライ付きで質問
        raw_answer = None
        for attempt in range(3):
            try:
                print(f"  NotebookLMに質問中... (試行{attempt+1})")
                result = await client.chat.ask(nb_id, ANTIFUNGAL_PROMPT)
                raw_answer = result.answer.strip()
                break
            except Exception as e:
                err_str = str(e).lower()
                if ('rate limit' in err_str or 'rate_limit' in err_str) and attempt < 2:
                    wait = [45, 90][attempt]
                    print(f"  レート制限 → {wait}秒待機後リトライ")
                    await asyncio.sleep(wait)
                else:
                    raise

        if raw_answer is None:
            raise RuntimeError("NotebookLM応答なし")

        if raw_answer.startswith("```"):
            raw_answer = raw_answer.split("\n", 1)[1].rsplit("```", 1)[0].strip()

        drugs = json.loads(raw_answer)
        if isinstance(drugs, dict):
            drugs = [drugs]

        return [clean_drug(d) for d in drugs]

    except json.JSONDecodeError:
        match = re.search(r'\[.*\]', raw_answer or '', re.DOTALL)
        if match:
            drugs = json.loads(match.group())
            return [clean_drug(d) for d in drugs]
        print(f"  [警告] JSONパース失敗: {(raw_answer or '')[:300]}")
        return []
    finally:
        await client.notebooks.delete(nb_id)
        tmp_path.unlink(missing_ok=True)
        print(f"  ノートブック削除完了")


async def run_extraction(target_ids: list[int] | None = None, from_id: int = 0):
    raw_list = load_raw()
    existing = load_existing()

    if target_ids:
        raw_list = [r for r in raw_list if r['id'] in target_ids]
    elif from_id:
        raw_list = [r for r in raw_list if r['id'] >= from_id]

    print(f"抽出対象: {len(raw_list)}件")
    added_total = 0

    async with await NotebookLMClient.from_storage() as client:
        for raw in raw_list:
            drug_name = raw['name']
            print(f"\n[{raw['id']:4d}] {drug_name}")

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

                save_output(existing)

            except Exception as e:
                print(f"  [エラー] {drug_name}: {e}")
                continue

    print(f"\n=== 完了: {added_total}件追加 / 合計{len(existing)}件 → {OUTPUT_PATH} ===")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='抗真菌薬 NotebookLM 抽出スクリプト')
    parser.add_argument('--ids', type=int, nargs='+', help='処理するIDを指定')
    parser.add_argument('--from-id', type=int, default=0, help='このID以降を処理')
    args = parser.parse_args()

    asyncio.run(run_extraction(
        target_ids=args.ids if args.ids else None,
        from_id=args.from_id,
    ))
