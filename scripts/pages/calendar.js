/* ============================================================
   pages/calendar.js — 梦境日历
   ============================================================ */

import { getState, setState, todayStr } from '../state.js';
import { recordsByDate, recordsMarkersByDate } from '../repository.js';
import { icon, badgeType, tag, empty, esc } from '../components.js';

let cursor = new Date(); // 当前展示月份

const WEEK = ['日', '一', '二', '三', '四', '五', '六'];
const MONTH_CN = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

/* 农历日名 */
const LUNAR_DAY = [
  '初一','初二','初三','初四','初五','初六','初七','初八','初九','初十',
  '十一','十二','十三','十四','十五','十六','十七','十八','十九','二十',
  '廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十'
];

/* 农历月初映射表（近似值，用于 mock 演示，覆盖 2025-2027 主要月份） */
const LUNAR_MONTH_START = [
  { first: '2025-01-29', m: '腊' },
  { first: '2025-02-28', m: '正' },
  { first: '2025-03-29', m: '二' },
  { first: '2025-04-28', m: '三' },
  { first: '2025-05-27', m: '四' },
  { first: '2025-06-25', m: '五' },
  { first: '2025-07-25', m: '六' },
  { first: '2025-08-23', m: '七' },
  { first: '2025-09-22', m: '八' },
  { first: '2025-10-21', m: '九' },
  { first: '2025-11-20', m: '十' },
  { first: '2025-12-20', m: '冬' },
  { first: '2026-01-19', m: '腊' },
  { first: '2026-02-17', m: '正' },
  { first: '2026-03-19', m: '二' },
  { first: '2026-04-17', m: '三' },
  { first: '2026-05-16', m: '四' },
  { first: '2026-06-14', m: '五' },
  { first: '2026-07-14', m: '六' },
  { first: '2026-08-13', m: '七' },
  { first: '2026-09-11', m: '八' },
  { first: '2026-10-10', m: '九' },
  { first: '2026-11-09', m: '十' },
  { first: '2026-12-08', m: '冬' },
  { first: '2027-01-07', m: '腊' },
  { first: '2027-02-06', m: '正' }
];

/* 取某公历日期对应的农历日名（如"初一"），无匹配返回空串 */
function lunarOf(dateStr) {
  let last = null;
  for (const item of LUNAR_MONTH_START) {
    if (item.first <= dateStr) last = item;
    else break;
  }
  if (!last) return '';
  const dt = new Date(dateStr + 'T00:00:00');
  const first = new Date(last.first + 'T00:00:00');
  const diff = Math.round((dt - first) / 86400000);
  if (diff < 0 || diff >= 30) return '';
  return LUNAR_DAY[diff];
}

export function shift(delta) {
  cursor = new Date(cursor.getFullYear(), cursor.getMonth() + delta, 1);
}
export function goToday() {
  const t = new Date();
  cursor = new Date(t.getFullYear(), t.getMonth(), 1);
  setState({ selectedDate: todayStr() });
}

function ymd(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function isFuture(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dateStr + 'T00:00:00') > today;
}

function buildGrid() {
  const y = cursor.getFullYear();
  const m = cursor.getMonth();
  const firstDay = new Date(y, m, 1).getDay();
  const days = new Date(y, m + 1, 0).getDate();
  const markers = recordsMarkersByDate();
  const todayStr2 = todayStr();
  const selected = getState().selectedDate;

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push('<li class="cell blank"></li>');
  for (let day = 1; day <= days; day++) {
    const ds = ymd(y, m, day);
    const mk = markers[ds];
    const isToday = ds === todayStr2;
    const isSel = ds === selected;
    const dots = [];
    if (mk?.dream) dots.push('<span class="dot dream"></span>');
    if (mk?.reality) dots.push('<span class="dot reality"></span>');
    cells.push(`<li class="cell${isSel ? ' sel' : ''}${isToday ? ' today' : ''}" data-act="calendar-day" data-date="${ds}">
      <span class="cell-num">${day}</span>
      <span class="cell-lunar">${isToday ? '今天' : lunarOf(ds)}</span>
      ${dots.length ? `<span class="cell-dots">${dots.join('')}</span>` : ''}
    </li>`);
  }
  return cells.join('');
}

function recordCard(r) {
  return `<article class="cci${r.imageUrl ? '' : ' no-cover'}" data-act="open-record" data-id="${r.id}">
    ${r.imageUrl ? `<div class="cci-cover">
      <img src="${esc(r.imageUrl)}" alt="" onerror="this.parentElement.style.display='none';this.closest('.cci').classList.add('no-cover')">
    </div>` : ''}
    <div class="cci-body">
      <div class="cci-head">
        ${badgeType(r.type)}
        <span class="cci-title">${esc(r.title)}</span>
      </div>
      <p class="cci-excerpt">${esc(r.content.slice(0, 60))}${r.content.length > 60 ? '…' : ''}</p>
    </div>
  </article>`;
}

function formatListDate(dateStr) {
  const dt = new Date(dateStr + 'T00:00:00');
  const m = dt.getMonth() + 1;
  const d = dt.getDate();
  const lunar = lunarOf(dateStr);
  return lunar ? `${m}月${d}日 · ${lunar}` : `${m}月${d}日`;
}

export function render() {
  const selected = getState().selectedDate;
  const list = recordsByDate(selected);
  const y = cursor.getFullYear();
  const m = cursor.getMonth();
  const future = isFuture(selected);

  return `
  <div class="cal page pad-fab">
    <!-- 顶部标题区 -->
    <header class="cal-hero">
      <div class="cal-hero-text">
        <h1 class="serif cal-hero-title">梦境日历</h1>
        <p class="cal-hero-sub">每一梦，都是心灵的宿客 ✨</p>
      </div>
      <button class="cal-add" data-act="calendar-new" aria-label="新增记录">${icon('plus', 22)}</button>
    </header>

    <!-- 日历卡片 -->
    <section class="cal-card">
      <div class="cal-month">
        <button class="cal-month-btn" data-act="calendar-prev" aria-label="上一月">${icon('chevron', 18, 'flip')}</button>
        <h2 class="serif cal-month-title">${y}年${MONTH_CN[m]}月</h2>
        <button class="cal-month-btn" data-act="calendar-next" aria-label="下一月">${icon('chevron', 18)}</button>
      </div>
      <ul class="cal-weekdays">${WEEK.map((w) => `<li>${w}</li>`).join('')}</ul>
      <ul class="cal-cells">${buildGrid()}</ul>
      <div class="cal-legend">
        <span class="lg"><span class="dot dream"></span>梦境记录</span>
        <span class="lg"><span class="dot reality"></span>现实记录</span>
      </div>
    </section>

    <!-- 记录列表标题区 -->
    <div class="cal-list-head">
      <h3 class="cal-list-date">${esc(formatListDate(selected))}</h3>
      ${future
        ? '<span class="cal-list-tag future">未来日期</span>'
        : `<span class="cal-list-tag">${list.length} 条记录</span>`}
    </div>

    <!-- 记录列表 -->
    ${future
      ? empty('🌙', '该日期还尚未到来哦～')
      : list.length
        ? `<div class="cal-list">${list.map(recordCard).join('')}</div>`
        : empty('🌙', '暂无记录，点击右上角 + 新建')}

    <p class="page-foot muted">梦迹 DreamTrace  · 用梦境照亮白天</p>
  </div>`;
}
