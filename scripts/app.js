/* ============================================================
   app.js — 应用入口
   职责：初始化数据 / 底部导航 / 路由分发 / 全局事件委托 / FAB
   ============================================================ */

import { initData, getRecord, getPost, deleteRecord, toggleLike, toggleAlsoDreamed,
  addComment, publishRecordToCommunity, updatePost, deletePost, unpublishPost, publishNewPost, updateUser } from './repository.js';
import { startRouter, navigate, onRouteChange } from './router.js';
import { setState, getState, todayStr } from './state.js';
import { showToast, confirmDialog, infoDialog } from './feedback.js';
import { icon } from './components.js';
import { openRecordSheet } from './pages/record.js';

import * as home from './pages/home.js';
import * as calendar from './pages/calendar.js';
import * as ai from './pages/ai.js';
import * as community from './pages/community.js';
import * as profile from './pages/profile.js';
import * as detail from './pages/detail.js';
import * as aiAnalysis from './pages/ai-analysis.js';
import * as communityDetail from './pages/community-detail.js';

const PAGES = {
  home, calendar, ai, community, profile,
  detail, 'ai-analysis': aiAnalysis, post: communityDetail
};

const NAV = [
  { route: 'home', label: '首页', icon: 'home' },
  { route: 'calendar', label: '日历', icon: 'calendar' },
  { route: 'ai', label: 'AI梦境', icon: 'sparkles', center: true },
  { route: 'community', label: '社区', icon: 'users' },
  { route: 'profile', label: '我的', icon: 'user' }
];

const FAB_ROUTES = new Set();

let current = { name: 'home', params: [] };
let fabEl = null;

/* ---------- 渲染 ---------- */
function renderPage(name, params = []) {
  const app = document.getElementById('app');
  app.scrollTop = 0;
  if (current.page && current.page.beforeLeave) current.page.beforeLeave();
  app.style.cssText = '';
  const page = PAGES[name] || home;
  app.innerHTML = page.render(params);
  if (page.afterRender) page.afterRender(app);
  current = { name, params, page };
  updateNav(name);
  updateFab(name);
  updateStatusBar(name);
}

/* 日历 / AI 页面：状态栏背景匹配页面蓝紫色 */
function updateStatusBar(name) {
  const sb = document.querySelector('.status-bar');
  if (!sb) return;
  sb.classList.remove('on-cal', 'on-ai', 'on-zg');
  if (name === 'calendar') sb.classList.add('on-cal');
  else if (name === 'ai') sb.classList.add('on-ai');
  else if (name === 'ai-analysis') sb.classList.add('on-zg');
}

function renderCurrent() {
  renderPage(current.name, current.params);
}

/* ---------- 底部导航 ---------- */
function renderNav() {
  const nav = document.getElementById('bottomNav');
  nav.innerHTML = NAV.map((n) => {
    return `<button class="nav-item${n.center ? ' nav-ai' : ''}" data-act="nav" data-route="${n.route}" aria-label="${n.label}">
      <span class="nav-ico">${icon(n.icon, 22)}</span>
      <span class="nav-label">${n.label}</span>
    </button>`;
  }).join('');
}

function updateNav(name) {
  const map = { 'ai-analysis': 'ai', detail: 'calendar', post: 'community' };
  const active = map[name] || name;
  document.querySelectorAll('.nav-item').forEach((el) => {
    el.classList.toggle('active', el.dataset.route === active);
  });
}

/* ---------- 悬浮记录按钮 ---------- */
function buildFab() {
  fabEl = document.createElement('button');
  fabEl.className = 'fab';
  fabEl.innerHTML = icon('plus', 26);
  fabEl.setAttribute('aria-label', '新建记录');
  fabEl.addEventListener('click', () => {
    // 社区页：打开发布弹窗；其他页面：打开记录弹窗
    if (current.name === 'community') openPublishSheet();
    else openRecordSheet();
  });
  document.querySelector('.phone-shell').appendChild(fabEl);
}

function updateFab(name) {
  if (!fabEl) return;
  const show = FAB_ROUTES.has(name);
  fabEl.classList.toggle('show', show);
  // 社区页 FAB 显示发布图标，其他显示加号
  fabEl.innerHTML = (name === 'community') ? icon('send', 24) : icon('plus', 26);
}

