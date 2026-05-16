#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
batch_notebooklm.py  - 複数の薬剤をNotebookLMで一括抽出・強化

使い方:
  PYTHONUTF8=1 python scripts/batch_notebooklm.py urology
  PYTHONUTF8=1 python scripts/batch_notebooklm.py renal
  PYTHONUTF8=1 python scripts/batch_notebooklm.py ophthalmo
  PYTHONUTF8=1 python scripts/batch_notebooklm.py all

注意:
  - 1薬剤ごとに約60〜90秒かかる（NotebookLM制限）
  - 既存データを上書きせずマージ（同名薬はスキップ）
  - PYTHONUTF8=1 を付けること
"""

import sys
import subprocess
import time
import pathlib

# ドメイン別薬剤リスト（日本語名, 英語名）
DRUG_LISTS = {
    'urology': [
        ('タムスロシン',     'tamsulosin',    'data/urology.json'),
        ('シロドシン',       'silodosin',     'data/urology.json'),
        ('ナフトピジル',     'naftopidil',    'data/urology.json'),
        ('フィナステリド',   'finasteride',   'data/urology.json'),
        ('デュタステリド',   'dutasteride',   'data/urology.json'),
        ('クロルマジノン',   'chlormadinone', 'data/urology.json'),
        ('ソリフェナシン',   'solifenacin',   'data/urology.json'),
        ('イミダフェナシン', 'imidafenacin',  'data/urology.json'),
        ('フェソテロジン',   'fesoterodine',  'data/urology.json'),
        ('ミラベグロン',     'mirabegron',    'data/urology.json'),
        ('ビベグロン',       'vibegron',      'data/urology.json'),
        ('シルデナフィル',   'sildenafil',    'data/urology.json'),
        ('タダラフィル',     'tadalafil',     'data/urology.json'),
        ('バルデナフィル',   'vardenafil',    'data/urology.json'),
        ('アバナフィル',     'avanafil',      'data/urology.json'),
    ],
    'renal': [
        ('フロセミド',             'furosemide',          'data/renal.json'),
        ('トラセミド',             'torasemide',          'data/renal.json'),
        ('アゾセミド',             'azosemide',           'data/renal.json'),
        ('ヒドロクロロチアジド',   'hydrochlorothiazide', 'data/renal.json'),
        ('トリクロルメチアジド',   'trichlormethiazide',  'data/renal.json'),
        ('インダパミド',           'indapamide',          'data/renal.json'),
        ('スピロノラクトン',       'spironolactone',      'data/renal.json'),
        ('エプレレノン',           'eplerenone',          'data/renal.json'),
        ('エサキセレノン',         'esaxerenone',         'data/renal.json'),
        ('トリアムテレン',         'triamterene',         'data/renal.json'),
    ],
    'ophthalmo': [
        ('ラタノプロスト',   'latanoprost',   'data/ophthalmo.json'),
        ('タフルプロスト',   'tafluprost',    'data/ophthalmo.json'),
        ('トラボプロスト',   'travoprost',    'data/ophthalmo.json'),
        ('ビマトプロスト',   'bimatoprost',   'data/ophthalmo.json'),
        ('チモロール',       'timolol',       'data/ophthalmo.json'),
        ('ブリモニジン',     'brimonidine',   'data/ophthalmo.json'),
        ('ドルゾラミド',     'dorzolamide',   'data/ophthalmo.json'),
        ('リパスジル',       'ripasudil',     'data/ophthalmo.json'),
        ('ランイビズマブ',   'ranibizumab',   'data/ophthalmo.json'),
        ('アフリベルセプト', 'aflibercept',   'data/ophthalmo.json'),
        ('ブロルシズマブ',   'brolucizumab',  'data/ophthalmo.json'),
        ('ファリシマブ',     'faricimab',     'data/ophthalmo.json'),
        ('ジクアホソル',     'diquafosol',    'data/ophthalmo.json'),
        ('レバミピド',       'rebamipide',    'data/ophthalmo.json'),
        ('ヒアルロン酸ナトリウム', 'sodium hyaluronate', 'data/ophthalmo.json'),
    ],
}


def run_drug(drug_ja: str, drug_en: str, target_json: str) -> bool:
    cmd = [
        sys.executable,
        'scripts/extract_pdf.py',
        drug_ja,
        target_json,
        drug_en,
    ]
    print(f'\n{"="*50}')
    print(f'処理中: {drug_ja} ({drug_en}) → {target_json}')
    print(f'{"="*50}')
    result = subprocess.run(cmd, encoding='utf-8', errors='replace')
    return result.returncode == 0


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    domain = sys.argv[1].lower()
    if domain == 'all':
        targets = []
        for v in DRUG_LISTS.values():
            targets.extend(v)
    elif domain in DRUG_LISTS:
        targets = DRUG_LISTS[domain]
    else:
        print(f'不明なドメイン: {domain}')
        print(f'有効なドメイン: {list(DRUG_LISTS.keys())} または all')
        sys.exit(1)

    total = len(targets)
    print(f'\n合計 {total} 薬剤を処理します')
    print('（各薬剤に約60〜90秒かかります）\n')

    ok = 0
    ng = []
    for i, (drug_ja, drug_en, target_json) in enumerate(targets, 1):
        print(f'[{i}/{total}]', end='')
        success = run_drug(drug_ja, drug_en, target_json)
        if success:
            ok += 1
        else:
            ng.append(drug_ja)
        if i < total:
            print('次の薬剤まで30秒待機...')
            time.sleep(30)

    print(f'\n\n{"="*50}')
    print(f'完了: {ok}/{total} 件成功')
    if ng:
        print(f'失敗: {ng}')


if __name__ == '__main__':
    main()
