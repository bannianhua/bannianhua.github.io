/* ============================================================
 * 聆熙童话 · 在线阅读器
 * 数据：js/book.js（由 tools/build-book.js 生成）
 * 功能：目录导航 / 上下一章 / 字号调节 / 记住阅读进度
 * ============================================================ */
(function () {
  var book = window.BOOK;
  if (!book || !book.chapters.length) return;

  /* ---------- 书籍信息 ---------- */
  var intro = document.getElementById('book-intro');
  if (intro && book.intro) {
    intro.innerHTML = book.intro.split('\n').map(function (s) {
      return s ? '<p>' + s + '</p>' : '';
    }).join('');
  }

  /* ---------- 状态 ---------- */
  var STORE_KEY = "xi'ai_reader_last";
  var cur = 0;
  var fontSize = 18;

  try {
    var saved = parseInt(localStorage.getItem(STORE_KEY), 10);
    if (!isNaN(saved) && saved >= 0 && saved < book.chapters.length) cur = saved;
  } catch (e) { /* localStorage 不可用时忽略 */ }

  /* ---------- 目录（按 nav.xhtml 卷目分组） ---------- */
  var list = document.getElementById('chap-list');
  var html = '';
  var lastGroup = null;
  book.chapters.forEach(function (c, i) {
    if (c.group !== lastGroup) {
      html += '<div class="cl-group">' + c.group + '</div>';
      lastGroup = c.group;
    }
    html += '<a href="#c' + i + '" data-i="' + i + '">' +
      (c.extra ? '✿ ' : '') + c.title + '</a>';
  });
  list.innerHTML = html;

  /* ---------- 渲染章节 ---------- */
  var content = document.getElementById('reader-content');
  var pos = document.getElementById('rb-pos');

  function render() {
    var c = book.chapters[cur];
    var cls = 'rc-body' +
      (c.kind === 'cover' ? ' rc-cover' : '') +
      (c.kind === 'colophon' ? ' rc-colophon' : '');
    content.innerHTML =
      '<h1 class="rc-title">' + (c.extra ? '✿ ' : '') + c.title + '</h1>' +
      '<div class="' + cls + '">' + c.body + '</div>';
    content.scrollTop = 0;
    window.scrollTo(0, 0);
    pos.textContent = (cur + 1) + ' / ' + book.chapters.length + ' · ' + c.group;
    // 高亮当前章节
    var links = list.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
      links[i].classList.toggle('active', i === cur);
      if (i === cur) links[i].scrollIntoView({ block: 'nearest' });
    }
    try { localStorage.setItem(STORE_KEY, String(cur)); } catch (e) { }
    document.title = c.title + ' · 聆熙童话';
  }

  function go(i) {
    if (i < 0) i = book.chapters.length - 1;
    if (i >= book.chapters.length) i = 0;
    cur = i;
    render();
  }

  /* ---------- 事件 ---------- */
  list.addEventListener('click', function (e) {
    var a = e.target.closest('a[data-i]');
    if (!a) return;
    go(parseInt(a.dataset.i, 10));
    closeSide();
  });
  document.getElementById('btn-prev').addEventListener('click', function () { go(cur - 1); });
  document.getElementById('btn-next').addEventListener('click', function () { go(cur + 1); });
  document.getElementById('btn-prev2').addEventListener('click', function () { go(cur - 1); });
  document.getElementById('btn-next2').addEventListener('click', function () { go(cur + 1); });

  /* 字号 */
  function setFont(delta) {
    fontSize = Math.min(26, Math.max(14, fontSize + delta));
    content.style.fontSize = fontSize + 'px';
    try { localStorage.setItem("xi'ai_reader_font", String(fontSize)); } catch (e) { }
  }
  document.getElementById('btn-larger').addEventListener('click', function () { setFont(1); });
  document.getElementById('btn-smaller').addEventListener('click', function () { setFont(-1); });
  try {
    var f = parseInt(localStorage.getItem("xi'ai_reader_font"), 10);
    if (!isNaN(f) && f >= 14 && f <= 26) { fontSize = f; content.style.fontSize = f + 'px'; }
  } catch (e) { }

  /* 键盘翻章 */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft' && !sideOpen()) go(cur - 1);
    if (e.key === 'ArrowRight' && !sideOpen()) go(cur + 1);
  });

  /* ---------- 移动端侧栏 ---------- */
  var side = document.getElementById('reader-side');
  var btnSide = document.getElementById('btn-side');
  var btnClose = document.getElementById('btn-close-side');
  function sideOpen() { return side.classList.contains('open'); }
  function closeSide() { side.classList.remove('open'); }
  btnSide.addEventListener('click', function () { side.classList.add('open'); });
  btnClose.addEventListener('click', closeSide);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSide(); });

  render();
})();
