import json

# Fix class fields in sleep_anxiety.json
with open('data/sleep_anxiety.json', encoding='utf-8') as f:
    sleep = json.load(f)

class_fix_sleep = {
    'スルピリド':     '定型抗精神病薬（低力価）',
    'レボメプロマジン': '定型抗精神病薬（低力価）',
    'ブロナンセリン':  '非定型抗精神病薬（SDA）',
    'ペロスピロン':   '非定型抗精神病薬（SDA）',
    'クロザピン':     '非定型抗精神病薬（MARTA）',
    'ルラシドン':     '非定型抗精神病薬（SDA）',
    'カリプラジン':   '非定型抗精神病薬（DSS）',
    'アセナピン':     '非定型抗精神病薬（MARTA）',
}

for d in sleep:
    if d['name'] in class_fix_sleep:
        d['class'] = class_fix_sleep[d['name']]

with open('data/sleep_anxiety.json', 'w', encoding='utf-8') as f:
    json.dump(sleep, f, ensure_ascii=False, indent=2)
print('Fixed sleep_anxiety.json classes')

# Fix class fields in pain.json
with open('data/pain.json', encoding='utf-8') as f:
    pain = json.load(f)

class_fix_pain = {
    'ブプレノルフィン': '弱オピオイド',
    'ペンタゾシン':    '弱オピオイド',
    'ガルカネズマブ':  'CGRP受容体拮抗抗体',
    'フレマネズマブ':  'CGRP受容体拮抗抗体',
    # ミロガバリン stays as α2δリガンド（第2世代）→ will add to badge map
    # ゾニサミド stays as スルホンアミド系抗てんかん薬→ will add to badge map
    # ペランパネル stays as AMPA受容体拮抗薬（非競合）→ will add to badge map
    # クロバザム stays as 1,5-ベンゾジアゼピン系→ will add to badge map
}

for d in pain:
    if d['name'] in class_fix_pain:
        d['class'] = class_fix_pain[d['name']]

with open('data/pain.json', 'w', encoding='utf-8') as f:
    json.dump(pain, f, ensure_ascii=False, indent=2)
print('Fixed pain.json classes')

# Fix class fields in lifestyle.json
with open('data/lifestyle.json', encoding='utf-8') as f:
    life = json.load(f)

class_fix_life = {
    'カナグリフロジン': 'SGLT2阻害薬',
    'リラグルチド':    'GLP-1受容体作動薬',
    'ロサルタン':     'ARB',
    'ニフェジピン':   'Ca拮抗薬（L型）',
    'アゼルニジピン': 'Ca拮抗薬（L型）',
    'スピロノラクトン': 'アルドステロン拮抗薬',
    'プラバスタチン': 'スタチン（中強度）',
    'アリロクマブ':   'PCSK9阻害薬（抗体薬）',
}

for d in life:
    if d['name'] in class_fix_life:
        d['class'] = class_fix_life[d['name']]

with open('data/lifestyle.json', 'w', encoding='utf-8') as f:
    json.dump(life, f, ensure_ascii=False, indent=2)
print('Fixed lifestyle.json classes')

# Verify
for fname in ['data/sleep_anxiety.json', 'data/pain.json', 'data/lifestyle.json']:
    d = json.load(open(fname, encoding='utf-8'))
    print(f'{fname}: {len(d)} entries')
