/* ============================================================
   seed-data.js — 模拟数据种子
   说明：包含用户、本地记录（梦境/现实）、社区帖子
   ============================================================ */

import { dateStr } from './state.js';

const today = new Date();
const d = (offset) => {
  const dt = new Date(today);
  dt.setDate(dt.getDate() + offset);
  return dateStr(dt);
};

/* 生成符合主题的梦境插画 URL（统一梦幻水彩风格，无文字无边框）
   使用 landscape_16_9 横图，匹配详情页/卡片的 16:9 横向展示区域，避免裁剪 */
const imgUrl = (prompt) =>
  `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=landscape_16_9`;

/* 生成用户头像 URL（圆形小图，梦幻水彩风格的人物/意象头像）
   使用 square 方形比例，avatar 样式为圆形裁切 */
const avatarUrl = (prompt) =>
  `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=square`;

/* 当前用户可切换的头像列表（统一梦幻水彩风格，无文字无边框）
   切换头像时，avatarSeed 作为标识，avatarUrl 作为实际图片 */
export const userAvatarOptions = [
  { seed: '梦', url: avatarUrl('dreamy watercolor portrait of a peaceful dreamer with soft purple hair and closed eyes, ethereal misty atmosphere, pastel colors, no text, no border, seamless edges') },
  { seed: '星', url: avatarUrl('dreamy watercolor portrait of a person with starlit hair and glowing eyes, deep purple blue tones, ethereal cosmic atmosphere, no text, no border, seamless edges') },
  { seed: '月', url: avatarUrl('dreamy watercolor portrait of a person with crescent moon aura, silver and lavender tones, serene ethereal atmosphere, no text, no border, seamless edges') },
  { seed: '夜', url: avatarUrl('dreamy watercolor portrait of a person under night sky with soft constellations, purple tones, mysterious ethereal, no text, no border, seamless edges') },
  { seed: '云', url: avatarUrl('dreamy watercolor portrait of a person surrounded by soft clouds, pastel pink and purple tones, gentle ethereal, no text, no border, seamless edges') },
  { seed: '海', url: avatarUrl('dreamy watercolor portrait of a person with ocean waves aura, blue purple tones, serene ethereal atmosphere, no text, no border, seamless edges') },
  { seed: '雾', url: avatarUrl('dreamy watercolor portrait of a person shrouded in morning mist, soft gray purple tones, mysterious ethereal, no text, no border, seamless edges') },
  { seed: '萤', url: avatarUrl('dreamy watercolor portrait of a person with firefly glow, warm purple tones, magical ethereal atmosphere, no text, no border, seamless edges') }
];

export const seedUser = {
  id: 'u_me',
  nickname: '星海旅人',
  avatarSeed: '梦',
  avatarUrl: userAvatarOptions[0].url,
  bio: '在梦里，遇见另一个自己。',
  joinedAt: '2026-05-12',
  stats: { dreams: 0, reality: 0, aiUsed: 0 },
  // 个人中心展示数据（模拟成长数据）
  profile: {
    totalDreams: 132,
    streakDays: 28,
    aiAnalysisCount: 56,
    communityLikes: 382,
    monthlyDreamCount: 18,
    monthlyDreamDays: 12,
    commonSymbol: '飞行',
    commonPerson: '小女孩'
  }
};