/* ---------- 全局事件委托 ---------- */
const actions = {
  nav: (el) => navigate(el.dataset.route),
  back: () => {
    if (history.length > 1) history.back();
    else navigate('home');
  },
  'open-record': (el) => navigate('detail', el.dataset.id),
  'open-post': (el) => navigate('post', el.dataset.id),
  'open-ai-analysis': (el) => navigate('ai-analysis', el.dataset.id),
  'new-record': (el) => openRecordSheet(el.dataset.type),
  'edit-record': (el) => openRecordSheet(null, el.dataset.id),
  'calendar-new': () => home.openTextSheet(getState().selectedDate),
  'ai-module': (el) => handleAiModule(el.dataset.mod, el.dataset.id),
  'ai-all-records': () => infoDialog({ title: '功能即将上线', desc: '分析历史记录功能正在开发中，敬请期待。', confirmText: '我知道了' }),

  'like-post': (el) => { toggleLike(el.dataset.id); updateLikeUI(el.dataset.id); },
  'also-dream': (el) => { toggleAlsoDreamed(el.dataset.id); updateAlsoDreamUI(el.dataset.id); },
  'comment-submit': (el) => handleComment(el.dataset.id),
  'publish-record': (el) => handlePublish(el.dataset.id),
  'unpublish-record': (el) => handleUnpublishRecord(el.dataset.id),
  'ai-paint': (el) => handleAiPaint(el.dataset.id),
  'delete-record': (el) => handleDelete(el.dataset.id),
  'com-search': () => showToast('搜索功能即将上线', { icon: 'info' }),
  'com-notice': () => showToast('暂无新通知，愿你今夜好梦 ✨', { icon: 'moon' }),
  'com-share': () => showToast('已复制梦境链接', { icon: 'check' }),
  'com-follow': () => showToast('关注功能即将上线', { icon: 'sparkle' }),
  'com-focus-comment': () => focusCommentInput(),
  'pd-edit': (el) => handlePostEdit(el.dataset.id),
  'pd-delete': (el) => handlePostDelete(el.dataset.id),
  'pd-unpublish': (el) => handlePostUnpublish(el.dataset.id),
  'pd-more': (el) => openPostMoreSheet(el.dataset.id),
  'com-publish': () => openPublishSheet(),

  'calendar-prev': () => { calendar.shift(-1); renderCurrent(); },
  'calendar-next': () => { calendar.shift(1); renderCurrent(); },
  'calendar-day': (el) => { setState({ selectedDate: el.dataset.date }); renderCurrent(); },
  'calendar-today': () => { calendar.goToday(); renderCurrent(); },

  'community-filter': (el) => { setState({ filter: el.dataset.cat }); renderCurrent(); },

  /* 我的页面交互 */
  'profile-notify': () => showToast('暂无新通知，愿你今夜好梦 ✨', { icon: 'moon' }),
  'profile-edit': () => openProfileEditSheet(),
  'stat-dreams': () => infoDialog({ title: '梦境记录', desc: '梦境记录列表功能即将上线，敬请期待。', confirmText: '我知道了' }),
  'stat-streak': () => showToast('连续记梦 28 天，继续加油 ✨', { icon: 'sparkle' }),
  'stat-ai': () => infoDialog({ title: 'AI 分析记录', desc: 'AI 分析历史记录功能正在开发中，敬请期待。', confirmText: '我知道了' }),
  'stat-likes': () => infoDialog({ title: '社区互动', desc: '社区互动记录功能正在开发中，敬请期待。', confirmText: '我知道了' }),
  'ov-month': () => navigate('calendar'),
  'ov-days': () => navigate('calendar'),
  'ov-symbol': () => infoDialog({ title: '意象统计', desc: '梦境意象统计功能正在开发中，敬请期待。', confirmText: '我知道了' }),
  'ov-person': () => infoDialog({ title: '人物统计', desc: '梦境人物统计功能正在开发中，敬请期待。', confirmText: '我知道了' }),
  'menu-privacy': () => infoDialog({ title: '隐私设置', desc: '隐私设置功能正在开发中，敬请期待。', confirmText: '我知道了' }),
  'menu-message': () => infoDialog({ title: '消息中心', desc: '消息中心功能正在开发中，敬请期待。', confirmText: '我知道了' }),
  'menu-system': () => infoDialog({ title: '系统设置', desc: '系统设置功能正在开发中，敬请期待。', confirmText: '我知道了' }),
  'menu-favorites': () => infoDialog({ title: '我的收藏', desc: '收藏的梦境与帖子将在这里汇总，功能正在开发中，敬请期待。', confirmText: '我知道了' }),
  'menu-about': () => infoDialog({ title: '关于梦迹', desc: '梦迹 DreamTrace · 用梦境照亮白天。\n在这里，每一段梦都被温柔记下。', confirmText: '我知道了' }),

  /* 首页专属交互 */
  'home-bell': () => showToast('暂无新通知，愿你今夜好梦 ✨', { icon: 'moon' }),
  'home-voice': () => home.openVoiceSheet(),
  'home-text': () => home.openTextSheet()
};

