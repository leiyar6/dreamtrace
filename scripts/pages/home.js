/* ============================================================
   pages/home.js — 梦境栖息地（高保真首页）
   ============================================================ */

import { getState, todayStr } from '../state.js';
import { addRecord, genId, recentRecords } from '../repository.js';
import { icon, esc } from '../components.js';
import { openSheet, showToast } from '../feedback.js';

/* 近期梦境图片轮播数据：只显示有图片且有标题的梦境记录 */
function dreamsSlides() {
  const recs = recentRecords(20).filter(
    (r) => r.type === 'dream' && r.imageUrl && r.title
  ).slice(0, 6);
  return recs.map((r) => ({
    src: r.imageUrl,
    title: r.title,
    date: r.date || '',
    mood: r.mood || '',
    id: r.id
  }));
}

function formatSlideDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  if (isNaN(d)) return dateStr;
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

/* ---------- 文生图（水彩梦境手帐插画风：云端梦岛+月亮树 / 熟睡女孩+梦云 / 3张手帐统计插画） ---------- */
const img = (prompt, size) =>
  `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=${size}&v=20260705d`;

const HERO_IMG = img(
  `Gentle healing dreamy watercolor illustration for an iOS app home screen hero background. Vertical mobile portrait composition (390:844 ratio). BALANCED WARM + COOL color palette: cool tones (soft light blue, pale sky blue, periwinkle blue, soft lavender, light purple, lilac) blended with WARM tones (warm cream-white, soft peach, pale gold, warm moon-yellow, soft rose-pink, dusty pink, amber). The scene should feel dreamy and healing with a balanced mix of cool blue-purple and warm gold-peach-pink tones - not too cold, not too warm. Delicate paper grain texture and soft watercolor bleed edges. CRITICAL: This is an illustration ONLY, NOT a picture of a phone, NOT a mockup of a device, NOT a screen inside a screen. It is a flat background illustration that will be used directly as a phone screen background - draw ONLY the dreamy scene, do NOT draw any phone frame, phone body, screen bezel, or device.

CRITICAL: All scene elements MUST be concentrated in the TOP 40% of the image. The bottom 60% must be a soft cream-white, warm peach, light blue, and lavender watercolor wash with no subjects, no objects, no illustration content - just gentle gradient fade, because this area is covered by the app content area and is not visible.

THEME: "Cloud Dream Island at Twilight" - a surreal dreamy floating island in a twilight starry sky, symbolizing the inner world of dreams and the journey of recording them. The scene blends the coolness of a dreamy night sky with the warmth of glowing lights, lanterns, flowers, and golden moonlight. The scene conveys "wandering in dreams, recording the journey of the soul".

All elements below MUST be present and arranged compactly in the TOP 40% of the image, filling edge-to-edge:

(1) TWILIGHT NIGHT SKY: A vast gradient night sky filling the upper background, blending soft light blue, lavender-purple, light purple, with WARM peach, soft gold, and rose-pink tints near the horizon. The sky has a dreamy blue-purple-to-warm-peach gradient, like twilight just before night. The sky is the dreamy canvas of the scene.
(2) CRESCENT MOON: A large softly glowing warm-yellow crescent moon, elegant and curved, placed in the FAR UPPER-RIGHT CORNER of the sky (near the top-right edge), radiating soft warm golden light. It is the guardian of dreams. The moon should be positioned as far to the upper-right as possible while remaining fully visible. The moon has a warm golden halo.
(3) TWINKLING STARS: Many tiny twinkling stars and glowing light dots scattered across the entire night sky, with soft halos, like a dreamy starfield. Some stars are five-pointed, some are tiny dots, some form faint constellations. Stars should have soft light blue, light purple, AND warm gold glows - a mix of cool and warm stars.
(4) FLOATING CLOUD ISLAND: A soft fluffy cloud floating in the center-left of the scene, shaped like a small floating island, serving as the dream stage. The cloud is light blue, lavender, cream-white, with WARM peach and pale gold tints, soft feathered watercolor edges, with light purple and soft pink shadows.
(5) DREAM MOON TREE: A small whimsical tree growing on the cloud island, with a soft warm-brown trunk and delicate branches. Instead of leaves, the tree bears tiny glowing warm-gold moons, soft pink star blossoms, light blue cloud blossoms, and small warm amber fruits of light - it is a "dream tree" where dreams grow. The tree radiates a warm gentle glow.
(6) WARM LANTERNS: Two or three small warm-glowing paper lanterns hanging from the branches of the dream tree, casting a soft amber light. The lanterns add warmth and a cozy magical feeling.
(7) GLOWING FIREFLIES: A few tiny glowing fireflies floating around the cloud island and tree, with warm yellow-green soft light, like little dream guardians. They add movement and warmth.
(8) OPEN DREAM JOURNAL: An open dream journal book resting on the cloud island beneath the tree, shown from a slight top angle so both pages are visible. It is the visual anchor of "recording dreams". The book has a soft warm cream-beige cover with a gold ribbon.
(9) HANDWRITTEN TEXT: The open journal pages contain delicate handwritten text lines and small dream illustrations drawn in the margins - tiny moons, stars, clouds, heart lines, and small floral doodles, like a personal dream diary.
(10) SLEEPING MOON RABBIT: A tiny cute sleeping moon rabbit (soft white with warm cream and light lavender shadows, long soft ears, curled up peacefully, eyes closed) resting near the journal on the cloud, symbolizing the dreamer. It should look gentle and poetic, not childish cartoon. A small warm glow surrounds the rabbit.
(11) FLOATING FEATHER PEN: A soft white feather quill pen floating gently above the journal, with a thin trail of sparkling dream dust in light blue, light purple, AND warm gold, as if it just finished writing.
(12) DREAM BUBBLES: A few translucent dream bubbles floating around the cloud island, each containing a tiny scene inside - a tiny moon, a tiny star, a tiny flower, a tiny cloud - like captured dream fragments. Bubbles have iridescent shimmer with light blue, light purple, and warm pink tones.
(13) STAR VINES + FLOWER VINES: Delicate vine-like trails of tiny stars, light dots, and small soft pink dream roses curling around the moon tree and the cloud island, connecting the elements like dream threads. The vines have light blue, light purple, soft pink, and warm gold glows.
(14) WARM FLOWERS: A few small soft dream flowers (roses, daisies, lavender blooms) growing on the cloud island near the journal, in soft pink, warm gold, cream-white, and light purple colors. They add warmth and life.
(15) MIST HALO: A soft light blue, lavender, and WARM peach-gold mist halo surrounding the cloud island, blending the cloud edges into the twilight sky, creating a floating dreamy atmosphere.
(16) GLOWING LIGHT DUST: Scattered glowing light dust and tiny shimmering particles sprinkled throughout the scene in light blue, light purple, warm gold, and soft pink, like dream magic in the air.
(17) SOFT CLOUD WISPS: A few soft cloud wisps in light blue, lavender, and warm peach drifting in the background sky around the moon and stars, adding depth and layering.
(18) SHOOTING STAR: One delicate shooting star streaking across the upper sky with a soft warm gold trail, adding a wish-making magical moment.
(19) DREAM SYMBOLS: Delicate hand-drawn dream symbols scattered in the air - tiny crescent moons, small stars, soft heart shapes, small flower outlines, crescent moon outlines - like a poetic dream aura, in warm gold and soft pink tones.

COMPOSITION LAYOUT (top to bottom, all within top 40%):
- TOP STRIP: vast twilight night sky (cool blue-purple + warm peach-gold gradient) with crescent moon (FAR UPPER-RIGHT CORNER), many twinkling stars, shooting star, soft cloud wisps, dream symbols
- CENTER: floating cloud island (center-left) with dream moon tree + warm lanterns, glowing fireflies, open journal, sleeping moon rabbit, floating feather pen, warm flowers
- FOREGROUND: cloud island base with light blue-purple-warm mist halo, dream bubbles floating around, star + flower vines curling, glowing light dust sprinkled
- ACCENTS: dream symbols, light dust, fireflies, and soft mist throughout

The entire top 40% must be filled edge-to-edge with all these elements, NO empty white gaps on left or right sides. Soft light blue, lavender, and warm peach watercolor wash fills any background gaps. The lower 60% is a smooth gradient fade from the scene to soft cream-white with light blue, light purple, and warm peach tints, with no subjects.

Overall mood: poetic, surreal, dreamy, healing, warm yet cool, like a watercolor dream journal page coming to life, depicting a floating cloud island where dreams grow on trees under a warm golden moon, lit by lanterns and fireflies. Balanced warm gold-peach-pink and cool blue-purple-lavender tones throughout. Soft feathered watercolor edges, gentle warm moonlight and soft starlight glow, no harsh shadows. No 3D, no photorealism, no cyberpunk, no neon, no thick black outlines, no high-contrast hard shadows, not childish cartoon style.

CRITICAL BORDER RULE: No black border, no dark border, no dark edges, no frame, no outline of any color around the image edges. The image must have NO black or dark margins on any edge - all four edges must blend seamlessly with soft watercolor wash. Edge-to-edge full bleed illustration with no surrounding margin or dark band of any color.`,
  'portrait_16_9'
);
const TODAY_IMG = img(
  `Gentle watercolor dream illustration style small UI card illustration. Main subject is a peacefully sleeping young girl lying on her side on a soft pillow, eyes closed with calm healing expression, long soft dark-brown or purple-brown hair with gentle waves and fluffy volume. She is covered by a lavender to cream-white gradient soft blanket with soft watercolor bleed on the edges. Above the girl floats a dream cloud in lavender, pale blue, and cream-white gradient with soft fluffy edges. Inside the dream cloud is a tiny crescent moon, a few small stars, and faint light dots symbolizing dreaming. Around her are subtle accents of tiny plant leaf sprigs, soft star points, and light mist. Background stays clean light cream. Sticker-like watercolor hand-drawn feel, soft edges, warm quiet lighting, suitable for small display. No photorealism, no 3D, no exaggerated cartoon, no thick black lines. CRITICAL: No black border, no dark border, no outline, no frame, no dark edges of any color around or inside the image. The image has soft feathered edges that blend seamlessly. Square format.`,
  'square_hd'
);
/* 轮播图专用宽幅梦境插画（landscape_16_9 匹配 slide 宽矩形比例，避免黑边） */
const SLIDE_IMG_A = img(
  `Gentle dreamy watercolor illustration, WIDE HORIZONTAL LANDSCAPE FORMAT (16:9 ratio). A serene dreamscape: a softly glowing crescent moon in the upper right corner of a twilight sky blending lavender, periwinkle blue, soft peach and warm gold tones. Below, a calm mirror-like sea with a silver moonlight reflection path stretching across the water. A small delicate figure floats peacefully on the water surface, eyes closed, draped in flowing lavender and cream-white fabric. Tiny twinkling stars scatter across the sky, a few translucent dream bubbles float around the figure, soft mist hovers over the water. The entire scene fills the full width edge-to-edge with no empty margins. Soft feathered watercolor bleed on all four edges, balanced warm gold-peach and cool blue-purple tones, dreamy healing atmosphere. No text, no words, no letters. CRITICAL: No black border, no dark border, no frame, no outline, no dark edges of any color. The image fully bleeds to all four edges edge-to-edge with no surrounding margin or dark band.`,
  'landscape_16_9'
);
const SLIDE_IMG_B = img(
  `Gentle dreamy watercolor illustration, WIDE HORIZONTAL LANDSCAPE FORMAT (16:9 ratio). A cozy dreamy night scene: a softly glowing warm-yellow crescent moon hanging in a twilight sky of lavender, dusty pink and soft purple. Below, a quiet misty forest path winding through tall slender trees with soft purple-pink foliage, tiny warm glowing lanterns hanging from branches casting amber light pools. A small gentle figure in a cream-white cloak walks along the path holding a tiny glowing star. Fireflies drift between the trees, soft mist hugs the ground. The entire scene fills the full width edge-to-edge with no empty margins. Soft feathered watercolor bleed on all four edges, balanced warm gold-amber and cool purple-blue tones, peaceful dreamy healing atmosphere. No text, no words, no letters. CRITICAL: No black border, no dark border, no frame, no outline, no dark edges of any color. The image fully bleeds to all four edges edge-to-edge with no surrounding margin or dark band.`,
  'landscape_16_9'
);
const SLIDE_FALLBACKS = [SLIDE_IMG_A, SLIDE_IMG_B];
const STAT_STYLE = 'Gentle watercolor dream journal illustration style, low saturation cream-white lavender-purple and warm moon-yellow color palette, paper grain texture with soft bleed edges, healing quiet dreamy light hand-drawn feeling, suitable for iOS App small stat card illustration, simple composition clear subject generous empty space clean light cream background, sticker-like illustration no 3D no photorealism no cyberpunk no thick black outlines, CRITICAL absolutely no border no frame no outline no edge of any color around or inside the image, the illustration fully bleeds to all four edges of the frame edge-to-edge with no surrounding border margin or dark band of any color';
const STAT1_IMG = img(
  `${STAT_STYLE}. A small delicate monthly record illustration: the main subject is a dream journal book or rounded-corner calendar card on warm cream-beige paper with faint page lines and soft shadow, the number 12 is clearly and prominently displayed on the page showing 12 days recorded this month. Surrounding it are small decorative elements: tiny crescent moon, twinkling stars, checkmark tick marks, date dots, and soft lavender dream cloud wisps, giving a cozy dream-journal decoration feeling with gentle statistics vibe. Overall cute, tidy, light dream atmosphere, not photorealistic, flat cute style. No letters no words other than the number 12. Square format.`,
  'square_hd'
);
const STAT2_IMG = img(
  `${STAT_STYLE}. A dreamy moon-themed illustration as the core subject: a softly glowing warm-yellow crescent moon with rounded elegant shape and gentle light halo, surrounded by light lavender clouds, tiny twinkling stars, floating light dots and soft mist, creating a quiet dreamy night atmosphere. Healing picture-book illustration feel, gentle watercolor edges, not photorealistic. Surrounded by small decorative stars and cloud wisps, dream journal sticker feeling. No text no words. Square format.`,
  'square_hd'
);
const STAT3_IMG = img(
  `${STAT_STYLE}. A little girl character as the core subject: a cute gentle little girl with round face, long soft dark-brown or purple-brown hair, quiet healing expression, in a peaceful pose sitting curled or looking up gently at a tiny moon, wearing a lavender cream-white or soft pink dress or nightgown. Around her float a few small stars, soft clouds, tiny moon and delicate flower/leaf elements, creating a gentle dream atmosphere. Like a character sticker from a dream journal, cute rounded kawaii style with soft watercolor edges. No text no words. The illustration extends fully to all four edges of the frame with no surrounding border or dark band. Square format.`,
  'square_hd'
);

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return '夜深了，愿好梦常伴你';
  if (h < 11) return '早安，愿好梦常伴你';
  if (h < 14) return '午安，愿好梦常伴你';
  if (h < 18) return '下午好，愿好梦常伴你';
  if (h < 22) return '晚上好，愿好梦常伴你';
  return '夜深了，愿好梦常伴你';
}

