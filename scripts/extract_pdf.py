#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
extract_pdf.py - NotebookLMでPDFから薬剤情報を抽出してJSONに追記

使い方:
  python scripts/extract_pdf.py <pdf_path> <target_json>

例:
  python scripts/extract_pdf.py data/raw/zuranolone.pdf data/sleep_anxiety.json
  python scripts/extract_pdf.py data/raw/celecoxib.pdf data/pain.json

注意:
  文字化けする場合は Git Bash で以下を実行してください:
  PYTHONUTF8=1 python scripts/extract_pdf.py ...
"""

import asyncio
import sys
import json
import pathlib
import re
import requests

from notebooklm import NotebookLMClient

# NotebookLMが引用番号 [1] [2, 3] を文字列に混入することがあるので除去
def clean_citation(val):
    if isinstance(val, str):
        return re.sub(r'\s*\[[\d,\s\.]+\]', '', val).strip()
    return val

def clean_drug(drug: dict) -> dict:
    return {k: clean_citation(v) for k, v in drug.items()}

# ============================================================
# 抽出プロンプト
# ============================================================
EXTRACT_PROMPT = """このPDF（医薬品の添付文書・インタビューフォーム・治験データ等）から、
含まれる薬剤の情報を以下のJSON形式で抽出してください。

必ず以下の形式のJSON配列のみを返してください（説明文・マークダウン記法は不要）:

[
  {
    "name": "薬品名（一般名・日本語）",
    "brand": "商品名（複数あれば「・」区切り）",
    "category": "カテゴリ（例: 睡眠薬、非オピオイド系、PPI など）",
    "class": "薬剤クラス（例: GABA_A受容体作動薬、NSAID、Z薬）",
    "action_type": "作用タイプの一行説明",
    "mechanism": "作用機序の詳細（100〜200字）",
    "efficacy_star": 3,
    "placebo_onset": "プラセボ比の主要エンドポイント改善量（例: HAM-D改善 プラセボ比-3.0点）",
    "placebo_sleep": "50%軽減達成率や主要二次エンドポイント",
    "NNT": 5.0,
    "onset_time": "効果発現時間（例: 投与3日以内）",
    "duration_hours": "作用持続時間（例: 24時間・1日1回）",
    "guideline_rank": "ガイドライン上の推奨・位置づけ",
    "evidence": "主要エビデンス（例: Gunduz-Bruce H et al. NEJM 2019（PMID:31618540））",
    "evidence_url": "https://pubmed.ncbi.nlm.nih.gov/31618540/",
    "caution": "注意事項・主な副作用・禁忌（150字以内）"
  }
]

