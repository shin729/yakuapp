'use strict';

// ===== ドメイン設定 =====
const DOMAINS = {
  sleep: {
    file: './data/sleep_anxiety.json',
    categories: [
      { key: '睡眠薬',             label: '🌙 睡眠薬' },
      { key: '抗不安薬',           label: '🧘 抗不安薬' },
      { key: '抗精神病薬（定型）', label: '💊 抗精神病薬（定型）' },
      { key: '抗精神病薬（非定型）',label: '💊 抗精神病薬（非定型）' },
      { key: '抗うつ薬',           label: '🌱 抗うつ薬' },
      { key: '気分安定薬',         label: '⚖ 気分安定薬' },
      { key: '認知症治療薬',       label: '🧠 認知症治療薬' },
      { key: '双極性障害そう状態', label: '⚡ 双極性そう状態' },
      { key: '双極性障害うつ状態', label: '🌧 双極性うつ状態' },
      { key: 'ADHD治療薬',             label: '🎯 ADHD' },
      { key: 'アルコール依存症治療薬', label: '🍶 アルコール依存症' },
      { key: '禁煙補助薬',             label: '🚭 禁煙補助' },
    ],
    defaultCat: '睡眠薬',
    headBg:       'linear-gradient(180deg, #f0f4ff 0%, #e8eeff 100%)',
    stickyBg:     '#f0f4ff',
    rowAltBg:     '#fafbff',
    rowAltSticky: '#f4f6fb',
    accentColor:  '#1d4ed8',
  },
  pain: {
    file: './data/pain.json',
    categories: [
      { key: '非オピオイド系',           label: '💊 非オピオイド系' },
      { key: '強オピオイド',             label: '🔴 強オピオイド' },
      { key: '弱オピオイド・補助薬',     label: '⚕ 弱オピオイド・補助薬' },
      { key: '神経障害性疼痛',           label: '⚡ 神経障害性疼痛' },
      { key: '片頭痛',                   label: '🎯 片頭痛' },
      { key: '抗てんかん薬',             label: '🧩 抗てんかん薬' },
      { key: 'パーキンソン病治療薬',     label: '🔵 パーキンソン病治療薬' },
    ],
    defaultCat: '非オピオイド系',
    headBg:       'linear-gradient(180deg, #f0fdf9 0%, #e4f9f5 100%)',
    stickyBg:     '#f0fdf9',
    rowAltBg:     '#fafffe',
    rowAltSticky: '#f3fdfb',
    accentColor:  '#0f766e',
  },
  lifestyle: {
    file: './data/lifestyle.json',
    categories: [
      { key: '糖尿病治療薬',     label: '🩸 糖尿病' },
      { key: '高血圧治療薬',     label: '💓 高血圧' },
      { key: '脂質異常症治療薬', label: '🧪 脂質異常症' },
      { key: '高尿酸血症治療薬', label: '🦴 高尿酸血症' },
    ],
    defaultCat: '糖尿病治療薬',
    headBg:       'linear-gradient(180deg, #f0fdf4 0%, #dcfce7 100%)',
    stickyBg:     '#f0fdf4',
    rowAltBg:     '#f7fef9',
    rowAltSticky: '#ecfbf1',
    accentColor:  '#16a34a',
  },
  steroid: {
    file: './data/steroid.json',
    categories: [
      { key: '内服',   label: '💊 内服ステロイド' },
      { key: '塗布薬', label: '🧴 外用ステロイド（塗布薬）' },
      { key: '点鼻薬', label: '👃 点鼻ステロイド' },
      { key: '点眼薬', label: '👁 点眼ステロイド' },
      { key: '貼付剤', label: '🩹 外用ステロイド（貼付剤）' },
    ],
    defaultCat: '内服',
    headBg:       'linear-gradient(180deg, #fff7ed 0%, #ffedd5 100%)',
    stickyBg:     '#fff7ed',
    rowAltBg:     '#fffbf7',
    rowAltSticky: '#fff3e8',
    accentColor:  '#c2410c',
  },
  hf: {
    file: './data/hf.json',
    categories: [
      { key: 'HFrEF（予後改善薬）', label: '🫀 HFrEF 予後改善薬（EF<40%）' },
      { key: 'HFpEF治療薬',         label: '💙 HFpEF 治療薬（EF≥40%）'     },
      { key: '症状改善・体液管理',  label: '💧 症状改善・体液管理'          },
      { key: 'MX_RAAS',     label: '🔗 RAAS遮断薬（ACE/ARB/ARNI/MRA）' },
      { key: 'MX_beta',     label: '🛡 β遮断薬'                         },
      { key: 'MX_SGLT2',   label: '⚡ SGLT2阻害薬'                     },
      { key: 'MX_diuretic', label: '💧 利尿薬'                          },
      { key: 'MX_other',    label: '📋 その他（ジゴキシン・イバブラジン）'},
    ],
    categoryGroups: [
      { key: 'disease',   label: '疾患別',    cats: ['HFrEF（予後改善薬）', 'HFpEF治療薬', '症状改善・体液管理'] },
      { key: 'mechanism', label: '作用機序別', cats: ['MX_RAAS', 'MX_beta', 'MX_SGLT2', 'MX_diuretic', 'MX_other'] },
    ],
    defaultGroup: 'disease',
    defaultCat: 'HFrEF（予後改善薬）',
    headBg:       'linear-gradient(180deg, #f5f3ff 0%, #ede9fe 100%)',
    stickyBg:     '#f5f3ff',
    rowAltBg:     '#faf9ff',
    rowAltSticky: '#efecfd',
    accentColor:  '#7c3aed',
  },
  arrhythmia: {
    file: './data/arrhythmia.json',
    categories: [
      { key: '心房細動（レートコントロール）', label: '💓 AF レートコントロール' },
      { key: '心房細動（リズムコントロール）', label: '🎵 AF リズムコントロール' },
      { key: '心室性不整脈',                   label: '⚡ 心室性不整脈（VT/VF）' },
      { key: '上室性頻脈（SVT）',              label: '🔺 上室性頻脈（SVT）' },
      { key: 'VW_Ia',    label: '📘 Class Ia（Na遮断・活動電位延長）' },
      { key: 'VW_Ib',    label: '📗 Class Ib（Na遮断・活動電位短縮）' },
      { key: 'VW_Ic',    label: '📙 Class Ic（Na遮断・伝導遅延）' },
      { key: 'VW_II',    label: '📕 Class II（β遮断）' },
      { key: 'VW_III',   label: '📓 Class III（K遮断・活動電位延長）' },
      { key: 'VW_IV',    label: '📔 Class IV（Ca遮断）' },
      { key: 'VW_other', label: '📒 その他（ジゴキシン・ATP）' },
    ],
    categoryGroups: [
      { key: 'disease',   label: '疾患別',    cats: ['心房細動（レートコントロール）', '心房細動（リズムコントロール）', '心室性不整脈', '上室性頻脈（SVT）'] },
      { key: 'mechanism', label: '作用機序別', cats: ['VW_Ia', 'VW_Ib', 'VW_Ic', 'VW_II', 'VW_III', 'VW_IV', 'VW_other'] },
    ],
    defaultGroup: 'disease',
    defaultCat: '心房細動（レートコントロール）',
    headBg:       'linear-gradient(180deg, #fff1f2 0%, #ffe4e6 100%)',
    stickyBg:     '#fff1f2',
    rowAltBg:     '#fffbfb',
    rowAltSticky: '#ffeef0',
    accentColor:  '#be123c',
  },
  gi: {
    file: './data/gi.json',
    categories: [
      { key: '便秘薬',             label: '💊 便秘薬' },
      { key: '整腸剤',             label: '🦠 整腸剤' },
      { key: '消化酵素・胆汁系',   label: '🧪 消化酵素・胆汁系' },
      { key: '悪心・嘔吐',         label: '🤢 悪心・嘔吐' },
      { key: '下痢止め',           label: '🚽 下痢止め' },
      { key: '胃酸分泌抑制薬',     label: '🔴 胃酸分泌抑制薬' },
      { key: '粘膜防御薬',         label: '🛡 粘膜防御薬' },
      { key: '機能性消化管疾患',   label: '🔄 機能性消化管疾患' },
      { key: '潰瘍性大腸炎・クローン病', label: '🧬 潰瘍性大腸炎・クローン病' },
      { key: '消化器系漢方',       label: '🌿 消化器系漢方' },
    ],
    defaultCat: '便秘薬',
    headBg:       'linear-gradient(180deg, #f0fdf4 0%, #dcfce7 100%)',
    stickyBg:     '#f0fdf4',
    rowAltBg:     '#f7fef9',
    rowAltSticky: '#e8fced',
    accentColor:  '#059669',
  },
  allergy: {
    file: './data/allergy.json',
    categories: [
      { key: '抗ヒスタミン薬',       label: '💊 抗ヒスタミン薬' },
      { key: 'ロイコトリエン拮抗薬', label: '🔵 ロイコトリエン拮抗薬' },
      { key: '肥満細胞安定化薬',     label: '🛡 肥満細胞安定化薬' },
      { key: '生物学的製剤',         label: '💉 生物学的製剤' },
      { key: 'アレルゲン免疫療法',   label: '🌱 アレルゲン免疫療法' },
    ],
    defaultCat: '抗ヒスタミン薬',
    headBg:       'linear-gradient(180deg, #ecfeff 0%, #cffafe 100%)',
    stickyBg:     '#ecfeff',
    rowAltBg:     '#f5feff',
    rowAltSticky: '#e4fbfd',
    accentColor:  '#0891b2',
  },
  respiratory: {
    file: './data/respiratory.json',
    categories: [
      { key: '気管支喘息（吸入）', label: '💨 気管支喘息（吸入）' },
      { key: 'COPD（吸入）',       label: '💨 COPD（吸入）' },
      { key: '気管支喘息（内服）', label: '💊 気管支喘息（内服）' },
      { key: 'COPD（内服）',       label: '🫁 COPD（内服）' },
      { key: '肺高血圧症',         label: '❤ 肺高血圧症' },
      { key: '間質性肺疾患',       label: '🫧 間質性肺疾患' },
      { key: '慢性咳嗽',           label: '😮‍💨 慢性咳嗽' },
      { key: 'RX_SABA',      label: '🔴 SABA（短時間作用β2）' },
      { key: 'RX_LABA',      label: '🟠 LABA（長時間作用β2）' },
      { key: 'RX_LAMA',      label: '🔵 LAMA（長時間作用抗コリン）' },
      { key: 'RX_ICS',       label: '🟢 ICS（吸入ステロイド）' },
      { key: 'RX_ICS_LABA',  label: '🟩 ICS/LABA配合' },
      { key: 'RX_LAMA_LABA', label: '🟦 LAMA/LABA配合' },
      { key: 'RX_TRIPLE',    label: '⬛ ICS/LABA/LAMA（3剤）' },
    ],
    categoryGroups: [
      { key: 'disease',   label: '疾患別',    cats: ['気管支喘息（吸入）', 'COPD（吸入）', '気管支喘息（内服）', 'COPD（内服）', '肺高血圧症', '間質性肺疾患', '慢性咳嗽'] },
      { key: 'mechanism', label: '作用機序別', cats: ['RX_SABA', 'RX_LABA', 'RX_LAMA', 'RX_ICS', 'RX_ICS_LABA', 'RX_LAMA_LABA', 'RX_TRIPLE'] },
    ],
    defaultGroup: 'disease',
    defaultCat: '気管支喘息（吸入）',
    headBg:       'linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 100%)',
    stickyBg:     '#f0f9ff',
    rowAltBg:     '#f8fcff',
    rowAltSticky: '#e8f5fd',
    accentColor:  '#0369a1',
  },
  antiviral: {
    file: './data/antivirals.json',
    categories: [
      { key: '抗ヘルペス/CMV薬', label: '💊 抗ヘルペス/CMV薬' },
      { key: '抗HIV薬',          label: '🔴 抗HIV薬' },
      { key: '抗マラリア薬',     label: '🌿 抗マラリア薬' },
      { key: 'その他原虫薬',     label: '🦠 その他原虫薬' },
    ],
    defaultCat:   '抗ヘルペス/CMV薬',
    headBg:       'linear-gradient(180deg, #fffbeb 0%, #fef3c7 100%)',
    stickyBg:     '#fffbeb',
    rowAltBg:     '#fffdf5',
    rowAltSticky: '#fef8e1',
    accentColor:  '#d97706',
  },
  antifungals: {
    file: './data/antifungals.json',
    categories: [
      { key: 'ポリエン系',       label: '🔴 ポリエン系' },
      { key: 'トリアゾール系',   label: '🟣 トリアゾール系' },
      { key: 'エキノカンジン系', label: '🟢 エキノカンジン系' },
      { key: 'その他',           label: '💊 その他' },
      { key: 'AF_CANDIDA',     label: '🍄 カンジダ' },
      { key: 'AF_ASPERGILLUS', label: '🍄 アスペルギルス' },
      { key: 'AF_CRYPTO',      label: '🍄 クリプトコッカス' },
      { key: 'AF_MUCOR',       label: '🍄 接合菌/ムコール' },
      { key: 'AF_DERM',        label: '🍄 皮膚糸状菌' },
    ],
    categoryGroups: [
      { key: 'byClass',    label: 'クラス別',  cats: ['ポリエン系', 'トリアゾール系', 'エキノカンジン系', 'その他'] },
      { key: 'byOrganism', label: '対象菌別',  cats: ['AF_CANDIDA', 'AF_ASPERGILLUS', 'AF_CRYPTO', 'AF_MUCOR', 'AF_DERM'] },
    ],
    defaultGroup: 'byClass',
    defaultCat:   'ポリエン系',
    headBg:       'linear-gradient(180deg, #fdf4ff 0%, #fae8ff 100%)',
    stickyBg:     '#fdf4ff',
    rowAltBg:     '#fefbff',
    rowAltSticky: '#f9f0fe',
    accentColor:  '#9333ea',
  },
  antibiotics: {
    file: './data/antibiotics.json',
    categories: [
      { key: 'ペニシリン系',             label: '🔵 ペニシリン系' },
      { key: 'セファロスポリン第1世代',   label: '💊 セフェム第1世代' },
      { key: 'セファロスポリン第2世代',   label: '💊 セフェム第2世代' },
      { key: 'セファロスポリン第3世代',   label: '💊 セフェム第3世代' },
      { key: 'セファロスポリン第4世代',   label: '💊 セフェム第4世代' },
      { key: 'カルバペネム系',            label: '🔴 カルバペネム系' },
      { key: 'マクロライド系',            label: '🟣 マクロライド系' },
      { key: 'テトラサイクリン系',        label: '🟠 テトラサイクリン系' },
      { key: 'フルオロキノロン系',        label: '🟢 フルオロキノロン系' },
      { key: 'アミノグリコシド系',        label: '💊 アミノグリコシド系' },
      { key: 'グリコペプチド系',          label: '🟤 グリコペプチド系' },
      { key: 'その他',                    label: '💊 その他' },
      { key: 'AB_MRSA',      label: '🦠 MRSA' },
      { key: 'AB_STREP',     label: '🦠 肺炎球菌・連鎖球菌' },
      { key: 'AB_ENTERO',    label: '🦠 腸球菌' },
      { key: 'AB_ENTERO_BAC',label: '🦠 腸内細菌科' },
      { key: 'AB_ESBL',      label: '🦠 ESBL産生菌' },
      { key: 'AB_PSEUDO',    label: '🦠 緑膿菌' },
      { key: 'AB_ANAEROBE',  label: '🦠 嫌気性菌' },
      { key: 'AB_ATYPICAL',  label: '🦠 非定型菌' },
      { key: 'AB_TB',        label: '🦠 抗結核薬' },
    ],
    categoryGroups: [
      { key: 'byClass',    label: 'クラス別',  cats: ['ペニシリン系', 'セファロスポリン第1世代', 'セファロスポリン第2世代', 'セファロスポリン第3世代', 'セファロスポリン第4世代', 'カルバペネム系', 'マクロライド系', 'テトラサイクリン系', 'フルオロキノロン系', 'アミノグリコシド系', 'グリコペプチド系', 'その他'] },
      { key: 'byOrganism', label: '対象菌別',  cats: ['AB_MRSA', 'AB_STREP', 'AB_ENTERO', 'AB_ENTERO_BAC', 'AB_ESBL', 'AB_PSEUDO', 'AB_ANAEROBE', 'AB_ATYPICAL', 'AB_TB'] },
    ],
    defaultGroup: 'byClass',
    defaultCat:   'ペニシリン系',
    headBg:       'linear-gradient(180deg, #f0fdf4 0%, #dcfce7 100%)',
    stickyBg:     '#f0fdf4',
    rowAltBg:     '#f7fef9',
    rowAltSticky: '#ecfbf1',
    accentColor:  '#15803d',
  },
};