// 用户的本地记录（梦境 + 现实）
export const seedRecords = [
  {
    id: 'r_001',
    type: 'dream',
    title: '紫色的海与漂浮的我',
    date: d(0),
    mood: '宁静',
    tags: ['海洋', '漂浮', '紫色', '释放'],
    content:
      '我梦见自己躺在一片淡紫色的海面上，身体轻得像羽毛。海水温暖，托着我慢慢漂浮。' +
      '远处有一轮很低的月亮，月光把海面染成一条银色的路。我没有害怕，只觉得很安宁，' +
      '像是终于放下了一直背着的东西。醒来后，心口还留着一丝温热。',
    imageUrl: imgUrl('dreamy watercolor illustration, a person floating peacefully on calm lavender sea under low moon, silver moonlight path on water, soft purple and blue tones, misty ethereal atmosphere, no text, no border, seamless edges'),
    published: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 3,
    analysis: {
      theme: '漂浮与释放',
      themeDesc: '梦境围绕"失重"与"被托举"，潜意识正在处理近期积压的情绪，渴望卸下负担。',
      imagery: ['海洋', '月亮', '漂浮', '银色', '羽毛'],
      emotions: { 宁静: 0.85, 神秘: 0.6, 喜悦: 0.4, 恐惧: 0.1, 悲伤: 0.15, 愤怒: 0 },
      keywords: ['释放', '安宁', '潜意识', '月光'],
      realityLinks: [
        { element: '海洋', meaning: '近期情绪波动较大，潜意识渴望流动与释放' },
        { element: '月亮', meaning: '对内在直觉与女性能量的连接' },
        { element: '漂浮', meaning: '想要逃离现实重压，寻求短暂的失重感' }
      ],
      suggestion: '可以尝试在睡前进行 5 分钟腹式呼吸，给情绪一个出口；白天留一段"无目的时间"。'
    }
  },
  {
    id: 'r_002',
    type: 'reality',
    title: '加班到深夜，街灯很暖',
    date: d(0),
    mood: '疲惫',
    tags: ['工作', '夜晚', '独处'],
    content:
      '今天又加班到十一点。回家路上没什么人，街灯把影子拉得很长。' +
      '有点累，但空气凉凉的，反而清醒了些。买了一份关东煮，慢慢走回家。',
    imageUrl: imgUrl('dreamy watercolor illustration, quiet empty street at night with warm streetlights casting long shadows, lonely figure walking with steam from food, soft purple and amber tones, misty cozy atmosphere, no text, no border, seamless edges'),
    published: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 10
  },
  {
    id: 'r_003',
    type: 'dream',
    title: '追不上的电梯',
    date: d(-2),
    mood: '焦虑',
    tags: ['追逐', '电梯', '高楼', '坠落'],
    content:
      '梦见在一栋很高的楼里赶电梯，门要关了，我拼命跑，可怎么也跑不到。' +
      '最后电梯掉下去了，我也跟着坠落，然后惊醒，心脏跳得很快。',
    imageUrl: imgUrl('dreamy watercolor illustration, tall building elevator shaft with closing doors, sense of falling and vertigo, purple and deep blue misty atmosphere, abstract surreal, no text, no border, seamless edges'),
    published: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 50,
    analysis: {
      theme: '失控与追赶',
      themeDesc: '电梯与坠落象征对节奏失控的焦虑，反映近期对"赶不上"的担忧。',
      imagery: ['电梯', '高楼', '坠落', '门'],
      emotions: { 宁静: 0.1, 神秘: 0.3, 喜悦: 0.05, 恐惧: 0.8, 悲伤: 0.2, 愤怒: 0.3 },
      keywords: ['焦虑', '失控', '追赶', '坠落'],
      realityLinks: [
        { element: '电梯', meaning: '生活节奏与上升压力的投射' },
        { element: '坠落', meaning: '对失去掌控的深层恐惧' }
      ],
      suggestion: '梳理近期是否有"被推着走"的事项，尝试主动规划一两个小目标，夺回节奏感。'
    }
  },
  {
    id: 'r_004',
    type: 'dream',
    title: '会说话的白猫',
    date: d(-4),
    mood: '好奇',
    tags: ['猫', '对话', '白色', '指引'],
    content:
      '梦见一只很白的猫坐在窗台上，转头对我说："你该往回走看看。"' +
      '它的眼睛是金色的，声音很温柔。我想问它往回走是什么意思，它就跳下窗台不见了。',
    imageUrl: imgUrl('dreamy watercolor illustration, white cat sitting on windowsill with golden eyes, soft purple misty background with moonlight, ethereal gentle atmosphere, no text, no border, seamless edges'),
    published: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 90
  },
  {
    id: 'r_005',
    type: 'reality',
    title: '和老朋友通了电话',
    date: d(-5),
    mood: '温暖',
    tags: ['朋友', '回忆', '治愈'],
    content:
      '很久没联系的朋友突然打电话来，聊了一个多小时。' +
      '说起以前一起旅行的事，两个人都笑了。挂了电话觉得心里很暖。',
    imageUrl: imgUrl('dreamy watercolor illustration, person smiling while holding phone, cozy warm interior with soft light, soft pink and purple tones, misty warm atmosphere, no text, no border, seamless edges'),
    published: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 120
  },
  {
    id: 'r_006',
    type: 'dream',
    title: '云上的车站',
    date: d(-7),
    mood: '宁静',
    tags: ['云', '车站', '旅行', '高空'],
    content:
      '梦见一个建在云层上的车站，月台是半透明的。云在脚下缓缓流动。' +
      '没有车来，但我不着急，靠着栏杆看远方。醒来觉得轻盈。',
    imageUrl: imgUrl('dreamy watercolor illustration, translucent train platform floating above soft clouds, purple and pink sunset sky, figure leaning on railing looking far, ethereal peaceful, no text, no border, seamless edges'),
    published: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 160
  },
  {
    id: 'r_007',
    type: 'dream',
    title: '掉牙的梦',
    date: d(-9),
    mood: '不安',
    tags: ['牙齿', '身体', '变化'],
    content:
      '梦见刷牙的时候门牙松了，一碰就掉下来。镜子里我笑起来漏风，很不安。',
    imageUrl: imgUrl('dreamy watercolor illustration, misty mirror reflection in bathroom, falling tooth, abstract purple and gray pink tones, uneasy surreal atmosphere, no text, no border, seamless edges'),
    published: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 210
  },
  {
    id: 'r_008',
    type: 'reality',
    title: '雨天的咖啡馆',
    date: d(-11),
    mood: '平静',
    tags: ['雨', '咖啡', '独处', '阅读'],
    content:
      '下午下起雨，躲进一家小咖啡馆，点了一杯拿铁。' +
      '靠窗坐着看雨，看完了一本一直没读完的书。很平静的一个下午。',
    imageUrl: imgUrl('dreamy watercolor illustration, rainy day coffee shop window seat with latte and book, rain drops on glass, warm amber and soft purple tones, cozy peaceful atmosphere, no text, no border, seamless edges'),
    published: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 260
  },
  {
    id: 'r_009',
    type: 'dream',
    title: '飞向月亮的旅程',
    date: d(-1),
    mood: '喜悦',
    tags: ['飞行', '月亮', '探索', '成长', '自由'],
    content:
      '我梦见自己站在一片开阔的草地上，抬头看见一轮很大很亮的月亮。' +
      '我突然觉得自己变轻了，双脚离开地面，慢慢往上升。风从耳边掠过，' +
      '我不害怕，反而觉得很自由。越飞越高，云在脚下，月光越来越近。' +
      '我伸出手想要触碰月亮，在快要碰到的时候，我笑了。然后醒来，' +
      '心里还留着那种向上飞升的轻盈和喜悦。',
    imageUrl: imgUrl('dreamy watercolor illustration, person flying upward from grassy field toward large bright moon, clouds below feet, silver moonlight, purple and blue tones, ethereal joyful atmosphere, no text, no border, seamless edges'),
    published: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 20,
    analysis: {
      theme: '飞向月亮的旅程',
      themeDesc: '飞行与月亮共同构成"向上探索"的核心意象，反映你近期渴望突破现状、追寻更高目标的内在动力。这是一次积极的成长之梦。',
      imagery: ['飞行', '月亮', '草地', '云层', '月光'],
      emotions: { 宁静: 0.6, 神秘: 0.5, 喜悦: 0.9, 恐惧: 0.05, 悲伤: 0.05, 愤怒: 0 },
      keywords: ['飞行', '月亮', '探索', '成长', '自由'],
      realityLinks: [
        { element: '飞行', meaning: '渴望摆脱现实束缚，追求自由与成长' },
        { element: '月亮', meaning: '对理想与内心直觉的追寻' },
        { element: '触碰月亮', meaning: '即将达成某个重要目标的预感' }
      ],
      suggestion: '这是一段充满积极能量的梦境。建议你记录下此刻内心的渴望，把它转化为现实中的一个小目标。白天可以尝试一件一直想做但没敢做的事，让梦里的"向上"延伸到生活里。'
    }
  }
];

