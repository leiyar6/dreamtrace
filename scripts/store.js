/* ============================================================
   store.js — localStorage 持久化封装
   ============================================================ */

const KEYS = {
  user: 'dt_user',
  records: 'dt_records',
  posts: 'dt_posts',
  seeded: 'dt_seeded_v4'                /* v4：升级版本号，强制重新加载 seed 数据（帖子 imageUrl + 用户/评论 avatarUrl） */
};

export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('localStorage 写入失败', e);
  }
}

export const store = {
  // 用户
  getUser: () => load(KEYS.user, null),
  setUser: (u) => save(KEYS.user, u),

  // 记录
  getRecords: () => load(KEYS.records, []),
  setRecords: (r) => save(KEYS.records, r),

  // 社区帖子（包含他人帖，本地维护互动状态）
  getPosts: () => load(KEYS.posts, []),
  setPosts: (p) => save(KEYS.posts, p),

  isSeeded: () => load(KEYS.seeded, false),
  markSeeded: () => save(KEYS.seeded, true)
};
