/* ============================================================
   repository.js — 业务数据操作（读写 store + 同步 state）
   ============================================================ */

import { state, setState, todayStr, dateStr } from './state.js';
import { store } from './store.js';
import { seedUser, seedRecords, seedPosts } from './seed-data.js';
import { moodPresets } from './seed-data.js';

export { moodPresets };

/* 种子记录的日期偏移映射（相对今天）
   用于每次启动时重新对齐种子记录日期，确保"今天"始终有梦境预览 */
const SEED_OFFSETS = {
  r_001: 0, r_002: 0, r_003: -2, r_004: -4,
  r_005: -5, r_006: -7, r_007: -9, r_008: -11, r_009: -1
};

/* 根据当前日期重新计算种子记录的 date 字段 */
function realignSeedDates(records) {
  const today = new Date();
  let changed = false;
  const aligned = records.map((r) => {
    const offset = SEED_OFFSETS[r.id];
    if (offset === undefined) return r;
    const dt = new Date(today);
    dt.setDate(dt.getDate() + offset);
    const newDate = dateStr(dt);
    if (r.date !== newDate) {
      changed = true;
      return { ...r, date: newDate };
    }
    return r;
  });
  return { aligned, changed };
}

/* ---------- 初始化（首次加载种子数据） ---------- */
export function initData() {
  let user = store.getUser();
  let records = store.getRecords();
  let posts = store.getPosts();

  if (!user) {
    user = seedUser;
    store.setUser(user);
  }
  if (!store.isSeeded()) {
    records = seedRecords;
    posts = seedPosts;
    store.setRecords(records);
    store.setPosts(posts);
    store.markSeeded();
    // 重新播种时同步刷新用户数据，确保 avatarUrl 等新字段被更新
    if (user) {
      user = { ...user, avatarUrl: seedUser.avatarUrl, avatarSeed: seedUser.avatarSeed };
      store.setUser(user);
    }
  } else {
    // 已播种：重新对齐种子记录日期，确保"今天"始终有梦境预览
    const { aligned, changed } = realignSeedDates(records);
    if (changed) {
      records = aligned;
      store.setRecords(records);
    }
  }

  /* 字段补全：确保旧版本数据也有 avatarUrl
     - user 可能是旧版本，没有 avatarUrl，从 seedUser 复制
     - me_ 开头的帖子是用户发布的，需要同步当前用户的 avatarUrl */
  let userChanged = false;
  if (!user.avatarUrl) {
    user = { ...user, avatarUrl: seedUser.avatarUrl, avatarSeed: user.avatarSeed || seedUser.avatarSeed };
    store.setUser(user);
    userChanged = true;
  }
  let postsChanged = false;
  posts = posts.map((p) => {
    if (p.id.startsWith('me_') && !p.avatarUrl) {
      postsChanged = true;
      return { ...p, avatarUrl: user.avatarUrl, avatarSeed: user.avatarSeed };
    }
    if (p.id.startsWith('me_') && p.avatarUrl !== user.avatarUrl) {
      /* 同步当前用户的最新头像到所有自己的帖子 */
      postsChanged = true;
      return { ...p, avatarUrl: user.avatarUrl, avatarSeed: user.avatarSeed };
    }
    return p;
  });
  if (postsChanged) store.setPosts(posts);

  // 计算用户统计
  refreshStats(user, records);
  setState({ user, records, posts });
}

function refreshStats(user, records) {
  const dreams = records.filter((r) => r.type === 'dream').length;
  const reality = records.filter((r) => r.type === 'reality').length;
  const aiUsed = records.filter((r) => r.analysis).length;
  user.stats = { dreams, reality, aiUsed, total: records.length };
  /* profile 展示数据：固定数值（模拟成长数据），缺失字段从 seedUser 补全 */
  const sp = seedUser.profile;
  user.profile = {
    totalDreams: user.profile?.totalDreams ?? sp.totalDreams,
    streakDays: user.profile?.streakDays ?? sp.streakDays,
    aiAnalysisCount: user.profile?.aiAnalysisCount ?? sp.aiAnalysisCount,
    communityLikes: user.profile?.communityLikes ?? sp.communityLikes,
    monthlyDreamCount: user.profile?.monthlyDreamCount ?? sp.monthlyDreamCount,
    monthlyDreamDays: user.profile?.monthlyDreamDays ?? sp.monthlyDreamDays,
    commonSymbol: user.profile?.commonSymbol ?? sp.commonSymbol,
    commonPerson: user.profile?.commonPerson ?? sp.commonPerson
  };
  store.setUser(user);
}

/* ---------- 用户资料 ---------- */
export function updateUser(patch) {
  const user = { ...state.user, ...patch };
  store.setUser(user);
  /* 如果头像更新了，同步到所有自己发布的帖子 */
  if (patch.avatarUrl || patch.avatarSeed) {
    const posts = state.posts.map((p) => {
      if (!p.id.startsWith('me_')) return p;
      return { ...p, avatarUrl: user.avatarUrl, avatarSeed: user.avatarSeed };
    });
    store.setPosts(posts);
    setState({ user, posts });
    return user;
  }
  setState({ user });
  return user;
}

/* ---------- 记录 CRUD ---------- */
export function getRecord(id) {
  return state.records.find((r) => r.id === id);
}

export function addRecord(rec) {
  const list = [rec, ...state.records];
  store.setRecords(list);
  refreshStats(state.user, list);
  setState({ records: list, user: state.user });
  return rec;
}

export function updateRecord(id, patch) {
  const list = state.records.map((r) => (r.id === id ? { ...r, ...patch } : r));
  store.setRecords(list);
  refreshStats(state.user, list);
  setState({ records: list, user: state.user });
}

