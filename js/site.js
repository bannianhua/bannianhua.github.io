window.SITE = {
  lite: true,
  gameUrl: 'game/index.html',
  origDir: '',
  webDir: '',
  media: [
    { id: 'ev_001', title: '会动的碎片·其一', date: '2026-03-13',
      src: 'video/ev_001.mp4', orig: '', origName: '' },
    { id: 'ev_002', title: '会动的碎片·其二', date: '2026-03-13',
      src: 'video/ev_002.mp4', orig: '', origName: '' },
    { id: 'ev_003', title: '会动的碎片·其三', date: '2026-03-15',
      src: 'video/ev_003.mp4', orig: '', origName: '' }
  ],
  bgm: { title: '主题音乐《魔法时间的童话》', src: 'audio/bgm.m4a', orig: '', origName: '' }
};

(function makeParticles() {
  var host = document.getElementById('stars');
  if (!host) return;
  var dustCount = 70, petalCount = 10;
  var i, el;
  for (i = 0; i < dustCount; i++) {
    el = document.createElement('i');
    el.className = 'dust';
    var s = (Math.random() * 4 + 2).toFixed(1);
    el.style.cssText =
      'left:' + (Math.random() * 100).toFixed(2) + '%;' +
      'top:' + (Math.random() * 100).toFixed(2) + '%;' +
      'width:' + s + 'px;height:' + s + 'px;' +
      '--dur:' + (Math.random() * 8 + 6).toFixed(1) + 's;' +
      'animation-delay:' + (Math.random() * 8).toFixed(1) + 's;';
    host.appendChild(el);
  }
  for (i = 0; i < petalCount; i++) {
    el = document.createElement('i');
    el.className = 'petal';
    var w = (Math.random() * 6 + 9).toFixed(1);
    el.style.cssText =
      'left:' + (Math.random() * 98).toFixed(2) + '%;' +
      'width:' + w + 'px;height:' + (w * 1.55).toFixed(1) + 'px;' +
      '--dur:' + (Math.random() * 8 + 10).toFixed(1) + 's;' +
      'animation-delay:' + (Math.random() * 12).toFixed(1) + 's;' +
      'opacity:' + (Math.random() * 0.35 + 0.6).toFixed(2) + ';';
    host.appendChild(el);
  }
})();

(function highlightNav() {
  var here = location.pathname.split('/').pop() || 'index.html';
  var links = document.querySelectorAll('nav.menu a');
  for (var i = 0; i < links.length; i++) {
    if (links[i].getAttribute('href') === here) links[i].classList.add('active');
  }
})();