補足:
- efficacy_star: 1〜5の整数
- NNT: 数値のみ。不明な場合はnull
- evidence_url: PubMed URLのみ。それ以外はnull
- 不明な情報はnullを使用"""


def search_pubmed(drug_name: str, max_results: int = 4) -> list[str]:
    """PubMedで薬剤名の臨床試験論文PMIDを検索"""
    r = requests.get(
        'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi',
        params={
            'db': 'pubmed',
            'term': f'{drug_name} clinical trial',
            'retmax': max_results,
            'retmode': 'json',
            'sort': 'relevance',
        },
        timeout=10,
    )
    return r.json()['esearchresult']['idlist']


async def extract_from_pdf(pdf_path: pathlib.Path, pubmed_ids: list[str] = None) -> list[dict]:
    """PDFをNotebookLMにアップロードして薬剤情報を抽出
    pubmed_ids: 追加するPubMed論文のPMIDリスト（省略時はPDF単体で抽出）
    """
    async with await NotebookLMClient.from_storage() as client:
        nb_title = f"yakuapp-{pdf_path.stem}"
        print(f"ノートブック作成中: {nb_title}")
        nb = await client.notebooks.create(nb_title)
        nb_id = nb.id
        print(f"作成完了: {nb_id}")

        try:
            print(f"PDFアップロード中: {pdf_path.name}")
            await client.sources.add_file(nb_id, pdf_path)

            if pubmed_ids:
                print("PubMed論文を追加中...")
                for pmid in pubmed_ids:
                    await client.sources.add_url(nb_id, f'https://pubmed.ncbi.nlm.nih.gov/{pmid}/')
                    print(f"  追加: PMID:{pmid}")

            wait_sec = 15 if pubmed_ids else 10
            print(f"解析待機中（{wait_sec}秒）...")
            await asyncio.sleep(wait_sec)

            print("NotebookLMに質問中...")
            result = await client.chat.ask(nb_id, EXTRACT_PROMPT)
            raw = result.answer.strip()

            if raw.startswith("```"):
                raw = raw.split("\n", 1)[1]
                raw = raw.rsplit("```", 1)[0].strip()

            try:
                drugs = json.loads(raw)
            except json.JSONDecodeError:
                match = re.search(r'\[.*\]', raw, re.DOTALL)
                if match:
                    drugs = json.loads(match.group())
                else:
                    print("\n--- NotebookLM応答（パース失敗）---")
                    print(raw[:2000])
                    print("---")
                    raise ValueError("JSONの抽出に失敗しました")

            if isinstance(drugs, dict):
                drugs = [drugs]

            # 引用番号を除去
            return [clean_drug(d) for d in drugs]

        finally:
            print(f"ノートブック削除中: {nb_id}")
            await client.notebooks.delete(nb_id)
            print("削除完了")


def merge_into_json(drugs: list[dict], json_path: pathlib.Path) -> int:
    """抽出した薬剤リストを既存JSONに重複チェックしながら追記"""
    if json_path.exists():
        with open(json_path, encoding="utf-8") as f:
            existing = json.load(f)
    else:
        print(f"新規作成: {json_path}")
        existing = []

    existing_keys = {(d["name"], d.get("category", "")) for d in existing}
    added = 0

    for drug in drugs:
        key = (drug["name"], drug.get("category", ""))
        if key not in existing_keys:
            existing.append(drug)
            existing_keys.add(key)
            added += 1
            print(f"  [追加] {drug['name']}（{drug.get('category', '')}）")
        else:
            print(f"  [スキップ・重複] {drug['name']}")

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(existing, f, ensure_ascii=False, indent=2)

    print(f"\n完了: {added}件追加 / 合計{len(existing)}件 → {json_path}")
    return added


async def main(pdf_file: str, target_json: str, drug_name: str = None):
    pdf_path = pathlib.Path(pdf_file)
    json_path = pathlib.Path(target_json)

    if not pdf_path.exists():
        print(f"エラー: PDFが見つかりません: {pdf_path}")
        sys.exit(1)

    print("=== NotebookLM PDF抽出開始 ===")
    print(f"入力PDF : {pdf_path}")
    print(f"出力先  : {json_path}")

    pubmed_ids = None
    if drug_name:
        print(f"PubMed検索: {drug_name}")
        pubmed_ids = search_pubmed(drug_name)
        print(f"  取得PMID: {pubmed_ids}")
    print()

    try:
        drugs = await extract_from_pdf(pdf_path, pubmed_ids)
        print(f"\n{len(drugs)}件の薬剤情報を抽出:")
        for d in drugs:
            print(f"  - {d.get('name', '不明')}（{d.get('category', '')}）")
        print()
        merge_into_json(drugs, json_path)

    except Exception as e:
        print(f"\nエラー: {e}")
        sys.exit(1)


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)

    # 第3引数で薬剤名を渡すとPubMed検索も実施
    # 例: python scripts/extract_pdf.py data/raw/foo.pdf data/sleep_anxiety.json zuranolone
    drug_name = sys.argv[3] if len(sys.argv) >= 4 else None
    asyncio.run(main(sys.argv[1], sys.argv[2], drug_name))