function handleAiModule(mod, recordId) {
  if (mod === 'interpret') {
    infoDialog({
      title: 'AI 解梦',
      desc: '将深度解析这段梦境的含义，解读潜意识讯息。功能正在开发中，敬请期待。',
      confirmText: '我知道了'
    });
    return;
  }
  infoDialog({
    title: '功能即将上线',
    desc: '这个功能正在开发中，敬请期待。',
    confirmText: '我知道了'
  });
}

/* 局部更新点赞按钮（不重新渲染页面，避免滚动位置丢失） */
function updateLikeUI(postId) {
  const p = getPost(postId);
  if (!p) return;
  // 详情页互动栏按钮
  document.querySelectorAll(`[data-act="like-post"][data-id="${postId}"]`).forEach((btn) => {
    btn.classList.toggle('on', p.likedByMe);
    const num = btn.querySelector('.act-num, .pc-like-num');
    if (num) num.textContent = p.likes;
  });
}

/* 局部更新"也梦到过"按钮 */
function updateAlsoDreamUI(postId) {
  const p = getPost(postId);
  if (!p) return;
  document.querySelectorAll(`[data-act="also-dream"][data-id="${postId}"]`).forEach((btn) => {
    btn.classList.toggle('on', p.relatedByMe);
    const num = btn.querySelector('.act-num');
    if (num) num.textContent = p.alsoDreamed;
  });
}

function handleComment(postId) {
  const ta = document.getElementById('commentInput');
  const val = ta?.value.trim();
  if (!val) { showToast('请输入评论内容', { icon: 'info' }); return; }
  addComment(postId, val);
  showToast('评论已发送');
  renderCurrent();
}

async function handlePublish(id) {
  const rec = getRecord(id);
  if (!rec) return;
  const ok = await confirmDialog({
    title: '发布到社区？',
    desc: '这条梦境将以你的昵称分享到梦境集市，其他旅人可以与你互动。',
    confirmText: '发布',
    cancelText: '再想想'
  });
  if (!ok) return;
  publishRecordToCommunity(id);
  showToast('已发布到社区', { icon: 'check' });
  renderCurrent();
}

async function handleDelete(id) {
  const ok = await confirmDialog({
    title: '删除这条记录？',
    desc: '删除后无法恢复，相关的 AI 解读也会一并移除。',
    confirmText: '删除',
    cancelText: '取消',
    danger: true
  });
  if (!ok) return;
  deleteRecord(id);
  showToast('已删除');
  navigate('calendar');
}

/* 详情页：取消发布（从社区移除帖子，保留原始梦境记录） */
async function handleUnpublishRecord(id) {
  const ok = await confirmDialog({
    title: '取消发布？',
    desc: '这条梦境将从社区移除，原始记录会保留在你的日历中。',
    confirmText: '取消发布',
    cancelText: '再想想'
  });
  if (!ok) return;
  unpublishPost('me_' + id);
  showToast('已取消发布');
  renderCurrent();
}

/* 详情页：AI 画梦（生成梦境可视化图片，保存到原记录） */
function handleAiPaint(id) {
  const rec = getRecord(id);
  if (!rec) return;
  infoDialog({
    title: 'AI 画梦',
    desc: '将根据这段梦境内容生成一幅梦境可视化插画，并保存到原梦境中。功能正在开发中，敬请期待。',
    confirmText: '我知道了'
  });
}

function focusCommentInput() {
  const ta = document.getElementById('commentInput');
  if (ta) {
    ta.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => ta.focus(), 300);
  }
}