// ===== 抗結核薬リスト（対象菌別タブ AB_TB 用） =====
const AB_TB_DRUGS = ['イソニアジド', 'ピラジナミド', 'エタンブトール', 'ストレプトマイシン', 'リファンピシン', 'リファブチン', 'エンビオマイシン', 'カナマイシン'];

// ===== 心不全作用機序分類マップ（薬剤名 → MXクラスキー） =====
const HF_CLASS_MAP = {
  'エナラプリル':                  'MX_RAAS',
  'カンデサルタン':                'MX_RAAS',
  'サクビトリル/バルサルタン':     'MX_RAAS',
  'スピロノラクトン':              'MX_RAAS',
  'エプレレノン':                  'MX_RAAS',
  'スピロノラクトン（HFpEF）':     'MX_RAAS',
  'カルベジロール':                'MX_beta',
  'ビソプロロール（心不全）':      'MX_beta',
  'ダパグリフロジン':              'MX_SGLT2',
  'エンパグリフロジン':            'MX_SGLT2',
  'ダパグリフロジン（HFpEF）':     'MX_SGLT2',
  'エンパグリフロジン（HFpEF）':   'MX_SGLT2',
  'フロセミド':                    'MX_diuretic',
  'アゾセミド':                    'MX_diuretic',
  'トルバプタン':                  'MX_diuretic',
  'ジゴキシン（心不全）':          'MX_other',
  'イバブラジン':                  'MX_other',
};

// ===== Vaughan Williams分類マップ（薬剤名 → VWクラスキー） =====
const VW_CLASS_MAP = {
  'ジソピラミド':              'VW_Ia',
  'シベンゾリン':              'VW_Ia',
  'リドカイン（静注）':        'VW_Ib',
  'メキシレチン':              'VW_Ib',
  'フレカイニド':              'VW_Ic',
  'ピルジカイニド':            'VW_Ic',
  'ビソプロロール':            'VW_II',
  'メトプロロール':            'VW_II',
  'ランジオロール':            'VW_II',
  'プロプラノロール':          'VW_II',
  'アミオダロン':              'VW_III',
  'アミオダロン（VT/VF）':     'VW_III',
  'ソタロール':                'VW_III',
  'ニフェカラント':            'VW_III',
  'ジルチアゼム':              'VW_IV',
  'ジルチアゼム静注（SVT）':   'VW_IV',
  'ベラパミル':                'VW_IV',
  'ベラパミル静注（SVT）':     'VW_IV',
  'ベプリジル':                'VW_IV',
  'ジゴキシン':                'VW_other',
  'ATP（アデノシン三リン酸）': 'VW_other',
};

// ===== 呼吸器作用機序分類マップ（薬剤名 → RXクラスキー） =====
const RESP_MECH_MAP = {
  'サルブタモール':                          'RX_SABA',
  'プロカテロール':                          'RX_SABA',
  'サルメテロール':                          'RX_LABA',
  'ホルモテロール':                          'RX_LABA',
  'インダカテロール':                        'RX_LABA',
  'チオトロピウム':                          'RX_LAMA',
  'グリコピロニウム':                        'RX_LAMA',
  'ウメクリジニウム':                        'RX_LAMA',
  'ブデソニド':                              'RX_ICS',
  'フルチカゾンプロピオン酸':               'RX_ICS',
  'シクレソニド':                            'RX_ICS',
  'ブデソニド/ホルモテロール':              'RX_ICS_LABA',
  'フルチカゾン/サルメテロール':            'RX_ICS_LABA',
  'フルチカゾンフランカルボン酸/ビランテロール': 'RX_ICS_LABA',
  'チオトロピウム/オロダテロール':          'RX_LAMA_LABA',
  'グリコピロニウム/インダカテロール':      'RX_LAMA_LABA',
  'ウメクリジニウム/ビランテロール':        'RX_LAMA_LABA',
  'フルチカゾン/ビランテロール/ウメクリジニウム':    'RX_TRIPLE',
  'ブデソニド/ホルモテロール/グリコピロニウム':      'RX_TRIPLE',
};

// カテゴリ → ドメインのマップ（全体検索で使用）
const CAT_TO_DOMAIN = {};
Object.entries(DOMAINS).forEach(([dk, cfg]) => {
  cfg.categories.forEach(c => { CAT_TO_DOMAIN[c.key] = dk; });
});

let dataCache = {};
let currentDomain         = 'sleep';
let currentCategory       = '睡眠薬';
let currentCategoryGroup  = null;   // 疾患別 / 作用機序別（categoryGroups を持つドメイン専用）
let searchQuery = '';
let sortKey     = 'default';

// ===== 比較モード状態 =====
let compareMode = false;
let compareList = []; // max 4

// クロスカテゴリ比較用の汎用行定義
const COMPARE_ROWS = [
  { label: 'カテゴリ',       field: 'category',       type: 'val'    },
  { label: '主な作用',       field: 'action_type',    type: 'mech'   },
  { label: '作用機序',       field: 'mechanism',      type: 'mech'   },
  { label: '主要効果指標',   field: 'placebo_onset',  type: 'accent' },
  { label: '副次効果指標',   field: 'placebo_sleep',  type: 'accent' },
  { label: 'NNT',            field: 'NNT',            type: 'nnt'    },
  { label: '効果スコア',     field: 'efficacy_star',  type: 'stars'  },
  { label: '効果発現',       field: 'onset_time',     type: 'val'    },
  { label: '投与期間・頻度', field: 'duration_hours', type: 'val'    },
  { label: '使い分けポイント', field: 'guideline_rank', type: 'usecase'},
  { label: 'エビデンス出典', field: 'evidence',       type: 'evidence'},
  { label: '⚠ 注意事項',    field: 'caution',        type: 'caution'},
];

// ===== Init =====
async function init() {
  await Promise.allSettled(
    Object.entries(DOMAINS).map(async ([key, cfg]) => {
      const res = await fetch(cfg.file);
      dataCache[key] = await res.json();
    })
  );
  document.body.className = `domain-${currentDomain}`;
  renderDomainTabs();
  renderCatTabs();
  render();
  requestAnimationFrame(syncBottomPadding);
}

// ===== ドメインタブ =====
function renderDomainTabs() {
  document.querySelectorAll('.domain-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.domain === currentDomain);
  });
}

// ===== カテゴリタブ =====
function renderCatTabs() {
  const cfg      = DOMAINS[currentDomain];
  const groupEl  = document.getElementById('cat-group-area');
  const tabsEl   = document.getElementById('cat-tabs');

  // ── グループトグル（疾患別 / 作用機序別）──
  if (cfg.categoryGroups) {
    if (!currentCategoryGroup) currentCategoryGroup = cfg.defaultGroup || cfg.categoryGroups[0].key;
    groupEl.innerHTML = `
      <div class="cat-group-toggle">
        ${cfg.categoryGroups.map(g => `
          <button class="cat-group-btn${g.key === currentCategoryGroup ? ' active' : ''}"
                  data-group="${g.key}">${g.label}</button>`).join('')}
      </div>`;
    groupEl.querySelectorAll('.cat-group-btn').forEach(btn => {
      btn.addEventListener('click', () => switchCategoryGroup(btn.dataset.group));
    });
  } else {
    currentCategoryGroup = null;
    groupEl.innerHTML = '';
  }

  // ── 表示するカテゴリを絞り込み ──
  let catsToShow = cfg.categories;
  if (cfg.categoryGroups && currentCategoryGroup) {
    const grp = cfg.categoryGroups.find(g => g.key === currentCategoryGroup);
    if (grp) catsToShow = cfg.categories.filter(c => grp.cats.includes(c.key));
  }

  tabsEl.innerHTML = catsToShow.map(c => `
    <button class="tab-btn${c.key === currentCategory ? ' active' : ''}" data-cat="${c.key}" role="tab">
      ${c.label}
    </button>`).join('');
  tabsEl.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchCat(btn.dataset.cat));
  });
}

// ===== グループ切り替え（疾患別 ↔ 作用機序別） =====
function switchCategoryGroup(group) {
  currentCategoryGroup = group;
  const cfg = DOMAINS[currentDomain];
  const grp = cfg.categoryGroups.find(g => g.key === group);
  if (grp && grp.cats.length > 0) currentCategory = grp.cats[0];
  renderCatTabs();
  render();
}

// ===== ドメイン切り替え =====
function switchDomain(domain) {
  currentDomain        = domain;
  currentCategoryGroup = DOMAINS[domain].defaultGroup || null;
  currentCategory      = DOMAINS[domain].defaultCat;
  document.body.className = `domain-${domain}`;
  renderDomainTabs();
  renderCatTabs();
  render();
}

// ===== カテゴリ切り替え =====
function switchCat(category) {
  currentCategory = category;
  document.querySelectorAll('#cat-tabs .tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.cat === category);
  });
  render();
}

// ===== 検索 =====
function onSearch(e) {
  searchQuery = e.target.value.trim().toLowerCase();
  render();
}

// ===== ソート =====
function onSort(e) {
  sortKey = e.target.value;
  render();
}

function sortDrugs(drugs) {
  const arr = [...drugs];
  switch (sortKey) {
    case 'star-desc':   return arr.sort((a, b) => b.efficacy_star - a.efficacy_star);
    case 'star-asc':    return arr.sort((a, b) => a.efficacy_star - b.efficacy_star);
    case 'nnt-asc':
      return arr.sort((a, b) => {
        const na = typeof a.NNT === 'number' ? a.NNT : Infinity;
        const nb = typeof b.NNT === 'number' ? b.NNT : Infinity;
        return na - nb;
      });
    case 'rank-first':
      return arr.sort((a, b) => (b.efficacy_star || 0) - (a.efficacy_star || 0));
    case 'name-asc':
      return arr.sort((a, b) => a.name.localeCompare(b.name, 'ja'));
    default: return arr;
  }
}

// ===== Render =====
function render() {
  searchQuery ? renderGlobalSearch() : renderDomainView();
}

// ===== モバイル判定 =====
function isMobile() { return window.innerWidth < 640; }

// ===== 通常ビュー（ドメイン・カテゴリ別） =====
function renderDomainView() {
  const drugs  = (dataCache[currentDomain] || []).filter(d => {
    if (currentCategory.startsWith('VW_')) return VW_CLASS_MAP[d.name] === currentCategory;
    if (currentCategory.startsWith('MX_')) return HF_CLASS_MAP[d.name] === currentCategory;
    if (currentCategory.startsWith('RX_')) return RESP_MECH_MAP[d.name] === currentCategory;
    if (currentCategory.startsWith('AB_')) {
      if (currentCategory === 'AB_TB') return AB_TB_DRUGS.includes(d.name);
      const specField = { AB_MRSA: 'mrsa', AB_STREP: 'strep', AB_ENTERO: 'entero', AB_ENTERO_BAC: 'entero_bac', AB_ESBL: 'esbl', AB_PSEUDO: 'pseudo', AB_ANAEROBE: 'anaerobe', AB_ATYPICAL: 'atypical' }[currentCategory];
      return specField && ['+++', '++', '+'].includes(d[specField]);
    }
    if (currentCategory.startsWith('AF_')) {
      const specField = { AF_CANDIDA: 'candida', AF_ASPERGILLUS: 'aspergillus', AF_CRYPTO: 'crypto', AF_MUCOR: 'mucor', AF_DERM: 'dermatophyte' }[currentCategory];
      return specField && ['+++', '++', '+'].includes(d[specField]);
    }
    return d.category === currentCategory;
  });
  const sorted = sortDrugs(drugs);
  const cfg    = DOMAINS[currentDomain];

  document.getElementById('result-info').textContent = `${sorted.length} 件表示中`;

  const container = document.getElementById('cards');
  if (sorted.length === 0) {
    container.innerHTML = noResultsHTML();
    return;
  }
  container.innerHTML = isMobile()
    ? buildCardList(sorted, cfg, currentCategory)
    : `<div class="table-wrapper">${buildTable(sorted, cfg, currentCategory)}</div><p class="table-scroll-hint">← 横にスクロールできます →</p>`;
}

// ===== 全体検索ビュー =====
function renderGlobalSearch() {
  const allDrugs = Object.values(dataCache).flat();
  const matched  = allDrugs.filter(d =>
    [d.name, d.brand, d.class, d.caution, d.guideline_rank, d.action_type, d.mechanism]
      .join(' ').toLowerCase().includes(searchQuery)
  );

  document.getElementById('result-info').textContent =
    `全カテゴリで ${matched.length} 件`;

  const container = document.getElementById('cards');
  if (matched.length === 0) {
    container.innerHTML = noResultsHTML();
    return;
  }

  // カテゴリごとにグループ化
  const groups = {};
  matched.forEach(d => {
    (groups[d.category] = groups[d.category] || []).push(d);
  });

  // ドメイン定義順に並べる
  const ordered = [];
  Object.entries(DOMAINS).forEach(([dk, domCfg]) => {
    domCfg.categories.forEach(c => {
      if (groups[c.key]) ordered.push({ key: c.key, label: c.label, dk, domCfg });
    });
  });

  container.innerHTML = ordered.map(({ key, label, domCfg }) => {
    const sorted = sortDrugs(groups[key]);
    const inner = isMobile()
      ? buildCardList(sorted, domCfg, key)
      : `<div class="table-wrapper">${buildTable(sorted, domCfg, key)}</div><p class="table-scroll-hint">← 横にスクロールできます →</p>`;
    return `
      <div class="search-group">
        <div class="search-group-header">
          ${label}
          <span class="group-count">${sorted.length}件</span>
        </div>
        ${inner}
      </div>`;
  }).join('');
}

// ===== カードリスト（モバイル用） =====
function buildCardList(drugs, cfg, category) {
  const defs = getRowDefs(category);
  return `<div class="card-list">${drugs.map(d => buildDrugCard(d, defs, cfg)).join('')}</div>`;
}

