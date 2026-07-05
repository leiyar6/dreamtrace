/* ============================================================
   pages/profile.js — 我的（个人中心）
   ============================================================ */

import { getState } from '../state.js';
import { icon, avatar, esc } from '../components.js';

/* 核心数据统计项 */
function buildCoreStats(user, posts) {
  const p = user.profile || {};
  const mine = posts.filter((it) => it.id.startsWith('me_'));
  const communityLikes = mine.reduce((s, it) => s + it.likes, 0);
  return [
    { num: p.totalDreams ?? 0, label: '累计记梦', ico: 'moon', act: 'stat-dreams' },
    { num: p.streakDays ?? 0, label: '连续记梦', ico: 'sparkle', act: 'stat-streak' },
    { num: p.aiAnalysisCount ?? 0, label: 'AI 分析', ico: 'sparkles', act: 'stat-ai' },
    { num: p.communityLikes ?? communityLikes, label: '社区获赞', ico: 'heart', act: 'stat-likes' }
  ];
}

/* 菜单项 */
const MENU = [
  { ico: 'heart', title: '我的收藏', act: 'menu-favorites' },
  { ico: 'lock', title: '隐私设置', act: 'menu-privacy' },
  { ico: 'bell', title: '消息中心', act: 'menu-message' },
  { ico: 'settings', title: '系统设置', act: 'menu-system' },
  { ico: 'sparkles', title: '关于梦迹', act: 'menu-about' }
];

export function render() {
  const { user, posts } = getState();
  const coreStats = buildCoreStats(user, posts);

  return `
  <div class="profile page pad-fab">
    <!-- 顶部标题栏 -->
    <header class="pf-page-head">
      <h1 class="serif pf-page-title">我的</h1>
      <button class="pf-notify" data-act="profile-notify" aria-label="通知">
        ${icon('bell', 20)}
      </button>
    </header>

    <!-- 个人资料卡 -->
    <section class="pf-profile-card">
      <div class="pf-avatar">${avatar(user.avatarSeed || '梦', 64, null, user.avatarUrl)}</div>
      <div class="pf-profile-body">
        <h2 class="serif pf-nickname">${esc(user.nickname)}</h2>
        <p class="pf-bio">${esc(user.bio)}</p>
        <button class="pf-edit-btn" data-act="profile-edit">编辑资料</button>
      </div>
    </section>

    <!-- 数据统计栏 -->
    <div class="pf-stats-card">
      ${coreStats.map((it) => `
        <button class="pf-stat" data-act="${it.act}">
          <div class="pf-stat-num">${it.num}</div>
          <div class="pf-stat-label">${esc(it.label)}</div>
        </button>`).join('')}
    </div>

    <!-- 功能菜单列表 -->
    <section class="pf-panel">
      <div class="pf-menu-list">
        ${MENU.map((r, i) => `
          <button class="pf-menu-item ${i === MENU.length - 1 ? 'last' : ''}" data-act="${r.act}">
            <span class="pf-menu-ico">${icon(r.ico, 18)}</span>
            <span class="pf-menu-title">${esc(r.title)}</span>
            <span class="pf-menu-chev">${icon('chevron', 18, 'mute')}</span>
          </button>`).join('')}
      </div>
    </section>

    <p class="profile-foot muted">梦迹 DreamTrace  · 用梦境照亮白天</p>
  </div>`;
}
