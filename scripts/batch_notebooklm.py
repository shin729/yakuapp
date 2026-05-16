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
    'derma': [
        ('デュピルマブ',                   'dupilumab',            'data/derma.json'),
        ('トラロキヌマブ',                 'tralokinumab',         'data/derma.json'),
        ('レブリキズマブ',                 'lebrikizumab',         'data/derma.json'),
        ('ネモリズマブ',                   'nemolizumab',          'data/derma.json'),
        ('ウパダシチニブ',                 'upadacitinib',         'data/derma.json'),
        ('アブロシチニブ',                 'abrocitinib',          'data/derma.json'),
        ('タクロリムス',                   'tacrolimus',           'data/derma.json'),
        ('デルゴシチニブ',                 'delgocitinib',         'data/derma.json'),
        ('ジファミラスト',                 'difamilast',           'data/derma.json'),
        ('セクキヌマブ',                   'secukinumab',          'data/derma.json'),
        ('イキセキズマブ',                 'ixekizumab',           'data/derma.json'),
        ('ビメキズマブ',                   'bimekizumab',          'data/derma.json'),
        ('リサンキズマブ',                 'risankizumab',         'data/derma.json'),
        ('アプレミラスト',                 'apremilast',           'data/derma.json'),
        ('アダパレン',                     'adapalene',            'data/derma.json'),
        ('過酸化ベンゾイル',               'benzoyl peroxide',     'data/derma.json'),
        ('アダパレン・過酸化ベンゾイル',   'adapalene benzoyl peroxide', 'data/derma.json'),
        ('イソトレチノイン',               'isotretinoin',         'data/derma.json'),
    ],
    'gyneco': [
        ('エストラジオール（経口）',             'estradiol oral',          'data/gyneco.json'),
        ('エストラジオール（経皮貼付）',         'estradiol transdermal',   'data/gyneco.json'),
        ('エストリオール',                       'estriol',                 'data/gyneco.json'),
        ('メドロキシプロゲステロン',             'medroxyprogesterone',     'data/gyneco.json'),
        ('バゼドキシフェン/結合型エストロゲン', 'bazedoxifene CE',         'data/gyneco.json'),
        ('ジエノゲスト',                         'dienogest',               'data/gyneco.json'),
        ('リュープロレリン',                     'leuprorelin',             'data/gyneco.json'),
        ('レルゴリクス',                         'relugolix',               'data/gyneco.json'),
        ('ナファレリン',                         'nafarelin',               'data/gyneco.json'),
        ('ドロスピレノン+エチニルエストラジオール', 'drospirenone ethinylestradiol', 'data/gyneco.json'),
        ('レボノルゲストレル+エチニルエストラジオール', 'levonorgestrel ethinylestradiol', 'data/gyneco.json'),
        ('デソゲストレル+エチニルエストラジオール', 'desogestrel ethinylestradiol', 'data/gyneco.json'),
        ('ジエノゲスト+エチニルエストラジオール', 'dienogest ethinylestradiol', 'data/gyneco.json'),
        ('レボノルゲストレル（緊急避妊）',       'levonorgestrel emergency', 'data/gyneco.json'),
    ],
    'nutrition': [
        ('チアミン（ビタミンB1）',       'thiamine',              'data/nutrition.json'),
        ('メコバラミン（ビタミンB12）',  'mecobalamin',           'data/nutrition.json'),
        ('ピリドキシン（ビタミンB6）',   'pyridoxine',            'data/nutrition.json'),
        ('葉酸',                         'folic acid',            'data/nutrition.json'),
        ('アルファカルシドール',         'alfacalcidol',          'data/nutrition.json'),
        ('アスコルビン酸（ビタミンC）',  'ascorbic acid',         'data/nutrition.json'),
        ('塩化カリウム',                 'potassium chloride',    'data/nutrition.json'),
        ('硫酸マグネシウム',             'magnesium sulfate',     'data/nutrition.json'),
        ('グルコン酸カルシウム',         'calcium gluconate',     'data/nutrition.json'),
        ('酢酸亜鉛',                     'zinc acetate',          'data/nutrition.json'),
        ('エレンタール',                 'elemental formula',     'data/nutrition.json'),
        ('エンシュア・リキッド',         'ensure liquid',         'data/nutrition.json'),
        ('ラコール',                     'racol',                 'data/nutrition.json'),
        ('グルタミン製剤',               'glutamine',             'data/nutrition.json'),
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
