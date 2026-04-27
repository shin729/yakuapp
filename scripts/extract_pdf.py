#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
extract_pdf.py - NotebookLMでPDF/URLから薬剤情報を抽出してJSONに追記

使い方:
  python scripts/extract_pdf.py <source> <target_json> [英語薬剤名]

source は以下のいずれか:
  - ファイルパス    : data/raw/zuranolone.pdf
  - PMDA URL       : https://www.info.pmda.go.jp/go/pack/2123404D1033_1_10/...
  - 日本語薬剤名   : ランジオロール  （キャッシュまたはPlaywrightで自動解決）

例:
  PYTHONUTF8=1 python scripts/extract_pdf.py ランジオロール data/arrhythmia.json landiolol
  PYTHONUTF8=1 python scripts/extract_pdf.py data/raw/foo.pdf data/pain.json celecoxib
  PYTHONUTF8=1 python scripts/extract_pdf.py https://www.info.pmda.go.jp/go/pack/XXX/ data/sleep_anxiety.json

注意:
  PYTHONUTF8=1 を付けないと Windows で文字化けします
"""

import asyncio
import sys
import json
import pathlib
import re
import requests

from notebooklm import NotebookLMClient

# ============================================================
# PMDAキャッシュ
# ============================================================
CACHE_PATH = pathlib.Path(__file__).parent / 'pmda_cache.json'

def load_pmda_cache() -> dict:
    if CACHE_PATH.exists():
        with open(CACHE_PATH, encoding='utf-8') as f:
            return json.load(f)
    return {}

def save_pmda_cache(cache: dict):
    with open(CACHE_PATH, 'w', encoding='utf-8') as f:
        json.dump(cache, f, ensure_ascii=False, indent=2)

# target_jsonファイル名 → キャッシュのガイドラインキー
_GUIDELINE_KEY_MAP = {
    'arrhythmia':    '_guideline_arrhythmia',
    'hf':            '_guideline_arrhythmia',  # 循環器は同じ
    'sleep_anxiety': '_guideline_sleep',
    'pain':          '_guideline_pain',
}

def get_guideline_urls(json_path: pathlib.Path) -> list[str]:
    """対象JSONのドメインに対応するガイドラインURLをキャッシュから取得"""
    stem = json_path.stem  # e.g. 'arrhythmia'
    key = _GUIDELINE_KEY_MAP.get(stem)
    if not key:
        return []
    cache = load_pmda_cache()
    urls = cache.get(key, [])
    if urls:
        print(f"ガイドライン適用: {key} ({len(urls)}件)")
    return urls

async def resolve_pmda_url(drug_name_ja: str) -> str | None:
    """日本語薬剤名 → PMDA view=body URL を解決（キャッシュ優先）"""
    cache = load_pmda_cache()
    if drug_name_ja in cache:
        print(f"キャッシュヒット: {drug_name_ja} → {cache[drug_name_ja]}")
        return cache[drug_name_ja]

    print(f"PMDAを検索中: {drug_name_ja}")
    url = await _search_pmda_playwright(drug_name_ja)
    if url:
        cache[drug_name_ja] = url
        save_pmda_cache(cache)
        print(f"キャッシュ保存: {drug_name_ja} → {url}")
    return url

async def _search_pmda_playwright(drug_name: str) -> str | None:
    """PlaywrightでPMDA検索し、最初のview=body URLを返す"""
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()

        found_url = None
        pack_ids = []

        # レスポンスを監視してgo/packのURLを拾う
        async def on_response(response):
            if 'info.pmda.go.jp/go/pack' in response.url:
                pack_ids.append(response.url)

        page.on('response', on_response)

        try:
            await page.goto('https://www.pmda.go.jp/PmdaSearch/iyakuSearch/')
            await page.wait_for_load_state('networkidle')

            # cookie経由の検索条件を設定してPOST
            search_cond = json.dumps({
                'nameWord': drug_name,
                'iyakuHowtoNameSearchRadioValue': '1',
                'howtoMatchRadioValue': '1',
            })
            await context.add_cookies([{
                'name': 'SearchCond_Iyaku',
                'value': search_cond,
                'domain': 'www.pmda.go.jp',
                'path': '/',
            }])

            await page.fill('#txtName', drug_name)
            await page.wait_for_timeout(300)
            await page.evaluate("document.querySelector('form[name=\"iyakuSearchActionForm\"]').submit()")
            await page.wait_for_load_state('networkidle')
            await page.wait_for_timeout(4000)

            # ページ内のgo/packリンクを収集
            links = await page.eval_on_selector_all(
                'a[href*="info.pmda.go.jp/go/pack"]',
                'els => els.map(e => e.href)'
            )
            pack_ids.extend(links)

        except Exception as e:
            print(f"  Playwright検索エラー: {e}")
        finally:
            await browser.close()

        if pack_ids:
            # 最初のpack IDからview=body URLを構築
            raw = pack_ids[0].rstrip('/')
            pack_id = raw.split('/go/pack/')[-1].split('/')[0]
            found_url = f'https://www.info.pmda.go.jp/go/pack/{pack_id}/{pack_id}?view=body&lang=ja'
            print(f"  発見: {found_url}")

        return found_url


# ============================================================
# 薬剤名正規化
# ============================================================
_SALT_SUFFIXES = re.compile(
    r'[　 ]*(塩酸塩|臭化水素酸塩|硫酸塩|フマル酸塩|酒石酸塩|マレイン酸塩|'
    r'クエン酸塩|リン酸塩|ナトリウム塩|カリウム塩|水和物|無水物)$'
)

def normalize_drug_name(name: str) -> str:
    """一般名から塩表記を除いた正規化名を返す"""
    return _SALT_SUFFIXES.sub('', name).strip()


# ============================================================
# 抽出プロンプト
# ============================================================
_PROMPT_BASE = """\
以下の資料（PMDA添付文書・インタビューフォーム・PubMed論文等）から、薬剤情報を抽出してください。

