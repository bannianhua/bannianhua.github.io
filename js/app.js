/* ============================================================
 * 聆熙花影馆 · 单页应用主逻辑
 * 路由（hash）/ 页面渲染 / 图库灯箱 / 阅读器 / 背景粒子
 * ============================================================ */
(function () {
  'use strict';

  var SITE = window.SITE || {};
  var PHOTOS = window.PHOTOS || [];
  var BOOK = window.BOOK || null;

  var SEASON = { spr: '春', sum: '夏', aut: '秋', win: '冬' };
  function el(id) { return document.getElementById(id); }
  function pad(n) { return String(n).padStart(3, '0'); }

  /* ---------- 日期种子随机数（用于「每日精选」：同一天内结果稳定） ---------- */
  function seedOf(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function rngOf(seed) {
    var s = seed >>> 0;
    return function () { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
  }
  function dayKey(d) {
    d = d || new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  /* 每天随机挑选 n 张图库照片（同一天内稳定） */
  function dailyPicks(n) {
    var r = rngOf(seedOf('picks-' + dayKey()));
    var pool = PHOTOS.slice(), out = [];
    for (var i = 0; i < n && pool.length; i++) {
      out.push(pool.splice(Math.floor(r() * pool.length), 1)[0]);
    }
    return out;
  }

  /* ============================================================
     主页
     ============================================================ */
  function pgHome() {
    var cards = dailyPicks(6).map(function (p) {
      return '<div class="shard" data-open="' + p.id + '" style="cursor:pointer">' +
        '<img src="' + p.thumb + '" alt="时光碎片 ' + pad(p.id) + '" loading="lazy">' +
        '<div class="s-meta"><span class="s-no">#' + pad(p.id) + '</span><span>' + p.seasonName + ' · ' + p.date + '</span></div>' +
        '</div>';
    }).join('');

    return '' +
    '<section class="hero">' +
      '<div class="hero-txt">' +
        '<span class="hero-kicker">🌻 SUNFLOWER SPIRIT · 向日葵精灵</span>' +
        '<h1>熙叆</h1>' +
        '<p class="hero-sub">～ 向日葵与露水的魔法时间 ～</p>' +
        '<p class="hero-desc">向日葵国度里，一场太阳雨落进花心，让同一朵花里开出了两个孩子——' +
          '像太阳一样的向日葵精灵 <em>熙叆</em>，和像雨露一样的雨露精灵 <em>聆淅</em>。' +
          '她们一起拍下黄昏的「魔法时间」，一起把散落的时光碎片收进相册，' +
          '也一起住在开满向日葵的「聆熙花影馆」里。</p>' +
        '<div class="hero-act">' +
          '<a class="btn solid" href="#/gallery">浏览时光图库</a>' +
          '<a class="btn" href="#/read">阅读聆熙童话</a>' +
          '<a class="btn" href="#/about">完整角色设定</a>' +
        '</div>' +
      '</div>' +
      '<div class="hero-art">' +
        '<figure class="polaroid"><img src="preview/012.webp" alt="熙叆" loading="eager">' +
        '<figcaption>熙叆 · 黄昏下的天使</figcaption></figure>' +
      '</div>' +
    '</section>' +

    '<div class="stats">' +
      '<div class="stat"><b>' + PHOTOS.length + '</b><span>时光碎片 · 照片</span></div>' +
      '<div class="stat"><b>' + ((SITE.media || []).length) + '</b><span>会动的碎片 · 影像</span></div>' +
      '<div class="stat"><b>' + (SITE.bgm ? 1 : 0) + '</b><span>主题音乐</span></div>' +
      '<div class="stat"><b>4</b><span>季 · 春夏秋冬</span></div>' +
      '<div class="stat"><b>2</b><span>位 · 熙叆与聆淅</span></div>' +
      '<div class="stat"><b>' + chapterCount() + '</b><span>章 · 聆熙童话</span></div>' +
    '</div>' +

    '<div class="sec-h">两位精灵姐妹</div>' +
    '<div class="chara">' +
      '<div class="c-art"><figure class="polaroid"><img src="preview/012.webp" alt="熙叆" loading="lazy">' +
      '<figcaption>熙叆 · 碎片 012</figcaption></figure></div>' +
      '<div class="c-body">' +
        '<div class="chara-hd"><h3>熙叆</h3><span class="c-alias">きあい · 黄昏下的天使 · 向日葵精灵</span></div>' +
        '<div class="attrs">' +
          attr('别称', '小叆 · 熙叆酱 · 叆酱 · kiai酱') +
          attr('生日', '2 月 20 日') +
          attr('性格', '天然呆 · 活泼 · 乐观 · 元气 · 温柔') +
          attr('能力', '操纵花朵盛开与枯萎 · 奇特摄影能力') +
          attr('爱好', '摄影 · 吃书 · 看书 · 养花 · 和聆淅玩耍') +
          attr('理想', '希望每天都开心快乐自由一点') +
        '</div>' +
        '<p class="quote">「熙叆」音同「心爱」——熙，是光明的意思，也寓意温暖与快乐；叆，是可爱的一面。' +
          '每到黄昏，天空美得不真实，像是有人对着天空施了魔法。她把那样的时刻，叫做「魔法时间」。</p>' +
      '</div>' +
    '</div>' +
    '<div class="chara">' +
      '<div class="c-art"><figure class="polaroid"><img src="preview/033.webp" alt="聆淅" loading="lazy">' +
      '<figcaption>聆淅 · 雨中的天使 · 碎片 033</figcaption></figure></div>' +
      '<div class="c-body">' +
        '<div class="chara-hd"><h3>聆淅</h3><span class="c-alias">れいせき · 雨中的天使 · 雨露精灵</span></div>' +
        '<div class="attrs">' +
          attr('别称', '小淅 · 聆淅酱 · leiseki酱') +
          attr('生日', '2 月 20 日') +
          attr('性格', '天然呆 · 三无（偶尔会笑）· 温柔') +
          attr('能力', '在指定地方施展雨露') +
          attr('爱好', '在雨中玩耍 · 听雨的声音 · 吮吸雨露') +
          attr('理想', '希望每天都快乐一点') +
        '</div>' +
        '<p class="quote">「聆淅」就是聆听淅淅沥沥的雨声。她身旁总有两只可爱的雨水精灵「方儿」和「慕儿」，' +
          '伞把上挂着按熙叆姐姐形象定制的挂件。雨露很甜，所以她总在雨后吮吸花瓣上的露水——' +
          '毕竟，吮吸露水是雨露精灵的本能呀。</p>' +
      '</div>' +
    '</div>' +

    '<div class="sec-h">在花影馆里走走</div>' +
    '<div class="entries">' +
      entry('#/gallery', '❀', '时光图库', '按春夏秋冬四季整理的 ' + PHOTOS.length + ' 枚时光碎片，可筛选、可放大细看。', 'GALLERY') +
      entry('#/media', '✦', '影音资源', '三卷「会动的碎片」影像与主题音乐《魔法时间的童话》。', 'MEDIA') +
      entry('#/about', '✿', '角色设定', '熙叆与聆淅的完整设定，以及向日葵国度的种种趣事。', 'PROFILE') +
      entry('#/read', '📖', '聆熙童话', '《向日葵与露水的魔法时间》治愈童话全文在线阅读。', 'STORY') +
      entry('#/board', '✉', '留言板', '给熙叆和聆淅留一句话吧，也可以看看别人写了什么。', 'BOARD') +
    '</div>' +

    '<div class="sec-h">每日精选</div>' +
    '<p class="p-sub" style="margin:-10px 0 16px;font-size:12.5px">每天从时光碎片里随机翻出六枚 · 明天又不一样</p>' +
    '<div class="grid-g" id="home-grid">' + cards + '</div>';
  }

  function attr(k, v) {
    return '<div class="attr"><span class="k">' + k + '</span><span class="v">' + v + '</span></div>';
  }
  function entry(href, ico, title, desc, en) {
    return '<a class="entry" href="' + href + '"><span class="e-ico">' + ico + '</span>' +
      '<h3>' + title + '</h3><p>' + desc + '</p><span class="e-en">' + en + '</span></a>';
  }

  /* ============================================================
     图库
     ============================================================ */
  var gState = { filter: 'all', list: PHOTOS.slice(), cur: -1 };

  function pgGallery() {
    var total = PHOTOS.filter(function (p) { return p.season === gState.filter; }).length;
    return '' +
      '<h2 class="p-title">时光图库</h2>' +
      '<p class="p-sub">' + seasonRange() + ' · 共 <b>' + PHOTOS.length + '</b> 枚时光碎片 · 点击放大细看</p>' +
      '<div class="filters" id="g-filters">' +
        fbtn('all', '全部') + fbtn('spr', '春') + fbtn('sum', '夏') + fbtn('aut', '秋') + fbtn('win', '冬') +
      '</div>' +
      '<div class="grid-g" id="g-grid"></div>' +
      '<div class="empty" id="g-empty" style="display:none">这个季节还没有时光碎片……</div>' +
      '<p class="p-sub" style="margin-top:26px;font-size:12px">※ 照片按拍摄日期归类；「魔法时间」是熙叆对黄昏的称呼。</p>';
  }
  function fbtn(s, label) {
    return '<button data-season="' + s + '"' + (gState.filter === s ? ' class="on"' : '') + '>' + label + '</button>';
  }
  function seasonRange() {
    if (!PHOTOS.length) return '';
    var ds = PHOTOS.map(function (p) { return p.date; }).sort();
    return ds[0].replace(/-/g, '.') + ' ～ ' + ds[ds.length - 1].replace(/-/g, '.');
  }

  function paintGallery() {
    var grid = el('g-grid');
    if (!grid) return;
    var list = gState.filter === 'all' ? PHOTOS.slice() : PHOTOS.filter(function (p) { return p.season === gState.filter; });
    gState.list = list;
    el('g-empty').style.display = list.length ? 'none' : 'block';
    grid.innerHTML = list.map(function (p) {
      return '<div class="shard" data-i="' + list.indexOf(p) + '">' +
        '<img src="' + p.thumb + '" alt="时光碎片 ' + pad(p.id) + '" loading="lazy">' +
        '<div class="s-meta"><span class="s-no">#' + pad(p.id) + '</span><span>' + p.seasonName + ' · ' + p.date + '</span></div>' +
        '</div>';
    }).join('');
  }

  /* 灯箱 */
  function openLb(i) {
    var p = gState.list[i];
    if (!p) return;
    gState.cur = i;
    var lb = el('lb');
    el('lb-img').src = p.preview;
    el('lb-img').alt = '时光碎片 ' + pad(p.id);
    el('lb-no').textContent = pad(p.id);
    el('lb-season').textContent = p.seasonName + '季';
    el('lb-date').textContent = p.date;
    el('lb-size').textContent = (p.width && p.height) ? (p.width + ' × ' + p.height) : '';
    lb.classList.add('on');
    document.body.style.overflow = 'hidden';
  }
  function closeLb() {
    el('lb').classList.remove('on');
    document.body.style.overflow = '';
  }
  function stepLb(d) {
    if (!gState.list.length) return;
    openLb((gState.cur + d + gState.list.length) % gState.list.length);
  }

  /* 童话真正的章节数（不含封面 / 简介 / 全书完这几页） */
  function chapterCount() {
    if (!BOOK || !BOOK.chapters) return 0;
    var n = BOOK.chapters.filter(function (c) { return c.kind === 'chapter'; }).length;
    return n || BOOK.chapters.length;
  }

  /* ============================================================
     影音
     ============================================================ */
  function pgMedia() {
    var media = SITE.media || [];
    var vids = media.map(function (m) {
      return '<div class="vcard">' +
        '<div class="vcard-hd"><h3>✦ ' + m.title + '</h3><span>' + m.date + ' · ' + m.id + '</span></div>' +
        '<video controls controlsList="nodownload" disablePictureInPicture preload="none" playsinline src="' + m.src + '"></video>' +
        '<p class="note">※ 在线播放压缩版影像。</p>' +
        '</div>';
    }).join('');
    var bgm = SITE.bgm || {};
    return '' +
      '<h2 class="p-title">影音资源</h2>' +
      '<p class="p-sub">会动的碎片 · 三卷特别影像 ／ 主题音乐《魔法时间的童话》</p>' +
      vids +
      '<div class="sec-h">主题音乐</div>' +
      '<div class="music">' +
        '<div class="music-hd">' +
          '<span class="m-ico">♪</span>' +
          '<div class="m-txt"><h3>' + (bgm.title || '主题音乐') + '</h3><p>循环播放 · 点击播放键收听</p></div>' +
        '</div>' +
        '<audio id="bgm" controls controlsList="nodownload" preload="metadata" loop src="' + (bgm.src || '') + '"></audio>' +
        '<p class="m-state" id="bgm-state">♪ 点击播放键即可收听主题音乐</p>' +
      '</div>';
  }

  var bgmTimer = null;

  function initMedia() {
    var a = el('bgm'), st = el('bgm-state');
    if (!a || !st) return;
    /* 每次进入本页都会重新建播放器，先清掉上一次的定时器，避免泄漏 */
    if (bgmTimer) { clearInterval(bgmTimer); bgmTimer = null; }

    /* 恢复上次的播放位置：只看时间，与「上次是否在播」无关 */
    var lastOn = false;
    try {
      lastOn = localStorage.getItem("xi'ai_bgm_on") === '1';
      var t = parseFloat(localStorage.getItem("xi'ai_bgm_time") || '0');
      if (!isNaN(t) && t > 1) {
        a.addEventListener('loadedmetadata', function () {
          try { if (Math.abs(a.currentTime - t) > 2) a.currentTime = t; } catch (e) { }
        }, { once: true });
      }
    } catch (e) { }
    st.textContent = lastOn ? '♪ 上次听到一半，点击播放键继续（不会自动播放）' : '♪ 点击播放键即可收听主题音乐';

    a.addEventListener('play', function () {
      st.textContent = '♪ 主题音乐播放中';
      try {
        localStorage.setItem("xi'ai_bgm_on", '1');
        localStorage.setItem("xi'ai_bgm_time", String(a.currentTime || 0));
      } catch (e) { }
    });
    a.addEventListener('pause', function () {
      st.textContent = '♪ 已暂停，点击播放键继续';
      try {
        localStorage.setItem("xi'ai_bgm_on", '0');
        localStorage.setItem("xi'ai_bgm_time", String(a.currentTime || 0));
      } catch (e) { }
    });
    /* 播放中每 3 秒记一次进度（每次都取当前节点，避免抓住已移除的旧播放器） */
    bgmTimer = setInterval(function () {
      var cur = el('bgm');
      if (cur && !cur.paused) { try { localStorage.setItem("xi'ai_bgm_time", String(cur.currentTime || 0)); } catch (e) { } }
    }, 3000);
  }

  /* ============================================================
     角色设定
     ============================================================ */
  function pgAbout() {
    return '' +
      '<h2 class="p-title">角色设定</h2>' +
      '<p class="p-sub">向日葵国度的两位精灵姐妹 · 黄昏的天使与雨中的天使</p>' +

      '<div class="card chara-page">' +
        '<div class="chara-hd"><h3>熙叆</h3><span class="c-alias">きあい · kiai酱 · 别称：小叆 · 熙叆酱 · 叆酱</span></div>' +
        '<p style="color:var(--ink-3);font-size:14.5px;margin-bottom:14px">' +
          '「熙」是光明的意思，也寓意温暖快乐；「叆」体现可爱的一面。' +
          '「熙叆」听起来音同「心爱」——她是被大家心爱着的、向日葵国度的向日葵精灵。</p>' +
        '<table class="ctable">' +
          row('种族', '向日葵精灵') + row('绰号', '黄昏下的天使') + row('性别', '女') +
          row('年龄', '这是女孩子的秘密') + row('生日', '2 月 20 日') +
          row('性格', '天然呆 · 活泼 · 乐观 · 元气 · 温柔') +
          row('能力', '操纵花朵盛开与枯萎；奇特的摄影能力（向日葵国度里其他精灵都没有）') +
          row('爱好', '摄影 · 吃书 · 看书 · 喜欢故事 · 养花 · 和聆淅一起玩耍 · 拍摄魔法时间') +
          row('理想', '希望每天都开心快乐自由一点') +
        '</table>' +
        '<div class="story">' +
          h4('外貌') +
          p('拥有一头纯白色的长发，喜欢将长发扎成多马尾（四马尾）：前面两条马尾由向日葵花饰扎起（是真的向日葵花哦），' +
            '后面两条马尾由向日葵花搭配向日葵叶扎起（这里也是真正的向日葵花和叶哦）。头顶佩戴绿色的发带，' +
            '发带从侧边延伸出形似叶片的绿色发饰。头发上还别着两枚橙色发卡，瞳色为银白色。') +
          p('上身穿着暖黄色的形似水手服的宽松上衣，内搭白色翻领衬衫，领口系着绿色的蝴蝶结领结，' +
            '袖口处有绿色和白色的蝴蝶结装饰，袖子为超长袖。下身穿着深棕色的百褶短裙，' +
            '裙边有暖黄色和白色的细条纹装饰。脚上穿着带花边的白色中筒袜与深棕色的鞋子，鞋头有向日葵花叶的装饰。') +
          h4('关于聆淅') + p('聆淅是我的妹妹。【想未来和妹妹结婚】') +
          h4('关于书籍') +
          p('作为一个爱书、喜欢读书、喜欢买书的精灵，不只是被书的内容所吸引，同时也对书本各种各样的纸张纹理、' +
            '装帧方式、油墨的味道和时间沉淀下来的书香气特别的痴迷。每一次拿到一本书，随便翻开一页，' +
            '凑过鼻子闻一下书香，书本中的内容和一切仿佛都在不经意中传递到大脑，传递到心灵最柔美、最纯真的那片温床。') +
          h4('关于能力') +
          p('我们向日葵精灵每个精灵的能力都不一样，我的是操纵花朵盛开和枯萎，并且还有一个很奇特的摄影能力，' +
            '我非常喜欢我的能力哦。') +
          h4('关于摄影能力') +
          p('相机？那是什么。在国度里，并没有相机这种东西，我只需要用双手比划摄影的动作，就可以拍下来哦，' +
            '风景非常清晰呢，照片会在拍完以后凭空出现在我的手上。') +
          h4('关于摄影') +
          p('可能我一直都很喜欢摄影，并且这是我的能力，它藏在自己内心的深处，连我自己都未曾发觉。' +
            '我会为拍摄到自己喜欢的风景而开心，也会为错过某一时刻的风景而遗憾。' +
            '我不在乎别人的看法，我自己拍摄的风景只需自己觉得好看就可以了。') +
          h4('关于「魔法时间」') +
          p('我会亲切地将黄昏称呼为「魔法时间」，因为每到这时候，天空就会异常美丽，美得不真实，' +
            '像是有人对着天空施了魔法。') +
          h4('关于「吃书」') +
          p('在看书的过程中，我会不由自主地将书页撕下，塞到嘴里吃下去，并且会根据书页的内容尝到各种味道' +
            '【书页真的好好吃！】。吃下书页后，内容会流入我的心里，从而知道书页上写的是什么内容。' +
            '问了一下国度里的其他孩子，好像只有我可以吃书！') +
        '</div>' +
      '</div>' +

      '<div class="card chara-page">' +
        '<div class="chara-hd"><h3>聆淅</h3><span class="c-alias">れいせき · leiseki酱 · 别称：小淅 · 聆淅酱</span></div>' +
        '<p style="color:var(--ink-3);font-size:14.5px;margin-bottom:14px">' +
          '「聆」是聆听，「淅」是淅淅沥沥的雨声——聆淅，就是聆听淅淅沥沥的雨声。' +
          '她是熙叆的妹妹，来自向日葵国度的雨露精灵。</p>' +
        '<table class="ctable">' +
          row('种族', '雨露精灵') + row('绰号', '雨中的天使') + row('性别', '女') +
          row('年龄', '这是女孩子的秘密') + row('生日', '2 月 20 日') +
          row('性格', '天然呆 · 三无（但不是完全三无，偶尔会笑）· 温柔') +
          row('能力', '在指定地方施展雨露') +
          row('爱好', '在雨中玩耍 · 听雨的声音 · 吮吸雨露') +
          row('理想', '希望每天都快乐一点') +
        '</table>' +
        '<div class="story">' +
          h4('外貌') +
          p('拥有一头纯白色的长发，喜欢将长发扎成多马尾（四马尾）：前面两条马尾由浅蓝色蝴蝶结扎起，' +
            '后面两条马尾由深蓝色蝴蝶结扎起。头顶佩戴深蓝色的发带，发带从侧边延伸出形似叶片的蓝色发饰。' +
            '头发上还别着两枚白色发卡，瞳色为银白色。') +
          p('上身穿着白色的形似水手服的宽松上衣，内搭白色翻领衬衫，领口系着红色的蝴蝶结领结，' +
            '袖口处有深蓝色和浅蓝色的蝴蝶结装饰，袖子为超长袖。下身穿着深蓝色的百褶短裙，' +
            '裙边有蓝色和白色的细条纹装饰。脚上穿着带花边的白色中筒袜与黑色的鞋子，鞋头有浅蓝色蝴蝶结的装饰。') +
          h4('关于熙叆') + p('熙叆是我的姐姐。【想未来和姐姐结婚】') +
          h4('关于雨') +
          p('我从小就喜欢雨，对雨有一种很亲切的感觉。每当雨水从天而降时，我就会觉得非常惬意，' +
            '仿佛置身另一个世界：时间静止了，空间也静止了，整个世界变得异常安静，只剩下雨落在物体上的声音。' +
            '每当下雨时，我一定会走在雨中，撑着伞，在雨中漫步。我喜欢雨的声音，喜欢雨后清新的空气和泥土的芬芳。') +
          h4('雨中的天使') +
          p('我的朋友们亲切地称我为「雨中的天使」。【不过，我并不讨厌这个绰号，反而还挺喜欢的】' +
            '不过对我来说，我只是喜欢在雨中漫步和摄影，并不是什么「雨中的天使」哈哈。') +
          h4('关于「魔法时间」') +
          p('我和姐姐一样，会亲切地将黄昏称呼为「魔法时间」，因为每到这时候，天空就会异常美丽，美得不真实。') +
          h4('关于「雨露精灵」') +
          p('在我的身旁有两只超级超级可爱的雨水精灵，我给它们起名为「方儿」和「慕儿」。' +
            '至于它们是什么时候出现的，我也不知道，我只知道它们从我记事起就陪在我的身边。' +
            '外人也能看到它们，但是并不会感到惊讶，反而会感觉很可爱。为什么呢？我也不知道哈哈。') +
          h4('关于「雨伞」') +
          p('我有一把白色的雨伞，是在购物时买的，当时看着这把伞特别可爱，就买了下来。' +
            '伞把下面有一个熙叆姐姐的挂件，那是我根据姐姐的形象定制的，定制完成后挂在了伞把上。') +
          h4('关于「吮吸雨露」') +
          p('雨露很甜，所以我经常会雨后去吮吸残留在植物、花朵上的露水，因为很好喝' +
            '【真实原因是因为自己是雨露精灵，吮吸露水是本能】。') +
        '</div>' +
      '</div>' +

      '<div class="card chara-page">' +
        '<div class="chara-hd"><h3>向日葵国度</h3><span class="c-alias">A SUNFLOWER LAND</span></div>' +
        '<p style="color:var(--ink-3);font-size:14.5px;margin-bottom:14px">两位精灵姐妹生活的地方，也是《魔法时间的童话 ～熙叆的时光物语～》故事开始的地方。</p>' +
        '<div class="story">' +
          h4('魔法时间') +
          p('黄昏时分，天空会变得异常美丽，美得不真实，像是有人对着天空施了魔法。' +
            '熙叆与聆淅都亲切地把这样的时刻叫做「魔法时间」——她们最喜欢在这样的时刻拍照。') +
          h4('时光碎片') +
          p('2025 年夏到 2026 年秋，熙叆用她奇特的摄影能力拍下的照片，被整理成「时光碎片」，' +
            '按春夏秋冬四季编排，收藏在图库中。') +
          h4('关于这段童话') +
          p('在《魔法时间的童话 ～熙叆的时光物语～》里，你会在深夜翻开一本旧书，被卷进时光王国，' +
            '遇见守护「时间碎片」的小魔女熙叆，与她一起走过一年四季，编织成这部温暖的童话。') +
        '</div>' +
      '</div>';
  }
  function row(k, v) { return '<tr><td class="k">' + k + '</td><td>' + v + '</td></tr>'; }
  function h4(s) { return '<h4>' + s + '</h4>'; }
  function p(s) { return '<p>' + s + '</p>'; }

  /* ============================================================
     阅读器
     ============================================================ */
  var rState = { cur: 0, font: 18, key: "xi'ai_read_last" };
  /* 当前阅读器的翻页入口（由 initReader 赋值），供全局方向键监听器调用 */
  var rdTurn = null;

  function pgRead() {
    if (!BOOK || !BOOK.chapters || !BOOK.chapters.length) {
      return '<h2 class="p-title">聆熙童话</h2><p class="p-sub">内容加载中……</p>';
    }
    /* 简介里本来就有 <h2> 这类块级标签的行要原样输出，
       不能再用 <p> 包一层（<p><h2> 是非法嵌套，浏览器会补出空段落） */
    var intro = (BOOK.intro || '').split('\n').map(function (s) {
      if (!s) return '';
      return /^\s*</.test(s) ? s : '<p>' + s + '</p>';
    }).join('');
    return '' +
      '<h2 class="p-title">聆熙童话</h2>' +
      '<p class="p-sub">' + (BOOK.title || '') + ' · 作者 ' + (BOOK.author || '聆熙') + ' · 共 <b>' + BOOK.chapters.length + '</b> 页</p>' +
      '<div class="card" style="margin-bottom:26px">' +
        '<div class="sec-h" style="margin-top:0">作品简介</div>' +
        '<div style="font-size:14.5px;color:var(--ink-2)">' + intro + '</div>' +
      '</div>' +
      '<div class="reader">' +
        '<aside class="rd-side" id="rd-side">' +
          '<div class="rs-h"><span>目录</span></div>' +
          '<nav id="rd-list"></nav>' +
        '</aside>' +
        '<div class="rd-main">' +
          '<div class="rd-bar">' +
            '<button class="btn sm" id="rd-menu">☰ 目录</button>' +
            '<button class="btn sm" id="rd-prev">‹ 上一章</button>' +
            '<span class="pos" id="rd-pos">—</span>' +
            '<button class="btn sm" id="rd-next">下一章 ›</button>' +
            '<span class="tools"><button class="btn sm" id="rd-minus">A−</button><button class="btn sm" id="rd-plus">A＋</button></span>' +
          '</div>' +
          '<article class="rd-body" id="rd-body"></article>' +
        '</div>' +
      '</div>';
  }

  function initReader() {
    if (!BOOK || !BOOK.chapters) return;
    var list = el('rd-list'), body = el('rd-body'), pos = el('rd-pos');
    if (!list || !body) return;
    try {
      var s = parseInt(localStorage.getItem(rState.key), 10);
      if (!isNaN(s) && s >= 0 && s < BOOK.chapters.length) rState.cur = s;
      var f = parseInt(localStorage.getItem("xi'ai_read_font"), 10);
      if (!isNaN(f) && f >= 14 && f <= 26) rState.font = f;
    } catch (e) { }

    var html = '', lastG = null;
    BOOK.chapters.forEach(function (c, i) {
      if (c.group !== lastG) { html += '<div class="rd-group">' + c.group + '</div>'; lastG = c.group; }
      html += '<a href="#/read" data-i="' + i + '">' + (c.extra ? '✿ ' : '') + c.title + '</a>';
    });
    list.innerHTML = html;
    body.style.fontSize = rState.font + 'px';

    function paint(toChapterTop) {
      var c = BOOK.chapters[rState.cur];
      body.className = 'rd-body' + (c.kind === 'cover' ? ' cover' : c.kind === 'colophon' ? ' colophon' : '');
      body.innerHTML = '<h1>' + (c.extra ? '✿ ' : '') + c.title + '</h1>' + c.body;
      /* 翻章时只把「章节开头」对齐到顶栏下方，
         不再把整页滚回最顶部（那样每次翻页都要重新往下滚）。 */
      if (toChapterTop) scrollToChapter();
      pos.textContent = (rState.cur + 1) + ' / ' + BOOK.chapters.length + ' · ' + c.group;
      var as = list.querySelectorAll('a');
      for (var i = 0; i < as.length; i++) {
        as[i].classList.toggle('on', i === rState.cur);
        if (i === rState.cur && typeof as[i].scrollIntoView === 'function') {
          try { as[i].scrollIntoView({ block: 'nearest' }); } catch (e) { }
        }
      }
      try { localStorage.setItem(rState.key, String(rState.cur)); } catch (e) { }
      document.title = c.title + ' · 聆熙花影馆';
    }
    /* 把章节工具条对齐到固定顶栏下方；若本来就在合适位置则不动 */
    function scrollToChapter() {
      var bar = document.querySelector('#pg-read .rd-bar');
      if (!bar) return;
      var hd = document.querySelector('.hd');
      var hh = (hd && hd.offsetHeight) ? hd.offsetHeight : 0;
      var top = bar.getBoundingClientRect().top;
      if (top >= hh + 8 && top <= hh + 120) return;      /* 已经对齐好了 */
      var y = top + (window.pageYOffset || document.documentElement.scrollTop || 0) - hh - 14;
      if (y < 0) y = 0;
      try { window.scrollTo({ top: y, behavior: 'smooth' }); }
      catch (e) { try { window.scrollTo(0, y); } catch (e2) { } }
    }
    function go(i) {
      rState.cur = (i + BOOK.chapters.length) % BOOK.chapters.length;
      paint(true);
      el('rd-side').classList.remove('open');
    }
    list.addEventListener('click', function (e) {
      var a = e.target.closest('a[data-i]');
      if (!a) return;
      e.preventDefault();
      go(parseInt(a.dataset.i, 10));
    });
    el('rd-prev').addEventListener('click', function () { go(rState.cur - 1); });
    el('rd-next').addEventListener('click', function () { go(rState.cur + 1); });
    el('rd-plus').addEventListener('click', function () {
      rState.font = Math.min(26, rState.font + 1); body.style.fontSize = rState.font + 'px';
      try { localStorage.setItem("xi'ai_read_font", String(rState.font)); } catch (e) { }
    });
    el('rd-minus').addEventListener('click', function () {
      rState.font = Math.max(14, rState.font - 1); body.style.fontSize = rState.font + 'px';
      try { localStorage.setItem("xi'ai_read_font", String(rState.font)); } catch (e) { }
    });
    el('rd-menu').addEventListener('click', function () { el('rd-side').classList.toggle('open'); });
    /* 方向键翻页交给「全局交互绑定」里唯一的那个监听器，
       这里只把当前阅读器的翻页入口挂上去 ——
       避免每次进入本页都往 document 上重复注册监听器（会导致按一次翻好几章）。 */
    rdTurn = function (d) { go(rState.cur + d); };
    /* 首次进入阅读页不滚动，让读者先看到标题与简介 */
    paint(false);
  }

  /* ============================================================
     留言板 · 云端用 GitHub Issues
     —— 读取走 GitHub 公开接口：任何访客不用登录就能看到全部留言
     —— 发表跳转 GitHub 的发表页：需要访客有 GitHub 账号
     —— 未登录接口限 60 次/小时/IP，所以本地缓存 cacheMinutes 分钟
     ============================================================ */
  var BOARD = SITE.board || {};
  var GH = BOARD.github || {};
  var K_CACHE = "xi'ai_board_cache";   /* 上次读到的留言（含时间，用于缓存与离线显示） */
  var K_DRAFT = "xi'ai_board_draft";   /* 跳转发表页前的草稿，回来不丢字 */
  var K_NICK = "xi'ai_board_nick";     /* 记住昵称 */

  var bState = { list: [], shown: 0, loading: false, note: '', fromCache: false };

  function bCfg(k, d) { return (BOARD[k] === undefined || BOARD[k] === null) ? d : BOARD[k]; }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function bHash(s) { var h = 5381; for (var i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0; return h; }
  function bAvatar(n) {
    var hue = bHash(n || '旅人') % 360;
    return '<span class="mb-av" style="background:linear-gradient(135deg,hsl(' + hue + ',74%,70%),hsl(' +
      ((hue + 40) % 360) + ',72%,54%))">' + esc((n || '旅人').slice(0, 1)) + '</span>';
  }
  function bTime(ts) {
    if (!ts) return '';
    var d = new Date(ts), now = new Date();
    var diff = (now - d) / 1000;
    if (diff < 60) return '刚刚';
    if (diff < 3600) return Math.floor(diff / 60) + ' 分钟前';
    if (diff < 86400) return Math.floor(diff / 3600) + ' 小时前';
    if (diff < 86400 * 7) return Math.floor(diff / 86400) + ' 天前';
    return (d.getMonth() + 1) + ' 月 ' + d.getDate() + ' 日';
  }
  function bGet(k, d) { try { var v = JSON.parse(localStorage.getItem(k) || 'null'); return v === null ? d : v; } catch (e) { return d; } }
  function bSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }

  function boardReady() { return !!(GH.owner && GH.repo); }
  function boardPrefix() { return GH.prefix || '[留言板]'; }

  /* ---------- 读取：GitHub Issues（公开接口，无需登录） ---------- */
  function ghFetch() {
    var url = 'https://api.github.com/repos/' + GH.owner + '/' + GH.repo +
      '/issues?state=open&per_page=50&sort=created&direction=desc';
    return fetch(url, { headers: { 'Accept': 'application/vnd.github+json' }, cache: 'no-store' })
      .then(function (r) { return r.json(); })
      .then(function (arr) {
        if (!Array.isArray(arr)) throw new Error((arr && arr.message) || 'GitHub 返回异常');
        var pre = boardPrefix();
        return arr.filter(function (it) {
          return it && !it.pull_request && String(it.title || '').indexOf(pre) === 0;
        }).map(function (it) {
          var nick = String(it.title).slice(pre.length).trim() || (it.user && it.user.login) || '旅人';
          return {
            id: 'i' + it.number,
            n: nick.slice(0, 16),
            t: String(it.body || '').trim().slice(0, 600),
            ts: Date.parse(it.created_at) || 0,
            url: it.html_url || '',
            login: (it.user && it.user.login) || '',
            cmt: it.comments || 0
          };
        }).filter(function (m) { return m.t; })
          .sort(function (x, y) { return y.ts - x.ts; });
      });
  }

  /* ---------- 发表入口：跳转 GitHub 发表页（标题前缀用于识别留言） ---------- */
  function ghNewUrl(nick, text) {
    var title = boardPrefix() + ' ' + (nick || '旅人');
    return 'https://github.com/' + GH.owner + '/' + GH.repo + '/issues/new?title=' +
      encodeURIComponent(title) + '&body=' + encodeURIComponent(text);
  }

  /* ---------- 缓存 ---------- */
  function boardCacheGet() {
    var c = bGet(K_CACHE, null);
    return (c && Array.isArray(c.list)) ? c : null;
  }
  function boardCacheSet(list) { bSet(K_CACHE, { ts: Date.now(), list: list }); }
  function boardCacheFresh(c) { return c && (Date.now() - (c.ts || 0)) < bCfg('cacheMinutes', 5) * 60000; }

  /* ---------- 渲染 ---------- */
  function boardItem(m) {
    var ops = m.url
      ? '<div class="mb-ops"><a class="mb-op" href="' + esc(m.url) + '" target="_blank" rel="noopener">' +
        (m.cmt ? '在 GitHub 上回复（' + m.cmt + ' 条）' : '在 GitHub 上回复') + '</a></div>'
      : '';
    return '<article class="mb-item" data-id="' + esc(m.id) + '">' +
      bAvatar(m.n) +
      '<div class="mb-body">' +
        '<div class="mb-hd"><b>' + esc(m.n) + '</b><span>' + bTime(m.ts) + '</span>' +
          (m.login ? '<span class="mb-tag">@' + esc(m.login) + '</span>' : '') + '</div>' +
        '<p class="mb-text">' + esc(m.t) + '</p>' +
        ops +
      '</div>' +
    '</article>';
  }

  function boardRender() {
    var listEl = el('mb-list');
    if (!listEl) return;
    var pageSize = bCfg('pageSize', 30);
    if (!bState.shown) bState.shown = pageSize;
    var shown = bState.list.slice(0, bState.shown);
    var tot = el('mb-total'); if (tot) tot.textContent = String(bState.list.length);
    var st = el('mb-status');
    if (st) {
      st.innerHTML = bState.loading ? '<span class="mb-note">正在读取 GitHub 上的留言…</span>'
        : (bState.note ? '<span class="mb-note">' + esc(bState.note) + '</span>' : '');
    }
    listEl.innerHTML = shown.length ? shown.map(boardItem).join('')
      : '<div class="mb-empty">' + (bState.loading ? '正在读取…' : '还没有人留言，来做第一个吧 ❀') + '</div>';
    var more = el('mb-more');
    if (more) {
      more.innerHTML = bState.list.length > bState.shown
        ? '<button class="btn" id="mb-more-btn">看更早的留言（还有 ' + (bState.list.length - bState.shown) + ' 条）</button>' : '';
    }
  }

  function boardLoad(force) {
    if (!boardReady()) {
      bState.loading = false;
      bState.note = '留言板还没配置：请在 js/site.js 里填写 board.github';
      boardRender();
      return;
    }
    var c = boardCacheGet();
    if (c) { bState.list = c.list; bState.fromCache = true; }
    if (!bState.shown) bState.shown = bCfg('pageSize', 30);

    if (c && !force && boardCacheFresh(c)) {
      bState.loading = false;
      bState.note = '（显示的是刚才读取的内容，' + bCfg('cacheMinutes', 5) + ' 分钟内不重复请求 GitHub）';
      boardRender();
      return;
    }
    if (typeof fetch !== 'function') {
      bState.loading = false;
      bState.note = '当前环境不支持联网读取，先显示上次的内容';
      boardRender();
      return;
    }
    bState.loading = bState.list.length === 0;
    bState.note = '';
    boardRender();
    ghFetch().then(function (list) {
      bState.list = list;
      bState.loading = false;
      bState.fromCache = false;
      bState.note = '';
      boardCacheSet(list);
      boardRender();
    }).catch(function () {
      bState.loading = false;
      bState.note = bState.list.length
        ? 'GitHub 暂时读不到（可能达到访问频率限制），先显示上次的内容，稍后再试'
        : 'GitHub 暂时读不到（可能达到访问频率限制），稍后点「刷新留言」再试';
      boardRender();
    });
  }

  function boardSend() {
    var nickEl = el('mb-nick'), textEl = el('mb-text');
    if (!nickEl || !textEl) return;
    var nick = (nickEl.value || '').trim().slice(0, 16) || '旅人';
    var text = (textEl.value || '').trim();
    var maxLen = bCfg('maxLen', 500);
    if (!boardReady()) { bState.note = '留言板还没配置好（缺少 board.github）'; boardRender(); return; }
    if (!text) { bState.note = '先写点什么再发表吧'; boardRender(); textEl.focus(); return; }
    if (text.length < 2) { bState.note = '再多写两个字吧'; boardRender(); return; }
    if (text.length > maxLen) { bState.note = '太长了，最多 ' + maxLen + ' 字'; boardRender(); return; }

    try {
      localStorage.setItem(K_NICK, nick);
      localStorage.setItem(K_DRAFT, JSON.stringify({ t: text, ts: Date.now() }));
    } catch (e) { }

    var url = ghNewUrl(nick, text);
    var opened = null;
    try { opened = window.open(url, '_blank'); } catch (e) { }
    if (!opened) { try { location.href = url; } catch (e) { } }

    bState.note = '已打开 GitHub 发表页：登录后点下方「Submit new issue」就发布成功；回到这里点「刷新留言」即可看到 ✓';
    boardRender();
  }

  function pgBoard() {
    return '' +
      '<h2 class="p-title">留言板</h2>' +
      '<p class="p-sub">给熙叆和聆淅留一句话吧 · 已经收到 <b id="mb-total">' + bState.list.length + '</b> 条留言</p>' +
      '<div class="card mb-form">' +
        '<div class="mb-row">' +
          '<input id="mb-nick" class="mb-nick" maxlength="16" placeholder="你的名字（可留空，默认「旅人」）">' +
          '<span class="mb-hint">留言公开显示在这一页，所有人都能看到</span>' +
        '</div>' +
        '<textarea id="mb-text" class="mb-input" maxlength="' + bCfg('maxLen', 500) + '" placeholder="想对她们说的话…"></textarea>' +
        '<div class="mb-acts">' +
          '<span class="mb-count" id="mb-count">0 / ' + bCfg('maxLen', 500) + '</span>' +
          '<span class="mb-btns">' +
            '<button class="btn" id="mb-refresh">刷新留言</button>' +
            '<button class="btn solid" id="mb-send">用 GitHub 账号发表</button>' +
          '</span>' +
        '</div>' +
      '</div>' +
      '<div class="mb-status" id="mb-status"></div>' +
      '<div class="mb-list" id="mb-list"></div>' +
      '<div class="mb-more" id="mb-more"></div>' +
      '<p class="p-sub" style="margin-top:24px;font-size:12px">' +
        '※ 留言保存在本项目的 GitHub Issues 里（需要 GitHub 账号才能发表，浏览不需要）。' +
        '请不要填写真实姓名、电话等隐私信息；自己发的留言可以在 GitHub 上随时编辑或关闭。' +
      '</p>';
  }

  function initBoard() {
    var textEl = el('mb-text'), nickEl = el('mb-nick');
    if (!textEl || !nickEl) return;
    var maxLen = bCfg('maxLen', 500);

    try {
      var n = localStorage.getItem(K_NICK);
      if (n) nickEl.value = n;
      /* 跳转发表页前的草稿（10 分钟内有效）恢复回来，避免白写 */
      var d = JSON.parse(localStorage.getItem(K_DRAFT) || 'null');
      if (d && d.t && (Date.now() - (d.ts || 0)) < 600000) {
        textEl.value = d.t;
        el('mb-count').textContent = d.t.length + ' / ' + maxLen;
      }
    } catch (e) { }

    textEl.addEventListener('input', function () {
      var c = el('mb-count');
      if (c) c.textContent = textEl.value.length + ' / ' + maxLen;
    });
    textEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); boardSend(); }
    });
    el('mb-send').addEventListener('click', boardSend);
    el('mb-refresh').addEventListener('click', function () { boardLoad(true); });

    var moreEl = el('mb-more');
    if (moreEl) {
      moreEl.addEventListener('click', function (e) {
        if (e.target.id !== 'mb-more-btn') return;
        bState.shown += bCfg('pageSize', 30);
        boardRender();
      });
    }
    boardLoad(false);
  }

  /* ============================================================
     路由
     ============================================================ */
  var RENDER = { home: pgHome, gallery: pgGallery, media: pgMedia, about: pgAbout, read: pgRead, board: pgBoard };
  var AFTER = { gallery: function () { paintGallery(); }, media: initMedia, read: initReader, board: initBoard };
  var TITLES = {
    home: '聆熙花影馆 · 熙叆角色资源站',
    gallery: '时光图库 · 聆熙花影馆',
    media: '影音资源 · 聆熙花影馆',
    about: '角色设定 · 聆熙花影馆',
    read: '聆熙童话 · 聆熙花影馆',
    board: '留言板 · 聆熙花影馆'
  };
  var curRoute = null;

  function routeOf() {
    var h = (location.hash || '').replace(/^#\/?/, '').split('?')[0];
    return RENDER[h] ? h : 'home';
  }

  function go() {
    var r = routeOf();
    var page = el('pg-' + r);
    if (!page) return;
    var changed = curRoute !== r;
    /* 换页时回到该页顶部（阅读页的翻章不在此列，由 paint() 单独处理） */
    if (changed) {
      try { window.scrollTo({ top: 0, behavior: 'auto' }); }
      catch (e) { try { window.scrollTo(0, 0); } catch (e2) { } }
    }
    /* 首次进入该页时渲染内容。
       渲染或初始化即使出错，也必须让页面照常显示出来（否则整页白屏），
       所以这里分开 try，并保证后面的激活逻辑一定会执行。 */
    if (curRoute !== r || (r === 'read' && !page.dataset.ready)) {
      try {
        page.innerHTML = RENDER[r]();
      } catch (e) {
        page.innerHTML = '<h2 class="p-title">页面加载出错</h2>' +
          '<p class="p-sub">这一页暂时打不开，请刷新页面或先切换到其他页面。</p>';
        if (window.console && console.error) console.error('[聆熙花影馆] 渲染 ' + r + ' 出错：', e);
      }
      page.dataset.ready = '1';
      if (AFTER[r]) {
        try { AFTER[r](); } catch (e) {
          if (window.console && console.error) console.error('[聆熙花影馆] 初始化 ' + r + ' 出错：', e);
        }
      }
    }
    document.querySelectorAll('.page').forEach(function (s) { s.classList.remove('on'); });
    /* 重新触发入场动画 */
    page.classList.remove('on');
    void page.offsetWidth;
    page.classList.add('on');
    curRoute = r;
    document.querySelectorAll('#nav a').forEach(function (a) {
      a.classList.toggle('on', a.dataset.r === r);
    });
    /* 阅读页的标题由当前章节决定（paint() 内设置），这里不要覆盖掉 */
    if (r !== 'read') document.title = TITLES[r] || TITLES.home;
    closeLb();
  }

  /* ============================================================
     全局交互绑定
     ============================================================ */
  document.addEventListener('click', function (e) {
    /* 图库筛选 */
    var f = e.target.closest('#g-filters button');
    if (f) {
      gState.filter = f.dataset.season;
      document.querySelectorAll('#g-filters button').forEach(function (b) { b.classList.toggle('on', b === f); });
      paintGallery();
      return;
    }
    /* 图库卡片 */
    var sh = e.target.closest('#g-grid .shard');
    if (sh) { openLb(parseInt(sh.dataset.i, 10)); return; }
    var hs = e.target.closest('#home-grid .shard');
    if (hs) {
      var p = PHOTOS.find(function (x) { return x.id === parseInt(hs.dataset.open, 10); });
      if (p) {
        gState.filter = 'all';
        gState.list = PHOTOS.slice();
        openLb(PHOTOS.indexOf(p));
      }
      return;
    }
    /* 灯箱 */
    if (e.target.id === 'lb' || e.target.id === 'lb-x') { closeLb(); return; }
    if (e.target.id === 'lb-prev') { stepLb(-1); return; }
    if (e.target.id === 'lb-next') { stepLb(1); return; }
  });

  /* 灯箱：ESC 关闭 / 左右键翻页 */
  document.addEventListener('keydown', function (e) {
    var lb = el('lb');
    if (!lb || !lb.classList.contains('on')) return;
    if (e.key === 'Escape') { closeLb(); return; }
    if (e.key === 'ArrowLeft') { e.preventDefault(); stepLb(-1); return; }
    if (e.key === 'ArrowRight') { e.preventDefault(); stepLb(1); return; }
  });

  /* 阅读页：左右键翻章（只在这里注册一次） */
  document.addEventListener('keydown', function (e) {
    if (!rdTurn) return;
    var pr = el('pg-read');
    if (!pr || !pr.classList.contains('on')) return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); rdTurn(-1); return; }
    if (e.key === 'ArrowRight') { e.preventDefault(); rdTurn(1); return; }
  });

  /* ============================================================
     背景光尘与飘落花瓣（#fx）
     ============================================================ */
  function initFx() {
    var box = el('fx');
    if (!box) return;
    if (box.childNodes && box.childNodes.length) return;   /* 已生成过就不重复生成 */
    /* 尊重「减少动态效果」系统设置 */
    try {
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    } catch (e) { }
    var small = window.innerWidth < 860;
    var dustN = small ? 24 : 48, petalN = small ? 8 : 14;
    var i, node, s, w;
    for (i = 0; i < dustN; i++) {
      node = document.createElement('i');
      node.className = 'fx-dust';
      s = (Math.random() * 4 + 3).toFixed(1);
      node.style.cssText =
        'left:' + (Math.random() * 100).toFixed(2) + '%;' +
        'top:' + (Math.random() * 100).toFixed(2) + '%;' +
        'width:' + s + 'px;height:' + s + 'px;' +
        '--dur:' + (Math.random() * 8 + 7).toFixed(1) + 's;' +
        'animation-delay:' + (Math.random() * 8).toFixed(1) + 's;';
      box.appendChild(node);
    }
    for (i = 0; i < petalN; i++) {
      node = document.createElement('i');
      node.className = 'fx-petal';
      w = (Math.random() * 7 + 11).toFixed(1);
      node.style.cssText =
        'left:' + (Math.random() * 98).toFixed(2) + '%;' +
        'width:' + w + 'px;height:' + (w * 1.5).toFixed(1) + 'px;' +
        '--dur:' + (Math.random() * 9 + 11).toFixed(1) + 's;' +
        'animation-delay:' + (Math.random() * 10).toFixed(1) + 's;' +
        'opacity:' + (Math.random() * 0.35 + 0.62).toFixed(2) + ';';
      box.appendChild(node);
    }
  }

  /* ============================================================
     启动
     ============================================================ */
  initFx();
  window.addEventListener('hashchange', go);
  go();
})();
