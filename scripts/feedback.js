/* ============================================================
   feedback.js — Toast / 确认弹窗 / 底部抽屉
   挂载到 #overlayRoot，命令式调用
   ============================================================ */

const root = () => document.getElementById('overlayRoot');

/* ---------- Toast ---------- */
export function showToast(message, { icon = 'check', duration = 1800 } = {}) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `${iconSvg(icon)}<span>${escape(message)}</span>`;
  root().appendChild(el);
  setTimeout(() => {
    el.classList.add('out');
    setTimeout(() => el.remove(), 320);
  }, duration);
}

/* ---------- 居中确认弹窗，返回 Promise<boolean> ---------- */
export function confirmDialog({ title = '确认操作', desc = '', confirmText = '确定', cancelText = '取消', danger = false } = {}) {
  return new Promise((resolve) => {
    const mask = document.createElement('div');
    mask.className = 'center-modal';
    mask.innerHTML = `
      <div class="cm-box">
        <div class="cm-title">${escape(title)}</div>
        ${desc ? `<div class="cm-desc">${escape(desc)}</div>` : ''}
        <div class="cm-actions">
          <button class="btn btn-soft" data-act="cancel">${escape(cancelText)}</button>
          <button class="btn ${danger ? 'btn-danger' : 'btn-primary'}" data-act="ok">${escape(confirmText)}</button>
        </div>
      </div>`;
    const close = (val) => {
      mask.style.animation = 'fadeIn 0.2s reverse';
      setTimeout(() => mask.remove(), 180);
      resolve(val);
    };
    mask.addEventListener('click', (e) => {
      const act = e.target.closest('[data-act]')?.dataset.act;
      if (act === 'ok') close(true);
      else if (act === 'cancel' || e.target === mask) close(false);
    });
    root().appendChild(mask);
  });
}

/* ---------- 居中提示弹窗（单按钮），返回 Promise<void> ---------- */
export function infoDialog({ title = '提示', desc = '', confirmText = '我知道了' } = {}) {
  return new Promise((resolve) => {
    const mask = document.createElement('div');
    mask.className = 'center-modal';
    mask.innerHTML = `
      <div class="cm-box">
        <div class="cm-title">${escape(title)}</div>
        ${desc ? `<div class="cm-desc">${escape(desc)}</div>` : ''}
        <div class="cm-actions">
          <button class="btn btn-primary" data-act="ok" style="flex:1">${escape(confirmText)}</button>
        </div>
      </div>`;
    const close = () => {
      mask.style.animation = 'fadeIn 0.2s reverse';
      setTimeout(() => { mask.remove(); resolve(); }, 180);
    };
    mask.addEventListener('click', (e) => {
      const act = e.target.closest('[data-act]')?.dataset.act;
      if (act === 'ok' || e.target === mask) close();
    });
    root().appendChild(mask);
  });
}

/* ---------- 底部抽屉，返回 { el, close } ---------- */
export function openSheet({ title = '', sub = '', bodyHtml = '', onMount = null, onClose = null } = {}) {
  const mask = document.createElement('div');
  mask.className = 'sheet-mask';
  const sheet = document.createElement('div');
  sheet.className = 'sheet';
  sheet.innerHTML = `
    <button class="sheet-close" type="button" aria-label="关闭">${iconSvg('close')}</button>
    <div class="sheet-grip"></div>
    ${title ? `<h2>${escape(title)}</h2>` : ''}
    ${sub ? `<p class="sheet-sub">${escape(sub)}</p>` : ''}
    <div class="sheet-body">${bodyHtml}</div>`;
  mask.appendChild(sheet);
  let closed = false;
  const close = () => {
    if (closed) return;
    closed = true;
    if (typeof onClose === 'function') {
      try { onClose(); } catch (e) { /* 忽略清理异常 */ }
    }
    sheet.style.animation = 'sheetUp 0.28s reverse';
    mask.style.animation = 'fadeIn 0.25s reverse';
    setTimeout(() => mask.remove(), 260);
  };
  sheet.querySelector('.sheet-close').addEventListener('click', close);
  mask.addEventListener('click', (e) => {
    if (e.target === mask) close();
  });
  root().appendChild(mask);
  if (onMount) onMount(sheet, close);
  return { el: sheet, close };
}

/* ---------- 工具 ---------- */
function escape(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function iconSvg(name) {
  const paths = {
    check: '<path d="M20 6 9 17l-5-5"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><circle cx="12" cy="7.5" r="0.6"/>',
    warn: '<path d="M12 3 2 21h20L12 3z"/><path d="M12 10v5"/><circle cx="12" cy="18.5" r="0.6"/>',
    moon: '<path d="M20 13.5A8 8 0 1 1 10.5 4 6 6 0 0 0 20 13.5z"/>',
    sparkle: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4"/><path d="M12 8a4 4 0 0 0 4 4 4 4 0 0 0-4 4 4 4 0 0 0-4-4 4 4 0 0 0 4-4z"/>',
    close: '<path d="M18 6 6 18M6 6l12 12"/>'
  };
  return `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths[name] || paths.check}</svg>`;
}