function buildDrugCard(d, defs, cfg) {
  const badge    = getClassBadge(d.class || '');
  const starDef  = defs.find(r => r.type === 'stars');
  const nntDef   = defs.find(r => r.type === 'nnt');
  const rankDef  = defs.find(r => r.type === 'rank');
  const accentDefs = defs.filter(r => r.type === 'accent').slice(0, 2);

  // Stars
  const n = starDef ? (Number(d[starDef.field]) || 0) : 0;
  const starsHTML = `<span class="stars">${'★'.repeat(n)}</span><span class="stars-empty">${'☆'.repeat(5 - n)}</span>`;

  // NNT
  const nntVal = nntDef && d[nntDef.field] != null ? d[nntDef.field] : '―';

  // KPI accent rows (up to 2)
  const accentHTML = accentDefs.map(def => {
    const v = d[def.field];
    if (!v) return '';
    return `<div class="card-accent"><span class="card-accent-label">${esc(def.label)}</span><span class="card-accent-val">${esc(String(v))}</span></div>`;
  }).join('');

  // Detail rows (all defs except stars/nnt/rank already shown in KPIs)
  const detailHTML = defs.map(def => {
    if (['stars', 'nnt'].includes(def.type)) return '';
    const v = d[def.field];
    if (v == null || v === '') return '';
    const s = String(v);
    // evidence with link
    if (def.type === 'evidence') return evidenceCardRow(def.label, d);
    if (def.type === 'caution') {
      const hasContra = s.includes('禁忌');
      return `<div class="card-detail-row card-detail-caution${hasContra ? ' has-contraindication' : ''}"><span class="cd-label">${esc(def.label)}</span><span class="cd-val">${highlightCaution(s)}</span></div>`;
    }
    const rowClass = def.type === 'mech'   ? 'card-detail-row card-detail-mech'
                   : def.type === 'accent' ? 'card-detail-row card-detail-accent'
                   : 'card-detail-row';
    return `<div class="${rowClass}"><span class="cd-label">${esc(def.label)}</span><span class="cd-val">${esc(s)}</span></div>`;
  }).join('');

  const sel = isCompareSelected(d);
  const cmpBtn = compareMode
    ? `<button class="card-compare-btn${sel ? ' active' : ''}" data-cmp-name="${esc(d.name)}" data-cmp-cat="${esc(d.category)}" aria-label="比較に追加">${sel ? '✓' : '＋'}</button>`
    : '';

  return `
  <div class="drug-card${sel ? ' compare-selected' : ''}" data-card-name="${esc(d.name)}" data-card-cat="${esc(d.category)}">
    <div class="card-head">
      <div class="card-title-wrap">
        <div class="card-name">${esc(d.name)}</div>
        <div class="card-brand">${esc(d.brand || '')}</div>
      </div>
      <div class="card-head-right">
        <span class="class-badge ${badge.css}">${esc(d.class || '')}</span>
        ${cmpBtn}
      </div>
    </div>
    <div class="card-kpis">
      <div class="kpi-item"><span class="kpi-label">効果スコア</span><div class="kpi-stars">${starsHTML}</div></div>
      <div class="kpi-item"><span class="kpi-label">NNT</span><span class="kpi-val">${esc(String(nntVal))}</span></div>
    </div>
    ${accentHTML}
    <details class="card-details">
      <summary class="card-summary">詳細を見る</summary>
      <div class="card-detail-body">${detailHTML}</div>
    </details>
  </div>`;
}

function evidenceCardRow(label, d) {
  const linkBtn = d.evidence_url
    ? `<button class="ev-link-btn" data-url="${esc(d.evidence_url)}" aria-label="参照リンクを表示">🔗</button>
       <div class="ev-link-panel" hidden><a href="${esc(d.evidence_url)}" target="_blank" rel="noopener noreferrer">${esc(d.evidence_url)}</a></div>`
    : '';
  const glBtn = d.guideline_url
    ? `<button class="ev-link-btn ev-gl-btn" data-url="${esc(d.guideline_url)}" aria-label="ガイドラインを表示">📋</button>
       <div class="ev-link-panel" hidden><a href="${esc(d.guideline_url)}" target="_blank" rel="noopener noreferrer">ガイドライン PDF</a></div>`
    : '';
  return `<div class="card-detail-row"><span class="cd-label">${esc(label)}</span><span class="cd-val cd-evidence">${esc(d.evidence || '')}${linkBtn}${glBtn}</span></div>`;
}

function noResultsHTML() {
  return `
    <div class="no-results">
      <div class="no-results-icon">🔍</div>
      <p>「${searchQuery}」に一致する薬が見つかりませんでした。</p>
    </div>`;
}

// ===== テーブル構築 =====
function buildTable(drugs, cfg, category) {
  const headerCells = drugs.map(d => {
    const badge = getClassBadge(d.class);
    const sel = isCompareSelected(d);
    const cmpBtn = compareMode
      ? `<button class="col-compare-btn${sel ? ' active' : ''}" data-cmp-name="${esc(d.name)}" data-cmp-cat="${esc(d.category)}">${sel ? '✓ 選択中' : '＋ 比較'}</button>`
      : '';
    return `
      <th class="${sel ? 'compare-selected' : ''}" style="background:${cfg.headBg}">
        <div class="col-name">${esc(d.name)}</div>
        <div class="col-brand">${esc(d.brand)}</div>
        <span class="class-badge ${badge.css}">${esc(d.class)}</span>
        ${cmpBtn}
      </th>`;
  }).join('');

  const stickyHead = `<th class="sticky-col label-col" style="background:${cfg.stickyBg}"></th>`;
  const bodyRows   = buildRows(drugs, cfg, category);

  return `
    <table class="compare-table">
      <thead><tr>${stickyHead}${headerCells}</tr></thead>
      <tbody>${bodyRows}</tbody>
    </table>`;
}

// ===== カテゴリ別行設定 =====
const ROW_DEFS = {
  // ─ 精神系 ─
  '睡眠薬': [
    { label: '主な作用',       field: 'action_type',    type: 'mech'  },
    { label: '作用機序',       field: 'mechanism',      type: 'mech'  },
    { label: '入眠時間',       field: 'placebo_onset',  type: 'accent' },
    { label: '中途覚醒・熟睡', field: 'placebo_sleep',  type: 'accent' },
    { label: 'NNT',            field: 'NNT',            type: 'nnt'   },
    { label: '効果スコア',     field: 'efficacy_star',  type: 'stars' },
    { label: '効果持続時間',   field: 'duration_hours', type: 'val'   },
    { label: '使い分けポイント', field: 'guideline_rank', type: 'usecase'},
    { label: 'エビデンス出典', field: 'evidence',       type: 'evidence'},
    { label: '⚠ 注意事項',    field: 'caution',        type: 'caution'},
  ],
  '抗不安薬': [
    { label: '主な作用',       field: 'action_type',    type: 'mech'  },
    { label: '作用機序',       field: 'mechanism',      type: 'mech'  },
    { label: '不安スコア改善', field: 'placebo_onset',  type: 'accent' },
    { label: '治療反応率',     field: 'placebo_sleep',  type: 'accent' },
    { label: 'NNT',            field: 'NNT',            type: 'nnt'   },
    { label: '効果スコア',     field: 'efficacy_star',  type: 'stars' },
    { label: '効果持続時間',   field: 'duration_hours', type: 'val'   },
    { label: '使い分けポイント', field: 'guideline_rank', type: 'usecase'},
    { label: 'エビデンス出典', field: 'evidence',       type: 'evidence'},
    { label: '⚠ 注意事項',    field: 'caution',        type: 'caution'},
  ],
};

// 抗精神病薬・抗うつ薬・気分安定薬・認知症治療薬は共通レイアウト
const PSYCH_ROWS = [
  { label: '主な作用',       field: 'action_type',    type: 'mech'  },
  { label: '作用機序',       field: 'mechanism',      type: 'mech'  },
  { label: '症状スコア改善', field: 'placebo_onset',  type: 'accent' },
  { label: '治療反応率',     field: 'placebo_sleep',  type: 'accent' },
  { label: 'NNT',            field: 'NNT',            type: 'nnt'   },
  { label: '効果スコア',     field: 'efficacy_star',  type: 'stars' },
  { label: '効果持続時間',   field: 'duration_hours', type: 'val'   },
  { label: '使い分けポイント', field: 'guideline_rank', type: 'usecase'},
  { label: 'エビデンス出典', field: 'evidence',       type: 'evidence'},
  { label: '⚠ 注意事項',    field: 'caution',        type: 'caution'},
];

// 抗精神病薬（定型・非定型）専用：陽性症状・陰性症状行を追加
const AP_ROWS = [
  { label: '主な作用',       field: 'action_type',       type: 'mech'   },
  { label: '作用機序',       field: 'mechanism',         type: 'mech'   },
  { label: '陽性症状改善',   field: 'positive_symptoms', type: 'accent' },
  { label: '陰性症状改善',   field: 'negative_symptoms', type: 'accent' },
  { label: '症状スコア改善', field: 'placebo_onset',     type: 'accent' },
  { label: '治療反応率',     field: 'placebo_sleep',     type: 'accent' },
  { label: 'NNT',            field: 'NNT',               type: 'nnt'    },
  { label: '効果スコア',     field: 'efficacy_star',     type: 'stars'  },
  { label: '効果持続時間',   field: 'duration_hours',    type: 'val'    },
  { label: '使い分けポイント', field: 'guideline_rank', type: 'usecase'},
  { label: 'エビデンス出典', field: 'evidence',          type: 'evidence'},
  { label: '⚠ 注意事項',    field: 'caution',           type: 'caution'},
];

// 非オピオイド系（鎮痛効果・抗炎症効果を個別表示）
const NON_OPIOID_ROWS = [
  { label: '主な作用',           field: 'action_type',              type: 'mech'   },
  { label: '作用機序',           field: 'mechanism',                type: 'mech'   },
  { label: '鎮痛効果',           field: 'analgesic_effect',         type: 'accent' },
  { label: '抗炎症効果',         field: 'anti_inflammatory_effect', type: 'accent' },
  { label: '疼痛スコア改善',     field: 'placebo_onset',            type: 'accent' },
  { label: '50%軽減達成率',      field: 'placebo_sleep',            type: 'accent' },
  { label: 'NNT50',              field: 'NNT',                      type: 'nnt'    },
  { label: '効果スコア',         field: 'efficacy_star',            type: 'stars'  },
  { label: '効果発現時間',       field: 'onset_time',               type: 'val'    },
  { label: '効果持続時間',       field: 'duration_hours',           type: 'val'    },
  { label: '使い分けポイント',   field: 'guideline_rank',           type: 'usecase'},
  { label: 'エビデンス出典',     field: 'evidence',                 type: 'evidence'},
  { label: '⚠ 注意事項',        field: 'caution',                  type: 'caution'},
];

// 弱オピオイド・神経障害性疼痛
const PAIN_ROWS = [
  { label: '主な作用',       field: 'action_type',    type: 'mech'  },
  { label: '作用機序',       field: 'mechanism',      type: 'mech'  },
  { label: '疼痛スコア改善', field: 'placebo_onset',  type: 'accent' },
  { label: '50%軽減達成率',  field: 'placebo_sleep',  type: 'accent' },
  { label: 'NNT50',          field: 'NNT',            type: 'nnt'   },
  { label: '効果スコア',     field: 'efficacy_star',  type: 'stars' },
  { label: '効果発現時間',   field: 'onset_time',     type: 'val'   },
  { label: '効果持続時間',   field: 'duration_hours', type: 'val'   },
  { label: '使い分けポイント', field: 'guideline_rank', type: 'usecase'},
  { label: 'エビデンス出典', field: 'evidence',       type: 'evidence'},
  { label: '⚠ 注意事項',    field: 'caution',        type: 'caution'},
];

// 片頭痛
const MIGRAINE_ROWS = [
  { label: '主な作用',           field: 'action_type',    type: 'mech'  },
  { label: '作用機序',           field: 'mechanism',      type: 'mech'  },
  { label: '2時間後頭痛消失率',  field: 'placebo_onset',  type: 'accent' },
  { label: '24時間後再発率',     field: 'placebo_sleep',  type: 'accent' },
  { label: 'NNT',                field: 'NNT',            type: 'nnt'   },
  { label: '効果スコア',         field: 'efficacy_star',  type: 'stars' },
  { label: '効果発現時間',       field: 'onset_time',     type: 'val'   },
  { label: '効果持続時間',       field: 'duration_hours', type: 'val'   },
  { label: '使い分けポイント',   field: 'guideline_rank', type: 'usecase'},
  { label: 'エビデンス出典',     field: 'evidence',       type: 'evidence'},
  { label: '⚠ 注意事項',        field: 'caution',        type: 'caution'},
];

// 抗てんかん薬
const EPILEPSY_ROWS = [
  { label: '主な作用',             field: 'action_type',    type: 'mech'  },
  { label: '作用機序',             field: 'mechanism',      type: 'mech'  },
  { label: '発作頻度減少率',       field: 'placebo_onset',  type: 'accent' },
  { label: '50%以上減少達成率',    field: 'placebo_sleep',  type: 'accent' },
  { label: 'NNT',                  field: 'NNT',            type: 'nnt'   },
  { label: '効果スコア',           field: 'efficacy_star',  type: 'stars' },
  { label: '効果発現時間',         field: 'onset_time',     type: 'val'   },
  { label: '効果持続時間',         field: 'duration_hours', type: 'val'   },
  { label: '使い分けポイント', field: 'guideline_rank', type: 'usecase'},
  { label: 'エビデンス出典',       field: 'evidence',       type: 'evidence'},
  { label: '⚠ 注意事項',          field: 'caution',        type: 'caution'},
];

// 双極性障害そう状態
const BIPOLAR_MANIA_ROWS = [
  { label: '主な作用',       field: 'action_type',    type: 'mech'   },
  { label: '作用機序',       field: 'mechanism',      type: 'mech'   },
  { label: 'YMRS改善',       field: 'placebo_onset',  type: 'accent' },
  { label: '治療反応率',     field: 'placebo_sleep',  type: 'accent' },
  { label: 'NNT',            field: 'NNT',            type: 'nnt'    },
  { label: '効果スコア',     field: 'efficacy_star',  type: 'stars'  },
  { label: '効果発現時間',   field: 'onset_time',     type: 'val'    },
  { label: '効果持続時間',   field: 'duration_hours', type: 'val'    },
  { label: '使い分けポイント', field: 'guideline_rank', type: 'usecase'},
  { label: 'エビデンス出典', field: 'evidence',       type: 'evidence'},
  { label: '⚠ 注意事項',    field: 'caution',        type: 'caution'},
];

// 双極性障害うつ状態
const BIPOLAR_DEP_ROWS = [
  { label: '主な作用',       field: 'action_type',    type: 'mech'   },
  { label: '作用機序',       field: 'mechanism',      type: 'mech'   },
  { label: 'MADRS改善',      field: 'placebo_onset',  type: 'accent' },
  { label: '治療反応率',     field: 'placebo_sleep',  type: 'accent' },
  { label: 'NNT',            field: 'NNT',            type: 'nnt'    },
  { label: '効果スコア',     field: 'efficacy_star',  type: 'stars'  },
  { label: '効果発現時間',   field: 'onset_time',     type: 'val'    },
  { label: '効果持続時間',   field: 'duration_hours', type: 'val'    },
  { label: '使い分けポイント', field: 'guideline_rank', type: 'usecase'},
  { label: 'エビデンス出典', field: 'evidence',       type: 'evidence'},
  { label: '⚠ 注意事項',    field: 'caution',        type: 'caution'},
];

