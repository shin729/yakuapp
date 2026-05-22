import json

with open('data/pain.json', encoding='utf-8') as f:
    data = json.load(f)

existing_keys = {(d['name'], d['category']) for d in data}

new_drugs = [
    # ===== 弱オピオイド =====
    {
        "name": "ブプレノルフィン",
        "brand": "ノルスパンテープ・レペタン",
        "category": "弱オピオイド・補助薬",
        "class": "weak-opioid",
        "action_type": "μ受容体部分作動（貼付剤）",
        "mechanism": "μオピオイド受容体の部分作動薬。天井効果があり呼吸抑制リスクが低い。貼付剤（週1回）は非癌性慢性疼痛に適応",
        "placebo_onset": "VAS改善 プラセボ比−20〜25mm",
        "placebo_sleep": "50%軽減達成率 40〜55%",
        "NNT": 5.0,
        "efficacy_star": 3,
        "onset_time": "貼付後12〜24時間（血中濃度定常状態まで3日）",
        "duration_hours": "168時間（週1回交換）",
        "guideline_rank": "第二選択（慢性腰痛・変形性関節症）",
        "evidence": "Steiner DJ et al. Clin J Pain 2011（PMID:21240002）",
        "evidence_url": "https://pubmed.ncbi.nlm.nih.gov/21240002/",
        "caution": "部分作動薬のため完全作動薬との併用で拮抗。貼付部位の皮膚刺激。貼付剤はフェンタニルと異なり非麻薬指定（ノルスパン）"
    },
    {
        "name": "ペンタゾシン",
        "brand": "ソセゴン・ペンタジン",
        "category": "弱オピオイド・補助薬",
        "class": "weak-opioid",
        "action_type": "κ受容体作動・μ受容体拮抗",
        "mechanism": "κオピオイド受容体を刺激し鎮痛。μ受容体を拮抗するため他オピオイドと併用禁忌。天井効果・精神依存リスクあり",
        "placebo_onset": "VAS改善 プラセボ比−18〜22mm",
        "placebo_sleep": "50%軽減達成率 35〜50%",
        "NNT": 5.5,
        "efficacy_star": 3,
        "onset_time": "経口15〜30分、注射2〜3分",
        "duration_hours": "3〜4時間",
        "guideline_rank": "補助的選択（急性疼痛・術後痛）",
        "evidence": "添付文書・臨床経験",
        "evidence_url": None,
        "caution": "他オピオイドと併用禁忌（μ拮抗で離脱症状誘発）。精神症状（幻覚・興奮）に注意。乱用防止のため注射剤にナロキソン配合剤あり"
    },
    # ===== 神経障害性疼痛 =====
    {
        "name": "ミロガバリン",
        "brand": "タリージェ",
        "category": "神経障害性疼痛",
        "class": "α2δリガンド（第2世代）",
        "action_type": "電位依存性Ca²⁺チャンネルα2δサブユニット阻害",
        "mechanism": "プレガバリンと同機序だが脊髄後角のα2δ-1に高選択性。鎮痛効果が持続しやすく、1日2回投与",
        "placebo_onset": "NRS改善 プラセボ比−0.9〜1.2点",
        "placebo_sleep": "50%軽減達成率 35〜45%",
        "NNT": 6.0,
        "efficacy_star": 3,
        "onset_time": "1〜2週間で効果発現",
        "duration_hours": "12時間（t1/2 約6h・1日2回）",
        "guideline_rank": "第二選択（末梢神経障害性疼痛）",
        "evidence": "Baba M et al. J Diabetes Investig 2019（PMID:30900390）",
        "evidence_url": "https://pubmed.ncbi.nlm.nih.gov/30900390/",
        "caution": "傾眠・めまい（プレガバリンより少ない傾向）。腎機能に応じて減量。体重増加あり"
    },
    # ===== 片頭痛 =====
    {
        "name": "ガルカネズマブ",
        "brand": "エムガルティ",
        "category": "片頭痛",
        "class": "抗CGRPモノクローナル抗体（予防）",
        "action_type": "CGRP（カルシトニン遺伝子関連ペプチド）リガンド中和",
        "mechanism": "CGRPリガンドに結合し三叉神経血管反応を抑制。月1回皮下注射で片頭痛発作を予防",
        "placebo_onset": "月間片頭痛日数減少 プラセボ比−1.9〜4.7日",
        "placebo_sleep": "50%以上減少達成率 60〜65%",
        "NNT": 4.0,
        "efficacy_star": 4,
        "onset_time": "投与1カ月以内に効果発現",
        "duration_hours": "720時間（月1回皮下注）",
        "guideline_rank": "第二選択（反復性・慢性片頭痛予防）",
        "evidence": "Stauffer VL et al. JAMA Neurol 2018（EVOLVE-1試験 PMID:29813147）",
        "evidence_url": "https://pubmed.ncbi.nlm.nih.gov/29813147/",
        "caution": "注射部位反応。高価（月約4〜5万円）。妊娠中は禁忌。他の予防薬が無効または副作用の例に適応"
    },
    {
        "name": "フレマネズマブ",
        "brand": "アジョビ",
        "category": "片頭痛",
        "class": "抗CGRPモノクローナル抗体（予防）",
        "action_type": "CGRP（カルシトニン遺伝子関連ペプチド）リガンド中和",
        "mechanism": "CGRPリガンドに高親和性で結合し三叉神経活性化を抑制。月1回または四半期1回の皮下注射",
        "placebo_onset": "月間片頭痛日数減少 プラセボ比−2.0〜4.1日",
        "placebo_sleep": "50%以上減少達成率 57〜65%",
        "NNT": 4.5,
        "efficacy_star": 4,
        "onset_time": "投与1カ月以内に効果発現",
        "duration_hours": "720時間（月1回）または2160時間（四半期1回）",
        "guideline_rank": "第二選択（反復性・慢性片頭痛予防）",
        "evidence": "Silberstein SD et al. NEJM 2017（HALO試験 PMID:29171821）",
        "evidence_url": "https://pubmed.ncbi.nlm.nih.gov/29171821/",
        "caution": "注射部位反応。四半期1回投与（675mg）は服薬アドヒアランス向上に有利。他予防薬無効例に適応"
    },
    # ===== 抗てんかん薬 =====
    {
        "name": "ゾニサミド",
        "brand": "エクセグラン・トレリーフ",
        "category": "抗てんかん薬",
        "class": "スルホンアミド系抗てんかん薬",
        "action_type": "Na⁺/Ca²⁺チャンネル遮断・炭酸脱水酵素阻害",
        "mechanism": "電位依存性Na⁺・T型Ca²⁺チャンネル阻害。パーキンソン病補助にも使用（MAO-B阻害に類似作用）",
        "placebo_onset": "発作頻度減少率 プラセボ比−30〜40%",
        "placebo_sleep": "50%以上減少達成率 40〜55%",
        "NNT": 5.5,
        "efficacy_star": 3,
        "onset_time": "2〜4週で効果発現",
        "duration_hours": "24時間（t1/2 63h・1日1〜2回）",
        "guideline_rank": "補助療法（部分てんかん・全般てんかん）",
        "evidence": "Brodie MJ et al. Epilepsy Res 2005（PMID:16289617）",
        "evidence_url": "https://pubmed.ncbi.nlm.nih.gov/16289617/",
        "caution": "腎結石（炭酸脱水酵素阻害）・発汗減少・高体温。体重減少。認知機能への影響少ない。緩徐に増量"
    },
    {
        "name": "ペランパネル",
        "brand": "フィコンパ",
        "category": "抗てんかん薬",
        "class": "AMPA受容体拮抗薬（非競合）",
        "action_type": "興奮性グルタミン酸AMPA受容体遮断",
        "mechanism": "AMPA型グルタミン酸受容体を非競合的に遮断。唯一のAMPA拮抗抗てんかん薬。就寝前1日1回",
        "placebo_onset": "発作頻度減少率 プラセボ比−28〜30%",
        "placebo_sleep": "50%以上減少達成率 29〜35%",
        "NNT": 8.0,
        "efficacy_star": 3,
        "onset_time": "2〜4週",
        "duration_hours": "24時間（t1/2 105h・就寝前1回）",
        "guideline_rank": "補助療法（部分てんかん・強直間代発作）",
        "evidence": "French JA et al. Neurology 2012（PMID:22689744）",
        "evidence_url": "https://pubmed.ncbi.nlm.nih.gov/22689744/",
        "caution": "めまい・傾眠・攻撃性・精神症状（用量依存）。CYP3A4誘導薬で血中濃度↓。アルコールとの相互作用"
    },
    {
        "name": "クロバザム",
        "brand": "マイスタン",
        "category": "抗てんかん薬",
        "class": "1,5-ベンゾジアゼピン系",
        "action_type": "GABAA受容体正アロステリック調節（BZ系）",
        "mechanism": "GABAA受容体のβ2サブユニットに高親和性。1,5-BZのため1,4-BZより依存性・認知障害が少ない",
        "placebo_onset": "発作頻度減少率 プラセボ比−40〜50%",
        "placebo_sleep": "50%以上減少達成率 45〜65%（Lennox-Gastaut症候群）",
        "NNT": 4.0,
        "efficacy_star": 4,
        "onset_time": "数日〜1週間",
        "duration_hours": "12〜24時間（t1/2 36〜42h）",
        "guideline_rank": "補助療法（Lennox-Gastaut症候群・難治性てんかん）",
        "evidence": "Ng YT et al. NEJM 2011（PMID:21879742）",
        "evidence_url": "https://pubmed.ncbi.nlm.nih.gov/21879742/",
        "caution": "耐性形成（連用で効果減弱）・依存・離脱症状。1,4-BZより少ないが長期使用に注意。傾眠"
    },
]

added = 0
for drug in new_drugs:
    key = (drug['name'], drug['category'])
    if key not in existing_keys:
        data.append(drug)
        existing_keys.add(key)
        added += 1

print(f'Added {added} drugs')
print(f'Total pain.json: {len(data)} entries')

with open('data/pain.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
print('Saved.')
