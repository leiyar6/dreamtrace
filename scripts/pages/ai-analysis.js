/* ============================================================
   pages/ai-analysis.js — AI 梦境解读（周公解梦风格）
   ============================================================ */

import { getRecord, getPost } from '../repository.js';
import { icon, esc, formatDate } from '../components.js';

/* 常见梦境意象释义表 */
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

/* 根据情绪推断吉凶 */
function judgeFortune(emotions) {
  if (!emotions) return { level: '吉', text: '吉', color: '#c0392b' };
  const positive = (emotions['宁静'] ?? 0) + (emotions['喜悦'] ?? 0);
  const negative = (emotions['恐惧'] ?? 0) + (emotions['悲伤'] ?? 0) + (emotions['愤怒'] ?? 0);
  const mystery = emotions['神秘'] ?? 0;
  if (positive > negative + 0.2) return { level: '吉', text: '吉', color: '#c0392b' };
  if (negative > positive + 0.2) return { level: '凶', text: '凶', color: '#3a539b' };
  if (mystery > 0.5) return { level: '中吉', text: '中吉', color: '#7B68EE' };
  return { level: '平', text: '平', color: '#5C5575' };
}

/* 生成【周公解梦】段落：基于 realityLinks 与意象释义表
   每条统一为"意象+动词+释义"格式，使句子通顺连贯 */
function buildZhouGongParagraph(analysis) {
  const items = [];
  const seen = new Set();
  /* 连接动词池，根据意象类型选择更贴切的动词 */
  const verbs = ['象征着', '代表着', '暗示着', '寓意着'];
  /* 优先使用 realityLinks（已有意象 + 含义，但缺少连接动词） */
  if (analysis.realityLinks?.length) {
    analysis.realityLinks.forEach((link, i) => {
      const key = link.element;
      if (seen.has(key)) return;
      seen.add(key);
      const v = verbs[i % verbs.length];
      items.push(`${key}${v}${link.meaning}`);
    });
  }
  /* 用 imagery 补充（IMAGERY_MEANINGS 已含"象征着"等动词） */
  for (const im of analysis.imagery || []) {
    if (seen.has(im)) continue;
    const mean = IMAGERY_MEANINGS[im];
    if (mean) {
      seen.add(im);
      items.push(`${im}${mean}`);
    }
  }
  /* 用 keywords 兜底，确保至少 3 条 */
  for (const kw of analysis.keywords || []) {
    if (items.length >= 4) break;
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
  /* 每句用；分隔，最后以。结尾 */
  return items.slice(0, 5).join('；') + '。';
}

/* 生成【综合判断】论述段落 */
function buildSummaryParagraph(analysis, fortune) {
  const parts = [];
  if (analysis.themeDesc) parts.push(analysis.themeDesc);
  /* 补充一段基于吉凶的延伸论述 */
  const fortuneDesc = {
    '吉': '此梦整体气象清明，暗示着内心正在走向和解与稳定，外在环境也会随之渐入佳境。',
    '凶': '此梦虽显警示之象，但梦境本身就是潜意识的提醒，正视内在所忧，便能化解困局。',
    '中吉': '此梦玄机暗藏，看似平常却蕴含深层讯息，宜静心细品其中意味。',
    '平': '此梦平稳，主心绪平和，无大碍亦无大波澜，宜守不宜进。'
  };
  if (fortuneDesc[fortune.level]) parts.push(fortuneDesc[fortune.level]);
  if (analysis.suggestion) parts.push(analysis.suggestion);
  if (parts.length === 0) {
    return `此梦为${fortune.text}，建议结合现实处境，以本心为念，从容应对。`;
  }
  return parts.join('');
}

function resolve(id) {
  return getRecord(id) || getPost(id);
}

export function render(params) {
  const id = params?.[0];
  const r = resolve(id);
  if (!r || !r.analysis) {
    return `<div class="page"><div class="empty"><div class="emo">✨</div><div class="txt">暂无 AI 解读</div>
      <button class="btn btn-ghost btn-sm" data-act="back">返回</button></div></div>`;
  }
  const a = r.analysis;
  const fortune = judgeFortune(a.emotions);
  const keywords = a.keywords || [];
  const zhouGongText = buildZhouGongParagraph(a);
  const summaryText = buildSummaryParagraph(a, fortune);

  return `
  <div class="ai-detail page">
    <header class="sub-head">
      <button class="btn-icon" data-act="back" aria-label="返回">${icon('arrow', 20)}</button>
      <span class="sub-head-title">周公解梦</span>
      <span class="grow"></span>
      <button class="btn-icon" data-act="com-share" aria-label="分享">${icon('share', 18)}</button>
    </header>

    <!-- 周公解梦正文 -->
    <article class="zg-scroll">
      <!-- 梦境标题 -->
      <h1 class="zg-dream-title serif">梦境：${esc(r.title)}</h1>
      <div class="zg-dream-date">${esc(formatDate(r.date || r.createdAt, true))}</div>

      <!-- 梦境详情 -->
      <section class="zg-block">
        <div class="zg-block-label">【梦境详情】</div>
        <p class="zg-paragraph">${esc(r.content || '')}</p>
      </section>

      <!-- 梦境关键词 -->
      ${keywords.length ? `
        <section class="zg-block">
          <div class="zg-block-label">【梦境关键词】</div>
          <div class="zg-keywords">${esc(keywords.join('、'))}</div>
        </section>` : ''}

      <!-- 周公解梦 -->
      <section class="zg-block">
        <div class="zg-block-label">【周公解梦】</div>
        <p class="zg-paragraph">${esc(zhouGongText)}</p>
      </section>

      <!-- 综合判断 -->
      <section class="zg-block">
        <div class="zg-block-label zg-judge-label">
          【综合判断】
          <span class="zg-fortune-tag" style="color:${fortune.color};border-color:${fortune.color}">${esc(fortune.text)}</span>
        </div>
        <p class="zg-paragraph">${esc(summaryText)}</p>
      </section>

      <p class="zg-foot muted">AI 解读仅供参考，吉凶非定数，请以本心为念。</p>
    </article>
  </div>`;
}