// ADHD治療薬
const ADHD_ROWS = [
  { label: '主な作用',         field: 'action_type',    type: 'mech'   },
  { label: '作用機序',         field: 'mechanism',      type: 'mech'   },
  { label: 'ADHD-RS改善',      field: 'placebo_onset',  type: 'accent' },
  { label: '治療反応率',       field: 'placebo_sleep',  type: 'accent' },
  { label: 'NNT',              field: 'NNT',            type: 'nnt'    },
  { label: '効果スコア',       field: 'efficacy_star',  type: 'stars'  },
  { label: '効果発現',         field: 'onset_time',     type: 'val'    },
  { label: '効果持続時間',     field: 'duration_hours', type: 'val'    },
  { label: '使い分けポイント', field: 'guideline_rank', type: 'usecase'},
  { label: 'エビデンス出典',   field: 'evidence',       type: 'evidence'},
  { label: '⚠ 注意事項',      field: 'caution',        type: 'caution'},
];

// アルコール依存症治療薬
const ALCOHOL_ROWS = [
  { label: '主な作用',         field: 'action_type',    type: 'mech'   },
  { label: '作用機序',         field: 'mechanism',      type: 'mech'   },
  { label: '断酒・飲酒量減少', field: 'placebo_onset',  type: 'accent' },
  { label: '再発防止・長期効果',field: 'placebo_sleep',  type: 'accent' },
  { label: 'NNT',              field: 'NNT',            type: 'nnt'    },
  { label: '効果スコア',       field: 'efficacy_star',  type: 'stars'  },
  { label: '効果発現',         field: 'onset_time',     type: 'val'    },
  { label: '推奨投与期間',     field: 'duration_hours', type: 'val'    },
  { label: '使い分けポイント', field: 'guideline_rank', type: 'usecase'},
  { label: 'エビデンス出典',   field: 'evidence',       type: 'evidence'},
  { label: '⚠ 注意事項',      field: 'caution',        type: 'caution'},
];

// 禁煙補助薬
const SMOKING_ROWS = [
  { label: '主な作用',         field: 'action_type',    type: 'mech'   },
  { label: '作用機序',         field: 'mechanism',      type: 'mech'   },
  { label: '禁煙成功率（6カ月）',field: 'placebo_onset', type: 'accent' },
  { label: 'プラセボ比禁煙率', field: 'placebo_sleep',  type: 'accent' },
  { label: 'NNT',              field: 'NNT',            type: 'nnt'    },
  { label: '効果スコア',       field: 'efficacy_star',  type: 'stars'  },
  { label: '効果発現',         field: 'onset_time',     type: 'val'    },
  { label: '推奨投与期間',     field: 'duration_hours', type: 'val'    },
  { label: '使い分けポイント', field: 'guideline_rank', type: 'usecase'},
  { label: 'エビデンス出典',   field: 'evidence',       type: 'evidence'},
  { label: '⚠ 注意事項',      field: 'caution',        type: 'caution'},
];

// 強オピオイド
const STRONG_OPIOID_ROWS = [
  { label: '主な作用',         field: 'action_type',    type: 'mech'   },
  { label: '作用機序',         field: 'mechanism',      type: 'mech'   },
  { label: '疼痛スコア改善',   field: 'placebo_onset',  type: 'accent' },
  { label: '50%軽減達成率',    field: 'placebo_sleep',  type: 'accent' },
  { label: 'NNT50',            field: 'NNT',            type: 'nnt'    },
  { label: '効果スコア',       field: 'efficacy_star',  type: 'stars'  },
  { label: '効果発現時間',     field: 'onset_time',     type: 'val'    },
  { label: '効果持続時間',     field: 'duration_hours', type: 'val'    },
  { label: '使い分けポイント', field: 'guideline_rank', type: 'usecase'},
  { label: 'エビデンス出典',   field: 'evidence',       type: 'evidence'},
  { label: '⚠ 注意事項',      field: 'caution',        type: 'caution'},
];

// 糖尿病治療薬
const DIABETES_ROWS = [
  { label: '主な作用',       field: 'action_type',    type: 'mech'   },
  { label: '作用機序',       field: 'mechanism',      type: 'mech'   },
  { label: 'HbA1c低下',      field: 'placebo_onset',  type: 'accent' },
  { label: '体重・付加効果', field: 'placebo_sleep',  type: 'accent' },
  { label: 'NNT（心血管）',  field: 'NNT',            type: 'nnt'    },
  { label: '効果スコア',     field: 'efficacy_star',  type: 'stars'  },
  { label: '効果発現',       field: 'onset_time',     type: 'val'    },
  { label: '投与頻度',       field: 'duration_hours', type: 'val'    },
  { label: '使い分けポイント', field: 'guideline_rank', type: 'usecase'},
  { label: 'エビデンス出典', field: 'evidence',       type: 'evidence'},
  { label: '⚠ 注意事項',    field: 'caution',        type: 'caution'},
];

// 高血圧治療薬
const HYPERTENSION_ROWS = [
  { label: '主な作用',       field: 'action_type',    type: 'mech'   },
  { label: '作用機序',       field: 'mechanism',      type: 'mech'   },
  { label: 'SBP/DBP低下',   field: 'placebo_onset',  type: 'accent' },
  { label: '心血管保護',     field: 'placebo_sleep',  type: 'accent' },
  { label: 'NNT（MACE）',   field: 'NNT',            type: 'nnt'    },
  { label: '効果スコア',     field: 'efficacy_star',  type: 'stars'  },
  { label: '効果発現',       field: 'onset_time',     type: 'val'    },
  { label: '投与頻度',       field: 'duration_hours', type: 'val'    },
  { label: '使い分けポイント', field: 'guideline_rank', type: 'usecase'},
  { label: 'エビデンス出典', field: 'evidence',       type: 'evidence'},
  { label: '⚠ 注意事項',    field: 'caution',        type: 'caution'},
];

// 脂質異常症治療薬
const DYSLIPIDEMIA_ROWS = [
  { label: '主な作用',       field: 'action_type',    type: 'mech'   },
  { label: '作用機序',       field: 'mechanism',      type: 'mech'   },
  { label: 'LDL低下率',      field: 'placebo_onset',  type: 'accent' },
  { label: '心血管保護',     field: 'placebo_sleep',  type: 'accent' },
  { label: 'NNT（MACE）',   field: 'NNT',            type: 'nnt'    },
  { label: '効果スコア',     field: 'efficacy_star',  type: 'stars'  },
  { label: '効果発現',       field: 'onset_time',     type: 'val'    },
  { label: '投与頻度',       field: 'duration_hours', type: 'val'    },
  { label: '使い分けポイント', field: 'guideline_rank', type: 'usecase'},
  { label: 'エビデンス出典', field: 'evidence',       type: 'evidence'},
  { label: '⚠ 注意事項',    field: 'caution',        type: 'caution'},
];

// 高尿酸血症治療薬
const HYPERURICEMIA_ROWS = [
  { label: '主な作用',       field: 'action_type',    type: 'mech'   },
  { label: '作用機序',       field: 'mechanism',      type: 'mech'   },
  { label: '尿酸値低下',     field: 'placebo_onset',  type: 'accent' },
  { label: '目標達成率',     field: 'placebo_sleep',  type: 'accent' },
  { label: 'NNT（痛風発作）',field: 'NNT',            type: 'nnt'    },
  { label: '効果スコア',     field: 'efficacy_star',  type: 'stars'  },
  { label: '効果発現',       field: 'onset_time',     type: 'val'    },
  { label: '投与頻度',       field: 'duration_hours', type: 'val'    },
  { label: '使い分けポイント', field: 'guideline_rank', type: 'usecase'},
  { label: 'エビデンス出典', field: 'evidence',       type: 'evidence'},
  { label: '⚠ 注意事項',    field: 'caution',        type: 'caution'},
];

// パーキンソン病治療薬
const PARKINSON_ROWS = [
  { label: '主な作用',         field: 'action_type',    type: 'mech'  },
  { label: '作用機序',         field: 'mechanism',      type: 'mech'  },
  { label: 'UPDRS運動スコア改善',field: 'placebo_onset', type: 'accent' },
  { label: 'ADL改善率',        field: 'placebo_sleep',  type: 'accent' },
  { label: 'NNT',              field: 'NNT',            type: 'nnt'   },
  { label: '効果スコア',       field: 'efficacy_star',  type: 'stars' },
  { label: '効果発現時間',     field: 'onset_time',     type: 'val'   },
  { label: '効果持続時間',     field: 'duration_hours', type: 'val'   },
  { label: '使い分けポイント', field: 'guideline_rank', type: 'usecase'},
  { label: 'エビデンス出典',   field: 'evidence',       type: 'evidence'},
  { label: '⚠ 注意事項',      field: 'caution',        type: 'caution'},
];

// ステロイド内服
const STEROID_ORAL_ROWS = [
  { label: '主な作用',             field: 'action_type',    type: 'mech'   },
  { label: '作用機序',             field: 'mechanism',      type: 'mech'   },
  { label: 'プレドニゾロン換算力価', field: 'placebo_onset',  type: 'accent' },
  { label: '半減期・作用持続時間', field: 'placebo_sleep',  type: 'accent' },
  { label: '効果スコア',           field: 'efficacy_star',  type: 'stars'  },
  { label: '効果発現',             field: 'onset_time',     type: 'val'    },
  { label: '投与頻度',             field: 'duration_hours', type: 'val'    },
  { label: '使い分けポイント',     field: 'guideline_rank', type: 'usecase'},
  { label: 'エビデンス出典',       field: 'evidence',       type: 'evidence'},
  { label: '⚠ 注意事項',          field: 'caution',        type: 'caution'},
];

// ステロイド塗布薬
const STEROID_TOPICAL_ROWS = [
  { label: '主な作用',         field: 'action_type',    type: 'mech'   },
  { label: '作用機序',         field: 'mechanism',      type: 'mech'   },
  { label: '強度分類（7段階）', field: 'placebo_onset',  type: 'accent' },
  { label: '剤形',             field: 'placebo_sleep',  type: 'accent' },
  { label: '効果スコア',       field: 'efficacy_star',  type: 'stars'  },
  { label: '効果発現',         field: 'onset_time',     type: 'val'    },
  { label: '投与頻度',         field: 'duration_hours', type: 'val'    },
  { label: '使い分けポイント', field: 'guideline_rank', type: 'usecase'},
  { label: 'エビデンス出典',   field: 'evidence',       type: 'evidence'},
  { label: '⚠ 注意事項',      field: 'caution',        type: 'caution'},
];

// ステロイド点鼻薬
const STEROID_NASAL_ROWS = [
  { label: '主な作用',                     field: 'action_type',    type: 'mech'   },
  { label: '作用機序',                     field: 'mechanism',      type: 'mech'   },
  { label: '鼻症状スコア改善',             field: 'placebo_onset',  type: 'accent' },
  { label: '全身吸収（バイオアベイラビリティ）', field: 'placebo_sleep', type: 'accent' },
  { label: '効果スコア',                   field: 'efficacy_star',  type: 'stars'  },
  { label: '効果発現',                     field: 'onset_time',     type: 'val'    },
  { label: '投与頻度',                     field: 'duration_hours', type: 'val'    },
  { label: '使い分けポイント',             field: 'guideline_rank', type: 'usecase'},
  { label: 'エビデンス出典',               field: 'evidence',       type: 'evidence'},
  { label: '⚠ 注意事項',                  field: 'caution',        type: 'caution'},
];

// ステロイド点眼薬
const STEROID_EYE_ROWS = [
  { label: '主な作用',         field: 'action_type',    type: 'mech'   },
  { label: '作用機序',         field: 'mechanism',      type: 'mech'   },
  { label: '抗炎症効果レベル', field: 'placebo_onset',  type: 'accent' },
  { label: '眼圧上昇リスク',   field: 'placebo_sleep',  type: 'accent' },
  { label: '効果スコア',       field: 'efficacy_star',  type: 'stars'  },
  { label: '効果発現',         field: 'onset_time',     type: 'val'    },
  { label: '投与頻度',         field: 'duration_hours', type: 'val'    },
  { label: '使い分けポイント', field: 'guideline_rank', type: 'usecase'},
  { label: 'エビデンス出典',   field: 'evidence',       type: 'evidence'},
  { label: '⚠ 注意事項',      field: 'caution',        type: 'caution'},
];

// 心不全（HFrEF・HFpEF・症状改善共通）
const HF_ROWS = [
  { label: '主な作用',           field: 'action_type',        type: 'mech'    },
  { label: '作用機序',           field: 'mechanism',          type: 'mech'    },
  { label: '主要アウトカム改善', field: 'placebo_onset',      type: 'accent'  },
  { label: '心不全入院・症状改善',field: 'placebo_sleep',     type: 'accent'  },
  { label: 'NNT',                field: 'NNT',                type: 'nnt'     },
  { label: '効果スコア',         field: 'efficacy_star',      type: 'stars'   },
  { label: '予後改善エビデンス', field: 'mortality_benefit',  type: 'benefit' },
  { label: '開始用量',           field: 'start_dose',         type: 'val'     },
  { label: '目標用量',           field: 'target_dose',        type: 'val'     },
  { label: '使い分けポイント',   field: 'guideline_rank',     type: 'usecase' },
  { label: 'エビデンス出典',     field: 'evidence',           type: 'evidence'},
  { label: '⚠ 注意事項',        field: 'caution',            type: 'caution' },
];

// 不整脈（全カテゴリ共通）
const ARRHYTHMIA_ROWS = [
  { label: '適応不整脈',           field: 'action_type',    type: 'mech'    },
  { label: '作用機序',             field: 'mechanism',      type: 'mech'    },
  { label: '有効性指標',           field: 'placebo_onset',  type: 'accent'  },
  { label: '付加的効果',           field: 'placebo_sleep',  type: 'accent'  },
  { label: '効果スコア',           field: 'efficacy_star',  type: 'stars'   },
  { label: '効果発現',             field: 'onset_time',     type: 'val'     },
  { label: '作用持続',             field: 'duration_hours', type: 'val'     },
  { label: '使い分けポイント',     field: 'guideline_rank', type: 'usecase' },
  { label: 'エビデンス出典',       field: 'evidence',       type: 'evidence'},
  { label: '⚠ 注意事項',          field: 'caution',        type: 'caution' },
];

// ===== 消化器系 ROW_DEFS =====
const GI_LAXATIVE_ROWS = [
  { label: '主な作用',           field: 'action_type',     type: 'mech'   },
  { label: '作用機序',           field: 'mechanism',       type: 'mech'   },
  { label: '刺激性・種別',       field: 'stimulant_type',  type: 'accent' },
  { label: '長期使用可否（依存性）', field: 'long_term_use', type: 'accent' },
  { label: '効果スコア',         field: 'efficacy_star',   type: 'stars'  },
  { label: '発現時間',           field: 'onset_time',      type: 'val'    },
  { label: '水分摂取の必要性',   field: 'water_required',  type: 'val'    },
  { label: '使い分けポイント',   field: 'guideline_rank',  type: 'usecase'},
  { label: 'エビデンス出典',     field: 'evidence',        type: 'evidence'},
  { label: '⚠ 注意事項',        field: 'caution',         type: 'caution'},
];