// 社区帖子（含他人梦境 + 互动数据）
export const seedPosts = [
  {
    id: 'p_001',
    authorName: '雾里看花',
    avatarSeed: '雾',
    avatarUrl: avatarUrl('dreamy watercolor portrait of a person surrounded by morning mist, soft purple tones, ethereal atmosphere, no text, no border, seamless edges'),
    title: '我梦见自己变成了一只鲸',
    excerpt: '巨大、安静、潜得很深。整片深海只有我心跳的声音……',
    cover: 'whale',
    imageUrl: imgUrl('dreamy watercolor illustration of a giant whale swimming in deep blue sea, soft moonlight from above, serene atmosphere, purple blue tones, misty, no text, no border, seamless edges'),
    mood: '宁静',
    tags: ['鲸', '深海', '孤独', '自由'],
    likes: 248,
    alsoDreamed: 36,
    comments: [
      { id: 'c1', name: '夜行猫', avatarSeed: '夜', avatarUrl: avatarUrl('dreamy watercolor portrait of a cat-like person under night sky, purple tones, ethereal, no text, no border'), content: '我也梦到过类似的，潜入深海的感觉太真实了。', createdAt: Date.now() - 3600_000 },
      { id: 'c2', name: '星屑', avatarSeed: '星', avatarUrl: avatarUrl('dreamy watercolor portrait of a person with stardust hair, pink purple tones, dreamy, no text, no border'), content: '变成鲸鱼好浪漫，治愈到我了。', createdAt: Date.now() - 7200_000 }
    ],
    likedByMe: false,
    relatedByMe: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 6,
    content:
      '我梦见自己变成了一头鲸，很大很大，整片深海好像只容得下我一个。' +
      '海水是深蓝色的，光线从上方漏下来。我慢慢往下游，没有方向，只听见自己的心跳，' +
      '一下、一下，很远又很近。那种安静让我哭了出来，是释然的哭。',
    analysis: {
      theme: '孤独与自由',
      themeDesc: '鲸象征庞大的内在自我，深海是潜意识。独处带来的不是恐惧，而是与自我和解。',
      imagery: ['鲸', '深海', '心跳', '蓝光'],
      keywords: ['孤独', '自由', '内在', '释然']
    }
  },
  {
    id: 'p_002',
    authorName: '失眠行星',
    avatarSeed: '眠',
    avatarUrl: avatarUrl('dreamy watercolor portrait of a person with planet-like aura, insomnia theme, purple blue tones, ethereal, no text, no border, seamless edges'),
    title: '反复出现的旋转楼梯',
    excerpt: '一直向下、向下，没有尽头，但我不害怕……',
    cover: 'stairs',
    imageUrl: imgUrl('dreamy watercolor illustration of a spiral staircase descending into stone mist, purple tones, mysterious atmosphere, no text, no border, seamless edges'),
    mood: '神秘',
    tags: ['楼梯', '循环', '下行', '迷宫'],
    likes: 187,
    alsoDreamed: 52,
    comments: [
      { id: 'c3', name: '半夏', avatarSeed: '半', avatarUrl: avatarUrl('dreamy watercolor portrait of a gentle person with soft features, green purple tones, no text, no border'), content: '我也经常梦到无限向下的楼梯！', createdAt: Date.now() - 5400_000 }
    ],
    likedByMe: true,
    relatedByMe: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 30,
    content:
      '有一条螺旋向下的楼梯，我已经梦到过很多次了。每次都往下走，' +
      '墙壁是潮湿的石块，扶手冰凉。我不知道终点在哪，但我从不害怕，反而有点期待。',
    analysis: {
      theme: '向内探索',
      themeDesc: '反复出现的下行楼梯，是潜意识在邀请你向内深入。',
      imagery: ['楼梯', '石墙', '螺旋', '下行'],
      keywords: ['探索', '内在', '循环', '未知']
    }
  },
  {
    id: 'p_003',
    authorName: '糖霜月亮',
    avatarSeed: '糖',
    avatarUrl: avatarUrl('dreamy watercolor portrait of a person with moonlit sugar aura, pink purple tones, sweet dreamy, no text, no border, seamless edges'),
    title: '云朵做的城市',
    excerpt: '所有房子都是云做的，踩上去软软的，会弹起来……',
    cover: 'cloud',
    imageUrl: imgUrl('dreamy watercolor illustration of a city made of pink white clouds, soft bouncing houses, dreamy sky, pastel colors, no text, no border, seamless edges'),
    mood: '喜悦',
    tags: ['云', '城市', '飞行', '童年'],
    likes: 321,
    alsoDreamed: 18,
    comments: [],
    likedByMe: false,
    relatedByMe: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 54,
    content:
      '梦见一座城市，所有建筑都是粉白色的云做的。我在街上跳一下，' +
      '整个人就弹得老高，像在蹦床上。风一吹，整座城都轻轻晃动。',
    analysis: {
      theme: '轻盈与童心',
      themeDesc: '云的城市象征卸下重力后的纯粹快乐，是内在小孩的回响。',
      imagery: ['云', '城市', '弹跳', '粉色'],
      keywords: ['童心', '轻盈', '快乐', '自由']
    }
  },
  {
    id: 'p_004',
    authorName: '深海信',
    avatarSeed: '深',
    avatarUrl: avatarUrl('dreamy watercolor portrait of a person holding a letter, deep sea background, purple blue tones, mysterious, no text, no border, seamless edges'),
    title: '收到一封来自海底的信',
    excerpt: '信纸是湿的，字却清清楚楚。寄信人是我自己……',
    cover: 'letter',
    imageUrl: imgUrl('dreamy watercolor illustration of a glass bottle with a letter floating in deep sea, soft light, purple blue tones, mysterious, no text, no border, seamless edges'),
    mood: '神秘',
    tags: ['信', '海底', '自己', '回音'],
    likes: 156,
    alsoDreamed: 24,
    comments: [
      { id: 'c4', name: '潮汐', avatarSeed: '潮', avatarUrl: avatarUrl('dreamy watercolor portrait of a person with tidal wave aura, blue purple tones, ethereal, no text, no border'), content: '寄信人是自己这个设定太妙了。', createdAt: Date.now() - 9000_000 }
    ],
    likedByMe: false,
    relatedByMe: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 80,
    content:
      '我在海底捡到一个玻璃瓶，里面是一封信。信纸是湿的，字却很清楚。' +
      '抬头写着我的名字，落款也是我的名字。内容只有一句："别等了，先走。"',
    analysis: {
      theme: '自我的召唤',
      themeDesc: '来自自己的信，是潜意识在推动你做出某个拖延已久的决定。',
      imagery: ['信', '海底', '玻璃瓶', '字'],
      keywords: ['召唤', '决定', '自我', '回音']
    }
  },
  {
    id: 'p_005',
    authorName: '萤火',
    avatarSeed: '萤',
    avatarUrl: avatarUrl('dreamy watercolor portrait of a person with firefly glow, warm purple tones, ethereal, no text, no border, seamless edges'),
    title: '会发光的森林',
    excerpt: '每一棵树都在发光，颜色都不一样，像呼吸一样明灭……',
    cover: 'forest',
    imageUrl: imgUrl('dreamy watercolor illustration of a glowing forest with trees emitting soft purple pink cyan light, misty atmosphere, no text, no border, seamless edges'),
    mood: '宁静',
    tags: ['森林', '光', '呼吸', '治愈'],
    likes: 402,
    alsoDreamed: 67,
    comments: [],
    likedByMe: true,
    relatedByMe: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 120,
    content:
      '梦见走进一片森林，每棵树都在发光，颜色都不一样，' +
      '像在呼吸一样一明一灭。我坐在一棵紫色的树下，整个人都安静下来。',
    analysis: {
      theme: '疗愈与连接',
      themeDesc: '发光森林是潜意识的疗愈场，呼吸般的明灭对应你的情绪节律。',
      imagery: ['森林', '光', '树', '紫色'],
      keywords: ['疗愈', '连接', '安静', '呼吸']
    }
  },
  {
    id: 'p_006',
    authorName: '逆光',
    avatarSeed: '逆',
    avatarUrl: avatarUrl('dreamy watercolor portrait of a person in backlight silhouette, warm purple tones, ethereal, no text, no border, seamless edges'),
    title: '永远到不了的站台',
    excerpt: '火车一直在开，可我从没到站。窗外是模糊的光……',
    cover: 'train',
    imageUrl: imgUrl('dreamy watercolor illustration of a train running through blurred light, distant platform, purple tones, melancholic, no text, no border, seamless edges'),
    mood: '迷茫',
    tags: ['火车', '站台', '旅途', '等待'],
    likes: 98,
    alsoDreamed: 41,
    comments: [],
    likedByMe: false,
    relatedByMe: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 150,
    content:
      '我一直在一列火车上，窗外的光是模糊的、拉长的。每一站我都准备下车，' +
      '可每次都错过。我没有焦急，只是有点茫然。',
    analysis: {
      theme: '等待与过渡',
      themeDesc: '永不到站的火车象征你正处在人生的过渡期，尚未抵达下一段。',
      imagery: ['火车', '光', '站台', '窗'],
      keywords: ['过渡', '等待', '方向', '茫然']
    }
  }
];

