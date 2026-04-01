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

// ===== Init =====
async function init() {
  await Promise.allSettled(
    Object.entries(DOMAINS).map(async ([key, cfg]) => {
      const res = await fetch(cfg.file);
      dataCache[key] = await res.json();
    })
  );
  renderDomainTabs();
  renderCatTabs();
  render();
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
      return arr.sort((a, b) => {
        const s = r => r.includes('第一') ? 0 : r.includes('第二') ? 1 : 2;
        return s(a.guideline_rank) - s(b.guideline_rank);
      });
    case 'name-asc':
      return arr.sort((a, b) => a.name.localeCompare(b.name, 'ja'));
    default: return arr;
  }
}

// ===== Render =====
function render() {
  searchQuery ? renderGlobalSearch() : renderDomainView();
}

// ===== 通常ビュー（ドメイン・カテゴリ別） =====
function renderDomainView() {
  const drugs  = (dataCache[currentDomain] || []).filter(d => d.category === currentCategory);
  const sorted = sortDrugs(drugs);
  const cfg    = DOMAINS[currentDomain];

  document.getElementById('result-info').textContent = `${sorted.length} 件表示中`;

  const container = document.getElementById('cards');
  if (sorted.length === 0) {
    container.innerHTML = noResultsHTML();
    return;
  }
  container.innerHTML = `<div class="table-wrapper">${buildTable(sorted, cfg, currentCategory)}</div>`;
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
    return `
      <div class="search-group">
        <div class="search-group-header">
          ${label}
          <span class="group-count">${sorted.length}件</span>
        </div>
        <div class="table-wrapper">${buildTable(sorted, domCfg, key)}</div>
      </div>`;
  }).join('');
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
    return `
      <th style="background:${cfg.headBg}">
        <div class="col-name">${esc(d.name)}</div>
        <div class="col-brand">${esc(d.brand)}</div>
        <span class="class-badge ${badge.css}">${esc(d.class)}</span>
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
    { label: '推奨度',         field: 'guideline_rank', type: 'rank'  },
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
    { label: '推奨度',         field: 'guideline_rank', type: 'rank'  },
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
  { label: '推奨度',         field: 'guideline_rank', type: 'rank'  },
  { label: 'エビデンス出典', field: 'evidence',       type: 'evidence'},
  { label: '⚠ 注意事項',    field: 'caution',        type: 'caution'},
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
  { label: '推奨度',         field: 'guideline_rank', type: 'rank'  },
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
  { label: '推奨度',             field: 'guideline_rank', type: 'rank'  },
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
  { label: '推奨度',               field: 'guideline_rank', type: 'rank'  },
  { label: 'エビデンス出典',       field: 'evidence',       type: 'evidence'},
  { label: '⚠ 注意事項',          field: 'caution',        type: 'caution'},
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
  { label: '推奨度',           field: 'guideline_rank', type: 'rank'  },
  { label: 'エビデンス出典',   field: 'evidence',       type: 'evidence'},
  { label: '⚠ 注意事項',      field: 'caution',        type: 'caution'},
];

function getRowDefs(category) {
  if (ROW_DEFS[category]) return ROW_DEFS[category];
  if (['抗精神病薬（定型）', '抗精神病薬（非定型）', '抗うつ薬', '気分安定薬', '認知症治療薬'].includes(category))
    return PSYCH_ROWS;
  if (category === '片頭痛') return MIGRAINE_ROWS;
  if (category === '抗てんかん薬') return EPILEPSY_ROWS;
  if (category === 'パーキンソン病治療薬') return PARKINSON_ROWS;
  return PAIN_ROWS; // 非オピオイド系・弱オピオイド・神経障害性疼痛
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
    case 'rank':     return rankCell(s);
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

function rankCell(rank) {
  return `<td><span class="rank-badge ${getRankBadge(rank).css}">${esc(rank)}</span></td>`;
}

function cautionCell(text) {
  return `<td class="caution-cell">${esc(text)}</td>`;
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
    'トリプタン系（5-HT1B/1D作動薬）':{ css: 'triptan' },
    'ジタン系（5-HT1F作動薬）':       { css: 'ditan' },
    'CGRP受容体拮抗抗体':             { css: 'cgrp-ab' },
    'Na+チャネル遮断薬（抗てんかん）':{ css: 'na-channel-b' },
    'SV2A結合薬':                     { css: 'sv2a-b' },
    '多作用機序型抗てんかん薬':       { css: 'multi-aed' },
    'Na+チャネル遮断薬（緩徐な不活性化増強）': { css: 'na-channel-b' },
    '脂肪酸系抗てんかん薬':           { css: 'mood-stable' },
    'ドパミン前駆体':                 { css: 'levodopa-sys' },
    '非麦角系ドパミン作動薬':         { css: 'da-agonist' },
    '非麦角系ドパミン作動薬（経皮）': { css: 'da-agonist' },
    'MAO-B阻害薬':                    { css: 'mao-comt-i' },
    'COMT阻害薬':                     { css: 'mao-comt-i' },
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

// ===== イベント =====
document.querySelectorAll('.domain-btn').forEach(btn => {
  btn.addEventListener('click', () => switchDomain(btn.dataset.domain));
});
document.getElementById('search').addEventListener('input', onSearch);
document.getElementById('sort-select').addEventListener('change', onSort);
document.getElementById('cards').addEventListener('click', e => {
  const btn = e.target.closest('.ev-link-btn');
  if (!btn) return;
  const panel = btn.nextElementSibling;
  panel.hidden = !panel.hidden;
  btn.classList.toggle('active', !panel.hidden);
});

init();
