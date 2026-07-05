/* ============================================================
   pages/ai.js — AI 梦境宇宙
   ============================================================ */

import { getState } from '../state.js';
import { recentRecords } from '../repository.js';
import { icon, tag, empty, esc, formatDate } from '../components.js';

/* 复用周公解梦页的意象释义表（保持预览内容与详情页一致） */
const IMAGERY_MEANINGS = {
  '海洋': '象征着潜意识与情感的深邃，暗示内心正经历起伏与流动',
  '月亮': '代表直觉、阴性能量与内在的指引，常与神秘的觉知相连',
  '漂浮': '象征着对现实重压的暂时抽离，潜意识渴望自由与失重感',
  '银色': '象征着纯净与灵动，是直觉与梦境之光',
  '羽毛': '代表轻盈与释放，是心灵卸下负担的象征',
  '电梯': '象征着生活节奏与上升压力，常与事业或地位的攀升相关',
  '高楼': '代表目标、压力或心理高度，反映对成就的追逐',
  '坠落': '象征对失去掌控的恐惧，或潜意识对失败的隐忧',
  '门': '象征着转折与机会，是新旧阶段的交界',
  '鲸': '象征着庞大的内在自我与深邃的潜意识，常与孤独感和解',
  '深海': '代表着潜意识深处与情感的深渊',
  '心跳': '象征着生命节奏与自我意识的核心',
  '蓝光': '象征着冷静、深邃与精神层面的觉知',
  '楼梯': '象征着阶层、过渡与向内探索的路径',
  '石墙': '代表过去的积淀与心灵的边界',
  '螺旋': '象征着循环、成长与命运的回旋',
  '下行': '代表着向内深入或对潜意识的探索',
  '云': '象征着思绪、想象与超脱现实的轻盈',
  '城市': '代表社会关系与生活秩序',
  '弹跳': '象征着童心与生命力的回归',
  '粉色': '象征着柔软、温暖与情感的细腻',
  '信': '象征着未表达的心声与内在的召唤',
  '海底': '代表着潜意识深处与被掩埋的讯息',
  '玻璃瓶': '象征着封存的情感或保护的载体',
  '字': '代表着讯息、契约或内在的觉知',
  '森林': '象征着心灵的未知与生长的潜能',
  '光': '代表着觉知、希望与精神的照亮',
  '呼吸': '象征着生命力与当下的觉知',
  '飞行': '象征着自由、超越与精神层面的升华',
  '草地': '象征着生命的根基与自然的滋养',
  '云层': '代表着心境的层次与情感的屏障',
  '月光': '象征着直觉、灵感与阴性的智慧',
  '猫': '象征着独立、神秘与内在的指引者',
  '白色': '象征着纯净、灵性与新的开始',
  '金色': '象征着智慧、觉知与内在的光芒',
  '牙齿': '象征着自我形象与表达的力量',
  '镜子': '象征着自我审视与内在反射',
  '雨': '象征着净化、洗涤与情感的流动',
  '咖啡': '象征着沉思、温暖与生活的仪式感',
  '街灯': '象征着指引与温暖的微光',
  '影子': '象征着未被意识到的自我部分',
  '关东煮': '象征着生活中的微小慰藉与温暖',
  '电话': '象征着沟通、回忆与情感的联结',
  '书': '象征着智慧、沉淀与精神的滋养',
  '窗台': '象征着内外世界的交界与观察的视角'
};

/* 生成周公解梦预览段落（与详情页逻辑保持一致，但限制长度以便预览）
   每条统一为"意象+动词+释义"格式，使句子通顺连贯 */
