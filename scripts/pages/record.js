/* ============================================================
   pages/record.js — 新增/编辑记录（底部抽屉）
   ============================================================ */

import { addRecord, updateRecord, getRecord, genId } from '../repository.js';
import { navigate } from '../router.js';
import { openSheet, showToast } from '../feedback.js';
import { icon, esc } from '../components.js';
import { todayStr } from '../state.js';

export function openRecordSheet(forceType = null, editId = null, presetDate = null) {
  const editing = editId ? getRecord(editId) : null;
  const today = todayStr();

  const form = {
    type: editing?.type || forceType || 'dream',
    date: editing?.date || presetDate || today
  };

  const bodyHtml = `
    <div class="rec-form">
      <!-- 类型选择 -->
      <div class="type-switch">
        <button class="type-pill ${form.type === 'dream' ? 'on dream' : ''}" data-type="dream">${icon('moon', 16)} 梦境</button>
        <button class="type-pill ${form.type === 'reality' ? 'on reality' : ''}" data-type="reality">${icon('sun', 16)} 现实</button>
      </div>

      <div class="field">
        <label>标题</label>
        <input class="input" id="recTitle" placeholder="给这段梦境起个名字…" value="${esc(editing?.title || '')}" />
      </div>

      <div class="field">
        <label>日期</label>
        <input class="input" id="recDate" type="date" value="${form.date}" />
      </div>

      <div class="field">
        <label>正文</label>
        <textarea class="textarea" id="recContent" placeholder="记录此刻的梦境，越细越好…">${esc(editing?.content || '')}</textarea>
      </div>

      ${editing
        ? `<div class="rec-edit-actions">
            <button class="btn btn-ghost btn-block rec-cancel">取消编辑</button>
            <button class="btn btn-primary btn-block rec-save">保存修改</button>
          </div>`
        : `<button class="btn btn-primary btn-block rec-save">保存记录</button>`}
    </div>`;

  openSheet({
    title: editing ? '编辑记录' : '新建记录',
    sub: editing ? '修改你的梦境或感受' : '选择类型，开始记录',
    bodyHtml,
    onMount: (sheet, close) => {
      const content = sheet.querySelector('#recContent');

      // 类型切换 + placeholder 联动
      sheet.querySelectorAll('.type-pill').forEach((b) => {
        b.addEventListener('click', () => {
          form.type = b.dataset.type;
          sheet.querySelectorAll('.type-pill').forEach((x) => {
            x.classList.remove('on', 'dream', 'reality');
          });
          b.classList.add('on', form.type);
          const titleInput = sheet.querySelector('#recTitle');
          titleInput.placeholder =
            form.type === 'dream' ? '给这段梦境起个名字…' : '给这件事起个标题…';
          content.placeholder =
            form.type === 'dream'
              ? '记录此刻的梦境，越细越好…'
              : '详细记录最近的经历，后续可用于分析梦境与现实间的关联…';
        });
      });

      // 初始化 placeholder
      content.placeholder =
        form.type === 'dream'
          ? '记录此刻的梦境，越细越好…'
          : '详细记录最近的经历，后续可用于分析梦境与现实间的关联…';

      // 日期同步
      sheet.querySelector('#recDate').addEventListener('change', (e) => {
        form.date = e.target.value;
      });

      // 取消编辑（仅编辑态显示）
      const cancelBtn = sheet.querySelector('.rec-cancel');
      if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
          close();
        });
      }

      // 保存
      sheet.querySelector('.rec-save').addEventListener('click', () => {
        const title = sheet.querySelector('#recTitle').value.trim();
        const c = sheet.querySelector('#recContent').value.trim();
        const date = sheet.querySelector('#recDate').value;

        if (!date) {
          showToast('请选择日期', { icon: 'info' });
          return;
        }
        if (!c) {
          showToast('请先写下内容', { icon: 'info' });
          return;
        }

        const data = {
          type: form.type,
          title: title || (form.type === 'dream' ? '一个未命名的梦' : '今日感受'),
          date,
          content: c,
          tags: [],
          imageUrl: editing?.imageUrl || ''
        };

        if (editing) {
          updateRecord(editing.id, data);
          showToast('已保存修改');
          close();
          navigate('detail', editing.id);
        } else {
          const rec = {
            id: genId('r'),
            ...data,
            published: false,
            createdAt: Date.now(),
            analysis: null
          };
          addRecord(rec);
          showToast('记录已保存', { icon: 'moon' });
          close();
          navigate('detail', rec.id);
        }
      });
    }
  });
}