【重要な指示】
- guideline_rank は 診療ガイドライン（あれば最優先）または PMDA添付文書の「効能・効果」「用法・用量」を参照して記述する
  例：「○○学会ガイドライン推奨グレードA」「第一選択/第二選択」「使い分けポイント」など
  PubMed論文の疾患名には引っ張られないこと
- placebo_onset / placebo_sleep / NNT は PubMed論文または添付文書の臨床成績の数値を積極的に使う
- name は日本語一般名のみ（「塩酸塩」「フマル酸塩」等の塩表記は含めない）
- caution は150字以内
- 引用番号 [1][2,3][1-3] は除去する

{category_hint}

必ずJSON配列のみを返す（説明文・マークダウン記法は不要）:

[
  {{
    "name": "薬品名（一般名・日本語、塩表記なし）",
    "brand": "商品名（複数あれば「・」区切り）",
    "category": "{category_instruction}",
    "class": "薬剤クラス（簡潔に）",
    "action_type": "作用タイプの一行説明",
    "mechanism": "作用機序の詳細（100〜200字、改行は\\nで）",
    "efficacy_star": 3,
    "placebo_onset": "主要エンドポイント改善量（例: HAM-D プラセボ比-3.0点）",
    "placebo_sleep": "副次エンドポイントまたは50%改善達成率",
    "NNT": 5.0,
    "onset_time": "効果発現時間",
    "duration_hours": "作用持続時間",
    "guideline_rank": "添付文書ベースのガイドライン推奨・使い分けポイント（100字以内）",
    "evidence": "主要試験名 著者 雑誌 年（PMID:XXXXXXXX）",
    "evidence_url": "https://pubmed.ncbi.nlm.nih.gov/XXXXXXXX/",
    "caution": "禁忌・主な副作用・注意事項（150字以内）"
  }}
]

