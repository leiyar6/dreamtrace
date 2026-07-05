/* ============================================================
   pages/detail.js — 记录详情页
   ============================================================ */

import { getRecord } from '../repository.js';
import { icon, badgeType, formatDate, esc } from '../components.js';

export function render(params) {
  const id = params?.[0];
  const r = getRecord(id);
  if (!r) {
    return `<div class="page">${`<div class="empty"><div class="emo">🌫️</div><div class="txt">记录不存在或已被删除</div>
      <button class="btn btn-ghost btn-sm" data-act="back">返回</button></div>`}</div>`;
  }

  return `
  <div class="detail page">
    <header class="sub-head">
      <button class="btn-icon" data-act="back" aria-label="返回">${icon('arrow', 20)}</button>
      <span class="sub-head-title">${esc(formatDate(r.date, true))}</span>
      <span class="grow"></span>
    </header>

    <h1 class="detail-title serif"><span class="detail-type-inline">${badgeType(r.type)}</span>${esc(r.title)}</h1>

    ${r.imageUrl ? `
    <figure class="detail-cover">
      <img src="${esc(r.imageUrl)}" alt="${esc(r.title)}" onerror="this.parentElement.style.display='none'">
    </figure>` : ''}

    <div class="detail-body">${esc(r.content)}</div>

    <!-- 操作栏：编辑 / AI画梦 / 发布到社区（或取消发布） / 删除 -->
    <div class="action-bar detail-actions">
      <button class="act-btn" data-act="edit-record" data-id="${r.id}">${icon('edit', 18)} 编辑</button>
      <button class="act-btn" data-act="ai-paint" data-id="${r.id}">${icon('image', 18)} AI画梦</button>
      ${r.published
        ? `<button class="act-btn" data-act="unpublish-record" data-id="${r.id}">${icon('share', 18)} 取消发布</button>`
        : `<button class="act-btn" data-act="publish-record" data-id="${r.id}">${icon('share', 18)} 发布到社区</button>`}
      <button class="act-btn danger" data-act="delete-record" data-id="${r.id}">${icon('trash', 18)} 删除</button>
    </div>
  </div>`;
}
