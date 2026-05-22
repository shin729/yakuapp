import json

with open('data/lifestyle.json', encoding='utf-8') as f:
    data = json.load(f)

existing_keys = {(d['name'], d['category']) for d in data}

new_drugs = [
    # ===== 糖尿病 =====
    {
        "name": "カナグリフロジン",
        "brand": "カナグル",
        "category": "糖尿病治療薬",
        "class": "sglt2i",
        "action_type": "SGLT2阻害薬（腎糖再吸収阻害）",
        "mechanism": "腎近位尿細管のSGLT2を阻害し尿糖排泄↑。心腎保護・体重減少・血圧低下。心不全・CKD保護効果",
        "placebo_onset": "HbA1c −0.7〜1.0%",
        "placebo_sleep": "体重−2〜3kg・収縮期血圧−4mmHg・心不全入院↓33%",
        "NNT": 22.0,
        "efficacy_star": 4,
        "onset_time": "血糖低下：数日・心腎保護：数カ月",
        "duration_hours": "24時間（1日1回朝食前後）",
        "guideline_rank": "第一選択（心不全・CKD合併DM）",
        "evidence": "Neal B et al. NEJM 2017（CANVAS試験 PMID:28605608）",
        "evidence_url": "https://pubmed.ncbi.nlm.nih.gov/28605608/",
        "caution": "尿路・性器感染症。ケトアシドーシス（空腹時・手術前は中止）。下肢切断リスク（カナグリフロジン固有）。シックデイに中止"
    },
    {
        "name": "リラグルチド",
        "brand": "ビクトーザ",
        "category": "糖尿病治療薬",
        "class": "glp1ra",
        "action_type": "GLP-1受容体作動薬（日1回注射）",
        "mechanism": "GLP-1受容体刺激によりインスリン分泌↑・グルカゴン↓・食欲抑制・胃排泄遅延。心血管保護効果（LEADER試験）",
        "placebo_onset": "HbA1c −1.0〜1.5%",
        "placebo_sleep": "体重−2〜3kg・MACE↓13%（心血管ハイリスク例）",
        "NNT": 66.0,
        "efficacy_star": 4,
        "onset_time": "血糖：数日〜2週間・心血管保護：数カ月〜数年",
        "duration_hours": "24時間（日1回皮下注）",
        "guideline_rank": "第一選択（心血管病既往DM）",
        "evidence": "Marso SP et al. NEJM 2016（LEADER試験 PMID:27295427）",
        "evidence_url": "https://pubmed.ncbi.nlm.nih.gov/27295427/",
        "caution": "悪心・嘔吐（初期）。甲状腺髄様癌の既往/家族歴は禁忌。膵炎リスク（まれ）。注射製剤"
    },
    # ===== 高血圧 =====
    {
        "name": "ロサルタン",
        "brand": "ニューロタン",
        "category": "高血圧治療薬",
        "class": "arb",
        "action_type": "AT1受容体拮抗薬（ARB）",
        "mechanism": "アンジオテンシンIIのAT1受容体を選択的に遮断。血管拡張・アルドステロン抑制。初のARB。尿酸低下作用あり",
        "placebo_onset": "SBP/DBP −10〜14/−6〜8mmHg",
        "placebo_sleep": "心血管死・脳卒中↓16%（LIFE試験：HT+LVH）",
        "NNT": 50.0,
        "efficacy_star": 4,
        "onset_time": "1〜2時間（降圧最大効果3〜6時間）",
        "duration_hours": "24時間（1日1回）",
        "guideline_rank": "第一選択（CKD/蛋白尿・糖尿病性腎症・痛風合併）",
        "evidence": "Dahlof B et al. Lancet 2002（LIFE試験 PMID:12056585）",
        "evidence_url": "https://pubmed.ncbi.nlm.nih.gov/12056585/",
        "caution": "妊婦禁忌。高カリウム血症（腎機能低下例）。ACE阻害薬との併用は腎機能悪化リスク"
    },
    {
        "name": "ニフェジピン",
        "brand": "アダラート・アダラートCR",
        "category": "高血圧治療薬",
        "class": "ccb",
        "action_type": "ジヒドロピリジン系Ca²⁺拮抗薬（冠動脈・末梢）",
        "mechanism": "L型Ca²⁺チャンネル遮断により末梢血管・冠動脈を拡張。強力な降圧効果。CR製剤で平滑な血中濃度",
        "placebo_onset": "SBP/DBP −12〜18/−7〜10mmHg",
        "placebo_sleep": "冠動脈スパズム・安定狭心症に有効",
        "NNT": 40.0,
        "efficacy_star": 4,
        "onset_time": "CR製剤：2〜4時間（即放製剤は10〜30分）",
        "duration_hours": "24時間（CR1日1回）",
        "guideline_rank": "第一選択（狭心症合併・高齢者・妊娠高血圧）",
        "evidence": "添付文書・HOT試験（PMID:9236482）",
        "evidence_url": "https://pubmed.ncbi.nlm.nih.gov/9236482/",
        "caution": "顔面紅潮・頭痛・動悸（反射性頻脈）。グレープフルーツで血中濃度↑。即放製剤の急速投与で急激な降圧は危険"
    },
    {
        "name": "アゼルニジピン",
        "brand": "カルブロック",
        "category": "高血圧治療薬",
        "class": "ccb",
        "action_type": "ジヒドロピリジン系Ca²⁺拮抗薬（心保護・腎保護）",
        "mechanism": "L型Ca²⁺チャンネル遮断。輸入・輸出細動脈を均等拡張→糸球体内圧↓で腎保護。T型Ca²⁺遮断で交感神経抑制",
        "placebo_onset": "SBP/DBP −12〜16/−7〜9mmHg",
        "placebo_sleep": "糸球体内圧↓・蛋白尿減少・糖代謝改善",
        "NNT": 40.0,
        "efficacy_star": 4,
        "onset_time": "2〜4時間",
        "duration_hours": "24時間（1日1回）",
        "guideline_rank": "第一選択（CKD・糖尿病合併高血圧）",
        "evidence": "Ogawa S et al. J Am Soc Nephrol 2004（PMID:15213273）",
        "evidence_url": "https://pubmed.ncbi.nlm.nih.gov/15213273/",
        "caution": "反射性頻脈が少ない（アムロジピンより少ない）。グレープフルーツとの相互作用"
    },
    {
        "name": "スピロノラクトン",
        "brand": "アルダクトンA",
        "category": "高血圧治療薬",
        "class": "thiazide",
        "action_type": "アルドステロン拮抗薬（カリウム保持性利尿薬）",
        "mechanism": "鉱質コルチコイド受容体を遮断しNa排泄↑・K保持。難治性高血圧の第4選択。心不全・原発性アルドステロン症にも適応",
        "placebo_onset": "SBP/DBP −10〜15/−5〜8mmHg（難治性）",
        "placebo_sleep": "心不全死亡率↓（RALES試験）・原発性アルドステロン症コントロール",
        "NNT": 9.0,
        "efficacy_star": 4,
        "onset_time": "2〜3日（最大効果まで数週間）",
        "duration_hours": "24時間（t1/2 20h）",
        "guideline_rank": "第四選択（難治性高血圧）・心不全第一選択",
        "evidence": "Pitt B et al. NEJM 1999（RALES試験 PMID:10471456）",
        "evidence_url": "https://pubmed.ncbi.nlm.nih.gov/10471456/",
        "caution": "高カリウム血症（ACE/ARB併用で特に注意）。女性化乳房・月経異常（抗アンドロゲン作用）。腎機能低下例は禁忌または慎重"
    },
    # ===== 脂質異常症 =====
    {
        "name": "プラバスタチン",
        "brand": "メバロチン",
        "category": "脂質異常症治療薬",
        "class": "statin-mod",
        "action_type": "HMG-CoA還元酵素阻害薬（中等度スタチン）",
        "mechanism": "HMG-CoA還元酵素を競合阻害しコレステロール合成↓。水溶性で肝選択性高く筋障害リスクが低い。日本初のスタチン",
        "placebo_onset": "LDL −25〜35%",
        "placebo_sleep": "MACE↓24%（WOSCOPS試験・プラセボ比）",
        "NNT": 42.0,
        "efficacy_star": 3,
        "onset_time": "2〜4週で最大効果",
        "duration_hours": "24時間（就寝前1回）",
        "guideline_rank": "第一選択（CKD・透析患者・相互作用懸念例）",
        "evidence": "Shepherd J et al. NEJM 1995（WOSCOPS試験 PMID:7566020）",
        "evidence_url": "https://pubmed.ncbi.nlm.nih.gov/7566020/",
        "caution": "筋障害リスクが低い（水溶性）。P-糖タンパク基質のため一部相互作用。フィブラートとの慎重併用"
    },
    {
        "name": "アリロクマブ",
        "brand": "プラルエント",
        "category": "脂質異常症治療薬",
        "class": "pcsk9i",
        "action_type": "PCSK9阻害薬（LDLr再生・LDL強力低下）",
        "mechanism": "PCSK9に結合してLDL受容体の分解を阻止→LDR受容体数↑→LDL強力低下（最大70%）。スタチン最大量でも不十分な例に適応",
        "placebo_onset": "LDL −50〜65%",
        "placebo_sleep": "MACE↓15%（ODYSSEY OUTCOMES試験）",
        "NNT": 54.0,
        "efficacy_star": 5,
        "onset_time": "2週間以内に最大効果",
        "duration_hours": "336時間（2週に1回皮下注）",
        "guideline_rank": "第三選択（スタチン最大量でもLDL目標未達の高リスク例）",
        "evidence": "Schwartz GG et al. NEJM 2018（ODYSSEY OUTCOMES試験 PMID:29542579）",
        "evidence_url": "https://pubmed.ncbi.nlm.nih.gov/29542579/",
        "caution": "注射剤（2週1回または月1回）。非常に高価。注射部位反応。筋肉痛まれ"
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
print(f'Total lifestyle.json: {len(data)} entries')

with open('data/lifestyle.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
print('Saved.')
