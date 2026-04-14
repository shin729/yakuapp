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
    defaultCat: '心房細動（レートコントロール）',
    headBg:       'linear-gradient(180deg, #fff1f2 0%, #ffe4e6 100%)',
    stickyBg:     '#fff1f2',
    rowAltBg:     '#fffbfb',
    rowAltSticky: '#ffeef0',
    accentColor:  '#be123c',
  },
};

// ===== Vaughan Williams分類マップ（薬剤名 → VWクラスキー） =====
const VW_CLASS_MAP = {
  'シベンゾリン':              'VW_Ia',
  'リドカイン（静注）':        'VW_Ib',
  'メキシレチン':              'VW_Ib',
  'フレカイニド':              'VW_Ic',
  'ピルジカイニド':            'VW_Ic',
  'ビソプロロール':            'VW_II',
  'メトプロロール':            'VW_II',
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

// カテゴリ → ドメインのマップ（全体検索で使用）
const CAT_TO_DOMAIN = {};
Object.entries(DOMAINS).forEach(([dk, cfg]) => {
  cfg.categories.forEach(c => { CAT_TO_DOMAIN[c.key] = dk; });
});

let dataCache = {};
let currentDomain   = 'sleep';
let currentCategory = '睡眠薬';
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
  const cfg = DOMAINS[currentDomain];
  const tabsEl = document.getElementById('cat-tabs');
  tabsEl.innerHTML = cfg.categories.map(c => `
    <button class="tab-btn${c.key === currentCategory ? ' active' : ''}" data-cat="${c.key}" role="tab">
      ${c.label}
    </button>`).join('');
  tabsEl.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchCat(btn.dataset.cat));
  });
}

// ===== ドメイン切り替え =====
function switchDomain(domain) {
  currentDomain   = domain;
  currentCategory = DOMAINS[domain].defaultCat;
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
  const drugs  = (dataCache[currentDomain] || []).filter(d =>
    currentCategory.startsWith('VW_')
      ? VW_CLASS_MAP[d.name] === currentCategory
      : d.category === currentCategory
  );
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
  return `<div class="card-detail-row"><span class="cd-label">${esc(label)}</span><span class="cd-val cd-evidence">${esc(d.evidence || '')}${linkBtn}</span></div>`;
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

// 非オピオイド・弱オピオイド・神経障害性疼痛
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

function getRowDefs(category) {
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
    'リチウム塩':                     { css: 'lithium' },
    '脂肪酸系気分安定薬':             { css: 'mood-stable' },
    '気分安定薬（Na+チャネル遮断薬）':{ css: 'mood-stable' },
    '気分安定薬（グルタミン酸調節薬）':{ css: 'mood-stable' },
    'コリンエステラーゼ阻害薬（AChEI）':      { css: 'ache-i' },
    'コリンエステラーゼ阻害薬（AChEI/BuChEI）':{ css: 'ache-i' },
    'コリンエステラーゼ阻害薬（AChEI）＋APL': { css: 'ache-i' },
    'NMDA受容体拮抗薬':               { css: 'nmda-ant' },
    'α2δリガンド（カルシウムチャネル調節薬）': { css: 'alpha2delta' },
    'α2δリガンド（第2世代）':        { css: 'alpha2delta' },
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
