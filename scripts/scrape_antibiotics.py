#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
scrape_antibiotics.py - antibiotic-books.jp から抗菌薬情報をスクレイプ

使い方:
  PYTHONUTF8=1 python scripts/scrape_antibiotics.py            # 全処理（推奨）
  PYTHONUTF8=1 python scripts/scrape_antibiotics.py --max 130  # 最大番号指定
  PYTHONUTF8=1 python scripts/scrape_antibiotics.py --list     # 薬剤名一覧のみ

出力:
  data/raw/antibiotic_books_raw.json  ← 全コンテンツ（extract_antibiotics.py が参照）
"""

import asyncio
import json
import pathlib
import sys
import argparse

BASE_URL = "http://www.antibiotic-books.jp/drugs"
REPO_ROOT = pathlib.Path(__file__).parent.parent
OUTPUT_PATH = REPO_ROOT / "data" / "raw" / "antibiotic_books_raw.json"


async def handle_survey(page):
    """アンケート（職業選択）を処理する。表示されていなければスキップ。"""
    try:
        # ラジオボタン or セレクトボックス or クリッカブルリンクを探す
        radios = await page.query_selector_all('input[type="radio"]')
        if radios:
            await radios[0].click()
            await page.wait_for_timeout(300)
            submit = await page.query_selector('input[type="submit"], button[type="submit"], button')
            if submit:
                await submit.click()
                await page.wait_for_load_state('networkidle')
            return True

        # リンク形式のアンケート（「医師」「薬剤師」等のテキストリンク）
        for keyword in ['薬剤師', '医師', '看護師', '選択', 'enter', 'continue']:
            link = await page.query_selector(f'a:has-text("{keyword}")')
            if link:
                await link.click()
                await page.wait_for_load_state('networkidle')
                return True

        # フォームのsubmitボタン
        submit = await page.query_selector('input[type="submit"], button[type="submit"]')
        if submit:
            await submit.click()
            await page.wait_for_load_state('networkidle')
            return True

    except Exception as e:
        pass  # アンケートがない or 処理不要
    return False


async def extract_drug_info(page, url: str, drug_id: int) -> dict | None:
    """1ページから薬剤情報を抽出する。"""
    try:
        response = await page.goto(url, timeout=15000)

        if response and response.status in (404, 302, 301):
            # リダイレクト先がトップページなら欠番
            if response.status in (301, 302):
                final_url = page.url
                if 'drugs' not in final_url or final_url.rstrip('/') == BASE_URL:
                    return None
            elif response.status == 404:
                return None

        await page.wait_for_load_state('networkidle')

        # アンケートが再表示された場合に対応
        radios = await page.query_selector_all('input[type="radio"]')
        if radios:
            await handle_survey(page)
            await page.wait_for_load_state('networkidle')

        # 薬剤名（h1 優先、なければtitle）
        h1 = await page.query_selector('h1')
        drug_name = (await h1.inner_text()).strip() if h1 else ''
        if not drug_name:
            title = await page.title()
            drug_name = title.strip()

        # 本文テキスト全体
        body = await page.query_selector('main, article, #content, .content, body')
        content = (await body.inner_text()).strip() if body else ''

        # コンテンツが空 or 短すぎ → 欠番 or エラーページ
        if len(content) < 100 or not drug_name:
            return None

        # トップページに戻ってしまった場合（アンケートループ）
        if '薬剤師' in content[:200] and '医師' in content[:200] and len(content) < 500:
            return None

        return {
            "id": drug_id,
            "url": url,
            "name": drug_name,
            "content": content,
        }

    except Exception as e:
        print(f"  [{drug_id:3d}] エラー: {e}")
        return None


async def scrape_all(max_id: int = 130, list_only: bool = False):
    from playwright.async_api import async_playwright

    results = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        )
        page = await context.new_page()

        # 初回アクセス → アンケート処理
        print("初回アクセス中...")
        await page.goto(f"{BASE_URL}/1", timeout=20000)
        await page.wait_for_load_state('networkidle')
        handled = await handle_survey(page)
        if handled:
            print("  アンケート処理完了")
        else:
            print("  アンケートなし（または自動処理済み）")

        print(f"\n1〜{max_id}番をスキャン中...\n")

        for i in range(1, max_id + 1):
            url = f"{BASE_URL}/{i}"
            drug = await extract_drug_info(page, url, i)

            if drug:
                results.append(drug)
                name_display = drug['name'][:40]
                content_len = len(drug['content'])
                print(f"  [{i:3d}] ✓ {name_display} ({content_len}文字)")
            else:
                print(f"  [{i:3d}] - (欠番/削除)")

            await asyncio.sleep(0.8)  # サーバー負荷軽減

        await browser.close()

    print(f"\n=== スキャン完了: {len(results)}件取得 ===\n")

    # 薬剤名一覧を表示
    print("【取得できた薬剤一覧】")
    for d in results:
        print(f"  {d['id']:3d}. {d['name']}")

    if list_only:
        return results

    # JSON保存
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(f"\n保存完了: {OUTPUT_PATH}")
    print("次のステップ: PYTHONUTF8=1 python scripts/extract_antibiotics.py")

    return results


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='antibiotic-books.jp スクレイパー')
    parser.add_argument('--max', type=int, default=130, help='最大番号（デフォルト: 130）')
    parser.add_argument('--list', action='store_true', help='薬剤名一覧のみ表示（JSONに保存しない）')
    args = parser.parse_args()

    asyncio.run(scrape_all(max_id=args.max, list_only=args.list))