function buildPreviewParagraph(record) {
  const a = record.analysis;
  const items = [];
  const seen = new Set();
  const verbs = ['象征着', '代表着', '暗示着', '寓意着'];
  if (a.realityLinks?.length) {
    a.realityLinks.forEach((link, i) => {
      if (seen.has(link.element)) return;
      seen.add(link.element);
      const v = verbs[i % verbs.length];
      items.push(`${link.element}${v}${link.meaning}`);
    });
  }
  for (const im of a.imagery || []) {
    if (seen.has(im)) continue;
    const mean = IMAGERY_MEANINGS[im];
    if (mean) {
      seen.add(im);
      items.push(`${im}${mean}`);
    }
  }
  for (const kw of a.keywords || []) {
    if (items.length >= 3) break;
    if (seen.has(kw)) continue;
    const mean = IMAGERY_MEANINGS[kw];
    if (mean) {
      seen.add(kw);
      items.push(`${kw}${mean}`);
    }
  }
  if (items.length === 0) {
    return '此梦意象多变，需结合自身当下情境细细体味其中隐喻。';
  }
  /* 预览只取前 3 条，截断控制长度 */
  const text = items.slice(0, 3).join('；') + '。';
  return text.length > 78 ? text.slice(0, 78) + '…' : text;
}

/* AI 功能入口（前 4 个 2×2 网格，第 5 个横向铺满） */
const AI_FEATURES = [
  { id: 'interpret', title: 'AI 解梦', desc: '深度解析梦境含义，解读潜意识讯息。', icon: 'sparkles', tint: 'purple' },
  { id: 'paint', title: 'AI 画梦', desc: '生成的图片，可直接保存到原梦境中。', icon: 'image', tint: 'pink' },
  { id: 'reality', title: '现实关联', desc: '连接梦境与现实的隐藏联系。', icon: 'link', tint: 'cyan' },
  { id: 'imagery', title: '意象统计', desc: '多维度分析梦境意象。', icon: 'chart', tint: 'gold' }
];
const AI_FEATURE_WIDE = { id: 'story', title: '梦境故事', desc: '用 AI 编织你的专属梦境故事，把碎片串成连续叙事。', icon: 'book', tint: 'purple' };

const TINT = {
  purple: 'qc-dream',
  pink: 'qc-pink',
  cyan: 'qc-cyan',
  gold: 'qc-gold'
};

