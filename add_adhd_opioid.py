import json

# ===== ADHD治療薬 → sleep_anxiety.json =====
with open('data/sleep_anxiety.json', encoding='utf-8') as f:
    sleep = json.load(f)

existing_sleep = {(d['name'], d['category']) for d in sleep}

adhd_drugs = [
    {
        "name": "メチルフェニデート",
        "brand": "コンサータ・リタリン",
        "category": "ADHD治療薬",
        "class": "中枢刺激薬（メチルフェニデート）",
        "action_type": "ドパミン・ノルアドレナリン再取り込み阻害（中枢刺激）",
        "mechanism": "ドパミントランスポーター（DAT）・ノルアドレナリントランスポーター（NET）を阻害。前頭前野のドパミン・NA濃度↑で注意力・実行機能を改善",
        "placebo_onset": "ADHD-RS-IV プラセボ比 −10〜14点",
        "placebo_sleep": "治療反応率（CGI改善）65〜75%",
        "NNT": 3.0,
        "efficacy_star": 5,
        "onset_time": "即放：30〜60分・コンサータ（OROS）：1〜2時間",
        "duration_hours": "コンサータ：12時間・即放：4〜6時間",
        "guideline_rank": "第一選択（小児・成人ADHD）",
        "evidence": "Cortese S et al. Lancet Psychiatry 2018（ネットワークメタ解析 PMID:30097390）",
        "evidence_url": "https://pubmed.ncbi.nlm.nih.gov/30097390/",
        "caution": "食欲低下・不眠・心拍数↑。依存性あり（向精神薬指定）。心疾患・甲状腺機能亢進は禁忌。成長への影響を定期モニタリング"
    },
    {
        "name": "リスデキサンフェタミン",
        "brand": "ビバンセ",
        "category": "ADHD治療薬",
        "class": "中枢刺激薬（アンフェタミン系）",
        "action_type": "ドパミン・ノルアドレナリン遊離促進＋再取り込み阻害",
        "mechanism": "プロドラッグ（d-アンフェタミンに変換）。ドパミン・ノルアドレナリンのシナプス遊離↑と再取り込み阻害の両方で強力な作用。乱用防止設計",
        "placebo_onset": "ADHD-RS-IV プラセボ比 −12〜16点",
        "placebo_sleep": "治療反応率 70〜80%",
        "NNT": 2.5,
        "efficacy_star": 5,
        "onset_time": "1〜2時間（消化管でアンフェタミンに変換）",
        "duration_hours": "12〜14時間（1日1回朝）",
        "guideline_rank": "第一選択（成人ADHD・コンサータ無効例）",
        "evidence": "Cortese S et al. Lancet Psychiatry 2018（PMID:30097390）",
        "evidence_url": "https://pubmed.ncbi.nlm.nih.gov/30097390/",
        "caution": "食欲低下・不眠・血圧上昇。向精神薬（第一種）。依存性はメチルフェニデートより低い（プロドラッグ設計）。心疾患・高血圧は禁忌"
    },
    {
        "name": "アトモキセチン",
        "brand": "ストラテラ",
        "category": "ADHD治療薬",
        "class": "非刺激薬（NRI）",
        "action_type": "選択的ノルアドレナリン再取り込み阻害（非刺激薬）",
        "mechanism": "前頭前野のNETを選択的阻害→ノルアドレナリン↑→ドパミンも間接的に↑。刺激薬と異なり依存性・乱用リスクが低い",
        "placebo_onset": "ADHD-RS-IV プラセボ比 −7〜10点",
        "placebo_sleep": "治療反応率 50〜60%",
        "NNT": 5.0,
        "efficacy_star": 3,
        "onset_time": "4〜8週（効果発現が遅い）",
        "duration_hours": "24時間（1日1〜2回）",
        "guideline_rank": "第二選択（刺激薬禁忌・依存症リスク・チック合併）",
        "evidence": "Michelson D et al. Am J Psychiatry 2001（PMID:11691686）",
        "evidence_url": "https://pubmed.ncbi.nlm.nih.gov/11691686/",
        "caution": "効果発現まで4〜8週必要。初期に悪心・食欲低下。肝機能障害（まれ）。自殺念慮への注意（小児・青年）。MAO阻害薬と禁忌"
    },
    {
        "name": "グアンファシン",
        "brand": "インチュニブ",
        "category": "ADHD治療薬",
        "class": "非刺激薬（α2A作動薬）",
        "action_type": "前頭前野α2A受容体作動（非刺激薬）",
        "mechanism": "前頭前野のα2A受容体を刺激→cAMP産生↓→K+チャネル開口→神経回路の信号対雑音比↑。衝動性・多動性への効果が特に高い",
        "placebo_onset": "ADHD-RS-IV プラセボ比 −6〜9点",
        "placebo_sleep": "治療反応率 45〜55%（多動性・衝動性に強い）",
        "NNT": 6.0,
        "efficacy_star": 3,
        "onset_time": "2〜4週（徐放製剤）",
        "duration_hours": "24時間（1日1回就寝前）",
        "guideline_rank": "第二選択（チック合併・攻撃性・刺激薬禁忌）",
        "evidence": "Sallee FR et al. J Am Acad Child Adolesc Psychiatry 2009（PMID:19242382）",
        "evidence_url": "https://pubmed.ncbi.nlm.nih.gov/19242382/",
        "caution": "眠気・血圧低下・徐脈。急激な中止で反跳性高血圧。アルコールとの相互作用。刺激薬との併用で相乗効果あり"
    },
]

