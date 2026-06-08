"""gyneco.json にエフメノカプセル（経口天然型黄体ホルモン製剤）を追加
HRT・更年期カテゴリ、メドロキシプロゲステロン（合成プロゲスチン）の直後に挿入"""
import json

PATH = "data/gyneco.json"

NEW_ENTRY = {
    "name": "プロゲステロン（経口カプセル）",
    "brand": "エフメノ",
    "category": "HRT・更年期",
    "class": "天然型プロゲステロン（マイクロナイズド・経口製剤）",
    "action_type": "更年期障害・卵巣欠落症状における卵胞ホルモン剤投与時の子宮内膜増殖症の発症抑制（本邦初の経口天然型黄体ホルモン製剤・2021年9月承認）",
    "mechanism": "マイクロナイズド化した天然型プロゲステロンを経口投与→子宮内膜上皮細胞のプロゲステロン受容体に結合しエストロゲン受容体の遺伝子発現を抑制、間質細胞では線維芽細胞増殖因子の産生を抑制→エストロゲンによる子宮内膜増殖を抑制し内膜増殖症の発症を防ぐ",
    "efficacy_star": 4,
    "placebo_onset": "国内第Ⅲ相試験（エストラジオール併用52週間投与）で子宮内膜増殖症の発現は0例、発現率の95%信頼区間上限が事前規定の許容水準2.0%を下回ることを確認（検証的解析達成）",
    "placebo_sleep": "子宮を有する女性へのエストロゲン単独療法に伴う子宮内膜増殖症・子宮体がんリスクを抑制。マイクロナイズド化により天然型プロゲステロンの経口吸収性を改善した本邦初の経口天然型黄体ホルモン製剤",
    "NNT": None,
    "onset_time": "1〜3ヶ月程度（内膜変化の確認、他の黄体ホルモン製剤と同様）",
    "duration_hours": "レジメン1：100mg 1日1回 就寝前 連日内服／レジメン2：200mg 1日1回 就寝前 内服（投与15〜28日目の14日間のみ）",
    "guideline_rank": "本邦初の経口天然型黄体ホルモン製剤として2021年9月承認・子宮を有する女性のエストロゲン単独HRTに必須のプロゲスチン併用の選択肢の一つに追加。AACE/ACE 2017はプロゲスチンが必要な場合マイクロナイズドプロゲステロンをより安全な選択肢として推奨。海外では1980年フランスで承認され100カ国以上で使用実績あり",
    "evidence": "E3Nコホート研究（Breast Cancer Res Treat 2008 PMID:17333341）",
    "evidence_url": None,
    "caution": "重大な副作用に血栓症（心筋梗塞・脳血管障害・静脈血栓塞栓症・肺塞栓症等、頻度不明）。不正子宮出血（33.5%）・乳房不快感・頭痛・下腹部痛・浮動性めまい・腹部膨満・便秘・腟分泌物。E3Nコホート研究では合成プロゲスチン併用HRT（RR 1.69）に比べ天然型プロゲステロン併用（RR 1.00）は乳がんリスク増加が認められず、合成プロゲスチンより乳がんリスク面で有利な可能性が示唆されている",
    "pregnancy": "×",
    "lactation": "×",
    "renal_gfr": None,
    "dialysis": "無",
}

with open(PATH, encoding="utf-8") as f:
    data = json.load(f)

INSERT_AT = 4  # メドロキシプロゲステロン（index 3）の直後
data.insert(INSERT_AT, NEW_ENTRY)

with open(PATH, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
    f.write("\n")

print(f"inserted at index {INSERT_AT}: {NEW_ENTRY['name']} ({NEW_ENTRY['brand']})")
print(f"new total: {len(data)} entries")
