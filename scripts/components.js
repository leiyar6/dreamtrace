/* ============================================================
   components.js — 图标 + 可复用 HTML 片段
   ============================================================ */

/* ---------- 图标（线性，currentColor，lucide 风格） ---------- */
const ICONS = {
  home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/>',
  calendar: '<rect x="3" y="4" width="18" height="17" rx="3"/><path d="M3 9h18M8 2v4M16 2v4"/>',
  sparkles: '<path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z"/><path d="M19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14z"/>',
  users: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M16 5.2A3 3 0 0 1 16 11M17 14.5c2.4.4 4 2.4 4 4.8"/>',
  user: '<circle cx="12" cy="8" r="3.6"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  heart: '<path d="M12 20s-7-4.4-9.2-8.5C1.2 8.2 2.6 5 5.8 5c2 0 3.2 1.2 4.2 2.5C11 6.2 12.2 5 14.2 5c3.2 0 4.6 3.2 3 6.5C19 15.6 12 20 12 20z"/>',
  message: '<path d="M21 11.5a8 8 0 0 1-11.5 7.2L4 20l1.3-4.5A8 8 0 1 1 21 11.5z"/>',
  moon: '<path d="M20 13.5A8 8 0 1 1 10.5 4 6 6 0 0 0 20 13.5z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5 6.5 6.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19"/>',
  chevron: '<path d="m9 6 6 6-6 6"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>',
  trash: '<path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/>',
  share: '<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="m8.2 10.8 7.6-3.6M8.2 13.2l7.6 3.6"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
  pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="1.8"/><path d="m21 15-5-5L5 21"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1l2-1.6-2-3.4-2.4 1a7 7 0 0 0-1.7-1l-.4-2.5H9.6l-.4 2.5a7 7 0 0 0-1.7 1l-2.4-1-2 3.4 2 1.6a7 7 0 0 0 0 2l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 1.7 1l.4 2.5h4.8l.4-2.5a7 7 0 0 0 1.7-1l2.4 1 2-3.4-2-1.6a7 7 0 0 0 .1-1z"/>',
  bookmark: '<path d="M6 3h12v18l-6-4-6 4V3z"/>',
  star: '<path d="M12 3l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 18l-5.9 3 1.2-6.5L2.5 9.9 9 9z"/>',
  book: '<path d="M4 4h11a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3V4z"/><path d="M4 17a3 3 0 0 1 3-3h11"/>',
  chart: '<path d="M3 21h18"/><rect x="5" y="11" width="3" height="7"/><rect x="10.5" y="6" width="3" height="12"/><rect x="16" y="13" width="3" height="5"/>',
  link: '<path d="M10 13a4 4 0 0 0 6 .5l3-3a4 4 0 0 0-5.6-5.6L12 6"/><path d="M14 11a4 4 0 0 0-6-.5l-3 3a4 4 0 0 0 5.6 5.6L12 18"/>',
  cloud: '<path d="M7 18a4 4 0 0 1-.5-7.97 5.5 5.5 0 0 1 10.6-1A3.5 3.5 0 0 1 17 18H7z"/>',
  send: '<path d="M21 3 3 10.5l7 2.5 2.5 7L21 3z"/>',
  arrow: '<path d="m15 18-6-6 6-6"/>',
  arrowDown: '<path d="M12 5v14M6 13l6 6 6-6"/>',
  flame: '<path d="M12 22a7 7 0 0 0 7-7c0-5-5-7-5-12 0 0-7 3-7 10 0 0-2-1-2-4 0 0-3 3-3 7a8 8 0 0 0 10 8z"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M10.5 21a1.8 1.8 0 0 0 3 0"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  tag: '<path d="M3 11V5a2 2 0 0 1 2-2h6l9 9-8 8-9-9z"/><circle cx="7.5" cy="7.5" r="1.2"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  close: '<path d="M18 6 6 18M6 6l12 12"/>',
  refresh: '<path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 4v4h-4"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16M3 20v-4h4"/>',
  more: '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
  undo: '<path d="M9 14L4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 5 5v0a5 5 0 0 1-5 5h-6"/>'
};