const GI_PROBIOTIC_ROWS = [
  { label: '主な作用',           field: 'action_type',     type: 'mech'   },
  { label: '作用機序',           field: 'mechanism',       type: 'mech'   },
  { label: '主な適応・効果',     field: 'placebo_onset',   type: 'accent' },
  { label: '腸内環境への影響',   field: 'placebo_sleep',   type: 'accent' },
  { label: '効果スコア',         field: 'efficacy_star',   type: 'stars'  },
  { label: '効果発現',           field: 'onset_time',      type: 'val'    },
  { label: '使い分けポイント',   field: 'guideline_rank',  type: 'usecase'},
  { label: 'エビデンス出典',     field: 'evidence',        type: 'evidence'},
  { label: '⚠ 注意事項',        field: 'caution',         type: 'caution'},
];

const GI_ENZYME_ROWS = [
  { label: '主な作用',           field: 'action_type',      type: 'mech'   },
  { label: '作用機序',           field: 'mechanism',        type: 'mech'   },
  { label: '効果対象',           field: 'target_effect',    type: 'accent' },
  { label: '主要酵素成分',       field: 'dominant_enzyme',  type: 'accent' },
  { label: '服用タイミング',     field: 'dosing_timing',    type: 'val'    },
  { label: '効果スコア',         field: 'efficacy_star',    type: 'stars'  },
  { label: '使い分けポイント',   field: 'guideline_rank',   type: 'usecase'},
  { label: 'エビデンス出典',     field: 'evidence',         type: 'evidence'},
  { label: '⚠ 注意事項',        field: 'caution',          type: 'caution'},
];

const GI_ANTIEMETIC_ROWS = [
  { label: '主な作用',           field: 'action_type',     type: 'mech'   },
  { label: '作用機序',           field: 'mechanism',       type: 'mech'   },
  { label: '主要制吐効果',       field: 'placebo_onset',   type: 'accent' },
  { label: '適応・使用場面',     field: 'placebo_sleep',   type: 'accent' },
  { label: 'NNT',                field: 'NNT',             type: 'nnt'    },
  { label: '効果スコア',         field: 'efficacy_star',   type: 'stars'  },
  { label: '効果発現',           field: 'onset_time',      type: 'val'    },
  { label: '投与頻度',           field: 'duration_hours',  type: 'val'    },
  { label: '使い分けポイント',   field: 'guideline_rank',  type: 'usecase'},
  { label: 'エビデンス出典',     field: 'evidence',        type: 'evidence'},
  { label: '⚠ 注意事項',        field: 'caution',         type: 'caution'},
];

const GI_ANTIDIARR_ROWS = [
  { label: '主な作用',               field: 'action_type',         type: 'mech'   },
  { label: '作用機序',               field: 'mechanism',           type: 'mech'   },
  { label: '腸管運動抑制の強さ',     field: 'motility_inhibition', type: 'accent' },
  { label: '感染症での使用可否',     field: 'infection_use',       type: 'accent' },
  { label: '効果スコア',             field: 'efficacy_star',       type: 'stars'  },
  { label: '即効性',                 field: 'quick_onset',         type: 'val'    },
  { label: '使い分けポイント',       field: 'guideline_rank',      type: 'usecase'},
  { label: 'エビデンス出典',         field: 'evidence',            type: 'evidence'},
  { label: '⚠ 注意事項',            field: 'caution',             type: 'caution'},
];

const GI_ACID_ROWS = [
  { label: '主な作用',               field: 'action_type',         type: 'mech'   },
  { label: '作用機序',               field: 'mechanism',           type: 'mech'   },
  { label: '酸分泌抑制の強さ',       field: 'acid_strength',       type: 'accent' },
  { label: '夜間酸分泌への効果',     field: 'nocturnal_acid',      type: 'accent' },
  { label: '効果スコア',             field: 'efficacy_star',       type: 'stars'  },
  { label: '発現速度',               field: 'onset_time',          type: 'val'    },
  { label: '投与頻度',               field: 'duration_hours',      type: 'val'    },
  { label: '使い分けポイント',       field: 'guideline_rank',      type: 'usecase'},
  { label: 'エビデンス出典',         field: 'evidence',            type: 'evidence'},
  { label: '⚠ 注意事項',            field: 'caution',             type: 'caution'},
];

const GI_MUCOSAL_ROWS = [
  { label: '主な作用',               field: 'action_type',         type: 'mech'   },
  { label: '作用機序',               field: 'mechanism',           type: 'mech'   },
  { label: '防御効果の強さ',         field: 'mucosal_strength',    type: 'accent' },
  { label: '即効性',                 field: 'quick_onset',         type: 'accent' },
  { label: '効果スコア',             field: 'efficacy_star',       type: 'stars'  },
  { label: '効果発現',               field: 'onset_time',          type: 'val'    },
  { label: '投与頻度',               field: 'duration_hours',      type: 'val'    },
  { label: '使い分けポイント',       field: 'guideline_rank',      type: 'usecase'},
  { label: 'エビデンス出典',         field: 'evidence',            type: 'evidence'},
  { label: '⚠ 注意事項',            field: 'caution',             type: 'caution'},
];

const GI_FGD_ROWS = [
  { label: '主な作用',                   field: 'action_type',      type: 'mech'   },
  { label: '作用機序',                   field: 'mechanism',        type: 'mech'   },
  { label: 'ターゲット症状',             field: 'target_symptoms',  type: 'accent' },
  { label: '便通への影響',               field: 'bowel_effect',     type: 'accent' },
  { label: '効果スコア',                 field: 'efficacy_star',    type: 'stars'  },
  { label: '効果発現までの時間',         field: 'onset_time',       type: 'val'    },
  { label: '使い分けポイント',           field: 'guideline_rank',   type: 'usecase'},
  { label: 'エビデンス出典',             field: 'evidence',         type: 'evidence'},
  { label: '⚠ 注意事項',                field: 'caution',          type: 'caution'},
];

const GI_IBD_ROWS = [
  { label: '主な作用',                   field: 'action_type',                 type: 'mech'   },
  { label: '作用機序',                   field: 'mechanism',                   type: 'mech'   },
  { label: '製剤放出機構・適用部位',     field: 'delivery_system',             type: 'accent' },
  { label: '寛解導入 / 維持',            field: 'remission_type',              type: 'accent' },
  { label: '感染リスク',                 field: 'infection_risk',              type: 'accent' },
  { label: 'NNT',                        field: 'NNT',                         type: 'nnt'    },
  { label: '効果スコア',                 field: 'efficacy_star',               type: 'stars'  },
  { label: '免疫抑制の強さ',             field: 'immunosuppression_strength',  type: 'val'    },
  { label: '使い分けポイント',           field: 'guideline_rank',              type: 'usecase'},
  { label: 'エビデンス出典',             field: 'evidence',                    type: 'evidence'},
  { label: '⚠ 注意事項',                field: 'caution',                     type: 'caution'},
];

const GI_KAMPO_ROWS = [
  { label: '主な作用',           field: 'action_type',         type: 'mech'   },
  { label: '作用機序',           field: 'mechanism',           type: 'mech'   },
  { label: '主な適応症状',       field: 'main_symptoms',       type: 'accent' },
  { label: '体力レベルの適応',   field: 'constitution_level',  type: 'accent' },
  { label: '効果スコア',         field: 'efficacy_star',       type: 'stars'  },
  { label: '即効性・継続性',     field: 'duration_type',       type: 'val'    },
  { label: '使い分けポイント',   field: 'guideline_rank',      type: 'usecase'},
  { label: 'エビデンス出典',     field: 'evidence',            type: 'evidence'},
  { label: '⚠ 注意事項',        field: 'caution',             type: 'caution'},
];

// ステロイド貼付剤
const STEROID_PATCH_ROWS = [
  { label: '主な作用',             field: 'action_type',    type: 'mech'   },
  { label: '作用機序',             field: 'mechanism',      type: 'mech'   },
  { label: '強度分類（7段階）',   field: 'placebo_onset',  type: 'accent' },
  { label: '持続時間・交換頻度', field: 'placebo_sleep',  type: 'accent' },
  { label: '効果スコア',           field: 'efficacy_star',  type: 'stars'  },
  { label: '効果発現',             field: 'onset_time',     type: 'val'    },
  { label: '使い分けポイント',     field: 'guideline_rank', type: 'usecase'},
  { label: 'エビデンス出典',       field: 'evidence',       type: 'evidence'},
  { label: '⚠ 注意事項',          field: 'caution',        type: 'caution'},
];

// ===== 抗アレルギー薬 ROW_DEFS =====
const ALLERGY_ANTIHIST_ROWS = [
  { label: '作用機序',               field: 'mechanism',       type: 'mech'    },
  { label: '主な適応',               field: 'indication',      type: 'mech'    },
  { label: '構造/骨格',              field: 'structure',       type: 'mech'    },
  { label: '脳内H1受容体占拠率',     field: 'brain_occupancy', type: 'accent'  },
  { label: '眠気の強さ',             field: 'drowsiness',      type: 'accent'  },
  { label: '50%改善達成率',          field: 'response_rate',   type: 'accent'  },
  { label: '効果スコア',             field: 'efficacy_star',   type: 'stars'   },
  { label: '作用持続',               field: 'duration',        type: 'val'     },
  { label: '使い分けポイント',       field: 'guideline_rank',  type: 'usecase' },
  { label: 'エビデンス出典',         field: 'evidence',        type: 'evidence'},
  { label: '⚠ 注意事項',            field: 'caution',         type: 'caution' },
];

const ALLERGY_LTRA_ROWS = [
  { label: '作用機序',               field: 'mechanism',       type: 'mech'    },
  { label: '主な適応',               field: 'indication',      type: 'mech'    },
  { label: '効果スコア',             field: 'efficacy_star',   type: 'stars'   },
  { label: '鼻閉への効果',           field: 'pollen_effect',   type: 'accent'  },
  { label: '喘息合併への効果',       field: 'asthma_effect',   type: 'accent'  },
  { label: '夜間症状への効果',       field: 'nocturnal_effect',type: 'accent'  },
  { label: '服薬タイミング',         field: 'dosing_time',     type: 'val'     },
  { label: '使い分けポイント',       field: 'guideline_rank',  type: 'usecase' },
  { label: 'エビデンス出典',         field: 'evidence',        type: 'evidence'},
  { label: '⚠ 注意事項',            field: 'caution',         type: 'caution' },
];

const ALLERGY_MCS_ROWS = [
  { label: '作用機序',               field: 'mechanism',       type: 'mech'    },
  { label: '適応疾患',               field: 'indication',      type: 'mech'    },
  { label: '効果スコア',             field: 'efficacy_star',   type: 'stars'   },
  { label: '即効性',                 field: 'onset',           type: 'accent'  },
  { label: '予防効果',               field: 'prevention_effect',type: 'accent' },
  { label: '使い分けポイント',       field: 'guideline_rank',  type: 'usecase' },
  { label: 'エビデンス出典',         field: 'evidence',        type: 'evidence'},
  { label: '⚠ 注意事項',            field: 'caution',         type: 'caution' },
];

const ALLERGY_BIO_ROWS = [
  { label: 'ターゲット分子',         field: 'target_molecule', type: 'mech'    },
  { label: '作用機序',               field: 'mechanism',       type: 'mech'    },
  { label: '主な適応疾患',           field: 'indication',      type: 'mech'    },
  { label: '効果スコア',             field: 'efficacy_star',   type: 'stars'   },
  { label: '投与方法',               field: 'administration',  type: 'val'     },
  { label: '奏効率/寛解率',          field: 'remission_rate',  type: 'accent'  },
  { label: '使い分けポイント',       field: 'guideline_rank',  type: 'usecase' },
  { label: 'エビデンス出典',         field: 'evidence',        type: 'evidence'},
  { label: '⚠ 注意事項',            field: 'caution',         type: 'caution' },
];

const ALLERGY_AIT_ROWS = [
  { label: '投与経路',               field: 'action_type',     type: 'mech'    },
  { label: '適応アレルゲン',         field: 'allergen',        type: 'mech'    },
  { label: '作用機序',               field: 'mechanism',       type: 'mech'    },
  { label: '効果スコア',             field: 'efficacy_star',   type: 'stars'   },
  { label: '投与スケジュール',       field: 'administration',  type: 'val'     },
  { label: '治療期間',               field: 'treatment_duration',type: 'val'   },
  { label: '根治への可能性',         field: 'cure_potential',  type: 'accent'  },
  { label: '副反応リスク',           field: 'side_effect_risk',type: 'accent'  },
  { label: '使い分けポイント',       field: 'guideline_rank',  type: 'usecase' },
  { label: 'エビデンス出典',         field: 'evidence',        type: 'evidence'},
  { label: '⚠ 注意事項',            field: 'caution',         type: 'caution' },
];

// ===== 呼吸器 ROW_DEFS =====
const RESP_INHALER_ROWS = [
  { label: '作用機序',         field: 'mechanism',       type: 'mech'    },
  { label: '主な適応',         field: 'indication',      type: 'mech'    },
  { label: 'デバイス',         field: 'device',          type: 'val'     },
  { label: '必要吸気流速',     field: 'inhalation_flow', type: 'accent'  },
  { label: '効果スコア',       field: 'efficacy_star',   type: 'stars'   },
  { label: '効果発現',         field: 'onset_time',      type: 'val'     },
  { label: '作用持続',         field: 'duration_hours',  type: 'val'     },
  { label: '使い分けポイント', field: 'guideline_rank',  type: 'usecase' },
  { label: 'エビデンス出典',   field: 'evidence',        type: 'evidence'},
  { label: '⚠ 注意事項',      field: 'caution',         type: 'caution' },
];
const RESP_ORAL_ROWS = [
  { label: '作用機序',         field: 'mechanism',       type: 'mech'    },
  { label: '主な適応',         field: 'indication',      type: 'mech'    },
  { label: '効果スコア',       field: 'efficacy_star',   type: 'stars'   },
  { label: '主要効果指標',     field: 'placebo_onset',   type: 'accent'  },
  { label: '副次効果指標',     field: 'placebo_sleep',   type: 'accent'  },
  { label: '作用持続',         field: 'duration_hours',  type: 'val'     },
  { label: '使い分けポイント', field: 'guideline_rank',  type: 'usecase' },
  { label: 'エビデンス出典',   field: 'evidence',        type: 'evidence'},
  { label: '⚠ 注意事項',      field: 'caution',         type: 'caution' },
];

// ===== 抗ウイルス/抗原虫薬 ROW_DEFS =====
const ANTIVIRAL_ROWS = [
  { label: '作用機序',      field: 'mechanism',  type: 'mech'    },
  { label: '血中半減期',    field: 'half_life',   type: 'val'     },
  { label: '米国用量',      field: 'dose_us',     type: 'accent'  },
  { label: '投与経路・BA',  field: 'route',       type: 'accent'  },
  { label: '第一選択',      field: 'first_line',  type: 'usecase' },
  { label: '適応外使用',    field: 'off_label',   type: 'usecase' },
  { label: '薬物相互作用',  field: 'cross',       type: 'val'     },
  { label: '⚠ 注意事項',   field: 'caution',     type: 'caution' },
  { label: 'TDM',           field: 'tdm',         type: 'val'     },
];

// ===== 抗真菌薬 ROW_DEFS =====
const ANTIFUNGAL_ROWS = [
  { label: '作用機序',      field: 'mechanism',  type: 'mech'    },
  { label: 'PK/PD特性',     field: 'pkpd',       type: 'val'     },
  { label: '血中半減期',    field: 'half_life',   type: 'val'     },
  { label: '米国用量',      field: 'dose_us',     type: 'accent'  },
  { label: '投与経路・BA',  field: 'route',       type: 'accent'  },
  { label: '第一選択',      field: 'first_line',  type: 'usecase' },
  { label: '適応外使用',    field: 'off_label',   type: 'usecase' },
  { label: '薬物相互作用',  field: 'cross',       type: 'val'     },
  { label: '⚠ 注意事項',   field: 'caution',     type: 'caution' },
  { label: 'TDM',           field: 'tdm',         type: 'val'     },
];