export function deleteRecord(id) {
  const list = state.records.filter((r) => r.id !== id);
  store.setRecords(list);
  refreshStats(state.user, list);
  setState({ records: list, user: state.user });
}

/* 按日期分组记录 */
export function recordsByDate(dateStr) {
  return state.records.filter((r) => r.date === dateStr);
}

export function recordsDatesSet() {
  const set = {};
  for (const r of state.records) {
    set[r.date] = (set[r.date] || 0) + 1;
  }
  return set;
}

/* 按日期聚合标记：返回 { date: { dream: bool, reality: bool, count: number } } */
export function recordsMarkersByDate() {
  const map = {};
  for (const r of state.records) {
    if (!map[r.date]) map[r.date] = { dream: false, reality: false, count: 0 };
    if (r.type === 'dream') map[r.date].dream = true;
    if (r.type === 'reality') map[r.date].reality = true;
    map[r.date].count += 1;
  }
  return map;
}

export function recentRecords(n = 5) {
  return [...state.records].sort((a, b) => b.createdAt - a.createdAt).slice(0, n);
}

/* ---------- 社区帖子操作 ---------- */
export function getPost(id) {
  return state.posts.find((p) => p.id === id);
}

export function toggleLike(id) {
  const list = state.posts.map((p) => {
    if (p.id !== id) return p;
    const liked = !p.likedByMe;
    return { ...p, likedByMe: liked, likes: p.likes + (liked ? 1 : -1) };
  });
  store.setPosts(list);
  setState({ posts: list });
}

export function toggleAlsoDreamed(id) {
  const list = state.posts.map((p) => {
    if (p.id !== id) return p;
    const on = !p.relatedByMe;
    return { ...p, relatedByMe: on, alsoDreamed: p.alsoDreamed + (on ? 1 : -1) };
  });
  store.setPosts(list);
  setState({ posts: list });
}

export function addComment(id, content) {
  const list = state.posts.map((p) => {
    if (p.id !== id) return p;
    const c = {
      id: 'c_' + Date.now(),
      name: state.user.nickname,
      avatarSeed: state.user.avatarSeed,
      avatarUrl: state.user.avatarUrl,
      content,
      createdAt: Date.now()
    };
    return { ...p, comments: [c, ...p.comments] };
  });
  store.setPosts(list);
  setState({ posts: list });
}

/* 把本地记录发布到社区 */
export function publishRecordToCommunity(id) {
  const rec = getRecord(id);
  if (!rec) return;
  const exists = state.posts.some((p) => p.id === 'me_' + id);
  if (exists) return;
  const post = {
    id: 'me_' + id,
    authorId: state.user.id,
    authorName: state.user.nickname,
    avatarSeed: state.user.avatarSeed,
    avatarUrl: state.user.avatarUrl,
    title: rec.title,
    excerpt: rec.content.slice(0, 36) + '…',
    cover: ['cloud', 'forest', 'letter', 'stairs', 'train', 'whale'][id.length % 6],
    imageUrl: rec.imageUrl || '',           /* 同步原始梦境的图片到社区帖子 */
    mood: rec.mood,
    tags: rec.tags || [],
    likes: 0,
    alsoDreamed: 0,
    comments: [],
    likedByMe: false,
    relatedByMe: false,
    createdAt: Date.now(),
    content: rec.content,
    analysis: rec.analysis || null
  };
  const list = [post, ...state.posts];
  store.setPosts(list);
  updateRecord(id, { published: true });
  setState({ posts: list });
}

/* 直接在社区发布一条新帖子（不依赖本地记录） */
export function publishNewPost(data) {
  const post = {
    id: 'me_' + Date.now(),
    authorId: state.user.id,
    authorName: state.user.nickname,
    avatarSeed: state.user.avatarSeed,
    avatarUrl: state.user.avatarUrl,
    title: data.title || '未命名的梦境',
    excerpt: (data.content || '').slice(0, 36) + '…',
    cover: data.cover || ['cloud', 'forest', 'letter', 'stairs', 'train', 'whale', 'moon', 'deer', 'castle'][Math.floor(Math.random() * 9)],
    mood: data.mood || '宁静',
    tags: data.tags || [],
    likes: 0,
    alsoDreamed: 0,
    comments: [],
    likedByMe: false,
    relatedByMe: false,
    createdAt: Date.now(),
    content: data.content,
    analysis: null
  };
  const list = [post, ...state.posts];
  store.setPosts(list);
  setState({ posts: list });
  return post;
}

/* 更新帖子内容（编辑） */
export function updatePost(id, patch) {
  const list = state.posts.map((p) => (p.id === id ? { ...p, ...patch } : p));
  store.setPosts(list);
  setState({ posts: list });
}

/* 删除帖子 */
export function deletePost(id) {
  const list = state.posts.filter((p) => p.id !== id);
  store.setPosts(list);
  setState({ posts: list });
}

/* 取消发布（从社区移除，保留原始梦境记录） */
export function unpublishPost(id) {
  let list = state.posts.filter((p) => p.id !== id);
  // 如果是从本地记录发布的，把记录的 published 字段重置
  if (id.startsWith('me_')) {
    const recId = id.replace('me_', '');
    list = list; // 记录更新由 updateRecord 处理
    updateRecord(recId, { published: false });
  }
  store.setPosts(list);
  setState({ posts: list });
}

/* 生成新 id */
export function genId(prefix = 'r') {
  return prefix + '_' + Date.now();
}

/* 今日是否有记录 */
export function todayStatus() {
  const today = todayStr();
  const todays = state.records.filter((r) => r.date === today);
  return {
    date: today,
    count: todays.length,
    hasDream: todays.some((r) => r.type === 'dream'),
    records: todays
  };
}