function handlePostEdit(id) {
  const p = getPost(id);
  if (!p) return;
  const ta = document.querySelector('.pd-body');
  if (!ta) return;
  const original = p.content;
  ta.contentEditable = 'true';
  ta.classList.add('editing');
  ta.focus();
  // 创建保存/取消按钮
  const bar = document.createElement('div');
  bar.className = 'pd-edit-bar';
  bar.innerHTML = `<button class="btn btn-ghost btn-sm pd-cancel-edit">取消</button>
    <button class="btn btn-primary btn-sm pd-save-edit">保存修改</button>`;
  ta.after(bar);
  const cleanup = () => {
    ta.contentEditable = 'false';
    ta.classList.remove('editing');
    bar.remove();
  };
  bar.querySelector('.pd-cancel-edit').addEventListener('click', () => {
    ta.textContent = original;
    cleanup();
  });
  bar.querySelector('.pd-save-edit').addEventListener('click', () => {
    const val = ta.textContent.trim();
    if (!val) { showToast('内容不能为空', { icon: 'info' }); return; }
    updatePost(id, { content: val, excerpt: val.slice(0, 36) + '…' });
    showToast('已保存修改');
    cleanup();
    renderCurrent();
  });
}

async function handlePostDelete(id) {
  const ok = await confirmDialog({
    title: '删除这条梦境帖子？',
    desc: '删除后无法恢复，社区中将不再显示这条内容。',
    confirmText: '删除',
    cancelText: '取消',
    danger: true
  });
  if (!ok) return;
  deletePost(id);
  showToast('已删除');
  navigate('community');
}

async function handlePostUnpublish(id) {
  const ok = await confirmDialog({
    title: '取消发布？',
    desc: '这条帖子将从社区移除，原始梦境记录会保留。',
    confirmText: '取消发布',
    cancelText: '再想想'
  });
  if (!ok) return;
  unpublishPost(id);
  showToast('已取消发布');
  navigate('community');
}

/* 我的帖子：更多操作（三点按钮）底部弹层 */
function openPostMoreSheet(id) {
  const p = getPost(id);
  if (!p) return;
  const root = document.querySelector('.phone-shell') || document.body;
  const mask = document.createElement('div');
  mask.className = 'pd-more-mask';
  mask.innerHTML = `
    <div class="pd-more-sheet">
      <button class="pd-more-close" type="button" aria-label="关闭">${icon('close', 16)}</button>
      <div class="pd-more-grip"></div>
      <div class="pd-more-row">
        <button class="pd-more-item" data-act="pd-edit" data-id="${id}">${icon('edit', 16)} 编辑</button>
        <button class="pd-more-item" data-act="pd-unpublish" data-id="${id}">${icon('undo', 16)} 取消发布</button>
        <button class="pd-more-item danger" data-act="pd-delete" data-id="${id}">${icon('trash', 16)} 删除</button>
      </div>
    </div>`;
  root.appendChild(mask);
  requestAnimationFrame(() => mask.classList.add('show'));
  const close = () => {
    mask.classList.remove('show');
    setTimeout(() => mask.remove(), 220);
  };
  mask.addEventListener('click', (e) => {
    if (e.target === mask) { close(); return; }
    if (e.target.closest('.pd-more-close')) { close(); return; }
    const btn = e.target.closest('[data-act]');
    if (!btn) return;
    const act = btn.dataset.act;
    close();
    /* 等动画结束再触发，避免弹层未关时又叠一个弹层 */
    setTimeout(() => {
      if (act === 'pd-edit') handlePostEdit(id);
      else if (act === 'pd-unpublish') handlePostUnpublish(id);
      else if (act === 'pd-delete') handlePostDelete(id);
    }, 180);
  });
}

/* 社区发布弹窗 */
function openPublishSheet() {
  import('./pages/record.js').then(({ openSheet }) => {
    openSheet({
      title: '发布到社区',
      bodyHtml: `
        <div class="pub-form">
          <div class="field">
            <label>标题</label>
            <input class="input" id="pubTitle" placeholder="给你的梦境起个名字…" />
          </div>
          <div class="field">
            <label>梦境内容</label>
            <textarea class="textarea" id="pubContent" placeholder="写下你的梦境，让其他旅人一起感受…"></textarea>
          </div>
          <div class="field">
            <label>标签（用逗号分隔）</label>
            <input class="input" id="pubTags" placeholder="飞行, 月亮, 自由" />
          </div>
          <button class="btn btn-primary btn-block" id="pubSubmit">发布到社区</button>
        </div>`,
      onMount: (sheet, close) => {
        sheet.querySelector('#pubSubmit').addEventListener('click', () => {
          const title = sheet.querySelector('#pubTitle').value.trim();
          const content = sheet.querySelector('#pubContent').value.trim();
          const tagsRaw = sheet.querySelector('#pubTags').value.trim();
          if (!content) {
            showToast('请先写下梦境内容', { icon: 'info' });
            return;
          }
          const tags = tagsRaw ? tagsRaw.split(/[,，]/).map((t) => t.trim()).filter(Boolean) : [];
          const post = publishNewPost({ title, content, tags });
          showToast('已发布到社区', { icon: 'sparkle' });
          close();
          setState({ filter: 'mine' });
          navigate('community');
        });
      }
    });
  });
}

