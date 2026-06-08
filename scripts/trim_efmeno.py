"""エフメノカプセル（gyneco.json）の各フィールドを他薬剤と同程度の文字数にコンパクト化"""
import json

PATH = "data/gyneco.json"

PATCH = {
    "action_type": "更年期障害・卵巣欠落症状における卵胞ホルモン剤投与時の子宮内膜増殖症の発症抑制",
    "mechanism": "マイクロナイズド化した天然型プロゲステロンを経口投与→子宮内膜のプロゲステロン受容体に結合しエストロゲン受容体の発現と線維芽細胞増殖因子の産生を抑制→子宮内膜増殖を抑制",
    "placebo_onset": "国内第Ⅲ相試験（52週間投与）で子宮内膜増殖症の発現は0例、発現率95%信頼区間上限が許容水準2.0%を下回ることを確認",
    "placebo_sleep": "エストロゲン単独療法による子宮内膜増殖症・子宮体がんリスクを抑制。マイクロナイズド化で経口吸収性を改善した本邦初の経口天然型黄体ホルモン製剤",
    "onset_time": "1〜3ヶ月程度（内膜変化の確認）",
    "duration_hours": "100mg 1日1回 就寝前 連日内服、または200mg 1日1回 就寝前 14日間のみ内服",
    "guideline_rank": "2021年9月承認の本邦初の経口天然型黄体ホルモン製剤。AACE/ACE 2017はプロゲスチンが必要な場合マイクロナイズドプロゲステロンをより安全な選択肢として推奨。海外では1980年フランス承認・100カ国以上で使用実績",
    "caution": "重大な副作用に血栓症（心筋梗塞・脳血管障害・静脈血栓塞栓症等、頻度不明）。不正子宮出血（33.5%）・乳房不快感・頭痛・浮動性めまい等。E3Nコホート研究では合成プロゲスチン併用HRT（RR 1.69）に比べ天然型プロゲステロン併用（RR 1.00）は乳がんリスク増加が認められなかった",
}

with open(PATH, encoding="utf-8") as f:
    data = json.load(f)

for d in data:
    if d["name"] == "プロゲステロン（経口カプセル）" and d["brand"] == "エフメノ":
        for k, v in PATCH.items():
            print(f"{k}: {len(d[k])}字 → {len(v)}字")
            d[k] = v
        break

with open(PATH, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
    f.write("\n")

print("done")
