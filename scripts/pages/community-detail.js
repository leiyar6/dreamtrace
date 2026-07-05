/* ============================================================
   pages/community-detail.js — 社区详情页
   ============================================================ */

import { getPost } from '../repository.js';
import { getState } from '../state.js';
import { icon, avatar, tag, timeAgo, esc } from '../components.js';

const COVER_MAP = {
  whale: 'linear-gradient(150deg,#3a4d8f,#7b68ee 55%,#9b8df8)',
  stairs: 'linear-gradient(150deg,#5c4fd6,#2b2440 60%,#9b8df8)',
  cloud: 'linear-gradient(150deg,#ffd6ef,#c9b8ff 55%,#9b8df8)',
  letter: 'linear-gradient(150deg,#2a3a6b,#6b7fd6 60%,#c9b8ff)',
  forest: 'linear-gradient(150deg,#2e6b5e,#7b68ee 50%,#e0aaff)',
  train: 'linear-gradient(150deg,#43387a,#7b68ee 60%,#ffb4e1)',
  moon: 'linear-gradient(150deg,#2b2a52,#5c4fd6 55%,#e0aaff)',
  door: 'linear-gradient(150deg,#1f1b40,#7b68ee 50%,#ffd6ef)',
  star: 'linear-gradient(150deg,#2a3a6b,#9b8df8 60%,#ffd6ef)',
  deer: 'linear-gradient(150deg,#2e6b5e,#5c4fd6 55%,#c9b8ff)',
  castle: 'linear-gradient(150deg,#3a4d8f,#9b8df8 60%,#ffd6ef)',
  shadow: 'linear-gradient(150deg,#2b2a52,#7b68ee 60%,#e0aaff)'
};

function bigCover(p) {
  /* 有真实图片时优先展示图片 */
  if (p.imageUrl) {
    return `<div class="pd-cover pd-cover-img">
      <img src="${esc(p.imageUrl)}" alt="${esc(p.title)}" onerror="this.parentElement.classList.remove('pd-cover-img');this.remove()">
    </div>`;
  }
  const bg = COVER_MAP[p.cover] || COVER_MAP.whale;
  const emojiMap = { whale:'🐋', stairs:'🌀', cloud:'☁️', letter:'✉️', forest:'🌲', train:'🚆', moon:'🌙', door:'🚪', star:'⭐', deer:'🦌', castle:'🏰', shadow:'👤' };
  return `<div class="pd-cover" style="background:${bg}">
    <div class="pd-cover-stars">
      <span style="left:18%;top:24%;animation-delay:0s"></span>
      <span style="left:72%;top:30%;animation-delay:.6s"></span>
      <span style="left:40%;top:62%;animation-delay:1.2s"></span>
      <span style="left:84%;top:70%;animation-delay:1.8s"></span>
    </div>
    <span class="pd-cover-emoji">${emojiMap[p.cover] || '🌙'}</span>
  </div>`;
}

export function render(params) {
  const id = params?.[0];
  const p = getPost(id);
  if (!p) {
    return `<div class="page"><div class="empty"><div class="emo">🌫️</div><div class="txt">帖子不存在或已删除</div>
      <button class="btn btn-ghost btn-sm" data-act="back">返回</button></div></div>`;
  }

  // 判断是否为当前用户的帖子
  const isMine = p.id.startsWith('me_');
  const currentUser = getState().user;

  return `
  <div class="post-detail page">
    <!-- 顶部行：返回 + 作者信息 + (分享/更多) -->
    <header class="pd-top-bar">
      <button class="btn-icon" data-act="back" aria-label="返回">${icon('arrow', 20)}</button>
      <div class="pd-top-author">
        ${avatar(p.avatarSeed, 34, null, p.avatarUrl)}
        <div class="pd-top-info">
          <div class="pd-name">${esc(p.authorName)}${isMine ? ' <span class="pd-mine-tag">我</span>' : ''}</div>
          <div class="pd-time">${esc(timeAgo(p.createdAt))} · ${esc(p.mood || '')}</div>
        </div>
      </div>
      ${isMine
        ? `<button class="btn-icon" data-act="pd-more" data-id="${p.id}" aria-label="更多操作">${icon('more', 20)}</button>`
        : `<button class="btn-icon" data-act="com-share" aria-label="分享">${icon('share', 18)}</button>`}
    </header>

    <!-- 大封面 -->
    ${bigCover(p)}

    <h1 class="pd-title serif">${esc(p.title)}</h1>
    <div class="pd-body">${esc(p.content)}</div>

    ${p.tags?.length ? `<div class="pd-tags">${p.tags.map((t) => tag(t)).join('')}</div>` : ''}

    <!-- 互动栏 -->
    <div class="action-bar pd-actions">
      <button class="act-btn heart ${p.likedByMe ? 'on' : ''}" data-act="like-post" data-id="${p.id}">
        ${icon('heart', 18)} <span class="act-num">${p.likes}</span>
      </button>
      <button class="act-btn" data-act="com-focus-comment">
        ${icon('message', 18)} <span class="act-num">${p.comments.length}</span>
      </button>
      <button class="act-btn ${p.relatedByMe ? 'on' : ''}" data-act="also-dream" data-id="${p.id}">
        ${icon('moon', 18)} <span class="act-num">${p.alsoDreamed}</span> 也梦到
      </button>
    </div>

    <!-- 评论区 -->
    <div class="section-title" id="commentArea"><h3>评论 · ${p.comments.length}</h3></div>
    <div class="comment-input">
      ${avatar(currentUser.avatarSeed || '梦', 34, null, currentUser.avatarUrl)}
      <textarea id="commentInput" class="textarea" rows="1" placeholder="写下你的共鸣或解读…"></textarea>
      <button class="btn btn-primary btn-sm" data-act="comment-submit" data-id="${p.id}">${icon('send', 15)}</button>
    </div>

    <div class="comment-list">
      ${p.comments.length
        ? p.comments.map((c) => `
            <div class="comment-item">
              ${avatar(c.avatarSeed, 32, null, c.avatarUrl)}
              <div class="grow">
                <div class="ci-head"><span class="ci-name">${esc(c.name)}</span><span class="ci-time">${esc(timeAgo(c.createdAt))}</span></div>
                <div class="ci-text">${esc(c.content)}</div>
              </div>
            </div>`).join('')
        : `<div class="empty" style="padding:24px"><div class="emo">💭</div><div class="txt">还没有评论，留下第一个共鸣</div></div>`}
    </div>

    <p class="page-foot muted">梦迹 DreamTrace  · 用梦境照亮白天</p>
  </div>`;
}