// ===== 抗菌薬 ROW_DEFS =====
const ANTIBIOTIC_ROWS = [
  { label: '作用機序',       field: 'mechanism',  type: 'mech'    },
  { label: 'PK/PD特性',      field: 'pkpd',       type: 'val'     },
  { label: '血中半減期',      field: 'half_life',  type: 'val'     },
  { label: '米国用量',        field: 'dose_us',    type: 'accent'  },
  { label: '投与経路',        field: 'route',      type: 'val'     },
  { label: '第一選択',        field: 'first_line', type: 'usecase' },
  { label: '適応外使用',      field: 'off_label',  type: 'usecase' },
  { label: '交差アレルギー',  field: 'cross',      type: 'val'     },
  { label: '⚠ 注意事項',     field: 'caution',    type: 'caution' },
  { label: 'TDM',             field: 'tdm',        type: 'val'     },
];

function getRowDefs(category) {
  if (currentDomain === 'antiviral')   return ANTIVIRAL_ROWS;
  if (currentDomain === 'antifungals') return ANTIFUNGAL_ROWS;
  if (currentDomain === 'antibiotics') return ANTIBIOTIC_ROWS;
  if (ROW_DEFS[category]) return ROW_DEFS[category];
  if (['抗精神病薬（定型）', '抗精神病薬（非定型）'].includes(category))
    return AP_ROWS;
  if (['抗うつ薬', '気分安定薬', '認知症治療薬'].includes(category))
    return PSYCH_ROWS;
  if (category === '双極性障害そう状態') return BIPOLAR_MANIA_ROWS;
  if (category === '双極性障害うつ状態') return BIPOLAR_DEP_ROWS;
  if (category === 'ADHD治療薬')             return ADHD_ROWS;
  if (category === 'アルコール依存症治療薬') return ALCOHOL_ROWS;
  if (category === '禁煙補助薬')             return SMOKING_ROWS;
  if (category === '強オピオイド')           return STRONG_OPIOID_ROWS;
  if (category === '糖尿病治療薬')       return DIABETES_ROWS;
  if (category === '高血圧治療薬')       return HYPERTENSION_ROWS;
  if (category === '脂質異常症治療薬')   return DYSLIPIDEMIA_ROWS;
  if (category === '高尿酸血症治療薬')   return HYPERURICEMIA_ROWS;
  if (category === '片頭痛')             return MIGRAINE_ROWS;
  if (category === '抗てんかん薬')       return EPILEPSY_ROWS;
  if (category === 'パーキンソン病治療薬') return PARKINSON_ROWS;
  if (category === '内服')   return STEROID_ORAL_ROWS;
  if (category === '塗布薬') return STEROID_TOPICAL_ROWS;
  if (category === '点鼻薬') return STEROID_NASAL_ROWS;
  if (category === '点眼薬') return STEROID_EYE_ROWS;
  if (category === '貼付剤') return STEROID_PATCH_ROWS;
  if (['HFrEF（予後改善薬）', 'HFpEF治療薬', '症状改善・体液管理',
       'MX_RAAS', 'MX_beta', 'MX_SGLT2', 'MX_diuretic', 'MX_other'].includes(category))
    return HF_ROWS;
  // 不整脈
  if (['心房細動（レートコントロール）', '心房細動（リズムコントロール）',
       '心室性不整脈', '上室性頻脈（SVT）',
       'VW_Ia', 'VW_Ib', 'VW_Ic', 'VW_II', 'VW_III', 'VW_IV', 'VW_other'].includes(category))
    return ARRHYTHMIA_ROWS;
  // 消化器系
  if (category === '便秘薬')             return GI_LAXATIVE_ROWS;
  if (category === '整腸剤')             return GI_PROBIOTIC_ROWS;
  if (category === '消化酵素・胆汁系')   return GI_ENZYME_ROWS;
  if (category === '悪心・嘔吐')         return GI_ANTIEMETIC_ROWS;
  if (category === '下痢止め')           return GI_ANTIDIARR_ROWS;
  if (category === '胃酸分泌抑制薬')     return GI_ACID_ROWS;
  if (category === '粘膜防御薬')         return GI_MUCOSAL_ROWS;
  if (category === '機能性消化管疾患')   return GI_FGD_ROWS;
  if (category === '潰瘍性大腸炎・クローン病') return GI_IBD_ROWS;
  if (category === '消化器系漢方')       return GI_KAMPO_ROWS;
  if (category === '非オピオイド系')     return NON_OPIOID_ROWS;
  // 抗アレルギー薬
  if (category === '抗ヒスタミン薬')       return ALLERGY_ANTIHIST_ROWS;
  if (category === 'ロイコトリエン拮抗薬') return ALLERGY_LTRA_ROWS;
  if (category === '肥満細胞安定化薬')     return ALLERGY_MCS_ROWS;
  if (category === '生物学的製剤')         return ALLERGY_BIO_ROWS;
  if (category === 'アレルゲン免疫療法')   return ALLERGY_AIT_ROWS;
  // 呼吸器
  if (['気管支喘息（吸入）', 'COPD（吸入）',
       'RX_SABA', 'RX_LABA', 'RX_LAMA', 'RX_ICS',
       'RX_ICS_LABA', 'RX_LAMA_LABA', 'RX_TRIPLE'].includes(category))
    return RESP_INHALER_ROWS;
  if (['気管支喘息（内服）', 'COPD（内服）',
       '肺高血圧症', '間質性肺疾患', '慢性咳嗽'].includes(category))
    return RESP_ORAL_ROWS;
  return PAIN_ROWS;
}

// ===== 汎用行ビルダー =====
function buildRows(drugs, cfg, category) {
  const defs = getRowDefs(category);
  return defs.map((def, i) => {
    const alt    = i % 2 === 1;
    const isWarn = def.label.startsWith('⚠');
    return makeRow(drugs, cfg, def.label, d => renderCell(d, def, cfg.accentColor), alt, isWarn);
  }).join('');
}

function renderCell(d, def, accentColor) {
  const v = d[def.field];
  const s = v !== undefined && v !== null ? String(v) : 'データなし';
  switch (def.type) {
    case 'accent':   return valCell(s, accentColor);
    case 'nnt':      return nntCell(v, accentColor);
    case 'stars':    return starsCell(v);
    case 'usecase':  return usecaseCell(s);
    case 'evidence': return evidenceCell(d);
    case 'caution':  return cautionCell(s);
    case 'mech':     return `<td class="mech-cell">${esc(s)}</td>`;
    case 'tag':      return `<td class="tag-cell">${esc(s)}</td>`;
    case 'benefit': {
      const yes   = s.includes('あり');
      const color = yes ? '#15803d' : '#6b7280';
      const icon  = yes ? '✓ ' : '✕ ';
      return `<td class="val-cell" style="color:${color};font-weight:600">${esc(icon + s)}</td>`;
    }
    default:         return `<td class="val-cell">${esc(s)}</td>`;
  }
}

// ===== 行ヘルパー =====
function makeRow(drugs, cfg, label, cellFn, alt, isWarn = false) {
  const labelClass  = `row-label${isWarn ? ' row-label-warn' : ''}`;
  const stickyStyle = `background:${alt ? cfg.rowAltSticky : 'white'}`;
  return `
    <tr${alt ? ' class="row-alt"' : ''}>
      <td class="sticky-col ${labelClass}" style="${stickyStyle}">${esc(label)}</td>
      ${drugs.map(cellFn).join('')}
    </tr>`;
}

function valCell(v, color) {
  const nodata = v === 'データなし';
  return `<td class="val-cell${nodata ? ' val-nodata' : ''}" style="${nodata ? '' : `color:${color}`}">${esc(v)}</td>`;
}

function nntCell(nnt, color) {
  const isNA = typeof nnt !== 'number';
  return `<td class="val-cell${isNA ? ' val-nodata' : ''}" style="${isNA ? '' : `color:${color}`}">${isNA ? esc(String(nnt)) : 'NNT&nbsp;' + nnt}</td>`;
}

function starsCell(n) {
  return `
    <td>
      <div class="stars-wrap">
        <span class="stars">${'★'.repeat(n)}</span><span class="stars-empty">${'★'.repeat(5 - n)}</span>
        <span class="star-num">${n}/5</span>
      </div>
    </td>`;
}

function usecaseCell(text) {
  const long = text.length > 38;
  if (long) {
    return `<td class="usecase-cell"><span class="uc-text uc-clamp">${esc(text)}</span><button class="uc-expand-btn" aria-label="全文を見る">▾ 全文</button></td>`;
  }
  return `<td class="usecase-cell">${esc(text)}</td>`;
}

// 禁忌を赤バッジでハイライト（escした後に適用するので安全）
function highlightCaution(text) {
  return esc(text).replace(/禁忌/g, '<mark class="contraindication">禁忌</mark>');
}

function cautionCell(text) {
  const hasContraindication = text.includes('禁忌');
  return `<td class="caution-cell${hasContraindication ? ' has-contraindication' : ''}">${highlightCaution(text)}</td>`;
}

function evidenceCell(d) {
  const linkBtn = d.evidence_url
    ? `<button class="ev-link-btn" data-url="${esc(d.evidence_url)}" aria-label="参照リンクを表示">🔗</button>
       <div class="ev-link-panel" hidden>
         <a href="${esc(d.evidence_url)}" target="_blank" rel="noopener noreferrer">${esc(d.evidence_url)}</a>
       </div>`
    : '';
  return `<td class="evidence-cell">${esc(d.evidence || '')}${linkBtn}</td>`;
}