/* 编辑资料弹窗 */
function openProfileEditSheet() {
  const user = getState().user;
  import('./pages/record.js').then(({ openSheet }) => {
    import('./seed-data.js').then(({ userAvatarOptions }) => {
      let initIdx = userAvatarOptions.findIndex((o) => o.url === user.avatarUrl);
      if (initIdx < 0) initIdx = 0;
      const initOpt = userAvatarOptions[initIdx];
      openSheet({
        title: '编辑资料',
        bodyHtml: `
        <div class="pub-form">
          <div class="pf-edit-avatar">
            <div class="pf-avatar"><img src="${initOpt.url}" alt="" onerror="this.remove()" style="width:100%;height:100%;object-fit:cover"></div>
            <button class="btn btn-ghost btn-sm" type="button" id="pfChangeAvatar">换头像</button>
          </div>
          <div class="field">
            <label>昵称</label>
            <input class="input" id="pfNickname" placeholder="请输入昵称" value="${user.nickname}" maxlength="12" />
          </div>
          <div class="field">
            <label>签名</label>
            <textarea class="textarea" id="pfBio" placeholder="写一句你的梦境签名…" rows="2" maxlength="40">${user.bio}</textarea>
          </div>
          <button class="btn btn-primary btn-block" id="pfSave">保存修改</button>
        </div>`,
        onMount: (sheet, close) => {
          let optIdx = initIdx;
          const refreshAvatar = () => {
            const opt = userAvatarOptions[optIdx];
            const av = sheet.querySelector('.pf-edit-avatar .pf-avatar');
            av.innerHTML = `<img src="${opt.url}" alt="" onerror="this.remove()" style="width:100%;height:100%;object-fit:cover">`;
          };
          sheet.querySelector('#pfChangeAvatar').addEventListener('click', () => {
            optIdx = (optIdx + 1) % userAvatarOptions.length;
            refreshAvatar();
          });
          sheet.querySelector('#pfSave').addEventListener('click', () => {
            const nickname = sheet.querySelector('#pfNickname').value.trim();
            const bio = sheet.querySelector('#pfBio').value.trim();
            if (!nickname) {
              showToast('昵称不能为空', { icon: 'info' });
              return;
            }
            const opt = userAvatarOptions[optIdx];
            updateUser({
              nickname,
              bio: bio || '在梦里，遇见另一个自己。',
              avatarSeed: opt.seed,
              avatarUrl: opt.url
            });
            showToast('资料已更新', { icon: 'check' });
            close();
            renderCurrent();
          });
        }
      });
    });
  });
}

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-act]');
  if (!el) return;
  const fn = actions[el.dataset.act];
  if (fn) {
    e.preventDefault();
    fn(el);
  }
});

/* ---------- 状态栏时钟 ---------- */
let lastDateStr = todayStr();
function tickClock() {
  const now = new Date();
  const h = now.getHours();
  const m = String(now.getMinutes()).padStart(2, '0');
  const el = document.getElementById('statusTime');
  if (el) el.textContent = `${h}:${m}`;

  /* 检测日期变化：跨过午夜时同步今日日期，必要时重渲染日历 */
  const tStr = todayStr();
  if (tStr !== lastDateStr) {
    const prev = getState().selectedDate;
    /* 若之前选中的就是"今天"（旧日期），则同步到新日期；否则保持选中不变 */
    if (!prev || prev === lastDateStr) {
      setState({ selectedDate: tStr });
    }
    lastDateStr = tStr;
    /* 若当前正在日历页，重新渲染以刷新"今天"高亮 */
    if (current.name === 'calendar') renderCurrent();
  }
}

/* ---------- 启动 ---------- */
function init() {
  initData();
  renderNav();
  buildFab();
  setState({ selectedDate: todayStr() });

  onRouteChange((name, params) => renderPage(name, params));
  startRouter();

  tickClock();
  setInterval(tickClock, 30000);
}

init();
