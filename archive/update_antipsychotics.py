import json

with open('data/sleep_anxiety.json', encoding='utf-8') as f:
    data = json.load(f)

# Positive/negative symptom ratings for existing antipsychotics
ap_symptoms = {
    # 定型
    'ハロペリドール': {
        'positive_symptoms': '幻覚・妄想への有効性★★★★★（D2強遮断）',
        'negative_symptoms': '改善乏しい・錐体外路症状で悪化しやすい',
    },
    'クロルプロマジン': {
        'positive_symptoms': '陽性症状に有効★★★（広域D2遮断）',
        'negative_symptoms': '改善乏しい・鎮静が主',
    },
    'フルフェナジン': {
        'positive_symptoms': '幻覚・妄想★★★★（デポ製剤で継続率高）',
        'negative_symptoms': '改善不良・EPS頻度高い',
    },
    # 非定型
    'リスペリドン': {
        'positive_symptoms': '幻覚・妄想★★★★（D2/5-HT2A遮断）',
        'negative_symptoms': '中等度改善★★★（5-HT2A拮抗）',
    },
    'オランザピン': {
        'positive_symptoms': '陽性症状★★★★',
        'negative_symptoms': '陰性症状★★★★（多元受容体遮断）',
    },
    'クエチアピン': {
        'positive_symptoms': '陽性症状★★★',
        'negative_symptoms': '陰性症状★★★・抑うつにも効果',
    },
    'アリピプラゾール': {
        'positive_symptoms': '陽性症状★★★★（D2部分作動）',
        'negative_symptoms': '陰性症状★★★（D2部分作動・5-HT1A作動）',
    },
    'パリペリドン': {
        'positive_symptoms': '幻覚・妄想★★★★（活性代謝物）',
        'negative_symptoms': '中等度改善★★★',
    },
    'ブレクスピプラゾール': {
        'positive_symptoms': '陽性症状★★★（D2部分作動）',
        'negative_symptoms': '陰性症状★★★（5-HT1A強作動）',
    },
    # 追加する非定型
    'ブロナンセリン': {
        'positive_symptoms': '幻覚・妄想★★★★（高選択D2遮断）',
        'negative_symptoms': '中等度改善★★★（5-HT2A遮断）',
    },
    'ペロスピロン': {
        'positive_symptoms': '陽性症状★★★',
        'negative_symptoms': '陰性症状★★★（5-HT1A部分作動）',
    },
    'クロザピン': {
        'positive_symptoms': '治療抵抗性幻覚・妄想★★★★★',
        'negative_symptoms': '陰性症状★★★★（最も優れたエビデンス）',
    },
    'ルラシドン': {
        'positive_symptoms': '陽性症状★★★★',
        'negative_symptoms': '陰性症状★★★・認知機能改善',
    },
    'カリプラジン': {
        'positive_symptoms': '陽性症状★★★★（D3/D2部分作動）',
        'negative_symptoms': '陰性症状★★★★★（D3優先作動で最強エビデンス）',
    },
    'アセナピン': {
        'positive_symptoms': '陽性症状★★★★',
        'negative_symptoms': '陰性症状★★★（多受容体プロファイル）',
    },
    'スルピリド': {
        'positive_symptoms': '陽性症状★★★（低用量では陰性症状も）',
        'negative_symptoms': '低用量で改善★★★（D2弱遮断・プロラクチン↑）',
    },
    'レボメプロマジン': {
        'positive_symptoms': '陽性症状★★★（広域遮断・鎮静）',
        'negative_symptoms': '改善乏しい（鎮静効果が主）',
    },
}

# Add positive/negative symptoms to existing antipsychotics
ap_categories = {'抗精神病薬（定型）', '抗精神病薬（非定型）'}
for d in data:
    if d['category'] in ap_categories:
        sym = ap_symptoms.get(d['name'], {})
        d.setdefault('positive_symptoms', sym.get('positive_symptoms', 'データなし'))
        d.setdefault('negative_symptoms', sym.get('negative_symptoms', 'データなし'))

