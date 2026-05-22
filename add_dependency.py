import json

with open('data/sleep_anxiety.json', encoding='utf-8') as f:
    data = json.load(f)

existing = {(d['name'], d['category']) for d in data}

new_drugs = [
    # ===== アルコール依存症治療薬 =====
    {
        "name": "ナルトレキソン",
        "brand": "レビア",
        "category": "アルコール依存症治療薬",
        "class": "オピオイド拮抗薬",
        "action_type": "μ・δ・κオピオイド受容体完全拮抗（断酒・飲酒量低減）",
        "mechanism": "飲酒によるドパミン放出をμ受容体遮断で抑制し、飲酒の快感・渇望を低減。オピオイド依存の維持療法にも使用",
        "placebo_onset": "大量飲酒日数 プラセボ比 −25〜35%",
        "placebo_sleep": "完全断酒率 15〜25%・再飲酒までの期間延長",
        "NNT": 9.0,
        "efficacy_star": 3,
        "onset_time": "数日〜1週間",
        "duration_hours": "12〜24時間（1日1回または月1回注射剤）",
        "guideline_rank": "第一選択（飲酒量低減・断酒維持）",
        "evidence": "Rösner S et al. Cochrane 2010（PMID:20238348）",
        "evidence_url": "https://pubmed.ncbi.nlm.nih.gov/20238348/",
        "caution": "服薬中にオピオイド系薬（鎮痛薬など）が無効になる。急性肝炎・重篤な肝障害は禁忌。悪心・頭痛（初期）。断酒してから服用開始"
    },
    {
        "name": "ナルメフェン",
        "brand": "セリンクロ",
        "category": "アルコール依存症治療薬",
        "class": "オピオイド部分拮抗薬",
        "action_type": "μ・δ受容体拮抗・κ受容体部分作動（飲酒量低減）",
        "mechanism": "飲酒前に服用し飲酒の快感を減弱させる「必要時服用」型。断酒を目標としない飲酒量低減アプローチ（ハームリダクション）",
        "placebo_onset": "大量飲酒日数 プラセボ比 −40〜50%",
        "placebo_sleep": "大量飲酒日数ゼロ達成率 プラセボ比 +15〜20%",
        "NNT": 7.0,
        "efficacy_star": 4,
        "onset_time": "飲酒1〜2時間前に服用（必要時）",
        "duration_hours": "12〜24時間（飲酒しない日は服用不要）",
        "guideline_rank": "第一選択（断酒困難・飲酒量低減を目標とする例）",
        "evidence": "Mann K et al. Eur Neuropsychopharmacol 2013（ESENSE試験 PMID:23375536）",
        "evidence_url": "https://pubmed.ncbi.nlm.nih.gov/23375536/",
        "caution": "悪心・めまい・不眠（服用開始初期）。断酒目標でない点が他薬と異なる。肝障害・腎障害で慎重使用"
    },
    {
        "name": "アカンプロサート",
        "brand": "レグテクト",
        "category": "アルコール依存症治療薬",
        "class": "GABA調節薬（断酒補助）",
        "action_type": "GABA-A受容体正調節・グルタミン酸（NMDA）過活動抑制",
        "mechanism": "飲酒中断後のグルタミン酸過活動（離脱状態）を抑制して渇望・不快感を軽減。断酒後に開始する維持療法薬",
        "placebo_onset": "完全断酒率 プラセボ比 +10〜15%（6〜12カ月）",
        "placebo_sleep": "断酒継続期間延長・再飲酒率↓",
        "NNT": 9.0,
        "efficacy_star": 3,
        "onset_time": "断酒後5日以内に開始（離脱安定後）",
        "duration_hours": "24時間（1日3回食後）",
        "guideline_rank": "第一選択（断酒維持・ナルトレキソンと相補的）",
        "evidence": "Rösner S et al. Cochrane 2010（PMID:20166068）",
        "evidence_url": "https://pubmed.ncbi.nlm.nih.gov/20166068/",
        "caution": "腎排泄のため腎機能低下例は禁忌（CCr<30）。下痢・悪心（初期）。ナルトレキソンとの併用で相乗効果の報告あり"
    },
    {
        "name": "ジスルフィラム",
        "brand": "ノックビン",
        "category": "アルコール依存症治療薬",
        "class": "アルデヒド脱水素酵素阻害薬",
        "action_type": "ALDH2阻害→アセトアルデヒド蓄積による嫌悪反応（抑止療法）",
        "mechanism": "アルコール代謝酵素ALDH2を阻害。飲酒するとアセトアルデヒドが蓄積→顔面紅潮・頭痛・嘔吐・動悸→飲酒抑止",
        "placebo_onset": "飲酒抑止効果（服薬コンプライアンス依存）",
        "placebo_sleep": "断酒率 確認服薬で向上（ナルトレキソンより依存）",
        "NNT": 8.0,
        "efficacy_star": 3,
        "onset_time": "服薬後12時間以内に飲酒で反応",
        "duration_hours": "効果持続：最終服用から1〜2週間",
        "guideline_rank": "第二選択（動機付けが高い・確認服薬が可能な例）",
        "evidence": "Skinner MD et al. PLOS ONE 2014（PMID:24416179）",
        "evidence_url": "https://pubmed.ncbi.nlm.nih.gov/24416179/",
        "caution": "服薬中の飲酒は危険（重篤な心血管反応）。アルコール含有製品（うがい薬・香水など）も禁忌。肝障害・心疾患は禁忌。確認服薬が効果の鍵"
    },
    {
        "name": "シアナミド",
        "brand": "シアナマイド",
        "category": "アルコール依存症治療薬",
        "class": "シアナミド系",
        "action_type": "ALDH阻害（ジスルフィラムと同機序・速効・短時間）",
        "mechanism": "ALDH1・2を阻害しアセトアルデヒド蓄積を引き起こす。ジスルフィラムより作用持続が短く（12時間）、飲酒前投与で管理しやすい",
        "placebo_onset": "飲酒抑止効果（確認服薬で高い）",
        "placebo_sleep": "断酒率（確認服薬群）で良好",
        "NNT": 8.0,
        "efficacy_star": 3,
        "onset_time": "服薬後1〜3時間で飲酒反応",
        "duration_hours": "効果持続：約12時間（ジスルフィラムより短い）",
        "guideline_rank": "補助的選択（日本で広く使用・朝の確認服薬に適する）",
        "evidence": "添付文書・国内臨床経験",
        "evidence_url": None,
        "caution": "服薬中の飲酒は危険。肝障害に注意（定期肝機能検査）。ジスルフィラムと比較して甲状腺抑制作用が強い。確認服薬が必須"
    },
    # ===== 禁煙補助薬 =====
    {
        "name": "バレニクリン",
        "brand": "チャンピックス",
        "category": "禁煙補助薬",
        "class": "α4β2ニコチン受容体部分作動薬",
        "action_type": "ニコチン性アセチルコリン受容体α4β2の部分作動（禁煙補助）",
        "mechanism": "α4β2受容体を部分刺激→喫煙渇望・離脱症状を軽減。同時に完全作動を阻害→喫煙しても満足感が得られにくくなる",
        "placebo_onset": "禁煙成功率（9〜24週）約33〜44%",
        "placebo_sleep": "プラセボ比 禁煙率 OR 3.1〜3.6（最も高いエビデンス）",
        "NNT": 5.0,
        "efficacy_star": 5,
        "onset_time": "禁煙予定日1週間前から開始",
        "duration_hours": "24時間（1日2回・12週間標準）",
        "guideline_rank": "第一選択（禁煙薬物療法で最も有効）",
        "evidence": "Cahill K et al. Cochrane 2016（PMID:27091294）",
        "evidence_url": "https://pubmed.ncbi.nlm.nih.gov/27091294/",
        "caution": "悪心（最多副作用・食後服用で軽減）。うつ・自殺念慮の報告（精神疾患既往は慎重）。2025年現在チャンピックスは供給停止中・後発品あり"
    },
    {
        "name": "ニコチンパッチ",
        "brand": "ニコチネルTTS・ニコデルム",
        "category": "禁煙補助薬",
        "class": "ニコチン代替療法（経皮）",
        "action_type": "ニコチン補充による離脱症状・渇望軽減",
        "mechanism": "経皮ニコチンで血中ニコチン濃度を一定に保ち、禁煙時の離脱症状（イライラ・集中力低下・体重増加）を軽減。依存性は喫煙より大幅に低い",
        "placebo_onset": "禁煙成功率（6カ月）約17〜18%",
        "placebo_sleep": "プラセボ比 禁煙率 OR 1.8〜2.0",
        "NNT": 11.0,
        "efficacy_star": 3,
        "onset_time": "貼付後2〜4時間（血中濃度安定）",
        "duration_hours": "24時間（毎日貼り替え・8〜12週間）",
        "guideline_rank": "第一選択（OTC・バレニクリン禁忌例）",
        "evidence": "Stead LF et al. Cochrane 2012（PMID:22786451）",
        "evidence_url": "https://pubmed.ncbi.nlm.nih.gov/22786451/",
        "caution": "皮膚刺激・かぶれ（貼付部位を毎日変える）。心疾患急性期は慎重。就寝中は外しても可（不眠・悪夢の場合）。OTCで入手可能"
    },
    {
        "name": "ニコチンガム",
        "brand": "ニコレット",
        "category": "禁煙補助薬",
        "class": "ニコチン代替療法（口腔内）",
        "action_type": "ニコチン補充（口腔粘膜吸収・必要時使用）",
        "mechanism": "喫煙渇望が生じたときに噛んで使用する「必要時型NRT」。パッチより血中濃度の上昇が速く、急性渇望への対応に優れる",
        "placebo_onset": "禁煙成功率（6カ月）約17%",
        "placebo_sleep": "プラセボ比 禁煙率 OR 1.5〜1.8（パッチとの併用でさらに向上）",
        "NNT": 12.0,
        "efficacy_star": 3,
        "onset_time": "噛み始め後5〜10分（口腔粘膜吸収）",
        "duration_hours": "30分（1回使用）・1日最大24個まで",
        "guideline_rank": "第一選択（OTC・パッチとの併用でOR↑）",
        "evidence": "Stead LF et al. Cochrane 2012（PMID:22786451）",
        "evidence_url": "https://pubmed.ncbi.nlm.nih.gov/22786451/",
        "caution": "飲食後15分は使用しない（吸収↓）。「チュー＆パーク法」で正しく使用する必要あり。顎関節症に注意。OTCで入手可能"
    },
]

added = 0
for d in new_drugs:
    k = (d['name'], d['category'])
    if k not in existing:
        data.append(d)
        existing.add(k)
        added += 1

with open('data/sleep_anxiety.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
print(f'Added {added} drugs → total {len(data)}')
cats = {}
for d in data:
    cats[d['category']] = cats.get(d['category'], 0) + 1
for k, v in sorted(cats.items()):
    print(f'  {k}: {v}')
