/* ============================================================
   pages/community.js — 梦境社区
   ============================================================ */

import { getState, setState } from '../state.js';
import { icon, avatar, empty, esc, timeAgo } from '../components.js';

const FILTERS = [
  { key: 'recommend', label: '推荐' },
  { key: 'latest', label: '最新' },
  { key: 'liked', label: '我点赞的' },
  { key: 'mine', label: '我发布的' }
];

/* 帖子封面（渐变 + emoji） */
const COVER_MAP = {
  whale: { bg: 'linear-gradient(150deg,#3a4d8f,#7b68ee 55%,#9b8df8)', emoji: '🐋' },
  stairs: { bg: 'linear-gradient(150deg,#5c4fd6,#2b2440 60%,#9b8df8)', emoji: '🌀' },
  cloud: { bg: 'linear-gradient(150deg,#ffd6ef,#c9b8ff 55%,#9b8df8)', emoji: '☁️' },
  letter: { bg: 'linear-gradient(150deg,#2a3a6b,#6b7fd6 60%,#c9b8ff)', emoji: '✉️' },
  forest: { bg: 'linear-gradient(150deg,#2e6b5e,#7b68ee 50%,#e0aaff)', emoji: '🌲' },
  train: { bg: 'linear-gradient(150deg,#43387a,#7b68ee 60%,#ffb4e1)', emoji: '🚆' },
  moon: { bg: 'linear-gradient(150deg,#2b2a52,#5c4fd6 55%,#e0aaff)', emoji: '🌙' },
  door: { bg: 'linear-gradient(150deg,#1f1b40,#7b68ee 50%,#ffd6ef)', emoji: '🚪' },
  star: { bg: 'linear-gradient(150deg,#2a3a6b,#9b8df8 60%,#ffd6ef)', emoji: '⭐' },
  deer: { bg: 'linear-gradient(150deg,#2e6b5e,#5c4fd6 55%,#c9b8ff)', emoji: '🦌' },
  castle: { bg: 'linear-gradient(150deg,#3a4d8f,#9b8df8 60%,#ffd6ef)', emoji: '🏰' },
  shadow: { bg: 'linear-gradient(150deg,#2b2a52,#7b68ee 60%,#e0aaff)', emoji: '👤' }
};

function coverOf(p) {
  /* 有真实图片时优先展示图片 */
  if (p.imageUrl) {
    return `<div class="pc-cover pc-cover-img">
      <img src="${esc(p.imageUrl)}" alt="" onerror="this.parentElement.className='pc-cover';this.remove()">
    </div>`;
  }
  const c = COVER_MAP[p.cover] || COVER_MAP.whale;
  return `<div class="pc-cover" style="background:${c.bg}">
    <div class="pc-stars">
      <span style="left:18%;top:24%;animation-delay:0s"></span>
      <span style="left:72%;top:30%;animation-delay:.6s"></span>
      <span style="left:40%;top:62%;animation-delay:1.2s"></span>
    </div>
    <span class="pc-emoji">${c.emoji}</span>
  </div>`;
}

/* 筛选帖子 */
function filterPosts(posts, filter, user) {
  const uid = user.id;
  if (filter === 'liked') return posts.filter((p) => p.likedByMe);
  if (filter === 'mine') return posts.filter((p) => p.isMine || p.authorId === uid || p.id.startsWith('me_'));
  if (filter === 'latest') return [...posts].sort((a, b) => b.createdAt - a.createdAt);
  // recommend：默认顺序
  return posts;
}

export function render() {
  const { filter: rawFilter, posts, user } = getState();
  const filter = rawFilter || 'recommend';
  const list = filterPosts(posts, filter, user);

  return `
  <div class="community page pad-fab">
    <!-- 顶部标题区 -->
    <header class="com-page-head">
      <h1 class="serif com-page-title">社区</h1>
      <div class="com-page-actions">
        <button class="com-icon-btn" data-act="com-search" aria-label="搜索">${icon('search', 20)}</button>
        <button class="com-icon-btn" data-act="com-notice" aria-label="通知">
          ${icon('bell', 20)}
        </button>
      </div>
    </header>

    <!-- 分类标签 -->
    <div class="com-tabs h-scroll">
      ${FILTERS.map((f) => `
        <button class="com-tab ${filter === f.key ? 'on' : ''}" data-act="community-filter" data-cat="${f.key}">${esc(f.label)}</button>`).join('')}
    </div>

    <!-- 瀑布流 -->
    ${list.length
      ? `<div class="post-grid">
          ${list.map((p) => postCard(p, user)).join('')}
        </div>`
      : emptyState(filter)}

    <p class="page-foot muted">梦迹 DreamTrace  · 用梦境照亮白天</p>
  </div>`;
}

function postCard(p, user) {
  const mine = p.isMine || p.authorId === user.id || p.id.startsWith('me_');
  return `<article class="post-card" data-act="open-post" data-id="${p.id}">
    ${coverOf(p)}
    <div class="post-body">
      <p class="pc-excerpt">${esc(p.excerpt || p.content.slice(0, 38))}</p>
      <div class="pc-author">
        ${avatar(p.avatarSeed, 22, null, p.avatarUrl)}
        <span class="pc-name">${esc(p.authorName)}${mine ? ' · 我' : ''}</span>
        <span class="grow"></span>
        <button class="pc-like ${p.likedByMe ? 'on' : ''}" data-act="like-post" data-id="${p.id}" aria-label="点赞">
          ${icon('heart', 15)}
          <span class="pc-like-num">${p.likes}</span>
        </button>
      </div>
    </div>
  </article>`;
}

function emptyState(filter) {
  const map = {
    liked: { emoji: '💭', text: '还没有点赞过梦境' },
    mine: { emoji: '✍️', text: '你还没有发布过梦境' },
    latest: { emoji: '🌌', text: '暂无最新内容' },
    recommend: { emoji: '🌌', text: '暂无内容' }
  };
  const e = map[filter] || map.recommend;
  return empty(e.emoji, e.text);
}

/* 悬浮发布按钮（仅在社区页显示） */
export function afterRender() {
  // FAB 已由 app.js 统一处理
}

/* 处理筛选切换 */
export function setFilter(key) {
  setState({ filter: key });
}
