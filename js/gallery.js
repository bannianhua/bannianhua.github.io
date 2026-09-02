/* ============================================================
   时光图库 · 筛选 / 渲染 / 灯箱
   数据来源：js/photos.js（由 tools/generate.js 生成）
   ============================================================ */
(function () {
  var photos = window.PHOTOS || [];
  var current = 'all';
  var ordered = [];   // 当前筛选下的顺序
  var index = -1;     // 灯箱当前下标

  var grid = document.getElementById('grid');
  var empty = document.getElementById('empty');
  var total = document.getElementById('photo-total');
  if (total) total.textContent = photos.length;

  /* ---------- 渲染网格 ---------- */
  function render() {
    var list = current === 'all' ? photos : photos.filter(function (p) { return p.season === current; });
    ordered = list;
    if (!list.length) {
      grid.innerHTML = '';
      empty.style.display = 'block';
      return;
    }
    empty.style.display = 'none';
    var html = '';
    list.forEach(function (p) {
      var no = String(p.id).padStart(3, '0');
      html +=
        '<div class="photo-card" data-id="' + p.id + '">' +
        '<img src="' + p.thumb + '" alt="时光碎片 ' + no + ' · ' + p.date + '" loading="lazy">' +
        '<div class="meta"><span class="no">#' + no + '</span><span>' + p.seasonName + ' · ' + p.date + '</span></div>' +
        '</div>';
    });
    grid.innerHTML = html;
  }

  /* ---------- 灯箱 ---------- */
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lb-img');
  var lbNo = document.getElementById('lb-no');
  var lbSeason = document.getElementById('lb-season');
  var lbDate = document.getElementById('lb-date');
  var lbSize = document.getElementById('lb-size');
  var lbOrig = document.getElementById('lb-orig');

  function openAt(i) {
    index = i;
    var p = ordered[i];
    if (!p) return;
    var no = String(p.id).padStart(3, '0');
    lbImg.src = p.preview;
    lbImg.alt = '时光碎片 ' + no;
    lbNo.textContent = no;
    lbSeason.textContent = p.seasonName + '季';
    lbDate.textContent = p.date;
    lbSize.textContent = (p.width && p.height) ? (p.width + ' × ' + p.height) : '';
    if (window.SITE.origDir) {
      lbOrig.href = window.SITE.origDir + encodeURI(p.orig);
      lbOrig.title = '原图：' + p.orig;
      lbOrig.textContent = '原图 ⬇';
    } else {
      // 精简版：无原图目录，下载高清预览图
      lbOrig.href = p.preview;
      lbOrig.title = '高清预览图（原图请使用电脑版资源站）';
      lbOrig.textContent = '高清图 ⬇';
    }
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLb() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }
  function step(d) {
    if (!ordered.length) return;
    openAt((index + d + ordered.length) % ordered.length);
  }

  grid.addEventListener('click', function (e) {
    var card = e.target.closest('.photo-card');
    if (!card) return;
    var id = parseInt(card.dataset.id, 10);
    var i = ordered.findIndex(function (p) { return p.id === id; });
    openAt(i);
  });
  document.getElementById('lb-close').addEventListener('click', closeLb);
  document.getElementById('lb-prev').addEventListener('click', function () { step(-1); });
  document.getElementById('lb-next').addEventListener('click', function () { step(1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });

  /* ---------- 筛选 ---------- */
  var filters = document.getElementById('filters');
  filters.addEventListener('click', function (e) {
    var btn = e.target.closest('button');
    if (!btn) return;
    var s = btn.dataset.season;
    current = s;
    var btns = filters.querySelectorAll('button');
    for (var i = 0; i < btns.length; i++) btns[i].classList.remove('active');
    btn.classList.add('active');
    closeLb();
    render();
  });

  /* ---------- 支持从首页 #p12 定位 ---------- */
  function jumpToHash() {
    var m = location.hash.match(/^#p(\d+)$/);
    if (!m) return;
    var id = parseInt(m[1], 10);
    var p = photos.find(function (x) { return x.id === id; });
    if (!p) return;
    if (current !== 'all' && current !== p.season) {
      current = p.season;
      var btns = filters.querySelectorAll('button');
      for (var i = 0; i < btns.length; i++) {
        btns[i].classList.toggle('active', btns[i].dataset.season === current);
      }
    }
    render();
    var i = ordered.findIndex(function (x) { return x.id === id; });
    if (i >= 0) openAt(i);
  }

  render();
  jumpToHash();
})();