added = 0
for d in adhd_drugs:
    k = (d['name'], d['category'])
    if k not in existing_sleep:
        sleep.append(d)
        existing_sleep.add(k)
        added += 1

with open('data/sleep_anxiety.json', 'w', encoding='utf-8') as f:
    json.dump(sleep, f, ensure_ascii=False, indent=2)
print(f'sleep_anxiety.json: +{added} ADHD drugs → {len(sleep)} total')

# ===== 強オピオイド → pain.json =====
with open('data/pain.json', encoding='utf-8') as f:
    pain = json.load(f)

existing_pain = {(d['name'], d['category']) for d in pain}

opioid_drugs = [
    {
        "name": "モルヒネ",
        "brand": "MSコンチン・モルヒネ塩酸塩",
        "category": "強オピオイド",
        "class": "強オピオイド（モルヒネ系）",
        "action_type": "μオピオイド受容体完全作動薬（中等度〜重度疼痛）",
        "mechanism": "脊髄後角・脳幹・辺縁系のμ受容体に結合し疼痛シグナルを強力に遮断。活性代謝物M6G（腎機能低下で蓄積）あり",
        "placebo_onset": "疼痛スコア改善 プラセボ比 −2.0〜2.5点（NRS）",
        "placebo_sleep": "50%軽減達成率 50〜60%（癌性疼痛）",
        "NNT": 2.5,
        "efficacy_star": 5,
        "onset_time": "経口：30〜60分・静注：5〜10分",
        "duration_hours": "即放：4〜6時間・徐放（コンチン）：12時間",
        "guideline_rank": "第一選択（癌性疼痛WHO3段階ラダー）",
        "evidence": "WHO癌疼痛ガイドライン・Cochrane review 2015（PMID:26398958）",
        "evidence_url": "https://pubmed.ncbi.nlm.nih.gov/26398958/",
        "caution": "呼吸抑制（特に初回・急増量）・便秘（必ず緩下薬併用）・悪心。腎機能低下でM6G蓄積→過鎮静。ナロキソンで拮抗可能"
    },
    {
        "name": "オキシコドン",
        "brand": "オキシコンチン・オキノーム",
        "category": "強オピオイド",
        "class": "強オピオイド（モルヒネ系）",
        "action_type": "μ・κオピオイド受容体完全作動薬",
        "mechanism": "μ（主）・κ受容体作動。モルヒネより生体内利用率が高く（60〜87%）、腎障害での代謝物蓄積が少ない",
        "placebo_onset": "疼痛スコア改善 プラセボ比 −2.0〜2.5点（NRS）",
        "placebo_sleep": "50%軽減達成率 55〜65%",
        "NNT": 2.5,
        "efficacy_star": 5,
        "onset_time": "経口：30〜60分・徐放：1〜2時間",
        "duration_hours": "即放：4〜6時間・徐放：12時間",
        "guideline_rank": "第一選択（癌性疼痛・慢性疼痛）",
        "evidence": "Caraceni A et al. Lancet Oncol 2012（PMID:22240242）",
        "evidence_url": "https://pubmed.ncbi.nlm.nih.gov/22240242/",
        "caution": "便秘・悪心・眠気。腎障害時はモルヒネより安全。依存性・乱用リスク（麻薬指定）。CYP3A4/2D6基質"
    },
    {
        "name": "フェンタニル",
        "brand": "デュロテップMTパッチ・アブストラル",
        "category": "強オピオイド",
        "class": "強オピオイド（貼付剤）",
        "action_type": "μオピオイド受容体完全作動薬（高脂溶性・貼付剤）",
        "mechanism": "モルヒネの約100倍の力価。高脂溶性で経皮吸収が良好（貼付剤）。肝初回通過効果なし。嘔気・便秘がモルヒネより少ない",
        "placebo_onset": "疼痛スコア改善（貼付剤移行後）モルヒネ同等",
        "placebo_sleep": "50%軽減達成率 50〜65%",
        "NNT": 3.0,
        "efficacy_star": 5,
        "onset_time": "貼付剤：12〜24時間（steady state）・静注：即効",
        "duration_hours": "貼付剤：72時間（3日1回交換）",
        "guideline_rank": "第一選択（経口困難・モルヒネ副作用例）",
        "evidence": "Tassinari D et al. J Palliat Med 2011（PMID:21385030）",
        "evidence_url": "https://pubmed.ncbi.nlm.nih.gov/21385030/",
        "caution": "発熱・加温で吸収↑→過剰投与リスク。CYP3A4阻害薬で血中濃度↑。貼付剤は経口換算量から計算して開始。便秘少ないが悪心・眠気あり"
    },
    {
        "name": "ヒドロモルフォン",
        "brand": "ナルサス・ナルラピド",
        "category": "強オピオイド",
        "class": "強オピオイド（モルヒネ系）",
        "action_type": "μオピオイド受容体完全作動薬（モルヒネの5倍力価）",
        "mechanism": "モルヒネの半合成誘導体。力価はモルヒネの約5倍。活性代謝物が少なく腎障害でも比較的安全。1日1回徐放製剤（ナルサス）",
        "placebo_onset": "疼痛スコア改善 プラセボ比 −2.0〜2.5点（NRS）",
        "placebo_sleep": "50%軽減達成率 50〜60%",
        "NNT": 2.5,
        "efficacy_star": 5,
        "onset_time": "即放：15〜30分・徐放（ナルサス）：2〜4時間",
        "duration_hours": "即放：4〜6時間・徐放：24時間（1日1回）",
        "guideline_rank": "第一選択（腎障害合併・モルヒネ代替）",
        "evidence": "Wirz S et al. Pain Physician 2017（PMID:28934793）",
        "evidence_url": "https://pubmed.ncbi.nlm.nih.gov/28934793/",
        "caution": "便秘・悪心・眠気。少量から開始し漸増。ナロキソンで拮抗。日本では2017年承認の比較的新しい薬剤"
    },
    {
        "name": "タペンタドール",
        "brand": "タペンタ",
        "category": "強オピオイド",
        "class": "強オピオイド（混合作用）",
        "action_type": "μオピオイド受容体作動＋ノルアドレナリン再取り込み阻害（MOR-NRI）",
        "mechanism": "μ受容体作動（弱・モルヒネの18倍量が等力価）＋NET阻害の二重作用。神経障害性疼痛成分にも有効。活性代謝物なし",
        "placebo_onset": "疼痛スコア改善 プラセボ比 −1.5〜2.0点（NRS）",
        "placebo_sleep": "50%軽減達成率 35〜50%",
        "NNT": 4.0,
        "efficacy_star": 4,
        "onset_time": "1〜2時間（徐放製剤）",
        "duration_hours": "12時間（1日2回）",
        "guideline_rank": "第二選択（神経障害性疼痛合併・悪心が問題の例）",
        "evidence": "Schwartz S et al. J Pain 2011（PMID:21945027）",
        "evidence_url": "https://pubmed.ncbi.nlm.nih.gov/21945027/",
        "caution": "悪心・便秘がオキシコドンより少ない。CYP代謝なし（相互作用少）。MAO阻害薬は禁忌。セロトニン症候群リスク（SSRI/SNRI併用注意）"
    },
]

added = 0
for d in opioid_drugs:
    k = (d['name'], d['category'])
    if k not in existing_pain:
        pain.append(d)
        existing_pain.add(k)
        added += 1

with open('data/pain.json', 'w', encoding='utf-8') as f:
    json.dump(pain, f, ensure_ascii=False, indent=2)
print(f'pain.json: +{added} strong opioids → {len(pain)} total')