// AI 模块的功能入口配置
export const aiModules = [
  { id: 'interpret', title: 'AI 解梦', desc: '解读梦境主题与潜意识', icon: 'sparkles', tint: 'purple' },
  { id: 'paint', title: 'AI 画梦', desc: '把梦境生成为画面', icon: 'image', tint: 'pink' },
  { id: 'reality', title: '梦境与现实', desc: '关联梦境与日常感受', icon: 'link', tint: 'cyan' },
  { id: 'imagery', title: '意象统计', desc: '高频意象与情绪趋势', icon: 'chart', tint: 'gold' },
  { id: 'story', title: '梦境故事', desc: '把碎片串成连续叙事', icon: 'book', tint: 'purple' },
  { id: 'ask', title: '梦境问答', desc: '与梦境中的自己对话', icon: 'message', tint: 'pink' }
];

// 心情预设
export const moodPresets = [
  { key: '宁静', emoji: '🌙' },
  { key: '喜悦', emoji: '✨' },
  { key: '好奇', emoji: '🌱' },
  { key: '温暖', emoji: '🤍' },
  { key: '焦虑', emoji: '🌊' },
  { key: '不安', emoji: '🌫️' },
  { key: '悲伤', emoji: '🌧️' },
  { key: '疲惫', emoji: '🍃' }
];