/* 简单情绪趋势折线图（模拟近 7 次分析的积极度） */
function emotionTrend() {
  const pts = [0.42, 0.55, 0.48, 0.62, 0.7, 0.58, 0.88];
  const w = 260, h = 56, pad = 4;
  const step = (w - pad * 2) / (pts.length - 1);
  const coords = pts.map((v, i) => {
    const x = pad + i * step;
    const y = h - pad - v * (h - pad * 2);
    return { x, y, v };
  });
  const linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L ${coords[coords.length - 1].x.toFixed(1)} ${h - pad} L ${coords[0].x.toFixed(1)} ${h - pad} Z`;
  const dots = coords.map((c) => `<circle cx="${c.x.toFixed(1)}" cy="${c.y.toFixed(1)}" r="2.6" fill="#7B68EE"/>`).join('');
  const last = coords[coords.length - 1];
  return `<svg class="ai-trend" viewBox="0 0 ${w} ${h}" width="100%" height="${h}" preserveAspectRatio="none" aria-hidden="true">
    <defs>
      <linearGradient id="aiTrendFill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="rgba(123,104,238,0.28)"/>
        <stop offset="100%" stop-color="rgba(123,104,238,0)"/>
      </linearGradient>
    </defs>
    <path d="${areaPath}" fill="url(#aiTrendFill)"/>
    <path d="${linePath}" fill="none" stroke="#7B68EE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    ${dots}
    <circle cx="${last.x.toFixed(1)}" cy="${last.y.toFixed(1)}" r="4" fill="#fff" stroke="#7B68EE" stroke-width="2"/>
  </svg>`;
}

export function render() {
  const analyzed = getState().records.filter((r) => r.analysis);
  const latest = analyzed.length
    ? [...analyzed].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))[0]
    : null;

  const emotionTags = ['积极', '探索', '成长', '自由'];

  return `
  <div class="ai page pad-fab">
    <!-- 宇宙背景 -->
    <div class="ai-cosmos-bg" aria-hidden="true">
      <div class="ai-cosmos-nebula ai-cosmos-nebula-purple"></div>
      <div class="ai-cosmos-nebula ai-cosmos-nebula-pink"></div>
      <div class="ai-cosmos-nebula ai-cosmos-nebula-cyan"></div>
      <div class="ai-cosmos-stars">
        ${Array.from({ length: 40 }, () => {
          const left = Math.random() * 100;
          const top = Math.random() * 100;
          const size = 0.6 + Math.random() * 1.8;
          const delay = Math.random() * 4;
          const duration = 2.4 + Math.random() * 3.2;
          return `<span style="left:${left.toFixed(2)}%;top:${top.toFixed(2)}%;width:${size.toFixed(2)}px;height:${size.toFixed(2)}px;animation-delay:${delay.toFixed(2)}s;animation-duration:${duration.toFixed(2)}s"></span>`;
        }).join('')}
      </div>
    </div>

    <!-- 顶部标题区 -->
    <header class="ai-page-head">
      <div class="ai-page-text">
        <h1 class="serif ai-page-title">AI 梦境宇宙</h1>
        <p class="ai-page-sub">解析梦境·连接内心与现实桥梁</p>
      </div>
      <button class="ai-page-bell" data-act="home-bell" aria-label="通知">
        ${icon('bell', 20)}
      </button>
    </header>

    <!-- 功能入口区 -->
    <div class="ai-grid">
      ${AI_FEATURES.map((m) => `
        <button class="ai-card ${TINT[m.tint] || ''}" data-act="ai-module" data-mod="${m.id}">
          <span class="ai-card-ico">${icon(m.icon, 22)}</span>
          <span class="ai-card-title">${esc(m.title)}</span>
          <span class="ai-card-desc">${esc(m.desc)}</span>
        </button>`).join('')}
    </div>
    <button class="ai-card-wide ${TINT[AI_FEATURE_WIDE.tint]}" data-act="ai-module" data-mod="${AI_FEATURE_WIDE.id}">
      <span class="ai-card-ico">${icon(AI_FEATURE_WIDE.icon, 24)}</span>
      <div class="ai-wide-body">
        <span class="ai-card-title">${esc(AI_FEATURE_WIDE.title)}</span>
        <span class="ai-card-desc">${esc(AI_FEATURE_WIDE.desc)}</span>
      </div>
      <span class="ai-wide-tag">立即体验</span>
    </button>

    <!-- 最近分析 -->
    <div class="section-title">
      <h3>最近分析</h3>
      <button class="more" data-act="ai-all-records">全部记录 ${icon('chevron', 14)}</button>
    </div>

    ${latest
      ? `<article class="ai-latest" data-act="open-ai-analysis" data-id="${latest.id}">
          <div class="ai-latest-head">
            ${tag('周公解梦', 'tag-gold')}
            <span class="ai-latest-date">${esc(formatDate(latest.date || latest.createdAt, true))}</span>
          </div>
          <h4 class="ai-latest-title">${esc(latest.title)}</h4>

          ${(latest.analysis.keywords || []).length
            ? `<div class="ai-latest-section">
                <div class="ai-latest-label">【梦境关键词】</div>
                <div class="ai-latest-keys">${esc(latest.analysis.keywords.slice(0, 5).join('、'))}</div>
              </div>`
            : ''}

          <div class="ai-latest-section">
            <div class="ai-latest-label">【周公解梦】</div>
            <p class="ai-latest-text">${esc(buildPreviewParagraph(latest))}</p>
          </div>
        </article>`
      : empty('✨', '还没有 AI 解读，从梦境详情开始分析吧')}

    <p class="page-foot muted">梦迹 DreamTrace  · 用梦境照亮白天</p>
  </div>`;
}

export function afterRender(appEl) {
  /* 暂无需要绑定的事件，保留接口 */
}