// ===== バッジ =====
function getClassBadge(cls) {
  const map = {
    // 既存
    'ベンゾジアゼピン系':             { css: 'benzo' },
    'チエノジアゼピン系':             { css: 'thienodiaz' },
    '非ベンゾジアゼピン系':           { css: 'non-benzo' },
    'オレキシン受容体拮抗薬':         { css: 'orexin' },
    'メラトニン受容体作動薬':         { css: 'melatonin' },
    'セロトニン1A受容体作動薬':       { css: 'serotonin' },
    'SSRI':                           { css: 'ssri' },
    'SNRI':                           { css: 'snri' },
    'アセトアミノフェン系':           { css: 'acetaminophen' },
    'NSAID（非選択的）':              { css: 'nsaid-non' },
    'NSAID（COX-2選択的）':           { css: 'nsaid-cox2' },
    '弱オピオイド':                   { css: 'weak-opioid' },
    '弱オピオイド配合剤':             { css: 'opioid-combo' },
    // 新規
    // ADHD
    '中枢刺激薬（メチルフェニデート）': { css: 'stimulant' },
    '中枢刺激薬（アンフェタミン系）':   { css: 'stimulant' },
    '非刺激薬（NRI）':                 { css: 'nri-adhd' },
    '非刺激薬（α2A作動薬）':           { css: 'alpha2a-adhd' },
    // 依存症
    'オピオイド拮抗薬':                 { css: 'depend-ant' },
    'GABA調節薬（断酒補助）':           { css: 'depend-gaba' },
    'アルデヒド脱水素酵素阻害薬':       { css: 'depend-ald' },
    'シアナミド系':                     { css: 'depend-ald' },
    'オピオイド部分拮抗薬':             { css: 'depend-ant' },
    'α4β2ニコチン受容体部分作動薬':     { css: 'cessation-var' },
    'ニコチン代替療法（経皮）':         { css: 'cessation-nrt' },
    'ニコチン代替療法（口腔内）':       { css: 'cessation-nrt' },
    // 強オピオイド
    '強オピオイド（モルヒネ系）':       { css: 'strong-opioid' },
    '強オピオイド（合成）':             { css: 'strong-opioid' },
    '強オピオイド（貼付剤）':           { css: 'strong-opioid' },
    '強オピオイド（混合作用）':         { css: 'strong-opioid' },
    '強オピオイド（μ作動+NMDA拮抗）':  { css: 'strong-opioid' },
    '置換ベンズアミド系':             { css: 'typical-ap' },
    'フェノチアジン系':               { css: 'typical-ap' },
    '定型抗精神病薬（高力価）':       { css: 'typical-ap' },
    '定型抗精神病薬（低力価）':       { css: 'typical-ap' },
    '非定型抗精神病薬（SDA）':        { css: 'atypical-sda' },
    '非定型抗精神病薬（MARTA）':      { css: 'atypical-marta' },
    '非定型抗精神病薬（DSS）':        { css: 'atypical-dss' },
    '三環系抗うつ薬（TCA）':          { css: 'tca' },
    'NaSSA':                          { css: 'nassa' },
    'マルチモーダル抗うつ薬':         { css: 'multimodal' },
    'ニューロステロイド GABAA-PAM':    { css: 'neuroste' },
    'アロプレグナノロン様GABAA受容体機能賦活剤': { css: 'neuroste' }, // 旧表記・後方互換
    'リチウム塩':                     { css: 'lithium' },
    '脂肪酸系気分安定薬':             { css: 'mood-stable' },
    '気分安定薬（Na+チャネル遮断薬）':{ css: 'mood-stable' },
    '気分安定薬（グルタミン酸調節薬）':{ css: 'mood-stable' },
    'コリンエステラーゼ阻害薬（AChEI）':      { css: 'ache-i' },
    'コリンエステラーゼ阻害薬（AChEI/BuChEI）':{ css: 'ache-i' },
    'コリンエステラーゼ阻害薬（AChEI）＋APL': { css: 'ache-i' },
    'ChE阻害薬（AChEI）':       { css: 'ache-i' },
    'ChE阻害薬（AChEI/BuChEI）':{ css: 'ache-i' },
    'ChE阻害薬（AChEI）＋APL':  { css: 'ache-i' },
    'NMDA受容体拮抗薬':               { css: 'nmda-ant' },
    'α2δリガンド（カルシウムチャネル調節薬）': { css: 'alpha2delta' },
    'α2δリガンド（Ca²⁺チャネル調節薬）':    { css: 'alpha2delta' },
    'α2δリガンド（第2世代）':               { css: 'alpha2delta' },
    'トリプタン系（5-HT1B/1D作動薬）':{ css: 'triptan' },
    'ジタン系（5-HT1F作動薬）':       { css: 'ditan' },
    'CGRP受容体拮抗抗体':             { css: 'cgrp-ab' },
    'Na+チャネル遮断薬（抗てんかん）':{ css: 'na-channel-b' },
    'SV2A結合薬':                     { css: 'sv2a-b' },
    '多作用機序型抗てんかん薬':       { css: 'multi-aed' },
    'Na+チャネル遮断薬（緩徐な不活性化増強）': { css: 'na-channel-b' },
    'スルホンアミド系抗てんかん薬':   { css: 'multi-aed' },
    'AMPA受容体拮抗薬（非競合）':     { css: 'sv2a-b' },
    '1,5-ベンゾジアゼピン系':         { css: 'benzo' },
    '脂肪酸系抗てんかん薬':           { css: 'mood-stable' },
    'ドパミン前駆体':                 { css: 'levodopa-sys' },
    '非麦角系ドパミン作動薬':         { css: 'da-agonist' },
    '非麦角系ドパミン作動薬（経皮）': { css: 'da-agonist' },
    'MAO-B阻害薬':                    { css: 'mao-comt-i' },
    'COMT阻害薬':                     { css: 'mao-comt-i' },
    // 双極性障害
    '非定型抗精神病薬配合剤':         { css: 'atypical-combo' },
    // 糖尿病
    'ビグアナイド系':                 { css: 'biguanide' },
    'SGLT2阻害薬':                    { css: 'sglt2i' },
    'GLP-1受容体作動薬':              { css: 'glp1ra' },
    'DPP-4阻害薬':                    { css: 'dpp4i' },
    'SU薬（スルホニル尿素）':         { css: 'su-drug' },
    'チアゾリジン系（TZD）':          { css: 'tzd' },
    // 高血圧
    'Ca拮抗薬（L型）':                { css: 'ccb' },
    'ARB':                            { css: 'arb' },
    'ACE阻害薬':                      { css: 'acei' },
    'サイアザイド様利尿薬':           { css: 'thiazide' },
    'β1選択的遮断薬':                 { css: 'beta-blocker' },
    // 脂質異常症
    'スタチン（高強度）':             { css: 'statin-high' },
    'スタチン（中強度）':             { css: 'statin-mod' },
    'コレステロール吸収阻害薬':       { css: 'chol-absorb' },
    'PCSK9阻害薬（抗体薬）':          { css: 'pcsk9i' },
    'フィブラート系':                 { css: 'fibrate' },
    '高純度EPA':                      { css: 'epa' },
    'アルドステロン拮抗薬':           { css: 'thiazide' },
    // 高尿酸血症
    '非プリン型キサンチンオキシダーゼ阻害薬': { css: 'xo-inhibitor' },
    'プリン型キサンチンオキシダーゼ阻害薬':   { css: 'xo-inhibitor' },
    '尿酸排泄促進薬':                 { css: 'uricosuric' },
    '抗炎症薬（チュブリン重合阻害）': { css: 'colchicine-badge' },
    // ステロイド内服
    'グルココルチコイド（中間型）': { css: 'steroid-oral' },
    'グルココルチコイド（長時間型）': { css: 'steroid-oral-long' },
    'グルココルチコイド（短時間型）': { css: 'steroid-oral-short' },
    // ステロイド塗布薬
    '外用ステロイド I群（最強）':   { css: 'steroid-top-1' },
    '外用ステロイド II群（強力）':  { css: 'steroid-top-2' },
    '外用ステロイド III群（強）':   { css: 'steroid-top-3' },
    '外用ステロイド IV群（中等度）':{ css: 'steroid-top-4' },
    // ステロイド点鼻薬
    '点鼻ステロイド（第2世代）': { css: 'steroid-nasal' },
    '点鼻ステロイド（第1世代）': { css: 'steroid-nasal-1' },
    // ステロイド点眼薬
    '眼科用ステロイド（弱〜中）': { css: 'steroid-eye-mild' },
    '眼科用ステロイド（強力）':   { css: 'steroid-eye-strong' },
    // ステロイド塗布薬（V群追加）
    '外用ステロイド V群（弱）': { css: 'steroid-top-5' },
    // ステロイド貼付剤
    '外用ステロイド II群（強力）':  { css: 'steroid-top-2' },
    '外用ステロイド III群（強力）': { css: 'steroid-top-3' },
    // 消化器系 - 便秘薬
    '刺激性下剤（アントラキノン系）':       { css: 'gi-lax-stim' },
    '刺激性下剤（ジフェニルメタン系）':     { css: 'gi-lax-stim' },
    '非刺激性下剤（塩類下剤・浸透圧性）':   { css: 'gi-lax-osmo' },
    '腸液分泌促進薬（ClC-2クロライドチャネル活性化）': { css: 'gi-lax-secr' },
    '腸液分泌促進薬（ClC-2 Cl⁻チャネル活性化）':     { css: 'gi-lax-secr' },
    'グアニル酸シクラーゼC（GCC）受容体作動薬': { css: 'gi-lax-gcc' },
    '胆汁酸トランスポーター（IBAT）阻害薬': { css: 'gi-lax-ibat' },
    '非刺激性下剤（高分子浸透圧性下剤・PEG）': { css: 'gi-lax-peg' },
    '末梢性オピオイドμ受容体拮抗薬（PAMORA）': { css: 'gi-lax-pam' },
    // 整腸剤
    '生菌製剤（ビフィドバクテリウム属）':             { css: 'gi-probi' },
    '生菌製剤（抗菌薬耐性ラクトバチルス属）':         { css: 'gi-probi' },
    '生菌製剤（クロストリジウム・ブチリカム）':       { css: 'gi-probi' },
    '生菌製剤（エンテロコッカス・フェカーリス）':     { css: 'gi-probi' },
    // 消化酵素・胆汁系
    '膵酵素製剤（リパーゼ・アミラーゼ・プロテアーゼ含有）': { css: 'gi-enzyme' },
    '胆汁酸製剤（親水性二次胆汁酸）':    { css: 'gi-bile' },
    '消泡剤（シリコーン系ポリマー）':     { css: 'gi-enzyme' },
    '消化酵素配合剤（アミラーゼ・プロテアーゼ・リパーゼ等）': { css: 'gi-enzyme' },
    // 悪心・嘔吐
    'ドパミンD2受容体拮抗薬（消化管運動促進薬・中枢性制吐薬）': { css: 'gi-anti-d2' },
    'ドパミンD2受容体拮抗薬（末梢選択性・BBB通過少）':          { css: 'gi-anti-d2' },
    '5-HT3受容体拮抗薬（第1世代・中枢・末梢）':    { css: 'gi-anti-5ht3' },
    '5-HT3受容体拮抗薬（第1世代・長時間作用型）':  { css: 'gi-anti-5ht3' },
    'ニューロキニン1（NK1）受容体拮抗薬':           { css: 'gi-anti-nk1' },
    'フェノチアジン系制吐薬（D2・H1・ムスカリン受容体遮断）': { css: 'gi-anti-phen' },
    // 下痢止め
    '末梢性オピオイドμ受容体作動薬（腸管選択性）': { css: 'gi-dia-opi' },
    '収斂薬（タンニン酸・蛋白複合体）':             { css: 'gi-dia-ast' },
    '吸着剤（腸管内毒素・細菌・ガス吸着）':         { css: 'gi-dia-abs' },
    '植物アルカロイド（抗菌・腸管蠕動抑制・腸液分泌抑制）': { css: 'gi-dia-abs' },
    '陰イオン交換樹脂（胆汁酸吸着薬）':             { css: 'gi-dia-res' },
    // 胃酸分泌抑制薬
    'カリウムイオン競合型アシッドブロッカー（P-CAB）': { css: 'gi-pcab' },
    'プロトンポンプ阻害薬（PPI・第2世代・S異性体）':   { css: 'gi-ppi' },
    'プロトンポンプ阻害薬（PPI）':                     { css: 'gi-ppi' },
    'プロトンポンプ阻害薬（PPI・CYP2C19影響少）':      { css: 'gi-ppi' },
    'H2受容体拮抗薬（H2ブロッカー・第2世代）':         { css: 'gi-h2b' },
    // 粘膜防御薬
    '粘膜防御因子増強薬（プロスタグランジン産生促進・粘液増加）': { css: 'gi-muco' },
    '粘膜防御因子増強薬（テルペン誘導体・ムコ多糖増加）':         { css: 'gi-muco' },
    'アルミニウム含有粘膜被覆薬（潰瘍面選択的付着）':             { css: 'gi-muco-al' },
    'Al含有粘膜被覆薬（潰瘍面選択的付着）':                       { css: 'gi-muco-al' },
    '亜鉛含有粘膜修復薬（組織修復促進・抗酸化）':                 { css: 'gi-muco' },
    // 機能性消化管疾患
    'アセチルコリンエステラーゼ阻害薬（消化管選択的・胃運動促進）': { css: 'gi-fgd' },
    'AChE阻害薬（消化管選択的・胃運動促進）':                      { css: 'gi-fgd' },
    '腸管運動調節薬（オピオイド受容体作動・双方向調節）':           { css: 'gi-fgd' },
    '5-HT3受容体拮抗薬（腸管感覚・運動選択的）':                   { css: 'gi-ibs' },
    '高吸水性ポリマー（腸内水分調節・便形成補助）':                 { css: 'gi-ibs' },
    'ドパミンD2受容体拮抗薬＋コリンエステラーゼ阻害薬（胃運動促進）': { css: 'gi-fgd' },
    'ドパミンD2受容体拮抗薬＋ChE阻害薬（胃運動促進）':             { css: 'gi-fgd' },
    '抗コリン薬（腸管スパスム抑制・第四級アンモニウム化合物）':     { css: 'gi-ibs' },
    // 潰瘍性大腸炎・クローン病
    '5-アミノサリチル酸（5-ASA）製剤':                         { css: 'gi-5asa' },
    '全身性ステロイド（糖質コルチコイド・免疫抑制）':           { css: 'gi-ibd-ste' },
    'チオプリン系免疫調節薬（プリン代謝拮抗）':                 { css: 'gi-ibd-imm' },
    '抗TNFα抗体（キメラ型IgG1・点滴静注）':                    { css: 'gi-ibd-bio' },
    '抗IL-12/23p40抗体（完全ヒト型IgG1・点滴→皮下注）':        { css: 'gi-ibd-il' },
    '抗α4β7インテグリン抗体（腸管選択的・完全ヒト型IgG1）':    { css: 'gi-ibd-int' },
    '局所作用型ステロイド（CYP3A4一回通過代謝型）':            { css: 'gi-ibd-bud' },
    // 心不全 — 短縮後のクラス名
    'ARNI':              { css: 'hf-arni'     },
    'MRA（選択的）':     { css: 'thiazide'    },
    'MRA（非選択的）':   { css: 'thiazide'    },
    'β遮断薬（非選択的）': { css: 'beta-blocker' },
    'β遮断薬（β1選択的）': { css: 'beta-blocker' },
    'If電流阻害薬':      { css: 'hf-if'       },
    'V2受容体拮抗薬':    { css: 'hf-v2'       },
    '強心配糖体':        { css: 'hf-digoxin'  },
    // 高尿酸血症 — 短縮後
    'XO阻害薬（非プリン型）': { css: 'xo-inhibitor' },
    'XO阻害薬（プリン型）':   { css: 'xo-inhibitor' },
    '微小管重合阻害薬':       { css: 'colchicine-badge' },
    // 脂質異常症 — 短縮後
    'PCSK9阻害薬':       { css: 'pcsk9i'      },
    // 糖尿病 — 短縮後
    'SU薬':              { css: 'su-drug'     },
    'TZD':               { css: 'tzd'         },
    'GIP/GLP-1作動薬':   { css: 'glp1ra'      },
    // gi — K⁺表記
    'K⁺競合型アシッドブロッカー（P-CAB）': { css: 'gi-pcab' },
    // 消化器系漢方
    '消化器系漢方（腸管運動促進・温補・血流改善）':     { css: 'gi-kampo' },
    '消化器系漢方（胃運動促進・グレリン分泌促進・補気健脾）': { css: 'gi-kampo' },
    '消化器系漢方（寒熱錯雑・胃腸炎症・口内炎治療）':   { css: 'gi-kampo' },
    '消化器系漢方（腸管スパスム緩解・桂枝湯加芍薬）':   { css: 'gi-kampo' },
    '消化器系漢方（緩下・腸潤化・高齢者便秘）':         { css: 'gi-kampo' },
    '消化器系漢方（瀉下・清熱・発汗・利水・実証の肥満便秘）': { css: 'gi-kampo' },
    // 抗アレルギー薬 - 抗ヒスタミン薬（旧長名・後方互換）
    '第2世代抗ヒスタミン薬（非鎮静性・ピペリジン骨格）': { css: 'ah-2gen-non' },
    '第2世代抗ヒスタミン薬（非鎮静性・三環系）':        { css: 'ah-2gen-non' },
    '第2世代抗ヒスタミン薬（低鎮静性・ピペラジン骨格）': { css: 'ah-2gen-low' },
    '第2世代抗ヒスタミン薬（低鎮静性・ピペリジン骨格）': { css: 'ah-2gen-low' },
    '第2世代抗ヒスタミン薬（低鎮静性・ジベンズオキセピン骨格）': { css: 'ah-2gen-low' },
    '第2世代抗ヒスタミン薬（軽鎮静性・フタラジノン骨格）': { css: 'ah-2gen-mild' },
    '第2世代抗ヒスタミン薬（双作用：H1拮抗+肥満細胞安定化）': { css: 'ah-2gen-mild' },
    '第1世代抗ヒスタミン薬（鎮静性・プロピルアミン骨格）': { css: 'ah-1gen' },
    '第1世代抗ヒスタミン薬（鎮静性・エタノールアミン骨格）': { css: 'ah-1gen' },
    '第1世代抗ヒスタミン薬（鎮静性・ピペラジン骨格）': { css: 'ah-1gen' },
    '第1世代抗ヒスタミン薬（鎮静性・フェノチアジン骨格）': { css: 'ah-1gen' },
    // 抗ヒスタミン薬（短縮後クラス名）
    '第2世代・非鎮静性': { css: 'ah-2gen-non'  },
    '第2世代・低鎮静性': { css: 'ah-2gen-low'  },
    '第2世代・軽鎮静性': { css: 'ah-2gen-mild' },
    '第2世代・双作用':   { css: 'ah-2gen-mild' },
    '第1世代・鎮静性':   { css: 'ah-1gen'      },
    // LTRA・肥満細胞安定化薬
    'LTRAシステイニル型（CysLT1選択的）': { css: 'ah-ltra' },
    '肥満細胞安定化薬（クロモン系）':      { css: 'ah-mcs' },
    '肥満細胞安定化薬（アントラニル酸誘導体・国内開発）': { css: 'ah-mcs' },
    // 生物学的製剤
    '抗IgE抗体（ヒト化IgG1κ）':                        { css: 'ah-bio-ige' },
    '抗IL-4Rα抗体（IL-4・IL-13共通受容体遮断）':        { css: 'ah-bio-il4' },
    '抗IL-5抗体（完全ヒト化IgG1κ）':                   { css: 'ah-bio-il5' },
    '抗IL-5Rα抗体（フコース除去・ADCC増強）':           { css: 'ah-bio-il5' },
    // アレルゲン免疫療法
    '舌下免疫療法（SLIT）スギ花粉': { css: 'ah-ait' },
    '舌下免疫療法（SLIT）ダニ':     { css: 'ah-ait' },
    '皮下免疫療法（SCIT）':         { css: 'ah-ait-sc' },
    // 呼吸器
    'SABA（短時間作用型β2刺激薬）':   { css: 'resp-saba' },
    'LABA（長時間作用型β2刺激薬）':   { css: 'resp-laba' },
    'LAMA（長時間作用型抗コリン薬）': { css: 'resp-lama' },
    'ICS（吸入ステロイド）':          { css: 'resp-ics'  },
    'ICS/LABA配合剤':                 { css: 'resp-ics-laba' },
    'LAMA/LABA配合剤':                { css: 'resp-lama-laba' },
    'ICS/LABA/LAMA配合剤（3剤配合）': { css: 'resp-triple' },
    'LTRA（ロイコトリエン受容体拮抗薬）': { css: 'resp-ltra' },
    'キサンチン系気管支拡張薬':       { css: 'resp-xanth' },
    '抗IgE抗体（生物学的製剤）':      { css: 'resp-bio-ige' },
    '抗IL-5抗体（生物学的製剤）':     { css: 'resp-bio-il5' },
    '抗IL-5Rα抗体（生物学的製剤）':   { css: 'resp-bio-il5' },
    '抗IL-4Rα抗体（生物学的製剤）':   { css: 'resp-bio-il4' },
    'PDE4阻害薬':                     { css: 'resp-pde4' },
    'ERA（エンドセリン受容体拮抗薬）': { css: 'resp-era' },
    'PDE5阻害薬':                     { css: 'resp-pde5' },
    'プロスタサイクリン受容体作動薬（IP受容体作動薬）': { css: 'resp-pgi2' },
    '抗線維化薬':                     { css: 'resp-antifib' },
    'チロシンキナーゼ阻害薬（抗線維化薬）': { css: 'resp-antifib' },
    'P2X3受容体拮抗薬':               { css: 'resp-p2x3' },
    // 抗菌薬
    '天然ペニシリン':                      { css: 'ab-pen'    },
    '広域ペニシリン':                      { css: 'ab-pen'    },
    'βラクタマーゼ阻害薬配合ペニシリン':  { css: 'ab-pen-bli'},
    '第1世代セフェム':                     { css: 'ab-cef1'   },
    '第2世代セフェム':                     { css: 'ab-cef2'   },
    '第3世代セフェム':                     { css: 'ab-cef3'   },
    '第4世代セフェム':                     { css: 'ab-cef4'   },
    'カルバペネム':                        { css: 'ab-carba'  },
    'ペネム系':                            { css: 'ab-carba'  },
    'モノバクタム系':                      { css: 'ab-mono'   },
    'マクロライド系':                      { css: 'ab-macro'  },
    'テトラサイクリン系':                  { css: 'ab-tetra'  },
    'フルオロキノロン系':                  { css: 'ab-quin'   },
    '呼吸器キノロン':                      { css: 'ab-resp-quin' },
    'アミノグリコシド系':                  { css: 'ab-amino'  },
    'グリコペプチド系':                    { css: 'ab-glyco'  },
    'リンコサミド系':                      { css: 'ab-linco'  },
    'オキサゾリジノン系':                  { css: 'ab-oxazo'  },
    'ST合剤':                              { css: 'ab-st'     },
    '抗結核薬':                            { css: 'ab-tb'     },
    'ペプチド系抗結核薬':                  { css: 'ab-tb'     },
    'リファマイシン系':                    { css: 'ab-tb'     },
    'ホスホマイシン系':                    { css: 'ab-other'  },
    // 抗ウイルス/抗原虫薬
    'ヘリカーゼ阻害薬':                    { css: 'av-heli'   },
    'ヌクレオシド系（抗ヘルペス）':        { css: 'av-herpes' },
    'ヌクレオシド系（抗CMV）':             { css: 'av-cmv'   },
    'ヌクレオシド系（抗HIV）':             { css: 'av-hiv'   },
    'NRTI':                                { css: 'av-hiv'   },
    '抗葉酸薬':                            { css: 'av-malaria'},
    '抗マラリア薬':                        { css: 'av-malaria'},
    'ニトロイミダゾール':                  { css: 'av-nitro'  },
    '抗原虫薬':                            { css: 'av-proto'  },
    // 抗真菌薬
    'ポリエン':                            { css: 'af-poly'   },
    'トリアゾール':                        { css: 'af-triaz'  },
    'エキノカンジン':                      { css: 'af-echio'  },
    'イミダゾール':                        { css: 'af-imid'   },
    'フルシトシン':                        { css: 'af-other'  },
    'アリルアミン系':                      { css: 'af-other'  },
    'アリルアミン':                        { css: 'af-other'  },
  };
  return map[cls] || { css: 'benzo' };
}

