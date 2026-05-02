#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
scrape_antivirals.py - antibiotic-books.jp 抗ウイルス薬(2001-2006)・抗原虫薬(3001-3004) をスクレイプ

使い方:
  PYTHONUTF8=1 python scripts/scrape_antivirals.py

出力:
  data/raw/antiviral_books_raw.json
"""

import asyncio
import json
import pathlib

BASE_URL  = "http://www.antibiotic-books.jp/drugs"
REPO_ROOT = pathlib.Path(__file__).parent.parent
OUTPUT_PATH = REPO_ROOT / "data" / "raw" / "antiviral_books_raw.json"

TARGET_IDS = [2001, 2002, 2004, 2006, 3001, 3002, 3003, 3004]


async def handle_survey(page):
    try:
        radios = await page.query_selector_all('input[type="radio"]')
        if radios:
            await radios[0].click()
            await page.wait_for_timeout(300)
            submit = await page.query_selector('input[type="submit"], button[type="submit"], button')
            if submit:
                await submit.click()
                await page.wait_for_load_state('networkidle')
            return True
        for keyword in ['薬剤師', '医師', '看護師']:
            link = await page.query_selector(f'a:has-text("{keyword}")')
            if link:
                await link.click()
                await page.wait_for_load_state('networkidle')
                return True
    except Exception:
        pass
    return False


async def scrape_all():
    from playwright.async_api import async_playwright

    results = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        )
        page = await context.new_page()

        print("初回アクセス中...")
        await page.goto(f"{BASE_URL}/1", timeout=20000)
        await page.wait_for_load_state('networkidle')
        handled = await handle_survey(page)
        print(f"  アンケート処理: {'完了' if handled else 'なし'}")

        print(f"\n対象: {TARGET_IDS}\n")

        for drug_id in TARGET_IDS:
            url = f"{BASE_URL}/{drug_id}"
            try:
                await page.goto(url, timeout=15000)
                await page.wait_for_load_state('networkidle')

                radios = await page.query_selector_all('input[type="radio"]')
                if radios:
                    await handle_survey(page)
                    await page.wait_for_load_state('networkidle')

                h1 = await page.query_selector('h1')
                drug_name = (await h1.inner_text()).strip() if h1 else ''
                body = await page.query_selector('main, article, #content, .content, body')
                content = (await body.inner_text()).strip() if body else ''

                if len(content) < 100 or not drug_name:
                    print(f"  [{drug_id}] - (欠番/エラー)")
                    continue

                results.append({"id": drug_id, "url": url, "name": drug_name, "content": content})
                print(f"  [{drug_id}] OK {drug_name} ({len(content)}文字)")

            except Exception as e:
                print(f"  [{drug_id}] エラー: {e}")

            await asyncio.sleep(0.8)

        await browser.close()

    print(f"\nスキャン完了: {len(results)}件")

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(f"保存完了: {OUTPUT_PATH}")

    return results


if __name__ == "__main__":
    asyncio.run(scrape_all())
