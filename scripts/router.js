/* ============================================================
   router.js — 极简 Hash 路由
   约定：#/home  #/detail/r_001  #/post/p_002  #/ai-analysis/r_001
   ============================================================ */

import { setState } from './state.js';

const listeners = new Set();

function parse() {
  let hash = location.hash.replace(/^#\/?/, '') || 'home';
  const [path, ...rest] = hash.split('/');
  return { name: path || 'home', params: rest };
}

export function navigate(name, ...params) {
  const target = params.length ? `#/${name}/${params.join('/')}` : `#/${name}`;
  if (location.hash === target) {
    // 同地址也触发一次渲染（如刷新数据）
    broadcast();
  } else {
    location.hash = target;
  }
}

export function onRouteChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function broadcast() {
  const r = parse();
  setState({ route: r.name, params: r.params });
  listeners.forEach((fn) => fn(r.name, r.params));
}

export function startRouter() {
  if (!location.hash) location.hash = '#/home';
  window.addEventListener('hashchange', broadcast);
  broadcast();
}
