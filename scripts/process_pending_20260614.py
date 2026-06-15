"""checks/pending.md 溜まり分の一括処理（2026-06-14）

1. gi.json    : グセルクマブ（トレムフィア）をUC/CDカテゴリに追加
                抗IL-23p19抗体（CD64結合デュアル作用）。リサンキズマブの直後に挿入。
2. ent.json   : name括弧の統一感修正（過去のortho/derma修正例に倣う）
                「クラリスロマイシン（少量長期療法）」→「クラリスロマイシン」
                「プレドニゾロン（突発性難聴）」→「プレドニゾロン」
                ※区別情報はclass/role/category/target_symptom等で保持済み

ATP二重掲載（めまい/耳鳴り）はapp.jsが name+category 複合キーで管理しており
意図的な二重カテゴリ掲載（両適応とも保険適応あり）のため変更しない。
"""
import json

# ---- 1. gi.json: グセルクマブ追加 ----
GI_PATH = "data/gi.json"
GUSELKUMAB = {
    "name": "グセルクマブ",
    "brand": "トレムフィア",
    "category": "潰瘍性大腸炎・クローン病",
    "class": "抗IL-23p19抗体（完全ヒト型IgG1・CD64結合のデュアル作用）",
    "action_type": "IL-23のp19サブユニット中和＋CD64（FcγRI）結合によるIL-23産生細胞捕捉→Th17炎症経路を二重に遮断",
    "mechanism": "IL-23のp19サブユニットに高親和性で結合しIL-23シグナルを遮断すると同時に、IL-23産生細胞表面のCD64（FcγRI）にも結合してIL-23を局所で捕捉する（デュアル作用）。IL-12（p35+p40）には影響せずIL-23（p19+p40）を選択的に阻害し、Th17由来のIL-17A・IL-22産生を抑制する",
    "remission_type": "寛解導入・維持療法の両方（UC：2025年3月導入療法承認・2026年2月皮下注寛解導入追加、CD：2025年6月承認）",
    "infection_risk": "低〜中程度（IL-23選択的阻害でIL-12経路を温存・感染リスクはウステキヌマブと同等以下）",
    "NNT": 5,
    "immunosuppression_strength": "中〜強（IL-23特異的・Th17経路選択的：IL-12経路は温存）",
    "efficacy_star": 5,
    "guideline_rank": "リサンキズマブ・ミリキズマブと並ぶ抗IL-23（p19）薬。QUASAR試験（UC）で寛解導入・維持の有効性を示し、GALAXI-2/3試験（CD）ではウステキヌマブに対する優越性を達成した。乾癬で先行承認（derma.json掲載）、IBDではUC・CDとも2025年承認。導入はIV点滴、維持はSC皮下注",
    "evidence": "QUASAR試験（Lancet 2024 PMID:39706209）",
    "caution": "投与前感染症スクリーニング（結核・B型肝炎）必須。活動性感染症・活動性結核は禁忌。生ワクチン禁忌。注射部位反応（維持療法SC時）。悪性腫瘍リスクの長期評価継続中",
    "evidence_url": None,
    "pregnancy": "×",
    "lactation": "×",
    "renal_gfr": None,
    "dialysis": "無",
}

with open(GI_PATH, encoding="utf-8") as f:
    gi = json.load(f)

# リサンキズマブの直後に挿入
ins = next(i for i, e in enumerate(gi) if e.get("name") == "リサンキズマブ") + 1
gi.insert(ins, GUSELKUMAB)

with open(GI_PATH, "w", encoding="utf-8") as f:
    json.dump(gi, f, ensure_ascii=False, indent=2)
    f.write("\n")
print(f"[gi.json] グセルクマブを index {ins} に挿入 / total {len(gi)} 件")

# ---- 2. ent.json: name括弧の統一感修正 ----
ENT_PATH = "data/ent.json"
RENAMES = {
    "クラリスロマイシン（少量長期療法）": "クラリスロマイシン",
    "プレドニゾロン（突発性難聴）": "プレドニゾロン",
}

with open(ENT_PATH, encoding="utf-8") as f:
    ent = json.load(f)

changed = 0
for e in ent:
    if e.get("name") in RENAMES:
        old = e["name"]
        e["name"] = RENAMES[old]
        changed += 1
        print(f"[ent.json] name 修正: 「{old}」→「{e['name']}」(category: {e.get('category')})")

with open(ENT_PATH, "w", encoding="utf-8") as f:
    json.dump(ent, f, ensure_ascii=False, indent=2)
    f.write("\n")
print(f"[ent.json] {changed} 件修正 / total {len(ent)} 件")