export function icon(name, size = 22, cls = '') {
  const p = ICONS[name] || ICONS.sparkles;
  return `<svg class="icon ${cls}" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
}

/* ---------- 通用片段 ---------- */
export function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function avatar(seed, size = 36, initial, avatarUrl) {
  if (avatarUrl) {
    return `<div class="avatar" style="width:${size}px;height:${size}px"><img src="${esc(avatarUrl)}" alt="" onerror="this.remove()"></div>`;
  }
  const ch = initial || (seed ? seed.slice(-1) : '梦');
  return `<div class="avatar" style="width:${size}px;height:${size}px;font-size:${size * 0.42}px">${esc(ch)}</div>`;
}

export function tag(label, variant = '') {
  return `<span class="tag ${variant}">${esc(label)}</span>`;
}

export function badgeType(type) {
  return type === 'reality'
    ? `<span class="badge-type badge-reality">${icon('sun', 12)} 现实</span>`
    : `<span class="badge-type badge-dream">${icon('moon', 12)} 梦境</span>`;
}

export function sectionTitle(title, moreText = '', moreAct = '') {
  return `<div class="section-title">
    <h3>${esc(title)}</h3>
    ${moreText ? `<button class="more" data-act="${moreAct}">${esc(moreText)} ${icon('chevron', 14)}</button>` : ''}
  </div>`;
}

export function empty(emoji, text) {
  return `<div class="empty"><div class="emo">${emoji}</div><div class="txt">${esc(text)}</div></div>`;
}

/* ---------- 梦境/记录卡片 ---------- */
export function dreamCard(rec) {
  const hasAnalysis = !!rec.analysis;
  return `<article class="dream-card" data-act="open-record" data-id="${rec.id}">
    <div class="dc-head">
      ${badgeType(rec.type)}
      ${hasAnalysis ? tag('AI 已解读', 'tag-gold') : ''}
      <span class="dc-date">${formatDate(rec.date)}</span>
    </div>
    <div class="dc-title">${esc(rec.title)}</div>
    <p class="dc-excerpt">${esc(rec.content)}</p>
    <div class="dc-foot">
      ${tag(rec.mood, 'tag-pink')}
      ${(rec.tags || []).slice(0, 2).map((t) => tag(t, 'tag-ghost')).join('')}
    </div>
  </article>`;
}

/* ---------- 社区帖子卡片（封面用 CSS 渐变 + 装饰） ---------- */
const COVERS = {
  whale: 'linear-gradient(150deg,#3a4d8f,#7b68ee 55%,#9b8df8)',
  stairs: 'linear-gradient(150deg,#5c4fd6,#2b2440 60%,#9b8df8)',
  cloud: 'linear-gradient(150deg,#ffd6ef,#c9b8ff 55%,#9b8df8)',
  letter: 'linear-gradient(150deg,#2a3a6b,#6b7fd6 60%,#c9b8ff)',
  forest: 'linear-gradient(150deg,#2e6b5e,#7b68ee 50%,#e0aaff)',
  train: 'linear-gradient(150deg,#43387a,#7b68ee 60%,#ffb4e1)'
};

export function coverArt(key, label) {
  const bg = COVERS[key] || COVERS.whale;
  return `<div class="post-cover" style="background:${bg}">
    <div class="stars"><span style="left:18%;top:24%;animation-delay:0s"></span><span style="left:72%;top:30%;animation-delay:.6s"></span><span style="left:40%;top:62%;animation-delay:1.2s"></span><span style="left:84%;top:70%;animation-delay:1.8s"></span></div>
    <span class="cover-emoji">${emojiFor(key)}</span>
  </div>`;
}

function emojiFor(key) {
  const map = { whale: '🐋', stairs: '🌀', cloud: '☁️', letter: '✉️', forest: '🌲', train: '🚆' };
  return map[key] || '🌙';
}

export function postCard(post) {
  return `<article class="post-card" data-act="open-post" data-id="${post.id}">
    ${coverArt(post.cover)}
    <div class="post-body">
      <div class="pt-title">${esc(post.title)}</div>
      <p class="pt-excerpt">${esc(post.excerpt)}</p>
      <div class="post-author">
        ${avatar(post.avatarSeed, 22, null, post.avatarUrl)}
        <span class="nm">${esc(post.authorName)}</span>
        <span class="grow"></span>
        <span class="nm">${timeAgo(post.createdAt)}</span>
      </div>
      <div class="post-stats">
        <span class="${post.likedByMe ? 'on heart' : ''}">${icon('heart', 13)} ${post.likes}</span>
        <span>${icon('message', 13)} ${post.comments.length}</span>
        <span class="${post.relatedByMe ? 'on' : ''}">${icon('moon', 13)} ${post.alsoDreamed} 也梦到</span>
      </div>
    </div>
  </article>`;
}

/* ---------- 日期/时间工具 ---------- */
export function formatDate(dateStr, withWeek = false) {
  const dt = new Date(dateStr + (dateStr.length === 10 ? 'T00:00:00' : ''));
  const m = dt.getMonth() + 1;
  const d = dt.getDate();
  const base = `${m}月${d}日`;
  if (!withWeek) return base;
  const w = ['日', '一', '二', '三', '四', '五', '六'][dt.getDay()];
  return `${base} 周${w}`;
}

export function timeAgo(ts) {
  const diff = Date.now() - ts;
  const h = Math.floor(diff / 3600000);
  if (h < 1) return '刚刚';
  if (h < 24) return `${h}小时前`;
  const d = Math.floor(h / 24);
  return `${d}天前`;
}

/* 数字格式化 */
export function numFmt(n) {
  return n >= 1000 ? (n / 1000).toFixed(1) + 'k' : String(n);
}
