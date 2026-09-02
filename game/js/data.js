/* ============================================================
   《魔法时间的童话 ～熙叆的时光物语～》 剧情数据
   照片按拍摄时间排列:2025-07-07 ~ 2026-08-28
   ============================================================ */
window.GAME_DATA = (function () {

  /* ---------- 时光碎片(照片) ---------- */
  var PHOTOS = [
    { id: 1,  file: "../preview/001.webp", date: "2025-07-07", ch: "pro" },
    { id: 2,  file: "../preview/002.webp", date: "2025-07-09", ch: "pro" },
    { id: 3,  file: "../preview/003.webp", date: "2025-07-15", ch: "pro" },
    { id: 4,  file: "../preview/004.webp", date: "2025-07-16", ch: "sum" },
    { id: 5,  file: "../preview/005.webp", date: "2025-07-22", ch: "sum" },
    { id: 6,  file: "../preview/006.webp", date: "2025-07-22", ch: "sum" },
    { id: 7,  file: "../preview/007.webp", date: "2025-07-22", ch: "sum" },
    { id: 8,  file: "../preview/008.webp", date: "2025-07-22", ch: "sum" },
    { id: 9,  file: "../preview/009.webp", date: "2025-07-23", ch: "sum" },
    { id: 10, file: "../preview/010.webp", date: "2025-07-23", ch: "sum" },
    { id: 11, file: "../preview/011.webp", date: "2025-07-24", ch: "sum" },
    { id: 12, file: "../preview/012.webp", date: "2025-07-24", ch: "sum" },
    { id: 13, file: "../preview/013.webp", date: "2025-07-27", ch: "sum" },
    { id: 14, file: "../preview/014.webp", date: "2025-07-27", ch: "sum" },
    { id: 15, file: "../preview/015.webp", date: "2025-07-28", ch: "sum" },
    { id: 16, file: "../preview/016.webp", date: "2025-10-10", ch: "aut" },
    { id: 17, file: "../preview/017.webp", date: "2025-10-10", ch: "aut" },
    { id: 18, file: "../preview/018.webp", date: "2025-10-11", ch: "aut" },
    { id: 19, file: "../preview/019.webp", date: "2025-10-12", ch: "aut" },
    { id: 20, file: "../preview/020.webp", date: "2025-10-12", ch: "aut" },
    { id: 21, file: "../preview/021.webp", date: "2025-10-12", ch: "aut" },
    { id: 22, file: "../preview/022.webp", date: "2025-10-12", ch: "aut" },
    { id: 23, file: "../preview/023.webp", date: "2025-10-12", ch: "aut" },
    { id: 24, file: "../preview/024.webp", date: "2025-10-12", ch: "aut" },
    { id: 25, file: "../preview/025.webp", date: "2025-10-12", ch: "aut" },
    { id: 26, file: "../preview/026.webp", date: "2025-10-12", ch: "aut" },
    { id: 27, file: "../preview/027.webp", date: "2025-10-16", ch: "aut" },
    { id: 28, file: "../preview/028.webp", date: "2025-10-18", ch: "aut" },
    { id: 29, file: "../preview/029.webp", date: "2025-10-20", ch: "aut" },
    { id: 30, file: "../preview/030.webp", date: "2025-10-20", ch: "aut" },
    { id: 31, file: "../preview/031.webp", date: "2025-10-21", ch: "aut" },
    { id: 32, file: "../preview/032.webp", date: "2025-11-06", ch: "aut" },
    { id: 33, file: "../preview/033.webp", date: "2025-11-06", ch: "aut" },
    { id: 34, file: "../preview/034.webp", date: "2025-12-30", ch: "win" },
    { id: 35, file: "../preview/035.webp", date: "2026-01-01", ch: "win" },
    { id: 36, file: "../preview/036.webp", date: "2026-01-01", ch: "win" },
    { id: 37, file: "../preview/037.webp", date: "2026-01-03", ch: "win" },
    { id: 38, file: "../preview/038.webp", date: "2026-01-03", ch: "win" },
    { id: 39, file: "../preview/039.webp", date: "2026-01-06", ch: "win" },
    { id: 40, file: "../preview/040.webp", date: "2026-01-08", ch: "win" },
    { id: 41, file: "../preview/041.webp", date: "2026-01-08", ch: "win" },
    { id: 42, file: "../preview/042.webp", date: "2026-01-25", ch: "win" },
    { id: 43, file: "../preview/043.webp", date: "2026-02-20", ch: "spr" },
    { id: 44, file: "../preview/044.webp", date: "2026-02-21", ch: "spr" },
    { id: 45, file: "../preview/045.webp", date: "2026-02-21", ch: "spr" },
    { id: 46, file: "../preview/046.webp", date: "2026-03-14", ch: "spr" },
    { id: 47, file: "../preview/047.webp", date: "2026-03-14", ch: "spr" },
    { id: 48, file: "../preview/048.webp", date: "2026-03-15", ch: "spr" },
    { id: 49, file: "../preview/049.webp", date: "2026-03-18", ch: "spr" },
    { id: 50, file: "../preview/050.webp", date: "2026-03-18", ch: "spr" },
    { id: 51, file: "../preview/051.webp", date: "2026-03-18", ch: "spr" },
    { id: 52, file: "../preview/052.webp", date: "2026-03-18", ch: "spr" },
    { id: 53, file: "../preview/053.webp", date: "2026-03-18", ch: "spr" },
    { id: 54, file: "../preview/054.webp", date: "2026-03-18", ch: "spr" },
    { id: 55, file: "../preview/055.webp", date: "2026-03-21", ch: "spr" },
    { id: 56, file: "../preview/056.webp", date: "2026-03-21", ch: "spr" },
    { id: 57, file: "../preview/057.webp", date: "2026-03-21", ch: "spr" },
    { id: 58, file: "../preview/058.webp", date: "2026-03-21", ch: "spr" },
    { id: 59, file: "../preview/059.webp", date: "2026-03-22", ch: "spr" },
    { id: 60, file: "../preview/060.webp", date: "2026-03-22", ch: "spr" },
    { id: 61, file: "../preview/061.webp", date: "2026-03-23", ch: "spr" },
    { id: 62, file: "../preview/062.webp", date: "2026-03-26", ch: "spr" },
    { id: 63, file: "../preview/063.webp", date: "2026-03-26", ch: "spr" },
    { id: 64, file: "../preview/064.webp", date: "2026-03-26", ch: "spr" },
    { id: 65, file: "../preview/065.webp", date: "2026-05-08", ch: "fin" },
    { id: 66, file: "../preview/066.webp", date: "2026-05-15", ch: "fin" },
    { id: 67, file: "../preview/067.webp", date: "2026-05-20", ch: "fin" },
    { id: 68, file: "../preview/068.webp", date: "2026-05-21", ch: "fin" },
    { id: 69, file: "../preview/069.webp", date: "2026-05-24", ch: "fin" },
    { id: 70, file: "../preview/070.webp", date: "2026-08-09", ch: "fin" },
    { id: 71, file: "../preview/071.webp", date: "2026-08-14", ch: "fin" },
    { id: 72, file: "../preview/072.webp", date: "2026-08-20", ch: "fin" },
    { id: 73, file: "../preview/073.webp", date: "2026-08-28", ch: "fin" },
    { id: 74, file: "../preview/074.webp", date: "2026-09-01", ch: "fin" }
  ];

  /* ---------- 会动的碎片(影像) ---------- */
  var VIDEOS = [
    { id: "ev_001", file: "video/ev_001.mp4", date: "2026-03-13", ch: "spr", title: "会动的碎片·其一" },
    { id: "ev_002", file: "video/ev_002.mp4", date: "2026-03-13", ch: "spr", title: "会动的碎片·其二" },
    { id: "ev_003", file: "video/ev_003.mp4", date: "2026-03-15", ch: "spr", title: "会动的碎片·其三" }
  ];

  /* ---------- 章节 ---------- */
  var CHAPTERS = {
    pro: { title: "序章",        name: "被月光翻开的一页" },
    sum: { title: "第一章",      name: "夏·汽水味的蝉鸣" },
    aut: { title: "第二章",      name: "秋·会发光的落叶" },
    win: { title: "第三章",      name: "冬·初雪与长夜灯" },
    spr: { title: "第四章",      name: "春·风把风筝还给了天空" },
    fin: { title: "终章",        name: "最珍贵的一天" }
  };

  /* ---------- 结局 ---------- */
  var ENDINGS = [
    { id: "endA", type: "TRUE END", name: "永远的时间童话", need: "羁绊 ≥ 125",
      desc: "所有的碎片都醒了过来,拼成一条闪闪发光的河。最珍贵的一天,是每一个与你在一起的今天。" },
    { id: "endB", type: "GOOD END", name: "未完待续的四季", need: "羁绊 70 ~ 124",
      desc: "书还剩一点点空白。没关系,明年夏天,老地方见——约定亮得像星星。" },
    { id: "endC", type: "BAD END",  name: "一个人的时光机", need: "羁绊 < 70",
      desc: "碎片慢慢褪色,只有一片留了下来。想她的时候,就看看手心吧。" }
  ];

  /* ---------- 场景 ---------- */
  var SCENES = [
  /* ================= 序章 ================= */
  {
    id: "pro_1", chapter: "pro", photos: [1, 2, 3],
    lines: [
      { who: "旁白", text: "深夜。窗外的月光,像谁打翻了一杯会发光的牛奶。" },
      { who: "旁白", text: "书桌上,一本旧书静静躺着。封面上写着——《魔法时间的童话》。" },
      { who: "旁白", text: "你不记得它是什么时候出现的。只记得,翻开它的那一刻,风停了。" },
      { who: "旁白", text: "书页化作漫天光尘,把你卷进了一座沉睡的钟楼之间。" },
      { who: "旁白", text: "这里的钟全都停着。秒针停在半路,像在等谁。", p: 1 },
      { who: "熙叆", text: "站住——!你是谁,怎么进来的?" },
      { who: "旁白", text: "光尘里落下一个女孩。银色的头发,眼睛亮得像两粒星星。", p: 2 },
      { who: "熙叆", text: "啊,你是……被书选中的人?人类?" },
      { who: "熙叆", text: "居然真的会有。我还以为传说是骗小孩的。" },
      { who: "旁白", text: "她绕着你转了三圈,像在检查一件珍奇的宝贝。" },
      { who: "熙叆", text: "听好了,旅人。我是时光王国的主人,向日葵精灵——熙叆。" },
      { who: "熙叆", text: "『熙』是光明,『叆』是可爱。所以我的名字,是『心爱』的意思!" },
      { who: "熙叆", text: "这里的每一粒光尘,都是人类世界里被遗忘的『时间碎片』。每一片碎片,都是一天。" },
      { who: "熙叆", text: "有人把它们弄丢了,所以这里的钟,才全都停着。" },
      { who: "熙叆", text: "哦对了,我的能力,是让花朵盛开与枯萎。还有——用双手比划,就能把风景拍下来!" },
      { who: "旁白", text: "她举起双手,比出相机的形状。咔嚓——指尖绽开一片光。" },
      { who: "旁白", text: "她摊开手掌,一片发光的碎片浮了起来——", p: 3 },
      { who: "熙叆", text: "你看。这就是碎片。里面装着的,是某个人最舍不得忘掉的一天。" },
      { who: "熙叆", text: "我的职责,是把它们收集起来,缝进《魔法时间的童话》里。可是最近……我的魔法,突然失灵了。" },
      { who: "熙叆", text: "所以——" },
      { who: "旁白", text: "她深吸一口气,郑重地看向你。" },
      { who: "熙叆", text: "旅人,请和我一起,走完这一年的四季,把碎片全部找回来!" },
      { choice: [
          { label: "交给我吧。我们一起去。", pts: 30, say: "真的吗!好耶!那从今天起,我们就是……时间收集二人组!" },
          { label: "听起来有点麻烦……但好像很有趣。", pts: 20, say: "哼哼,等你看到会发光的落叶,就不会说麻烦啦。" },
          { label: "在那之前,能不能先让我睡一觉?", pts: 10, say: "喂——!在时光王国里睡觉会睡过头一百年的!" }
      ]},
      { who: "熙叆", text: "出发——!第一站,夏天!" }
    ],
    next: "sum_1"
  },

  /* ================= 第一章 夏 ================= */
  {
    id: "sum_1", chapter: "sum", photos: [4, 5, 6],
    lines: [
      { who: "旁白", text: "时光王国的夏之门,在蝉鸣声里轰然打开。" },
      { who: "旁白", text: "热浪扑面而来,混着青草和汽水的味道。" },
      { who: "熙叆", text: "夏天!我最喜欢的季节,没有之一!" },
      { who: "熙叆", text: "快点快点,碎片就藏在这条路上!" },
      { who: "旁白", text: "第一片碎片藏在斑驳的树影里,像一只打盹的蝉。", p: 1 },
      { who: "熙叆", text: "找到了!第一片!夏天的第一天!" },
      { who: "旁白", text: "碎片落到她掌心,嗡嗡地唱着歌。", p: 2 },
      { who: "熙叆", text: "你听,里面是蝉鸣。还有……冰镇汽水开盖的声音?" },
      { who: "旁白", text: "她眯起眼睛,笑得像偷到糖的小孩。" },
      { who: "旁白", text: "风把云吹成各种形状。夏天,正式开始了。", p: 3 }
    ],
    next: "sum_2"
  },
  {
    id: "sum_2", chapter: "sum", photos: [7, 8, 9],
    lines: [
      { who: "旁白", text: "第二站,是阳光最慷慨的地方。" },
      { who: "熙叆", text: "看!光从树叶缝里漏下来,像下了一场金币雨!", p: 1 },
      { who: "旁白", text: "她在光斑里转圈。裙摆扬起,惊起一地碎金。" },
      { who: "熙叆", text: "旅人,别发呆!快把这一刻收进书里——", p: 2 },
      { who: "旁白", text: "你举起手,碎片便应声飞来。" },
      { who: "熙叆", text: "嘿嘿,夏天就是要这样,把影子拉得长长的。", p: 3 }
    ],
    next: "sum_3"
  },
  {
    id: "sum_3", chapter: "sum", photos: [10, 11, 12],
    lines: [
      { who: "旁白", text: "第三站,有海风的味道。虽然看不见海,但风知道路。" },
      { who: "熙叆", text: "呼——好凉快。是海风!它从很远很远的地方来。", p: 1 },
      { who: "熙叆", text: "旅人,你猜,海的另一边是什么?", p: 2 },
      { who: "旁白", text: "她不等你回答,自己先笑起来。" },
      { who: "熙叆", text: "是明天!一定是明天。" },
      { who: "旁白", text: "风卷起一片碎片,稳稳落进书页。", p: 3 }
    ],
    next: "sum_4"
  },
  {
    id: "sum_4", chapter: "sum", photos: [13, 14, 15],
    lines: [
      { who: "旁白", text: "傍晚。天空开始调配最拿手的颜色。" },
      { who: "熙叆", text: "黄昏了呀。夏天总是这样,玩着玩着就晚了。", p: 1 },
      { who: "熙叆", text: "啊,对了!旅人,我们把黄昏叫做『魔法时间』。" },
      { who: "旁白", text: "魔法时间。原来这本童话的名字,是从这里来的。" },
      { who: "旁白", text: "晚霞把她的影子染成橘色。", p: 2 },
      { who: "熙叆", text: "最后一站了,旅人。今天最后一片碎片,藏得很好哦。" },
      { who: "旁白", text: "碎片就在你身后,静静发着光。", p: 3 },
      { who: "熙叆", text: "恭喜你,夏天的碎片,集齐了!" },
      { who: "熙叆", text: "那么,作为奖励——告诉我,夏天最棒的是什么?" },
      { choice: [
          { label: "和你一起看到的晚霞。", pts: 30, say: "——!好、好狡猾的回答……不过,我很喜欢。" },
          { label: "冰镇汽水开盖的那一瞬间。", pts: 20, say: "果然!『啵』的一声,是夏天的心跳呀。" },
          { label: "不用写作业的日子。", pts: 10, say: "噗。旅人你真是……永远的人类思维。" }
      ]},
      { who: "熙叆", text: "夏天的这一页,缝好啦。下一站——秋天。" }
    ],
    next: "aut_1"
  },

  /* ================= 第二章 秋 ================= */
  {
    id: "aut_1", chapter: "aut", photos: [16, 17, 18],
    lines: [
      { who: "旁白", text: "秋之门打开时,风变成了金黄色。" },
      { who: "熙叆", text: "哇——整条路都是落叶!像一条会沙沙响的地毯!", p: 1 },
      { who: "旁白", text: "她故意踩上去,听叶子唱歌。" },
      { who: "熙叆", text: "咔嚓、沙沙、咔嚓。秋天的开场曲!", p: 2 },
      { who: "旁白", text: "几片叶子追着她的裙摆跑,像跟不上的秋天。", p: 3 }
    ],
    next: "aut_2"
  },
  {
    id: "aut_2", chapter: "aut", photos: [19, 20, 21, 22],
    lines: [
      { who: "熙叆", text: "旅人,秋天的碎片最会躲了。它们会装成叶子、装成风、装成影子。" },
      { who: "旁白", text: "话没说完,她已经蹲了下去。", p: 1 },
      { who: "熙叆", text: "找到一片!看,叶脉里流着光。" },
      { who: "旁白", text: "一片又一片。她的口袋很快鼓了起来。", p: 2 },
      { who: "熙叆", text: "嘿嘿,大丰收!", p: 3 },
      { who: "旁白", text: "阳光照在落叶堆上,像撒了一层金箔。", p: 4 }
    ],
    next: "aut_3"
  },
  {
    id: "aut_3", chapter: "aut", photos: [23, 24, 25, 26, 27],
    lines: [
      { who: "熙叆", text: "嘘——旅人,别出声。前面有『会发光的落叶』。", p: 1 },
      { who: "旁白", text: "风停了一瞬。然后,整条路上的落叶同时亮了起来。", p: 2 },
      { who: "熙叆", text: "这是秋天的魔法。只有认真收集碎片的人,才看得见。" },
      { who: "旁白", text: "光从一片叶子跳到另一片,像一场无声的接力。", p: 3 },
      { who: "熙叆", text: "好看吧?我第一年看到的时候,激动得整晚没睡。", p: 4 },
      { who: "旁白", text: "她伸出手,接住最后一片发光的叶子。风又起了。", p: 5 }
    ],
    next: "aut_4"
  },
  {
    id: "aut_4", chapter: "aut", photos: [28, 29, 30],
    lines: [
      { who: "熙叆", text: "旅人,你看那朵云,像不像一条大鱼?", p: 1 },
      { who: "旁白", text: "你抬头。云慢慢游过屋檐。", p: 2 },
      { who: "熙叆", text: "等它游到钟楼顶上,秋天就过了一半。" },
      { who: "旁白", text: "一片碎片从云里掉下来,轻轻落在你肩头。", p: 3 }
    ],
    next: "aut_5"
  },
  {
    id: "aut_5", chapter: "aut", photos: [31, 32, 33],
    lines: [
      { who: "熙叆", text: "秋天还有一个秘密——", p: 1 },
      { who: "熙叆", text: "那就是……点心的季节!掰开一块,里面全是秋天的味道!", p: 2 },
      { who: "旁白", text: "夕阳把一切泡进蜂蜜色里。", p: 3 },
      { who: "熙叆", text: "啊……糟糕。" },
      { who: "旁白", text: "她忽然站住,表情认真。" },
      { who: "熙叆", text: "口袋,装不下了。碎片和叶子,都到极限啦。" },
      { choice: [
          { label: "把最漂亮的那片送给她。", pts: 30, say: "给我?真的吗?……我会把它做成书签,放在书的第一页。" },
          { label: "教她把叶子夹进书里。", pts: 20, say: "好主意!压平的叶子,就像睡着的秋天。" },
          { label: "告诉她:叶子会自己找到回家的路。", pts: 10, say: "真的吗?那我要站在这里,看它怎么走。……骗人,它根本没动嘛。" }
      ]},
      { who: "熙叆", text: "秋天的这一页,缝好啦。下一站——冬天。要把围巾系紧一点哦。" }
    ],
    next: "win_1"
  },

  /* ================= 第三章 冬 ================= */
  {
    id: "win_1", chapter: "win", photos: [34, 35, 36],
    lines: [
      { who: "旁白", text: "冬之门打开时,世界安静得像刚合上的书。" },
      { who: "熙叆", text: "下雪了……旅人,快看!初雪!", p: 1 },
      { who: "旁白", text: "雪落得轻手轻脚,生怕吵醒谁。", p: 2 },
      { who: "熙叆", text: "初雪是很了不起的。它是冬天写的第一封信。" },
      { who: "旁白", text: "她伸出舌头,接住一片雪。", p: 3 },
      { who: "熙叆", text: "……凉凉的,没味道。但是,甜甜的。真的!" }
    ],
    next: "win_2"
  },
  {
    id: "win_2", chapter: "win", photos: [37, 38, 39],
    lines: [
      { who: "熙叆", text: "冬天最适合做的事——第一名,就是把房间的灯全都点亮!", p: 1 },
      { who: "旁白", text: "灯光一盏盏亮起来,把雪地映成暖黄色。", p: 2 },
      { who: "熙叆", text: "第二名,就是捧着热可可,看窗外的雪。" },
      { who: "旁白", text: "热气模糊了窗玻璃。她在上面画了一颗星星。", p: 3 },
      { who: "熙叆", text: "许个愿吧,旅人。冬天的星星,最守信用。" }
    ],
    next: "win_3"
  },
  {
    id: "win_3", chapter: "win", photos: [40, 41, 42],
    lines: [
      { who: "旁白", text: "跨年的钟声,从很远的地方传来。" },
      { who: "熙叆", text: "倒数啦,旅人!十——九——八——", p: 1 },
      { who: "旁白", text: "光尘在雪地里升起,像一场倒着下的流星雨。", p: 2 },
      { who: "熙叆", text: "三——二——一!新年快乐!", p: 3 },
      { who: "熙叆", text: "新的一年也要一起收集碎片哦。……你刚才,许了什么愿?" },
      { choice: [
          { label: "希望明年的这个时候,也在这里。", pts: 30, say: "……真的吗?那、那说定了。违约的人要变成雪人。" },
          { label: "希望所有碎片都能回家。", pts: 20, say: "好温柔的愿望。它一定可以实现的。" },
          { label: "希望冬天快点过去。", pts: 10, say: "喂!冬天会伤心的!它可是很努力地在漂亮着。" }
      ]},
      { who: "熙叆", text: "冬天这一页,缝好啦。接下来,是春天。" }
    ],
    next: "spr_1"
  },

  /* ================= 第四章 春 ================= */
  {
    id: "spr_1", chapter: "spr", photos: [43, 44, 45],
    lines: [
      { who: "旁白", text: "春之门一开,雪就化了,像冬天从来没有来过。" },
      { who: "熙叆", text: "早春的风,像刚睡醒的猫,懒洋洋的。", p: 1 },
      { who: "熙叆", text: "等等,旅人!你猜今天是什么日子?" },
      { who: "熙叆", text: "2月20日——我的生日!嘿嘿,蜡烛要许愿,愿望要保密。" },
      { who: "旁白", text: "她忽然停下,盯着某处发呆。", p: 2 },
      { who: "熙叆", text: "旅人……你有没有觉得,这一页,特别亮?" },
      { who: "熙叆", text: "我好像,想起什么了。但是又抓不住……", p: 3 },
      { who: "旁白", text: "她的表情难得地认真。然后她甩甩头,重新笑起来。" },
      { who: "熙叆", text: "算啦!想不起来的事,就交给碎片去记!" }
    ],
    next: "spr_v1"
  },
  {
    id: "spr_v1", chapter: "spr", video: "ev_001",
    lines: [
      { who: "旁白", text: "忽然,脚下传来奇怪的震动。一本书从地底升起,封面镶着会转动的齿轮。" },
      { who: "熙叆", text: "这、这是……『会动的碎片』!传说级别的!" },
      { who: "熙叆", text: "旅人,快看快看!里面的时间,是活的!", video: true },
      { who: "熙叆", text: "……好厉害。里面的人,真的在动,在笑。" },
      { who: "熙叆", text: "原来,时间被好好珍惜的时候,就会变成这个样子。" },
      { who: "熙叆", text: "这个也要收进书里。一定、一定不能弄丢。" }
    ],
    next: "spr_2"
  },
  {
    id: "spr_2", chapter: "spr", photos: [46, 47, 48, 49, 50, 51],
    lines: [
      { who: "熙叆", text: "哇!花开了!一晚上就开了!", p: 1 },
      { who: "旁白", text: "春天把调色盘打翻在路边,到处都是颜色。", p: 2 },
      { who: "熙叆", text: "这朵像小喇叭,这朵像蝴蝶。春天真是天才!", p: 3 },
      { who: "旁白", text: "她跑在前面,回头朝你招手。", p: 4 },
      { who: "熙叆", text: "快点呀,旅人!春天可不等人!", p: 5 },
      { who: "旁白", text: "你追上去。风里全是花香。", p: 6 }
    ],
    next: "spr_v2"
  },
  {
    id: "spr_v2", chapter: "spr", video: "ev_002",
    lines: [
      { who: "旁白", text: "又有震动。这次,升起了一整面会动的墙。" },
      { who: "熙叆", text: "第二卷『会动的碎片』!今天是什么幸运日呀!" },
      { who: "熙叆", text: "看,里面也在过春天。", video: true },
      { who: "熙叆", text: "大家笑起来的样子,和花一样。" },
      { who: "熙叆", text: "要是妹妹聆淅也在,她一定会说:『姐姐,今天的魔法时间,很好看。』" },
      { who: "熙叆", text: "旅人,你说,书里装得下这么多快乐吗?" },
      { who: "旁白", text: "你点头。她满足地笑了。" }
    ],
    next: "spr_3"
  },
  {
    id: "spr_3", chapter: "spr", photos: [52, 53, 54, 55, 56, 57, 58],
    lines: [
      { who: "熙叆", text: "今天的风,好大呀——正适合放风筝!", p: 1 },
      { who: "旁白", text: "不知道从哪来的一只风筝,已经在她手上了。", p: 2 },
      { who: "熙叆", text: "预备——跑!", p: 3 },
      { who: "旁白", text: "风筝摇摇晃晃地起飞,像第一次学步的孩子。", p: 4 },
      { who: "熙叆", text: "飞起来了!旅人你看你看!", p: 5 },
      { who: "旁白", text: "线越放越长。风筝小成了一粒彩色芝麻。", p: 6 },
      { who: "熙叆", text: "嘿嘿,今天最厉害的就是它啦。", p: 7 }
    ],
    next: "spr_v3"
  },
  {
    id: "spr_v3", chapter: "spr", video: "ev_003",
    lines: [
      { who: "旁白", text: "第三卷影像,自己从书页间滑了出来。" },
      { who: "熙叆", text: "又来了!旅人,我们今天的运气,好到不真实!" },
      { who: "熙叆", text: "让我看看,这次的时间又藏着什么……", video: true },
      { who: "熙叆", text: "……真好啊。会动的时光,和不会动的碎片,都是宝贝。" },
      { who: "熙叆", text: "等一切结束,我要把这本书,读给最重要的人听。" }
    ],
    next: "spr_4"
  },
  {
    id: "spr_4", chapter: "spr", photos: [59, 60, 61, 62, 63, 64],
    lines: [
      { who: "旁白", text: "黄昏的风忽然乱了。", p: 1 },
      { who: "熙叆", text: "啊……", p: 2 },
      { who: "旁白", text: "风筝线,断了。", p: 3 },
      { who: "熙叆", text: "旅人!怎么办!风筝要飞走了!" },
      { who: "旁白", text: "风筝乘着风,越飞越高。" },
      { who: "熙叆", text: "去追吗?现在去追,还来得及!" },
      { choice: [
          { label: "追!跑起来!", pts: 30, say: "好!一、二——跑!!" },
          { label: "在原地等风把它送回来。", pts: 20, say: "好,那我们和风商量一下……风先生,拜托啦。" },
          { label: "断了就断了吧。天空也需要一只风筝。", pts: 10, say: "……你说得对。它现在,是天空的风筝了。" }
      ]},
      { who: "旁白", text: "风筝变成天边的一个点,又变成一颗星星。", p: 4 },
      { who: "熙叆", text: "不管飞得多远,线的那头,一直有人记得它。", p: 5 },
      { who: "熙叆", text: "春天这一页,缝好啦。", p: 6 },
      { who: "熙叆", text: "旅人……走吧。还剩最后一页。" }
    ],
    next: "fin_1"
  },

  /* ================= 终章 ================= */
  {
    id: "fin_1", chapter: "fin", photos: [65, 66, 67],
    lines: [
      { who: "旁白", text: "你们回到时光王国。钟楼之间,浮满了发光的碎片,像一条倒悬的银河。" },
      { who: "熙叆", text: "看呀,旅人。这是我们一起收集的一年。", p: 1 },
      { who: "熙叆", text: "要是妹妹聆淅也在就好了。她是雨露精灵,笑起来像雨后的晴天。" },
      { who: "旁白", text: "每一片碎片里,都有人影,有笑声,有阳光。", p: 2 },
      { who: "熙叆", text: "夏、秋、冬、春。原来一年,有这么多值得记住的日子。", p: 3 },
      { who: "熙叆", text: "旅人,我要告诉你一个秘密。" },
      { who: "熙叆", text: "其实,我认识你。在很久很久以前,在书外面的世界。" },
      { who: "熙叆", text: "这些碎片,不是别人丢的。是我自己的。是『我们』的。" },
      { who: "旁白", text: "光尘安静下来。她的声音轻得像一片雪。" },
      { who: "熙叆", text: "我是把一年回忆缝进书里的小裁缝。因为害怕忘记,所以我把每一天,都做成了碎片。" },
      { who: "熙叆", text: "可是后来,书合上了。我在这里,等了很久很久。等一个愿意陪我重走四季的人。" }
    ],
    next: "fin_2"
  },
  {
    id: "fin_2", chapter: "fin", photos: [68, 69, 70, 71, 72],
    lines: [
      { who: "熙叆", text: "谢谢你,旅人。谢谢你陪我走完这一年。", p: 1 },
      { who: "旁白", text: "她的眼睛亮晶晶的,像装了一整个夏天。", p: 2 },
      { who: "熙叆", text: "书只剩下最后一页了。空白的。", p: 3 },
      { who: "熙叆", text: "这一页该放什么,由你来决定。", p: 4 },
      { who: "熙叆", text: "因为,这是『最珍贵的一天』的位置。" },
      { who: "熙叆", text: "那么,旅人。请选择吧。", p: 5 },
      { choice: [
          { label: "把『今天』也装进去。永远的时间童话。", pts: 30, say: "……好。那我要把这一天,缝得最漂亮。" },
          { label: "留白吧。未来的故事,还要继续写。", pts: 0, say: "未来……是呢。未来,也是一页童话。" }
      ]}
    ],
    next: "fin_3"
  },
  {
    id: "fin_3", chapter: "fin", photos: [73],
    lines: [
      { who: "旁白", text: "书页缓缓合上。然后,所有的光,都醒了。", p: 1 },
      { ending: true }
    ]
  }
  ];

  /* ---------- 结局演出 ---------- */
  var ENDING_SCRIPTS = {
    endA: [
      { who: "旁白", text: "所有的碎片同时飞起,在夜空中拼成一条闪闪发光的河。" },
      { who: "熙叆", text: "一年四季,全都回来了。而且——比原来更亮!" },
      { who: "熙叆", text: "你看,旅人。这就是我们的时间。" },
      { who: "旁白", text: "那本旧书缓缓合上,封面上多了一行字。" },
      { who: "熙叆", text: "『最珍贵的一天,是每一个与你在一起的今天。』" },
      { who: "熙叆", text: "所以,这不是结束。是永远的开始。" },
      { who: "熙叆", text: "欢迎回来,旅人。……不,欢迎回来,我最重要的人。" },
      { who: "旁白", text: "窗外,天亮了。书桌上那本旧书,还在。而你记得,关于魔法时间的一切。" }
    ],
    endB: [
      { who: "旁白", text: "碎片们慢慢落下,像一场温柔的雪。" },
      { who: "熙叆", text: "书,还差一点点。不过没关系。" },
      { who: "熙叆", text: "留一点空白,明年再一起补上吧。" },
      { who: "熙叆", text: "明年,后年,还有以后的每一年。" },
      { who: "旁白", text: "她的身影渐渐变淡。可那个约定,亮得像星星。" },
      { who: "熙叆", text: "说好了哦。明年夏天,老地方见。" },
      { who: "旁白", text: "你醒来时,枕边落着一片发光的叶子。" }
    ],
    endC: [
      { who: "旁白", text: "光,一点点暗下去。碎片开始褪色。" },
      { who: "熙叆", text: "……这样啊。原来有些日子,终究还是留不住。" },
      { who: "熙叆", text: "没关系的,旅人。至少,有一片不会褪色。" },
      { who: "旁白", text: "她把最亮的一片碎片,放进你手心。" },
      { who: "熙叆", text: "带着它回去吧。想我的时候,就看看它。" },
      { who: "旁白", text: "醒来时,手心里空空的。可你总觉得,那里曾经很暖。" }
    ]
  };

  /* ---------- 片尾 ---------- */
  var CREDITS = [
    "《魔法时间的童话》",
    "～ 熙叆的时光物语 ～",
    "",
    "主演:熙叆",
    "向日葵精灵 · 黄昏下的天使",
    "旅人:你",
    "",
    "影像:74 枚时光碎片 · 3 卷会动的碎片",
    "音乐:《魔法时间的童话》",
    "",
    "特别出演",
    "聆淅 · 方儿 · 慕儿",
    "",
    "设定:熙叆角色资源站",
    "黄昏,是她最爱的魔法时间",
    "",
    "「最珍贵的一天,",
    "是每一个与你在一起的今天。」",
    "",
    "愿魔法的时间,永远与你同在",
    "",
    "— 完 —"
  ];

  function endingFor(pts) {
    if (pts >= 125) return "endA";
    if (pts >= 70) return "endB";
    return "endC";
  }

  return {
    PHOTOS: PHOTOS,
    VIDEOS: VIDEOS,
    CHAPTERS: CHAPTERS,
    ENDINGS: ENDINGS,
    SCENES: SCENES,
    ENDING_SCRIPTS: ENDING_SCRIPTS,
    CREDITS: CREDITS,
    endingFor: endingFor,
    photoById: function (id) { return PHOTOS[id - 1]; },
    videoById: function (id) {
      for (var i = 0; i < VIDEOS.length; i++) if (VIDEOS[i].id === id) return VIDEOS[i];
      return null;
    },
    sceneById: function (id) {
      for (var i = 0; i < SCENES.length; i++) if (SCENES[i].id === id) return SCENES[i];
      return null;
    }
  };
})();
