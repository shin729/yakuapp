"""allergy.json にラマトロバン（バイナス）を追加
TXA2/PGD2(CRTH2)受容体拮抗薬。プランルカスト（index 18）の直後に挿入"""
import json

PATH = "data/allergy.json"

NEW_ENTRY = {
    "name": "ラマトロバン",
    "brand": "バイナス",
    "category": "TXA2/PGD2受容体拮抗薬",
    "class": "TXA2・PGD2(CRTH2)受容体拮抗薬（アレルギー性鼻炎適応の唯一の薬剤）",
    "mechanism": "鼻粘膜血管・血小板のTXA2受容体と好酸球のPGD2(CRTH2)受容体を遮断し血管透過性亢進・浸潤を抑制",
    "action_type": "TXA2/PGD2受容体拮抗薬",
    "indication": "アレルギー性鼻炎（通年性・季節性）",
    "efficacy_star": 3,
    "pollen_effect": "★★★ 鼻閉に有効（LTRAに似た作用）",
    "asthma_effect": "適応外（喘息適応なし）",
    "nocturnal_effect": "★★ 夜間鼻閉にも有効",
    "dosing_time": "1日2回（朝夕食後または就寝前）",
    "guideline_rank": "アレルギー性鼻炎適応を持つ唯一のTXA2/PGD2拮抗薬。鼻閉型に有効だが効果発現に1〜2週間を要する",
    "evidence": "Okuda et al.（Adv Exp Med Biol 1998 PMID:9870646）",
    "evidence_url": None,
    "caution": "抗血小板作用により出血傾向を助長するおそれ。抗凝固薬・抗血小板薬併用時は注意。効果発現まで1〜2週間を要し即効性なし ／ 【妊娠】血小板凝集抑制作用により分娩時の出血リスク増加が懸念され、有益性が危険性を上回る場合のみ投与。授乳中は安全性データがなく、添付文書上も授乳を避けることが望ましいとされる。",
    "pregnancy": "△",
    "lactation": "×",
    "renal_gfr": None,
    "dialysis": "無",
}

with open(PATH, encoding="utf-8") as f:
    data = json.load(f)

INSERT_AT = 19  # プランルカスト（index 18）の直後
data.insert(INSERT_AT, NEW_ENTRY)

with open(PATH, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
    f.write("\n")

print(f"inserted at index {INSERT_AT}: {NEW_ENTRY['name']} ({NEW_ENTRY['brand']})")
print(f"new total: {len(data)} entries")
