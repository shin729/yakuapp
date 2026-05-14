#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
extract_one_antiviral.py - 1種の抗ウイルス薬をPMDA+NotebookLMで抽出してantivirals.jsonに追記

使い方:
  PYTHONUTF8=1 python scripts/extract_one_antiviral.py 薬剤名 [英語名]
  PYTHONUTF8=1 python scripts/extract_one_antiviral.py バラシクロビル valacyclovir

注意:
  PYTHONUTF8=1 を付けないと Windows で文字化けします
"""
import asyncio
import sys
import json
import pathlib
import re

REPO_ROOT = pathlib.Path(__file__).parent.parent
OUTPUT_PATH = REPO_ROOT / "data" / "antivirals.json"

ANTIVIRAL_PROMPT = """\
以下の資料（PMDA添付文書）から抗ウイルス薬情報を抽出してください。

【必須ルール】
- name: 日本語一般名（塩酸塩等の塩表記は除く）。カタカナ表記。
- brand: 商品名（複数なら「・」区切り）
- category: 下記リストから1つ選択:
    抗ヘルペス/CMV薬 / 抗HIV薬 / 抗HBV薬 / 抗HCV薬 / 抗マラリア薬 / その他原虫薬 / 抗インフルエンザ薬 / 抗COVID-19薬
- class: バッジ用短文字列（例: ヌクレオシド系（抗ヘルペス）、NRTI、PI、INSTI、NtRTI）
- mechanism: 作用機序（100〜200字、改行は\nで）
- half_life: 血中半減期（例: 約3時間）
- route: 投与経路。経口の場合はBAを付記（例: 経口（BA約55%））
- dose_us: 成人標準用量（日本語）
- first_line: IDSAガイドライン等の第一選択シナリオ（なければ null）
- off_label: 添付文書外の実臨床・ガイドライン用途（なければ null）
- cross: 薬物相互作用（なければ null）
- caution: 主な副作用・禁忌・注意点（150字以内）
- tdm: TDM要否（不要なら null）
- evidence_url: 必ず null（ハルシネーション防止）
- 引用番号 [1][2] は除去する

必ずJSON配列のみを返す（説明文・マークダウン記法は一切不要）:

[
  {
    "name": "薬剤名（日本語一般名）",
    "brand": "商品名",
    "category": "抗ヘルペス/CMV薬 など",
    "class": "短いクラス名",
    "mechanism": "作用機序",
    "half_life": "血中半減期",
    "route": "投与経路（経口の場合はBA付記）",
    "dose_us": "成人標準用量（日本語）",
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

def load_existing() -> list[dict]:
    if OUTPUT_PATH.exists():
        with open(OUTPUT_PATH, encoding='utf-8') as f:
            return json.load(f)
    return []

def save_output(drugs: list[dict]):
    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(drugs, f, ensure_ascii=False, indent=2)

def already_exists(name: str, existing: list[dict]) -> bool:
    return any(d.get('name', '') == name for d in existing)


async def resolve_pmda_url(drug_name_ja: str) -> str | None:
    """extract_pdf.pyのresolve_pmda_urlを流用（キャッシュ優先）"""
    import sys as _sys
    _sys.path.insert(0, str(pathlib.Path(__file__).parent))
    from extract_pdf import resolve_pmda_url as _resolve
    return await _resolve(drug_name_ja)


async def extract_from_pmda(pmda_url: str, drug_name_ja: str) -> list[dict]:
    from notebooklm import NotebookLMClient

    target_hint = f'【抽出対象薬剤】{drug_name_ja} の情報を1件のみ抽出する。他の薬剤情報は含めないこと。'
    prompt = target_hint + '\n\n' + ANTIVIRAL_PROMPT

    async with await NotebookLMClient.from_storage(timeout=120) as client:
        nb_title = f"yakuapp-antiviral-{drug_name_ja[:20]}"
        print(f"ノートブック作成: {nb_title}")
        nb = await client.notebooks.create(nb_title)
        nb_id = nb.id

        try:
            print(f"PMDA URL追加中: {pmda_url[:80]}")
            await client.sources.add_url(nb_id, pmda_url)
            print("解析待機中（20秒）...")
            await asyncio.sleep(20)

            for attempt in range(3):
                try:
                    print(f"NotebookLMに質問中... (試行{attempt+1})")
                    result = await client.chat.ask(nb_id, prompt)
                    raw = result.answer.strip()
                    break
                except Exception as e:
                    err_str = str(e).lower()
                    if any(w in err_str for w in ('rate', 'limit', 'timed', 'timeout')) and attempt < 2:
                        wait = [60, 120][attempt]
                        print(f"  制限検出 → {wait}秒待機してリトライ")
                        await asyncio.sleep(wait)
                    else:
                        raise

            if raw.startswith("```"):
                raw = raw.split("\n", 1)[1].rsplit("```", 1)[0].strip()

            try:
                drugs = json.loads(raw)
            except json.JSONDecodeError:
                match = re.search(r'\[.*\]', raw, re.DOTALL)
                if match:
                    drugs = json.loads(match.group())
                else:
                    print(f"JSONパース失敗:\n{raw[:500]}")
                    raise

            if isinstance(drugs, dict):
                drugs = [drugs]
            return [clean_drug(d) for d in drugs]

        finally:
            print(f"ノートブック削除: {nb_id}")
            await client.notebooks.delete(nb_id)
            print("削除完了")


async def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    drug_name_ja = sys.argv[1]
    print(f"=== 抗ウイルス薬抽出: {drug_name_ja} ===")

    print(f"PMDAを検索中: {drug_name_ja}")
    pmda_url = await resolve_pmda_url(drug_name_ja)

    if not pmda_url:
        print(f"エラー: '{drug_name_ja}' のPMDA URLが見つかりません")
        sys.exit(1)

    print(f"PMDA URL: {pmda_url}")

    drugs = await extract_from_pmda(pmda_url, drug_name_ja)
    print(f"\n{len(drugs)}件を抽出:")
    for d in drugs:
        print(f"  - {d.get('name', '不明')}（{d.get('category', '')}）")

    existing = load_existing()
    added = 0
    for d in drugs:
        name = d.get('name', drug_name_ja)
        if already_exists(name, existing):
            print(f"  [スキップ・重複] {name}")
        else:
            existing.append(d)
            added += 1
            print(f"  [追加] {name}")

    if added > 0:
        save_output(existing)
        print(f"\n完了: {added}件追加 / 合計{len(existing)}件 → {OUTPUT_PATH}")
    else:
        print("\n追加なし（全件重複）")


if __name__ == "__main__":
    asyncio.run(main())