function moonMark() {
  return `<svg viewBox="0 0 24 24" width="34" height="34" fill="none" aria-hidden="true">
    <path d="M20 13.5A8 8 0 1 1 10.5 4 6 6 0 0 0 20 13.5z" fill="#5C4FD6"/>
    <circle cx="16" cy="9" r="1.5" fill="#FFD66B"/>
  </svg>`;
}

function statCard({ src, title, value, unit, badge, desc, big }) {
  return `<div class="stat-card${big ? ' stat-big' : ''}">
    <div class="stat-art"><img src="${src}" alt="" loading="lazy" onerror="this.style.opacity=0"/></div>
    <div class="stat-title">${esc(title)}</div>
    <div class="stat-value ${badge ? 'is-text' : ''}">${esc(value)}${
      unit ? `<span class="stat-unit">${esc(unit)}</span>` : ''
    }</div>
    ${badge ? `<div class="stat-badge">${esc(badge)}</div>` : ''}
    <div class="stat-desc">${esc(desc)}</div>
  </div>`;
}

export function render() {
  const stats = [
    { src: STAT1_IMG, title: '本月共记录', value: '12', unit: '天', badge: '累计统计', desc: '已坚持记录' },
    { src: STAT2_IMG, title: '本月高频意象', value: '月亮', badge: '出现最多', desc: '共出现 5 次' },
    { src: STAT3_IMG, title: '本月高频人物', value: '小女孩', badge: '出现最多', desc: '共出现 4 次' }
  ];

  return `
  <div class="home">
    <!-- Hero 梦境背景区 -->
    <section class="hero">
      <div class="hero-bg" style="background-image:url('${HERO_IMG}')"></div>
      <div class="hero-veil"></div>
      <span class="hero-star s1"></span>
      <span class="hero-star s2"></span>
      <span class="hero-star s3"></span>

      <div class="hero-top">
        <div class="brand">
          <span class="brand-mark">${moonMark()}</span>
          <span class="brand-name serif">梦迹</span>
        </div>
        <button class="bell" data-act="home-bell" aria-label="通知">
          ${icon('bell', 22)}
        </button>
      </div>

      <div class="hero-copy">
        <p class="hero-hi">${esc(greeting())} ✨</p>
        <h1 class="hero-title serif">你今天梦到了什么？</h1>
        <p class="hero-sub">记录梦境，探索潜意识的秘密</p>
      </div>
    </section>

    <!-- 奶油白内容区（覆盖 Hero 底部，圆角过渡） -->
    <div class="home-content">
      <!-- 近期梦境图片轮播（与原今日状态卡片同尺寸） -->
      <section class="today-carousel" id="todayCarousel">
        <div class="tc-head">
          <span class="tc-head-title">近期梦境</span>
          <span class="tc-head-sub">${dreamsSlides().length} 段梦境</span>
        </div>
        <div class="tc-track" id="tcTrack">
          ${dreamsSlides().map((s) => `
            <div class="tc-slide"${s.id ? ` data-act="open-record" data-id="${s.id}"` : ''}>
              <img src="${s.src}" alt="${esc(s.title)}" loading="eager" decoding="async" onerror="this.onerror=null;this.src='${SLIDE_IMG_A}'"/>
              <div class="tc-cap">
                ${s.date ? `<span class="tc-date">${formatSlideDate(s.date)}</span>` : ''}
                <span class="tc-title">${esc(s.title)}</span>
                ${s.mood ? `<span class="tc-mood">${esc(s.mood)}</span>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
        <div class="tc-dots" id="tcDots">
          ${dreamsSlides().map((_, i) => `<span class="tc-dot${i === 0 ? ' on' : ''}"></span>`).join('')}
        </div>
      </section>

      <!-- 本月数据统计 -->
      <div class="stats-block">
        <div class="stats-row">
          ${stats.map(statCard).join('')}
        </div>
      </div>

      <!-- 快速记录按钮 -->
      <div class="quick-block">
        <div class="rec-row">
          <button class="rec-btn rec-voice" data-act="home-voice">
            <span class="rec-ico">${icon('mic', 24)}</span>
            <span class="rec-meta">
              <span class="rec-main">语音记录</span>
              <span class="rec-sub">按住说出你的梦</span>
            </span>
          </button>
          <button class="rec-btn rec-text" data-act="home-text">
            <span class="rec-ico">${icon('pen', 24)}</span>
            <span class="rec-meta">
              <span class="rec-main">文字记录</span>
              <span class="rec-sub">写下你的梦境</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>`;
}

/* 首页：Hero 延伸到状态栏背后 + 禁用滚动，内容刚好填满 */
export function afterRender(appEl) {
  appEl.style.position = 'absolute';
  appEl.style.top = '0';
  appEl.style.left = '0';
  appEl.style.right = '0';
  appEl.style.bottom = '0';
  appEl.style.padding = '0';
  appEl.style.overflow = 'hidden';
  const shell = document.querySelector('.phone-shell');
  if (shell) shell.classList.add('is-home');
  initCarousel();
}

/* ---------- 近期梦境图片轮播 ---------- */
let carouselTimer = null;
function initCarousel() {
  if (carouselTimer) { clearInterval(carouselTimer); carouselTimer = null; }
  const track = document.getElementById('tcTrack');
  const dotsBox = document.getElementById('tcDots');
  if (!track || !dotsBox) return;
  const slides = track.querySelectorAll('.tc-slide');
  const dots = dotsBox.querySelectorAll('.tc-dot');
  const total = slides.length;
  if (total <= 1) return;
  let idx = 0;
  const go = (n) => {
    idx = (n + total) % total;
    track.style.transform = `translateX(-${idx * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('on', i === idx));
  };
  dots.forEach((d, i) => d.addEventListener('click', () => go(i)));
  /* 触摸滑动支持 */
  let startX = 0, deltaX = 0, dragging = false;
  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    dragging = true;
    if (carouselTimer) clearInterval(carouselTimer);
    track.style.transition = 'none';
  }, { passive: true });
  track.addEventListener('touchmove', (e) => {
    if (!dragging) return;
    deltaX = e.touches[0].clientX - startX;
    track.style.transform = `translateX(calc(-${idx * 100}% + ${deltaX}px))`;
  }, { passive: true });
  track.addEventListener('touchend', () => {
    if (!dragging) return;
    dragging = false;
    track.style.transition = '';
    if (Math.abs(deltaX) > 40) go(idx + (deltaX < 0 ? 1 : -1));
    else go(idx);
    deltaX = 0;
    carouselTimer = setInterval(() => go(idx + 1), 3500);
  });
  carouselTimer = setInterval(() => go(idx + 1), 3500);
}

export function beforeLeave() {
  const shell = document.querySelector('.phone-shell');
  if (shell) shell.classList.remove('is-home');
  if (carouselTimer) { clearInterval(carouselTimer); carouselTimer = null; }
}

/* ============================================================
   语音记录弹窗
   ============================================================ */
export function openVoiceSheet() {
  const bodyHtml = `
    <div class="vs" id="vsRoot">
      <!-- 日期选择 -->
      <div class="field">
        <label>日期</label>
        <input class="input" id="vsDate" type="date" value="${todayStr()}" />
      </div>
      <!-- 实时文字展示区（淡紫底，可滚动） -->
      <div class="vs-text-wrap">
        <textarea class="vs-text" id="vsText" placeholder="按住按钮，说出你的梦" readonly></textarea>
      </div>
      <!-- 聆听状态指示器（默认隐藏） -->
      <div class="vs-listening" id="vsListening" hidden>
        <span class="vs-pulse-dot"></span>
        <span class="vs-listening-text">正在聆听...</span>
      </div>
      <!-- 底部控制区 -->
      <div class="vs-foot" id="vsFoot">
        <!-- 状态 A：待录制 - 大圆按住按钮 -->
        <button class="vs-mic-btn" id="vsMicBtn" type="button" aria-label="按住说话">
          <span class="vs-mic-icon">${icon('mic', 28)}</span>
          <span class="vs-mic-label">按住 说话</span>
        </button>
        <!-- 状态 B：录制完成 - 三操作按钮 -->
        <div class="vs-actions" id="vsActions" hidden>
          <button class="btn btn-soft" id="vsDiscard" type="button">舍弃</button>
          <button class="btn btn-ghost" id="vsEdit" type="button">编辑</button>
          <button class="btn btn-primary" id="vsSave" type="button">保存</button>
        </div>
      </div>
    </div>`;

  openSheet({
    title: '语音记录梦境',
    sub: '在安静的环境下，慢慢说出你的梦境',
    bodyHtml,
    onMount: (sheet, close) => {
      const text = sheet.querySelector('#vsText');
      const listeningEl = sheet.querySelector('#vsListening');
      const micBtn = sheet.querySelector('#vsMicBtn');
      const foot = sheet.querySelector('#vsFoot');
      const actions = sheet.querySelector('#vsActions');
      const discardBtn = sheet.querySelector('#vsDiscard');
      const editBtn = sheet.querySelector('#vsEdit');
      const saveBtn = sheet.querySelector('#vsSave');

      const PLACEHOLDER = '按住按钮，说出你的梦';

      let listening = false;
      let editing = false;
      let waitingResult = false;

      /* ---------- Web Speech API 实时语音识别 ---------- */
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      let recognition = null;
      let restartCount = 0;          // 重启计数，避免无限循环
      const MAX_RESTART = 30;        // 最多重启次数（约 30 次静音间隔）

      if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.lang = 'zh-CN';
        recognition.continuous = true;
        recognition.interimResults = true;

        // 实时识别结果：拼接最终 + 中间文字
        recognition.onresult = (event) => {
          restartCount = 0; // 收到结果，重置计数
          let final = '';
          let interim = '';
          for (let i = 0; i < event.results.length; i++) {
            const t = event.results[i][0].transcript;
            if (event.results[i].isFinal) final += t;
            else interim += t;
          }
          text.value = final + interim;
          text.scrollTop = text.scrollHeight;
        };

        // 错误处理：区分致命错误与可恢复错误
        recognition.onerror = (event) => {
          const err = event.error;
          // 致命错误：权限被拒 / 服务不可用 / 终止
          if (err === 'not-allowed' || err === 'service-not-allowed' || err === 'aborted') {
            showToast('请允许麦克风权限', { icon: 'info' });
            listening = false;
            waitingResult = false;
            micBtn.classList.remove('listening');
            listeningEl.hidden = true;
            text.placeholder = PLACEHOLDER;
            return;
          }
          // 可恢复错误：no-speech（静音）/ network / audio，按住中由 onend 自动重启
          // 不修改 listening 状态，让 onend 处理重启
        };

        // 识别结束：根据状态决定下一步
        recognition.onend = () => {
          if (listening) {
            // 用户还在按住，自动重启继续识别
            if (restartCount < MAX_RESTART) {
              restartCount++;
              // 延迟 100ms 重启，避免过快循环
              setTimeout(() => {
                if (listening) {
                  try { recognition.start(); } catch (e) {}
                }
              }, 100);
            } else {
              // 达到重启上限，停止识别
              listening = false;
              waitingResult = false;
              micBtn.classList.remove('listening');
              listeningEl.hidden = true;
              showToast('录制时间过长，请重新按住', { icon: 'info' });
            }
          } else if (waitingResult) {
            // 用户已松开，处理最终结果
            waitingResult = false;
            restartCount = 0;
            const content = text.value.trim();
            if (content) {
              goResult();
            } else {
              // 无识别内容，回到待录制状态
              micBtn.classList.remove('listening');
              listeningEl.hidden = true;
              text.value = '';
              text.placeholder = PLACEHOLDER;
              micBtn.hidden = false;
              actions.hidden = true;
              showToast('未识别到内容，请重试', { icon: 'info' });
            }
          }
        };
      }

      /* ---------- 状态 A：待录制（初始 / 舍弃后） ---------- */
      const goIdle = () => {
        listening = false;
        editing = false;
        waitingResult = false;
        micBtn.classList.remove('pressed', 'listening');
        text.value = '';
        text.placeholder = PLACEHOLDER;
        text.readOnly = true;
        listeningEl.hidden = true;
        micBtn.hidden = false;
        actions.hidden = true;
        editBtn.textContent = '编辑';
      };

      /* ---------- 聆听中：按住大圆按钮 ---------- */
      const goListening = () => {
        if (listening) return;
        if (!recognition) {
          showToast('当前浏览器不支持语音识别', { icon: 'info' });
          return;
        }
        // 如果正在编辑，先退出编辑态
        if (editing) {
          editing = false;
          text.readOnly = true;
          text.blur();
          editBtn.textContent = '编辑';
        }
        listening = true;
        restartCount = 0;                // 重置重启计数
        micBtn.classList.add('listening');
        text.value = '';
        text.placeholder = '';
        text.readOnly = true;
        listeningEl.hidden = false;
        actions.hidden = true;
        micBtn.hidden = false;
        // 启动语音识别
        try {
          recognition.start();
        } catch (e) {
          // 可能上次还未完全停止，稍后重试
          setTimeout(() => { try { recognition.start(); } catch (e2) {} }, 200);
        }
      };

      /* ---------- 状态 B：录制完成（松开后有结果） ---------- */
      const goResult = () => {
        listening = false;
        micBtn.classList.remove('listening');
        // 文本已是识别结果，保持不变
        text.scrollTop = text.scrollHeight;
        listeningEl.hidden = true;
        micBtn.hidden = true;
        actions.hidden = false;
        text.readOnly = true;
        editing = false;
        editBtn.textContent = '编辑';
      };

      /* ---------- 按住大圆按钮（使用指针捕获，避免权限弹窗/缩放导致误触发松开） ---------- */
      const start = (e) => {
        e.preventDefault();
        // 捕获指针：即使指针移出按钮或浏览器弹出麦克风权限框，事件仍发到此元素
        try { micBtn.setPointerCapture(e.pointerId); } catch (err) {}
        goListening();
      };
      const stop = (e) => {
        if (!listening) return;
        listening = false;
        waitingResult = true;
        micBtn.classList.remove('listening');
        // 释放指针捕获
        if (e && e.pointerId !== undefined) {
          try { micBtn.releasePointerCapture(e.pointerId); } catch (err) {}
        }
        try { recognition.stop(); } catch (err) {}
        // onend 触发后自动调用 goResult 或回到待录制
      };
      micBtn.addEventListener('pointerdown', start);
      micBtn.addEventListener('pointerup', stop);
      micBtn.addEventListener('pointercancel', stop);
      // 不监听 pointerleave：避免按钮缩放或权限弹窗导致误触发松开

      /* ---------- 舍弃 ---------- */
      discardBtn.addEventListener('click', () => {
        goIdle();
        showToast('已舍弃识别内容');
      });

      /* ---------- 编辑 / 完成 ---------- */
      editBtn.addEventListener('click', () => {
        if (editBtn.textContent === '编辑') {
          editing = true;
          text.readOnly = false;
          text.focus();
          const len = text.value.length;
          text.setSelectionRange(len, len);
          editBtn.textContent = '完成';
          showToast('可自由编辑文字');
        } else {
          editing = false;
          text.readOnly = true;
          text.blur();
          editBtn.textContent = '编辑';
          showToast('已保存修改');
        }
      });

      /* ---------- 保存 ---------- */
      saveBtn.addEventListener('click', () => {
        const c = text.value.trim();
        if (!c) {
          showToast('请先说出你的梦境', { icon: 'info' });
          return;
        }
        const date = sheet.querySelector('#vsDate').value;
        if (!date) { showToast('请选择日期', { icon: 'info' }); return; }
        addRecord({
          id: genId('r'),
          type: 'dream',
          title: '语音梦境 · ' + date,
          date,
          mood: '宁静',
          content: c,
          tags: [],
          imageUrl: '',
          published: false,
          createdAt: Date.now(),
          analysis: null
        });
        close();
        showToast('梦境已保存 ✨', { icon: 'moon' });
      });

      // 关闭时清理：停止识别 + 清空状态
      sheet._vsCleanup = () => {
        listening = false;
        editing = false;
        waitingResult = false;
        micBtn.classList.remove('listening', 'pressed');
        if (recognition) {
          try { recognition.stop(); } catch (e) {}
        }
      };

      goIdle();
    },
    onClose: () => {
      const sheetEl = document.querySelector('.sheet');
      if (sheetEl && typeof sheetEl._vsCleanup === 'function') {
        sheetEl._vsCleanup();
        sheetEl._vsCleanup = null;
      }
    }
  });
}

/* ============================================================
   文字记录弹窗（梦境 / 现实 切换）
   ============================================================ */
export function openTextSheet(presetDate = null) {
  let type = 'dream';
  const today = todayStr();
  const initDate = presetDate || today;

  const bodyHtml = `
    <div class="ts-form">
      <div class="seg">
        <button class="seg-item on dream" data-type="dream">梦境</button>
        <button class="seg-item" data-type="reality">现实</button>
      </div>
      <div class="field">
        <label>标题</label>
        <input class="input" id="tsTitle" placeholder="给这段梦境起个名字…" />
      </div>
      <div class="field">
        <label>日期</label>
        <input class="input" id="tsDate" type="date" value="${initDate}" />
      </div>
      <div class="field">
        <label>正文</label>
        <textarea class="textarea" id="tsContent" placeholder="记录此刻的梦境，越细越好…"></textarea>
      </div>
      <div class="ts-actions">
        <button class="btn btn-soft" id="tsCancel">取消</button>
        <button class="btn btn-primary" id="tsSave">保存梦境</button>
      </div>
    </div>`;

  openSheet({
    title: '文字记录',
    sub: '选择类型，写下此刻的梦境或感受',
    bodyHtml,
    onMount: (sheet, close) => {
      const seg = sheet.querySelector('.seg');
      const content = sheet.querySelector('#tsContent');
      const saveBtn = sheet.querySelector('#tsSave');

      seg.querySelectorAll('.seg-item').forEach((b) => {
        b.addEventListener('click', () => {
          type = b.dataset.type;
          seg.querySelectorAll('.seg-item').forEach((x) => {
            x.classList.remove('on', 'dream', 'reality');
          });
          b.classList.add('on', type);
          const titleInput = sheet.querySelector('#tsTitle');
          titleInput.placeholder =
            type === 'dream' ? '给这段梦境起个名字…' : '给这件事起个标题…';
          content.placeholder =
            type === 'dream' ? '记录此刻的梦境，越细越好…' : '详细记录最近的经历，后续可用于分析梦境与现实间的关联…';
          saveBtn.textContent = type === 'dream' ? '保存梦境' : '保存感受';
        });
      });

      sheet.querySelector('#tsCancel').addEventListener('click', close);
      saveBtn.addEventListener('click', () => {
        const title = sheet.querySelector('#tsTitle').value.trim();
        const c = sheet.querySelector('#tsContent').value.trim();
        const date = sheet.querySelector('#tsDate').value;
        if (!date) { showToast('请选择日期', { icon: 'info' }); return; }
        if (!c) { showToast('请先写下内容', { icon: 'info' }); return; }
        addRecord({
          id: genId('r'),
          type,
          title: title || (type === 'dream' ? '一个未命名的梦' : '今日感受'),
          date,
          mood: '宁静',
          content: c,
          tags: [],
          imageUrl: '',
          published: false,
          createdAt: Date.now(),
          analysis: null
        });
        close();
        showToast(type === 'dream' ? '梦境已保存 ✨' : '感受已保存 ✨', { icon: 'moon' });
      });
    }
  });
}