補足:
- efficacy_star: 1〜5の整数
- NNT: 数値のみ。不明な場合は null
- evidence_url: PubMed URLのみ。それ以外は null
- 不明な情報は null
"""

def build_extract_prompt(valid_categories: list[str] = None) -> str:
    if valid_categories:
        cats_str = '・'.join(valid_categories)
        category_hint = f'【有効なcategory値】次のいずれかを選ぶ:\n{cats_str}'
        category_instruction = f'次のいずれか: {cats_str}'
    else:
        category_hint = ''
        category_instruction = 'カテゴリ名（例: 睡眠薬、非オピオイド系など）'
    return _PROMPT_BASE.format(
        category_hint=category_hint,
        category_instruction=category_instruction,
    )

def get_categories_from_json(json_path: pathlib.Path) -> list[str]:
    """既存JSONから有効なcategory値一覧を取得"""
    if not json_path.exists():
        return []
    with open(json_path, encoding='utf-8') as f:
        data = json.load(f)
    return list(dict.fromkeys(d.get('category', '') for d in data if d.get('category')))


# ============================================================
# 引用番号除去
# ============================================================
def clean_citation(val):
    if isinstance(val, str):
        return re.sub(r'\s*\[[\d,\s\.\-–]+\]', '', val).strip()
    return val

def clean_drug(drug: dict) -> dict:
    cleaned = {k: clean_citation(v) for k, v in drug.items()}
    # 薬剤名の塩表記除去
    if 'name' in cleaned and isinstance(cleaned['name'], str):
        cleaned['name'] = normalize_drug_name(cleaned['name'])
    return cleaned


# ============================================================
# NotebookLM 抽出コア
# ============================================================
async def _run_extraction(nb_id: str, client, prompt: str, extra_urls: list[str] = None) -> list[dict]:
    if extra_urls:
        print("追加URLを投入中...")
        for url in extra_urls:
            await client.sources.add_url(nb_id, url)
            print(f"  追加: {url[:80]}")

    wait_sec = 20 if extra_urls else 12
    print(f"解析待機中（{wait_sec}秒）...")
    await asyncio.sleep(wait_sec)

    print("NotebookLMに質問中...")
    result = await client.chat.ask(nb_id, prompt)
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
    return [clean_drug(d) for d in drugs]


async def extract_from_pdf(pdf_path: pathlib.Path, prompt: str, extra_urls: list[str] = None) -> list[dict]:
    async with await NotebookLMClient.from_storage() as client:
        nb_title = f"yakuapp-{pdf_path.stem}"
        print(f"ノートブック作成中: {nb_title}")
        nb = await client.notebooks.create(nb_title)
        nb_id = nb.id
        print(f"作成完了: {nb_id}")
        try:
            print(f"PDFアップロード中: {pdf_path.name}")
            await client.sources.add_file(nb_id, pdf_path)
            return await _run_extraction(nb_id, client, prompt, extra_urls or None)
        finally:
            print(f"ノートブック削除中: {nb_id}")
            await client.notebooks.delete(nb_id)
            print("削除完了")


async def extract_from_url(source_url: str, prompt: str, extra_urls: list[str] = None) -> list[dict]:
    slug = re.sub(r'[^a-zA-Z0-9]', '-', source_url.split('/')[-2] or source_url.split('/')[-1])[:30]
    async with await NotebookLMClient.from_storage() as client:
        nb_title = f"yakuapp-{slug}"
        print(f"ノートブック作成中: {nb_title}")
        nb = await client.notebooks.create(nb_title)
        nb_id = nb.id
        print(f"作成完了: {nb_id}")
        try:
            print(f"URLを追加中: {source_url[:80]}")
            await client.sources.add_url(nb_id, source_url)
            return await _run_extraction(nb_id, client, prompt, extra_urls or None)
        finally:
            print(f"ノートブック削除中: {nb_id}")
            await client.notebooks.delete(nb_id)
            print("削除完了")


# ============================================================
# JSON マージ
# ============================================================
def merge_into_json(drugs: list[dict], json_path: pathlib.Path) -> int:
    if json_path.exists():
        with open(json_path, encoding='utf-8') as f:
            existing = json.load(f)
    else:
        print(f"新規作成: {json_path}")
        existing = []

    # 正規化名でも重複チェック
    existing_keys = set()
    for d in existing:
        n = d['name']
        existing_keys.add(n)
        existing_keys.add(normalize_drug_name(n))

    added = 0
    for drug in drugs:
        n = drug['name']
        if n in existing_keys or normalize_drug_name(n) in existing_keys:
            print(f"  [スキップ・重複] {n}")
        else:
            existing.append(drug)
            existing_keys.add(n)
            existing_keys.add(normalize_drug_name(n))
            added += 1
            print(f"  [追加] {n}（{drug.get('category', '')}）")

    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(existing, f, ensure_ascii=False, indent=2)

    print(f"\n完了: {added}件追加 / 合計{len(existing)}件 → {json_path}")
    return added


# ============================================================
# PubMed 検索
# ============================================================
def search_pubmed(drug_name: str, max_results: int = 4) -> list[str]:
    r = requests.get(
        'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi',
        params={
            'db': 'pubmed',
            'term': f'{drug_name} randomized clinical trial',
            'retmax': max_results,
            'retmode': 'json',
            'sort': 'relevance',
        },
        timeout=10,
    )
    return r.json()['esearchresult']['idlist']


# ============================================================
# メイン
# ============================================================
async def main(source: str, target_json: str, drug_name_en: str = None):
    json_path = pathlib.Path(target_json)
    is_url = source.startswith('http://') or source.startswith('https://')
    is_file = pathlib.Path(source).exists()
    is_drug_name = not is_url and not is_file

    print("=== NotebookLM 抽出開始 ===")
    print(f"入力   : {source}")
    print(f"出力先 : {json_path}")

    # カテゴリを既存JSONから自動取得
    valid_cats = get_categories_from_json(json_path)
    if valid_cats:
        print(f"有効カテゴリ: {valid_cats}")
    prompt = build_extract_prompt(valid_cats)

    # ガイドラインURL取得
    guideline_urls = get_guideline_urls(json_path)

    # PubMed検索
    pubmed_ids = None
    if drug_name_en:
        print(f"PubMed検索: {drug_name_en}")
        pubmed_ids = search_pubmed(drug_name_en)
        print(f"  取得PMID: {pubmed_ids}")

    # 追加URLをまとめる（ガイドライン + PubMed）
    extra_urls = guideline_urls + [
        f'https://pubmed.ncbi.nlm.nih.gov/{pmid}/' for pmid in (pubmed_ids or [])
    ] or None
    print()

    # sourceを解決
    if is_drug_name:
        resolved = await resolve_pmda_url(source)
        if not resolved:
            print(f"エラー: '{source}' のPMDA URLが見つかりません")
            print("  → PMDAで手動検索してURLを直接渡すか、キャッシュに追加してください")
            print(f"  キャッシュファイル: {CACHE_PATH}")
            sys.exit(1)
        source = resolved
        is_url = True

    try:
        if is_url:
            drugs = await extract_from_url(source, prompt, extra_urls)
        else:
            drugs = await extract_from_pdf(pathlib.Path(source), prompt, extra_urls)

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

    drug_name_en = sys.argv[3] if len(sys.argv) >= 4 else None
    asyncio.run(main(sys.argv[1], sys.argv[2], drug_name_en))