# New drugs to add
new_drugs = [
    # ===== 抗精神病薬（定型）=====
    {
        "name": "スルピリド",
        "brand": "ドグマチール",
        "category": "抗精神病薬（定型）",
        "class": "置換ベンズアミド系",
        "action_type": "抗精神病・胃潰瘍・抗うつ（用量依存）",
        "mechanism": "D2受容体遮断（辺縁系選択性）。低用量では前シナプスD2遮断でドパミン遊離促進→抗うつ・陰性症状改善",
        "positive_symptoms": "陽性症状★★★（低用量では陰性症状も）",
        "negative_symptoms": "低用量で改善★★★（D2弱遮断・プロラクチン↑）",
        "placebo_onset": "BPRS改善 プラセボ比−7〜9点",
        "placebo_sleep": "治療反応率 55〜65%",
        "NNT": 5.5,
        "efficacy_star": 3,
        "duration_hours": "8〜12時間（t1/2 約8h）",
        "guideline_rank": "補助的選択（胃潰瘍合併例・低用量うつ）",
        "evidence": "Cochrane review 2002（PMID:12137657）",
        "evidence_url": "https://pubmed.ncbi.nlm.nih.gov/12137657/",
        "caution": "プロラクチン↑顕著（無月経・乳汁分泌）。腎排泄のため腎機能低下例は減量。高用量でEPS"
    },
    {
        "name": "レボメプロマジン",
        "brand": "ヒルナミン・レボトミン",
        "category": "抗精神病薬（定型）",
        "class": "フェノチアジン系",
        "action_type": "鎮静・抗精神病",
        "mechanism": "D2・H1・α1・M受容体を広域遮断。強力な鎮静作用。緩和ケアでの制吐・鎮静にも使用",
        "positive_symptoms": "陽性症状★★★（広域遮断・鎮静）",
        "negative_symptoms": "改善乏しい（鎮静効果が主）",
        "placebo_onset": "BPRS改善 プラセボ比−6〜8点",
        "placebo_sleep": "治療反応率 50〜60%",
        "NNT": 6.0,
        "efficacy_star": 3,
        "duration_hours": "12〜24時間（t1/2 15〜30h）",
        "guideline_rank": "補助的選択（難治性不眠・緩和ケア）",
        "evidence": "添付文書・臨床経験",
        "evidence_url": None,
        "caution": "強い鎮静・起立性低血圧・口渇。QT延長リスク。抗コリン作用あり"
    },
    # ===== 抗精神病薬（非定型）新規 =====
    {
        "name": "ブロナンセリン",
        "brand": "ロナセン",
        "category": "抗精神病薬（非定型）",
        "class": "D2/D3/5-HT2A拮抗薬",
        "action_type": "抗精神病（D2高選択性・EPS少）",
        "mechanism": "D2・D3受容体を高選択的に遮断。5-HT2A遮断でEPS軽減。貼付剤（ロナセンテープ）あり",
        "positive_symptoms": "幻覚・妄想★★★★（高選択D2遮断）",
        "negative_symptoms": "中等度改善★★★（5-HT2A遮断）",
        "placebo_onset": "PANSS改善 プラセボ比−12〜15点",
        "placebo_sleep": "治療反応率 60〜70%",
        "NNT": 4.5,
        "efficacy_star": 4,
        "duration_hours": "12〜24時間（貼付剤24時間）",
        "guideline_rank": "第二選択（EPS懸念例に貼付剤が有用）",
        "evidence": "Kane JM et al. J Clin Psychiatry 2015（PMID:25919841）",
        "evidence_url": "https://pubmed.ncbi.nlm.nih.gov/25919841/",
        "caution": "食後投与で吸収↑（空腹時は効果減弱）。テープは皮膚刺激に注意。EPS中程度"
    },
    {
        "name": "ペロスピロン",
        "brand": "ルーラン",
        "category": "抗精神病薬（非定型）",
        "class": "D2/5-HT2A/5-HT1A拮抗・部分作動薬",
        "action_type": "抗精神病・抗不安",
        "mechanism": "D2・5-HT2A遮断 + 5-HT1A部分作動。5-HT1A作動により不安・陰性症状・認知機能改善に寄与",
        "positive_symptoms": "陽性症状★★★",
        "negative_symptoms": "陰性症状★★★（5-HT1A部分作動）",
        "placebo_onset": "PANSS改善 プラセボ比−10〜13点",
        "placebo_sleep": "治療反応率 55〜65%",
        "NNT": 5.0,
        "efficacy_star": 3,
        "duration_hours": "8〜12時間（t1/2 約3h・1日3回）",
        "guideline_rank": "補助的選択",
        "evidence": "Murasaki M et al. Psychiatry Clin Neurosci 2007（PMID:17316357）",
        "evidence_url": "https://pubmed.ncbi.nlm.nih.gov/17316357/",
        "caution": "食後投与必須（空腹時は吸収不良）。1日3回服用で服薬アドヒアランス↓のリスク"
    },
    {
        "name": "クロザピン",
        "brand": "クロザリル",
        "category": "抗精神病薬（非定型）",
        "class": "多元受容体標的薬（MARTA）",
        "action_type": "治療抵抗性統合失調症治療薬",
        "mechanism": "D1-4・5-HT2A/2C・H1・M・α遮断の広域プロファイル。治療抵抗性に唯一エビデンスある薬剤",
        "positive_symptoms": "治療抵抗性幻覚・妄想★★★★★",
        "negative_symptoms": "陰性症状★★★★（最も優れたエビデンス）",
        "placebo_onset": "BPRS改善 他剤無効例の30〜60%が反応",
        "placebo_sleep": "治療反応率（無効例から）30〜60%",
        "NNT": 3.0,
        "efficacy_star": 5,
        "duration_hours": "12〜16時間（t1/2 12h）",
        "guideline_rank": "治療抵抗性に第一選択（2剤失敗後）",
        "evidence": "Kane JM et al. Arch Gen Psychiatry 1988（PMID:2849054）",
        "evidence_url": "https://pubmed.ncbi.nlm.nih.gov/2849054/",
        "caution": "無顆粒球症（1〜2%）のため定期血液検査必須（CPMS登録）。体重増加・糖尿病リスク高。過鎮静・流涎"
    },
    {
        "name": "ルラシドン",
        "brand": "ラツーダ",
        "category": "抗精神病薬（非定型）",
        "class": "D2/5-HT2A/5-HT7拮抗薬",
        "action_type": "抗精神病・認知機能改善",
        "mechanism": "D2・5-HT2A遮断 + 5-HT7遮断により認知機能・抑うつ改善。代謝への影響が少ない",
        "positive_symptoms": "陽性症状★★★★",
        "negative_symptoms": "陰性症状★★★・認知機能改善",
        "placebo_onset": "PANSS改善 プラセボ比−14〜18点",
        "placebo_sleep": "治療反応率 65〜75%",
        "NNT": 4.0,
        "efficacy_star": 4,
        "duration_hours": "24時間（t1/2 18h・1日1回）",
        "guideline_rank": "第二選択（代謝副作用が懸念される例）",
        "evidence": "Loebel A et al. J Clin Psychiatry 2013（PMID:23218157）",
        "evidence_url": "https://pubmed.ncbi.nlm.nih.gov/23218157/",
        "caution": "食後（350kcal以上）投与必須（空腹時は血中濃度1/2）。CYP3A4基質。体重・血糖への影響少ない"
    },
    {
        "name": "カリプラジン",
        "brand": "レアルダ",
        "category": "抗精神病薬（非定型）",
        "class": "D3/D2部分作動薬",
        "action_type": "抗精神病・陰性症状改善",
        "mechanism": "D3受容体優先的部分作動（D3/D2比 10:1）。陰性症状・認知機能へのエビデンスが最強クラス",
        "positive_symptoms": "陽性症状★★★★（D3/D2部分作動）",
        "negative_symptoms": "陰性症状★★★★★（D3優先作動で最強エビデンス）",
        "placebo_onset": "PANSS改善 プラセボ比−15〜20点",
        "placebo_sleep": "陰性症状反応率 45〜60%（NSA-16評価）",
        "NNT": 4.0,
        "efficacy_star": 5,
        "duration_hours": "24時間（活性代謝物t1/2 1〜3週）",
        "guideline_rank": "第二選択（陰性症状が前景の例に強く推奨）",
        "evidence": "Németh G et al. Lancet 2017（PMID:27839948）",
        "evidence_url": "https://pubmed.ncbi.nlm.nih.gov/27839948/",
        "caution": "活性代謝物の半減期が長く（1〜3週）、副作用発現が遅れることがある。アカシジアに注意"
    },
    {
        "name": "アセナピン",
        "brand": "シクレスト",
        "category": "抗精神病薬（非定型）",
        "class": "多元受容体標的薬（MARTA）",
        "action_type": "抗精神病（統合失調症・双極性障害そう状態）",
        "mechanism": "D2・5-HT2A/2C・α2・H1受容体を遮断。舌下投与（嚥下不可）で速やかな吸収",
        "positive_symptoms": "陽性症状★★★★",
        "negative_symptoms": "陰性症状★★★（多受容体プロファイル）",
        "placebo_onset": "PANSS改善 プラセボ比−12〜16点",
        "placebo_sleep": "治療反応率 60〜70%",
        "NNT": 5.0,
        "efficacy_star": 4,
        "duration_hours": "12時間（t1/2 24h・1日2回）",
        "guideline_rank": "第二選択",
        "evidence": "Potkin SG et al. J Clin Psychiatry 2007（PMID:18052560）",
        "evidence_url": "https://pubmed.ncbi.nlm.nih.gov/18052560/",
        "caution": "舌下投与必須（飲み込むと生体内利用率<2%）。口腔内感覚鈍麻。体重増加あり"
    },
    # ===== 認知症治療薬 =====
    {
        "name": "レカネマブ",
        "brand": "レケンビ",
        "category": "認知症治療薬",
        "class": "抗アミロイドβ抗体（疾患修飾薬）",
        "action_type": "アルツハイマー型認知症の疾患修飾（進行抑制）",
        "mechanism": "脳内アミロイドβ（可溶性プロトフィブリル）に結合してクリアランスを促進。認知症進行を27%遅延",
        "placebo_onset": "CDR-SB悪化抑制 プラセボ比−0.45点（27%遅延）",
        "placebo_sleep": "治療反応率（進行抑制）約27%の差",
        "NNT": 10.0,
        "efficacy_star": 3,
        "duration_hours": "2週間に1回点滴（t1/2 約5日）",
        "guideline_rank": "早期AD（MCI〜軽度）に条件付き推奨",
        "evidence": "van Dyck CH et al. NEJM 2023（CLARITY AD試験 PMID:36449413）",
        "evidence_url": "https://pubmed.ncbi.nlm.nih.gov/36449413/",
        "caution": "ARIA（アミロイド関連画像異常：脳浮腫・微小出血）に注意。APOE4ホモ接合体はリスク高。MRI定期モニタリング必須。抗凝固薬との併用慎重"
    },
]

# Deduplicate by name+category
existing_keys = {(d['name'], d['category']) for d in data}
added = 0
for drug in new_drugs:
    key = (drug['name'], drug['category'])
    if key not in existing_keys:
        data.append(drug)
        existing_keys.add(key)
        added += 1

print(f'Added {added} new drugs')
print(f'Total: {len(data)} entries')

# Count antipsychotics with symptoms
ap_with = sum(1 for d in data if d.get('category') in {'抗精神病薬（定型）', '抗精神病薬（非定型）'} and 'positive_symptoms' in d)
print(f'Antipsychotics with positive/negative symptoms: {ap_with}')

with open('data/sleep_anxiety.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
print('Saved.')
