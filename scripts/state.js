/* ============================================================
   state.js — 全局应用状态 + 订阅
   ============================================================ */

export const state = {
  user: null,
  records: [],      // 用户的梦境 / 现实记录
  posts: [],        // 社区帖子
  route: 'home',    // 当前路由名
  params: {},        // 路由参数
  selectedDate: null, // 日历选中日期
  filter: 'recommend' // 社区筛选（默认推荐）
};

const subs = new Set();

export function getState() {
  return state;
}

export function setState(patch = {}) {
  Object.assign(state, patch);
  subs.forEach((fn) => fn(state));
}

export function subscribe(fn) {
  subs.add(fn);
  return () => subs.delete(fn);
}

/* 北京时间日期字符串（YYYY-MM-DD），用 Asia/Shanghai 时区，避免 UTC 偏差导致日期错位 */
export function dateStr(d = new Date()) {
  const fmt = new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric', month: '2-digit', day: '2-digit', hour12: false
  });
  const parts = fmt.formatToParts(d);
  const y = parts.find((p) => p.type === 'year').value;
  const m = parts.find((p) => p.type === 'month').value;
  const day = parts.find((p) => p.type === 'day').value;
  return `${y}-${m}-${day}`;
}
export const todayStr = () => dateStr(new Date());
