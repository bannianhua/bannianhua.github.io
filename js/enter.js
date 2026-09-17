/* ============================================================
 * 网站进场动画（参考 danjin.slty.site 的 intro 设计）
 * - 全屏遮罩：暖黄「魔法时间」渐变 + 飘落的向日葵花瓣
 * - 中央：图库照片（拍立得相框，随机选图）
 * - 打字机文字：角色台词逐字浮现，循环播放
 * - 底部：金色进度条 + 「点击任意处跳过」
 * - 每次打开网站都完整播放（站内路由切换不会重播，也不会重复遮挡）
 * ============================================================ */
(function () {
  /* 每次打开网站都完整播放进场动画（页面内路由切换不会重播） */
  var DURATION = 7000;
  var TYPE_SPEED = 95;   // 每字毫秒
  var HOLD = 1100;       // 每句打完停顿

  /* 图库照片：稍后从 window.PHOTOS（图库全部照片）中随机抽选 */
  var pick = null;

  /* 台词（依次打出） */
  var QUOTES = [
    '所有真正的童话，开头都该有一场不寻常的天气。',
    '每到黄昏，天空美得不真实——那是我的「魔法时间」。',
    '因为被雨淋过的向日葵，会在太阳出来的时候，开得格外认真。'
  ];

  var timers = [];
  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }

  /* ---------- 样式 ---------- */
  var css = [
    '#xi-intro{position:fixed;inset:0;z-index:9999;display:flex;flex-direction:column;',
    'align-items:center;justify-content:center;gap:26px;overflow:hidden;cursor:pointer;',
    'background:linear-gradient(180deg,#fff8e6 0%,#ffefd0 32%,#ffe3ba 60%,#ffd9b0 100%);',
    'transition:opacity .55s ease,visibility .55s ease;}',
    '#xi-intro.hide{opacity:0;visibility:hidden;}',
    /* 光晕 */
    '#xi-intro .xi-glow{position:absolute;width:460px;height:460px;border-radius:50%;',
    'background:radial-gradient(circle,rgba(255,214,140,.6),rgba(255,214,140,0) 68%);',
    'animation:xiPulse 2.6s ease-in-out infinite;}',
    '@keyframes xiPulse{0%,100%{transform:scale(.9);opacity:.45}50%{transform:scale(1.08);opacity:.9}}',
    /* 花瓣 */
    '#xi-intro .xi-petal{position:absolute;top:-30px;border-radius:62% 38% 58% 42%;',
    'background:linear-gradient(135deg,#ffdd85 10%,#f5b845 60%,#e89c2e 100%);',
    'box-shadow:inset -2px -2px 4px rgba(190,120,30,.35);opacity:.85;',
    'animation:xiFall var(--dur,12s) linear infinite;animation-delay:var(--delay,0s);}',
    '@keyframes xiFall{0%{transform:translate(0,-6vh) rotate(0)}25%{transform:translate(18px,26vh) rotate(95deg)}',
    '50%{transform:translate(-14px,52vh) rotate(185deg)}75%{transform:translate(16px,78vh) rotate(275deg)}',
    '100%{transform:translate(0,106vh) rotate(360deg)}}',
    /* 相框 */
    '#xi-intro .xi-photo{position:relative;z-index:3;background:#fffdf6;padding:10px 10px 34px;',
    'border-radius:6px;box-shadow:0 18px 46px rgba(196,140,60,.35),0 0 0 1px rgba(214,158,74,.35);',
    'transform:rotate(-1.6deg);opacity:0;animation:xiIn .9s cubic-bezier(.2,.8,.2,1) .1s forwards;}',
    '@keyframes xiIn{from{opacity:0;transform:rotate(-1.6deg) scale(.9) translateY(26px)}',
    'to{opacity:1;transform:rotate(-1.6deg) scale(1) translateY(0)}}',
    '#xi-intro .xi-photo img{display:block;border-radius:3px;background:#f3e9d8;max-width:min(62vw,310px);max-height:46vh;}',
    '#xi-intro .xi-photo figcaption{position:absolute;left:0;right:0;bottom:9px;text-align:center;',
    'font-family:"STKaiti","KaiTi","SimSun",serif;font-size:12.5px;color:#9a7b4f;letter-spacing:2px;}',
    /* 标题 */
    '#xi-intro .xi-title{position:relative;z-index:3;font-family:"STKaiti","KaiTi","SimSun",serif;',
    'font-size:27px;letter-spacing:11px;background:linear-gradient(180deg,#ffdf96,#e89c2e);',
    '-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;',
    'opacity:0;animation:xiFade 1s .3s ease forwards;}',
    '@keyframes xiFade{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}',
    /* 打字机 */
    '#xi-intro .xi-type{position:relative;z-index:3;min-height:26px;max-width:min(88vw,720px);',
    'text-align:center;font-family:"STKaiti","KaiTi","SimSun",serif;font-size:16px;',
    'letter-spacing:2px;color:#7a5c38;opacity:0;animation:xiFade 1s .5s ease forwards;}',
    '#xi-intro .xi-type .xi-cursor{display:inline-block;width:2px;height:1em;margin-left:3px;',
    'background:#d9a441;vertical-align:-2px;animation:xiBlink .9s steps(1) infinite;}',
    '@keyframes xiBlink{0%,49%{opacity:1}50%,100%{opacity:0}}',
    /* 进度条 */
    '#xi-intro .xi-bar{position:absolute;bottom:64px;z-index:3;width:min(60vw,320px);height:3px;',
    'border-radius:999px;background:rgba(214,158,74,.25);overflow:hidden;}',
    '#xi-intro .xi-bar span{display:block;height:100%;width:0;border-radius:999px;',
    'background:linear-gradient(90deg,#f7c66f,#e9a13b);transition:width .2s linear;}',
    /* 点击提示 */
    '#xi-intro .xi-hint{position:absolute;bottom:34px;z-index:3;font-size:12px;letter-spacing:3px;',
    'color:#bda07c;opacity:0;animation:xiHint 1.5s .9s ease-in-out infinite;}',
    '@keyframes xiHint{0%,100%{opacity:.35}50%{opacity:.95}}',
    /* 副标题 */
    '#xi-intro .xi-sub{position:relative;z-index:3;font-size:12px;letter-spacing:4px;color:#b0967a;',
    'opacity:0;animation:xiFade 1s .65s ease forwards;}'
  ].join('');
  var style = document.createElement('style');
  style.textContent = css;
  (document.head || document.documentElement).appendChild(style);

  /* ---------- DOM ---------- */
  var ov = document.createElement('div');
  ov.id = 'xi-intro';
  var petals = '';
  for (var i = 0; i < 10; i++) {
    var w = (Math.random() * 6 + 9).toFixed(1);
    petals += '<i class="xi-petal" style="left:' + (Math.random() * 96).toFixed(1) + '%;width:' + w +
      'px;height:' + (w * 1.55).toFixed(1) + 'px;--dur:' + (Math.random() * 8 + 11).toFixed(1) +
      's;--delay:' + (Math.random() * 8).toFixed(1) + 's"></i>';
  }
  ov.innerHTML =
    '<div class="xi-glow"></div>' + petals +
    '<figure class="xi-photo"><img id="xi-photo-img" alt=""><figcaption id="xi-photo-cap">时光碎片</figcaption></figure>' +
    '<div class="xi-title">聆熙花影馆</div>' +
    '<div class="xi-type" id="xi-type"></div>' +
    '<div class="xi-sub">魔法时间的童话 · 角色资源站</div>' +
    '<div class="xi-bar"><span id="xi-bar-fill"></span></div>' +
    '<div class="xi-hint">点 击 任 意 处 跳 过</div>';

  /* ---------- 打字机 ---------- */
  var typeEl = ov.querySelector('#xi-type');
  function typeLoop(qi, ci) {
    if (ov.classList.contains('hide')) return;
    var q = QUOTES[qi % QUOTES.length];
    if (ci <= q.length) {
      typeEl.innerHTML = q.slice(0, ci) + '<i class="xi-cursor"></i>';
      later(function () { typeLoop(qi, ci + 1); }, TYPE_SPEED);
    } else {
      later(function () {
        typeEl.innerHTML = '<i class="xi-cursor"></i>';
        later(function () { typeLoop(qi + 1, 0); }, 260);
      }, HOLD);
    }
  }

  /* ---------- 结束 ---------- */
  var ended = false;
  function finish() {
    if (ended) return;
    ended = true;
    timers.forEach(clearTimeout);
    ov.classList.add('hide');
    /* 恢复页面滚动 */
    if (document.documentElement) document.documentElement.style.overflow = '';
    setTimeout(function () { if (ov.parentNode) ov.parentNode.removeChild(ov); }, 620);
  }

  function mount() {
    /* 立即挂载遮罩（head 阶段挂到 documentElement 上，避免页面内容闪现） */
    (document.body || document.documentElement).appendChild(ov);
    /* 遮罩期间锁住滚动，避免在遮罩背后把页面滚走 */
    try { document.documentElement.style.overflow = 'hidden'; } catch (e) { }

    /* 从图库全部照片中随机抽一张作为进场画面（等 photos.js 数据就绪） */
    function pickPhoto() {
      var img = ov.querySelector('#xi-photo-img');
      var cap = ov.querySelector('#xi-photo-cap');
      var arr = (window.PHOTOS && window.PHOTOS.length) ? window.PHOTOS : null;
      var p = arr ? arr[Math.floor(Math.random() * arr.length)] : null;
      if (p) {
        img.src = p.thumb;
        cap.textContent = '碎片 #' + String(p.id).padStart(3, '0') + ' · ' + p.seasonName + '季 · ' + p.date;
        /* 按原图尺寸比例显示（不裁剪，横竖图都保持原比例） */
        var ratio = (p.width && p.height) ? (p.width / p.height) : 0.72;
        var maxH = Math.min(window.innerHeight * 0.46, 430);
        var maxW = Math.min(window.innerWidth * 0.62, 310);
        var h = maxH, w = h * ratio;
        if (w > maxW) { w = maxW; h = w / ratio; }
        /* 只锁定宽度，高度交给原图比例 —— 避免与 CSS 的 max-width 冲突导致压扁 */
        img.style.width = Math.round(w) + 'px';
        img.style.height = 'auto';
      } else {
        img.src = 'thumbs/012.webp';
        img.style.width = '186px';
        img.style.height = 'auto';
        cap.textContent = '时光碎片';
      }
    }
    if (window.PHOTOS && window.PHOTOS.length) pickPhoto();
    else if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', pickPhoto);
    else pickPhoto();

    /* 进度条 */
    var fill = ov.querySelector('#xi-bar-fill');
    requestAnimationFrame(function () {
      fill.style.transition = 'width ' + DURATION + 'ms linear';
      fill.style.width = '100%';
    });
    later(function () { typeLoop(0, 0); }, 700);
    /* 自动结束 */
    later(finish, DURATION);
    /* 点击/触摸/按键跳过 */
    ov.addEventListener('click', finish);
    ov.addEventListener('touchstart', finish, { passive: true });
    document.addEventListener('keydown', finish, { once: true });
  }

  if (document.body || document.documentElement) mount();
  else document.addEventListener('DOMContentLoaded', mount);
})();
