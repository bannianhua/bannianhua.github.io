// 数据完整性校验(用 node 运行)
global.window = {};
require('./js/data.js');
var D = global.window.GAME_DATA;

var errors = [];
var usedPhotos = {};
var usedVideos = {};

D.SCENES.forEach(function (s) {
  if (!s.id) errors.push('scene without id');
  if (!D.CHAPTERS[s.chapter]) errors.push('scene ' + s.id + ' bad chapter');
  if (!s.lines || !s.lines.length) errors.push('scene ' + s.id + ' no lines');
  if (!s.next && s.id !== 'fin_3') errors.push('scene ' + s.id + ' no next');
  (s.photos || []).forEach(function (pid) {
    usedPhotos[pid] = true;
    if (!D.photoById(pid)) errors.push('scene ' + s.id + ' bad photo ' + pid);
  });
  if (s.video) {
    usedVideos[s.video] = true;
    if (!D.videoById(s.video)) errors.push('scene ' + s.id + ' bad video ' + s.video);
  }
  var hasChoice = false;
  s.lines.forEach(function (l) {
    if (l.choice) {
      hasChoice = true;
      if (!l.choice.length) errors.push('scene ' + s.id + ' empty choice');
      l.choice.forEach(function (c) {
        if (typeof c.pts !== 'number') errors.push('scene ' + s.id + ' choice no pts');
      });
    }
    if (l.p !== undefined && s.photos && (l.p < 1 || l.p > s.photos.length)) {
      errors.push('scene ' + s.id + ' p out of range ' + l.p);
    }
    if (l.video === true && !s.video) errors.push('scene ' + s.id + ' video flag without video');
  });
  // 除序章/终章外,每个章节最后场景应有选择
});

// next 引用检查
D.SCENES.forEach(function (s) {
  if (s.next && !D.sceneById(s.next)) errors.push('scene ' + s.id + ' next missing: ' + s.next);
});

// 照片全部被使用
D.PHOTOS.forEach(function (p) {
  if (!usedPhotos[p.id]) errors.push('photo ' + p.id + ' unused in any scene');
});
D.VIDEOS.forEach(function (v) {
  if (!usedVideos[v.id]) errors.push('video ' + v.id + ' unused');
});

// 结局阈值与脚本
var es = D.ENDING_SCRIPTS;
if (!es.endA || !es.endB || !es.endC) errors.push('missing ending scripts');
if (D.endingFor(124) !== 'endB') errors.push('threshold 124 should be endB, got ' + D.endingFor(124));
if (D.endingFor(125) !== 'endA') errors.push('threshold 125 should be endA, got ' + D.endingFor(125));
if (D.endingFor(69) !== 'endC') errors.push('threshold 69 should be endC, got ' + D.endingFor(69));
if (D.endingFor(70) !== 'endB') errors.push('threshold 70 should be endB, got ' + D.endingFor(70));

// 羁绊值可达范围
var min = 0, max = 0;
D.SCENES.forEach(function (s) {
  s.lines.forEach(function (l) {
    if (l.choice) {
      var opts = l.choice.map(function (c) { return c.pts; });
      min += Math.min.apply(null, opts);
      max += Math.max.apply(null, opts);
    }
  });
});
console.log('choices total min=' + min + ' max=' + max);
console.log('scenes=' + D.SCENES.length + ' photos=' + D.PHOTOS.length + ' videos=' + D.VIDEOS.length);

if (errors.length) {
  console.log('ERRORS:');
  errors.forEach(function (e) { console.log(' - ' + e); });
  process.exit(1);
} else {
  console.log('ALL CHECKS PASSED');
}
