/* ============================================================
 * 全站背景音乐 v4
 * - 在 <head> 阶段立即创建音频并预载：页面渲染期间音频已加载，
 *   切换页面后可见即续播，几乎无卡顿
 * - 自动播放：静音启动（浏览器必允许 muted autoplay），
 *   出声瞬间恢复音量，全程无需点击
 * - 跨页面无缝续播：进度存 localStorage；等音频就绪(loadedmetadata)
 *   后再 seek 定位；页面跳转(pagehide/beforeunload)时精确保存
 * - 悬浮按钮在 DOM 就绪后挂载
 * 注意：BGM_SRC 需与 js/site.js 的 SITE.bgm.src 保持一致
 * ============================================================ */
(function () {
  var BGM_SRC = '../熙叆物语/audio/bgm.m4a';
  var KEY_ON = "xi'ai_bgm_on";
  var KEY_TIME = "xi'ai_bgm_time";

  /* ---------- head 阶段：立即创建音频并开始预载 ---------- */
  var audio = new Audio();
  audio.loop = true;
  audio.preload = 'auto';
  audio.muted = true; // 始终保持静音启动，play 事件后再出声
  audio.src = BGM_SRC;

  var playing = false;
  var resumeTime = 0;
  try {
    if (localStorage.getItem(KEY_ON) === '1') {
      var t = parseFloat(localStorage.getItem(KEY_TIME) || '0');
      if (!isNaN(t) && t > 0) resumeTime = t;
    }
  } catch (e) { }

  /* 音频就绪后再定位到续播位置（过早 seek 会被重置） */
  var seekDone = false;
  function seekTo() {
    if (seekDone) return;
    seekDone = true;
    try {
      if (Math.abs(audio.currentTime - resumeTime) > 2) audio.currentTime = resumeTime;
    } catch (e) { }
  }
  if (resumeTime > 0) {
    audio.addEventListener('loadedmetadata', seekTo, { once: true });
    audio.addEventListener('canplay', seekTo, { once: true });
  }

  /* ---------- 自动播放：静音启动 → 出声瞬间恢复音量 ----------
     多时机反复尝试（head 解析 / DOM 就绪 / 页面加载完成 / 音频就绪 /
     延迟重试），音频未就绪导致的拒绝会在就绪后自动重试 */
  var fallbackArmed = false;
  function tryPlay() {
    if (playing) return;
    audio.muted = true;
    var p = audio.play();
    if (p && p.catch) {
      p.catch(function () {
        if (!fallbackArmed) armFallback();
      });
    }
  }
  function armFallback() {
    if (fallbackArmed) return;
    fallbackArmed = true;
    var started = false;
    ['click', 'touchstart', 'keydown'].forEach(function (ev) {
      document.addEventListener(ev, function () {
        if (started) return;
        started = true;
        audio.muted = false;
        audio.play().catch(function () { });
      }, { once: true });
    });
  }

  /* 多个时机发起自动播放尝试 */
  tryPlay();
  document.addEventListener('DOMContentLoaded', tryPlay);
  window.addEventListener('load', tryPlay);
  audio.addEventListener('loadedmetadata', tryPlay);
  audio.addEventListener('canplay', tryPlay);
  setTimeout(tryPlay, 1000);
  setTimeout(tryPlay, 3000);

  function saveTime() {
    try { localStorage.setItem(KEY_TIME, String(audio.currentTime || 0)); } catch (e) { }
  }
  function saveOn() {
    try { localStorage.setItem(KEY_ON, playing ? '1' : '0'); } catch (e) { }
  }

  audio.addEventListener('play', function () {
    playing = true;
    if (audio.muted) audio.muted = false;
    saveOn();
    updateBtn();
  });
  audio.addEventListener('pause', function () {
    playing = false;
    saveOn();
    updateBtn();
  });

  /* 进度保存：跳转/关闭时精确保存（无缝续播关键） */
  window.addEventListener('pagehide', saveTime);
  window.addEventListener('beforeunload', saveTime);
  setInterval(function () { if (playing) saveTime(); }, 3000);

  /* ---------- 悬浮按钮（DOM 就绪后挂载） ---------- */
  var btn = null;
  function updateBtn() {
    if (!btn) return;
    btn.textContent = playing ? '♪' : '♩';
    btn.classList.toggle('playing', playing);
  }
  function initBtn() {
    if (document.getElementById('bgm-float')) return;
    btn = document.createElement('button');
    btn.id = 'bgm-float';
    btn.type = 'button';
    btn.title = '背景音乐：主题曲《魔法时间的童话》';
    btn.setAttribute('aria-label', '背景音乐开关');
    btn.addEventListener('click', function () {
      if (playing) {
        audio.pause();
      } else {
        audio.muted = false;
        var p = audio.play();
        if (p && p.catch) p.catch(function () { });
      }
    });
    document.body.appendChild(btn);
    updateBtn();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBtn);
  } else {
    initBtn();
  }

  /* 启动自动播放（head 阶段即可发起，音频边加载边播放） */
  tryPlay();
})();