function getRankBadge(rank) {
  if (rank.includes('第一')) return { css: 'rank-first' };
  if (rank.includes('第二')) return { css: 'rank-second' };
  return { css: 'rank-support' };
}

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ===== 比較モード関数 =====
function isCompareSelected(d) {
  return compareList.some(x => x.name === d.name && x.category === d.category);
}

function toggleCompareMode() {
  compareMode = !compareMode;
  const btn = document.getElementById('compare-toggle');
  btn.classList.toggle('active', compareMode);
  btn.setAttribute('aria-pressed', compareMode);
  if (!compareMode) {
    compareList = [];
    updateCompareBar();
  }
  render();
}

function showToast(msg, duration = 2500) {
  document.querySelector('.toast')?.remove();
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add('toast-show'));
  setTimeout(() => {
    el.classList.remove('toast-show');
    setTimeout(() => el.remove(), 300);
  }, duration);
}

function toggleCompareItem(name, cat) {
  if (compareList.length >= 4 && !compareList.some(x => x.name === name && x.category === cat)) {
    showToast('最大4剤まで比較できます');
    return;
  }
  const allDrugs = Object.values(dataCache).flat();
  const drug = allDrugs.find(d => d.name === name && d.category === cat);
  if (!drug) return;
  const idx = compareList.findIndex(x => x.name === name && x.category === cat);
  if (idx >= 0) compareList.splice(idx, 1);
  else compareList.push(drug);
  updateCompareBar();
  // 選択状態だけ差分更新（フルレンダリング不要）
  document.querySelectorAll('[data-card-name]').forEach(el => {
    const n = el.dataset.cardName, c = el.dataset.cardCat;
    const s = compareList.some(x => x.name === n && x.category === c);
    el.classList.toggle('compare-selected', s);
    const b = el.querySelector('.card-compare-btn');
    if (b) { b.classList.toggle('active', s); b.textContent = s ? '✓' : '＋'; }
  });
  document.querySelectorAll('.col-compare-btn').forEach(b => {
    const s = compareList.some(x => x.name === b.dataset.cmpName && x.category === b.dataset.cmpCat);
    b.classList.toggle('active', s);
    b.textContent = s ? '✓ 選択中' : '＋ 比較';
    b.closest('th').classList.toggle('compare-selected', s);
  });
}

function updateCompareBar() {
  const bar = document.getElementById('compare-bar');
  bar.hidden = compareList.length === 0;
  document.body.classList.toggle('compare-bar-open', compareList.length > 0);
  document.getElementById('compare-bar-chips').innerHTML = compareList.map(d =>
    `<span class="cmp-chip">${esc(d.name)}<button class="cmp-chip-x" data-cmp-name="${esc(d.name)}" data-cmp-cat="${esc(d.category)}">✕</button></span>`
  ).join('');
  document.getElementById('compare-count').textContent = `${compareList.length}/4`;
  // バーの実際の高さが確定してから余白を更新
  requestAnimationFrame(syncBottomPadding);
}

// 固定要素（免責バー + 比較バー）の実際の高さを計測して main の下余白を動的に設定
function syncBottomPadding() {
  const disclaimer = document.querySelector('.disclaimer');
  const bar        = document.getElementById('compare-bar');
  const disclaimerH = disclaimer ? disclaimer.getBoundingClientRect().height : 60;
  const barH        = (bar && !bar.hidden) ? bar.getBoundingClientRect().height : 0;
  const main = document.querySelector('.main');
  if (main) main.style.paddingBottom = `${disclaimerH + barH + 24}px`;
}

function getCompareRows(drugs) {
  const cats = [...new Set(drugs.map(d => d.category))];
  if (cats.length === 1) return getRowDefs(cats[0]);
  return COMPARE_ROWS;
}

function showComparison() {
  if (compareList.length < 2) return;
  const drugs = compareList;
  const rows  = getCompareRows(drugs);

  // 最良値を事前計算
  const bestStar = Math.max(...drugs.map(d => Number(d.efficacy_star) || 0));
  const nntVals  = drugs.map(d => typeof d.NNT === 'number' ? d.NNT : Infinity);
  const bestNnt  = Math.min(...nntVals);

  // ヘッダー
  const domainCfg = Object.values(DOMAINS).find(cfg =>
    cfg.categories.some(c => c.key === drugs[0].category)
  ) || Object.values(DOMAINS)[0];
  const headBg = domainCfg.headBg;

  const headers = drugs.map(d => {
    const badge = getClassBadge(d.class || '');
    return `<th class="cmp-drug-col">
      <div class="cmp-drug-name">${esc(d.name)}</div>
      <div class="cmp-drug-brand">${esc(d.brand || '')}</div>
      <div class="cmp-drug-cat">${esc(d.category)}</div>
      <span class="class-badge ${badge.css}">${esc(d.class || '')}</span>
    </th>`;
  }).join('');

  // 行
  const bodyRows = rows.map((def, i) => {
    const alt = i % 2 === 1;
    const cells = drugs.map(d => {
      const v = d[def.field];
      const isBest =
        (def.type === 'stars' && (Number(v) || 0) === bestStar && bestStar > 0) ||
        (def.type === 'nnt'   && typeof v === 'number' && v === bestNnt && bestNnt < Infinity);
      const inner = renderCell(d, def, '#1d4ed8');
      // renderCellが返す<td>にcmp-bestクラスを追記
      return isBest
        ? inner.replace(/^(<td[^>]*)(>)/, (_, pre, gt) =>
            pre.includes('class=')
              ? pre.replace(/class="([^"]*)"/, `class="$1 cmp-best"`) + gt
              : pre + ' class="cmp-best"' + gt)
        : inner;
    }).join('');
    const isWarn = def.label.startsWith('⚠');
    return `<tr class="${alt ? 'row-alt' : ''}${isWarn ? ' cmp-warn-row' : ''}">
      <td class="row-label sticky-col label-col cmp-label-col">${esc(def.label)}</td>
      ${cells}
    </tr>`;
  }).join('');

  const contentSection = isMobile()
    ? buildMobileCmpGrid(drugs, rows, bestStar, bestNnt)
    : `<div class="cmp-scroll-hint">← 横にスクロールして比較 →</div>
       <div class="cmp-table-wrap">
         <div class="table-wrapper">
           <table class="compare-table">
             <thead><tr>
               <th class="sticky-col label-col cmp-label-col" style="background:${headBg}">項目</th>
               ${headers}
             </tr></thead>
             <tbody>${bodyRows}</tbody>
           </table>
         </div>
       </div>`;

  const html = `
  <div class="cmp-overlay" id="cmp-overlay">
    <div class="cmp-modal">
      <div class="cmp-modal-header">
        <span class="cmp-modal-title">⚖ 薬剤比較（${drugs.length}剤）</span>
        <button class="cmp-close-btn" id="cmp-close-btn">✕ 閉じる</button>
      </div>
      ${contentSection}
      <div class="cmp-legend"><span class="cmp-best-dot"></span> その比較内での最良値</div>
    </div>
  </div>`;

  document.body.insertAdjacentHTML('beforeend', html);
  document.getElementById('cmp-close-btn').addEventListener('click', closeComparison);
  document.getElementById('cmp-overlay').addEventListener('click', e => {
    if (e.target.id === 'cmp-overlay') closeComparison();
  });
}

// モバイル用：縦スクロールのCSSグリッド比較レイアウト
function buildMobileCmpGrid(drugs, rows, bestStar, bestNnt) {
  const n = drugs.length;
  const cols = `68px ${'1fr '.repeat(n).trim()}`;

  const drugHeaders = drugs.map(d => {
    const badge = getClassBadge(d.class || '');
    return `<div class="cmpg-drug-head">
      <div class="cmpg-drug-name">${esc(d.name)}</div>
      <div class="cmpg-drug-brand">${esc(d.brand || '')}</div>
      <span class="class-badge ${badge.css} cmpg-badge">${esc(d.class || '')}</span>
    </div>`;
  }).join('');

  const rowsHTML = rows.map((def, i) => {
    const alt = i % 2 === 1;
    const isWarn = def.label.startsWith('⚠');
    const labelCell = `<div class="cmpg-label${isWarn ? ' cmpg-label-warn' : ''}">${esc(def.label)}</div>`;
    const valCells = drugs.map(d => {
      const v = d[def.field];
      const isBest =
        (def.type === 'stars' && (Number(v) || 0) === bestStar && bestStar > 0) ||
        (def.type === 'nnt'   && typeof v === 'number' && v === bestNnt && bestNnt < Infinity);
      const inner = renderCell(d, def, '#1d4ed8');
      const hasContra = inner.includes('has-contraindication');
      const content = inner.replace(/^<td[^>]*>/, '').replace(/<\/td>$/, '');
      const cls = ['cmpg-val',
        `cmpg-type-${def.type}`,
        isBest ? 'cmpg-best' : '',
        alt ? 'cmpg-alt' : '',
        hasContra ? 'has-contraindication' : ''
      ].filter(Boolean).join(' ');
      return `<div class="${cls}">${content}</div>`;
    }).join('');
    return labelCell + valCells;
  }).join('');

  return `<div class="cmp-grid-wrap">
    <div class="cmpg-grid" style="grid-template-columns:${cols}">
      <div class="cmpg-head-label">項目</div>
      ${drugHeaders}
      ${rowsHTML}
    </div>
  </div>`;
}

function closeComparison() {
  document.getElementById('cmp-overlay')?.remove();
}

// ===== イベント =====
let _resizeTimer;
let _prevWidth = window.innerWidth;
window.addEventListener('resize', () => {
  clearTimeout(_resizeTimer);
  _resizeTimer = setTimeout(() => {
    // モバイルのアドレスバー開閉（高さのみ変化）では再レンダリングしない
    if (window.innerWidth === _prevWidth) return;
    _prevWidth = window.innerWidth;
    render();
  }, 150);
});

document.querySelectorAll('.domain-btn').forEach(btn => {
  btn.addEventListener('click', () => switchDomain(btn.dataset.domain));
});
document.getElementById('search').addEventListener('input', onSearch);
document.getElementById('sort-select').addEventListener('change', onSort);
document.getElementById('compare-toggle').addEventListener('click', toggleCompareMode);
document.getElementById('compare-go-btn').addEventListener('click', showComparison);
document.getElementById('compare-clear-btn').addEventListener('click', () => {
  compareList = [];
  updateCompareBar();
  render();
});

// カード・テーブルへの委譲イベント
document.getElementById('cards').addEventListener('click', e => {
  // エビデンスリンク
  const evBtn = e.target.closest('.ev-link-btn');
  if (evBtn) {
    const panel = evBtn.nextElementSibling;
    panel.hidden = !panel.hidden;
    evBtn.classList.toggle('active', !panel.hidden);
    return;
  }
  // 使い分けポイント展開ボタン
  const ucBtn = e.target.closest('.uc-expand-btn');
  if (ucBtn) {
    const text = ucBtn.previousElementSibling;
    const nowClamped = text.classList.toggle('uc-clamp'); // true=折りたたみ, false=展開
    ucBtn.textContent = nowClamped ? '▾ 全文' : '▴ 閉じる';
    return;
  }
  // 比較ボタン（カード）
  const cmpCard = e.target.closest('.card-compare-btn');
  if (cmpCard) { toggleCompareItem(cmpCard.dataset.cmpName, cmpCard.dataset.cmpCat); return; }
  // 比較ボタン（テーブルヘッダー）
  const cmpCol = e.target.closest('.col-compare-btn');
  if (cmpCol) { toggleCompareItem(cmpCol.dataset.cmpName, cmpCol.dataset.cmpCat); return; }
});

// 比較バーのチップ削除
document.getElementById('compare-bar-chips').addEventListener('click', e => {
  const x = e.target.closest('.cmp-chip-x');
  if (x) toggleCompareItem(x.dataset.cmpName, x.dataset.cmpCat);
});

init();
