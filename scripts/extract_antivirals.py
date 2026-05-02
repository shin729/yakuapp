#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
extract_antivirals.py - antiviral_books_raw.json から NotebookLM で抗ウイルス/抗原虫薬JSONを生成

使い方:
  PYTHONUTF8=1 python scripts/extract_antivirals.py
  PYTHONUTF8=1 python scripts/extract_antivirals.py --ids 2001 3002

出力: data/antivirals.json
事前準備: PYTHONUTF8=1 python scripts/scrape_antivirals.py
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
RAW_PATH    = REPO_ROOT / "data" / "raw" / "antiviral_books_raw.json"
OUTPUT_PATH = REPO_ROOT / "data" / "antivirals.json"

ANTIVIRAL_PROMPT = """\
以下の資料（抗菌薬インターネットブックの抗ウイルス薬・抗原虫薬解説ページ）から情報を抽出してください。

【必須ルール】
- name: 日本語一般名（塩酸塩等の塩表記は除く）。カタカナ表記。
  - 抗原虫薬として使われるメトロニダゾールは「メトロニダゾール（抗原虫薬）」と記載
- brand: 商品名（複数なら「・」区切り）
- category: 下記リストから1つ選択:
    抗ヘルペス/CMV薬 / 抗HIV薬 / 抗マラリア薬 / その他原虫薬
- class: バッジ用短文字列
    例: ヌクレオシド系（抗ヘルペス）、ヌクレオシド系（抗HIV）、NRTI、抗葉酸薬、ニトロイミダゾール、抗原虫薬、抗マラリア薬
- mechanism: 作用機序（100〜200字、改行は\nで）
- half_life: 血中半減期（例: 約3時間、約2.5〜3.5時間）
- route: 投与経路。経口の場合はバイオアベイラビリティを付記
    例: 「経口（BA約15〜30%）」「注射」「経口/注射」「経口（BA ほぼ100%）」
    - 経口投与できない（注射のみ）の場合は「注射」
- dose_us: 成人標準用量を日本語で記載
    （例: 「5mg/kg 点滴 q8h × 7〜14日」「200mg 経口 5回/日」）
- first_line: IDSAガイドライン等に基づく第一選択シナリオ（なければ null）
    （例: 「HSV脳炎（IDSA）」「CMV網膜炎（IDSA）」「マラリア予防・治療（WHO）」）
- off_label: 添付文書適応外だが実臨床・ガイドラインで使われる用途（なければ null）
- cross: CYP阻害等の薬物相互作用（なければ null）
- caution: 主な副作用・禁忌・注意点（150字以内）
- tdm: TDM要否。不要なら null
- evidence_url: 必ず null（ハルシネーション防止）
- 引用番号 [1][2] は除去する

必ずJSON配列のみを返す（説明文・マークダウン記法は一切不要）:

[
  {
    "name": "薬剤名（日本語一般名）",
    "brand": "商品名",
    "category": "抗ヘルペス/CMV薬 / 抗HIV薬 / 抗マラリア薬 / その他原虫薬",
    "class": "短いクラス名",
    "mechanism": "作用機序",
    "half_life": "血中半減期",
    "route": "投与経路（経口の場合はBA付記）",
    "dose_us": "米国成人標準用量（日本語）",
    "first_line": "第一選択シナリオ（なければnull）",
    "off_label": "適応外（なければnull）",
    "cross": "薬物相互作用（なければnull）",
    "caution": "注意事項（150字以内）",
    "tdm": "TDM（不要ならnull）",
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
        print(f"エラー: {RAW_PATH} が見つかりません。先にscrape_antivirals.pyを実行してください。")
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
    for d in existing:
        if d.get('name', '') == name:
            return True
    return False


async def extract_one(raw: dict, client) -> list[dict]:
    drug_name = raw['name']
    content   = raw['content']

    with tempfile.NamedTemporaryFile(
        mode='w', suffix='.txt', encoding='utf-8', delete=False, prefix=f'antiviral_{raw["id"]}_'
    ) as tmp:
        tmp.write(f"# {drug_name}\n\n{content}")
        tmp_path = pathlib.Path(tmp.name)

    nb_title = f"yakuapp-antiviral-{raw['id']}-{drug_name[:20]}"
    print(f"  ノートブック作成: {nb_title}")

    nb = await client.notebooks.create(nb_title)
    nb_id = nb.id

    try:
        print(f"  テキスト投入中...")
        await client.sources.add_file(nb_id, tmp_path)
        await asyncio.sleep(25)

        raw_answer = None
        for attempt in range(3):
            try:
                print(f"  NotebookLMに質問中... (試行{attempt+1})")
                result = await client.chat.ask(nb_id, ANTIVIRAL_PROMPT)
                raw_answer = result.answer.strip()
                break
            except Exception as e:
                err_str = str(e).lower()
                if ('rate limit' in err_str or 'rate_limit' in err_str or 'timed out' in err_str) and attempt < 2:
                    wait = [45, 90][attempt]
                    print(f"  制限/タイムアウト → {wait}秒待機後リトライ")
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


async def run_extraction(target_ids: list[int] | None = None):
    raw_list = load_raw()
    existing = load_existing()

    if target_ids:
        raw_list = [r for r in raw_list if r['id'] in target_ids]

    print(f"抽出対象: {len(raw_list)}件")
    added_total = 0

    async with await NotebookLMClient.from_storage() as client:
        for raw in raw_list:
            drug_name = raw['name']
            print(f"\n[{raw['id']:4d}] {drug_name}")

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
    parser = argparse.ArgumentParser(description='抗ウイルス/抗原虫薬 NotebookLM 抽出スクリプト')
    parser.add_argument('--ids', type=int, nargs='+', help='処理するIDを指定')
    args = parser.parse_args()

    asyncio.run(run_extraction(
        target_ids=args.ids if args.ids else None,
    ))
