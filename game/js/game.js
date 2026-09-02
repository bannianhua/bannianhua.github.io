/* ============================================================
   《魔法时间的童话 ～熙叆的时光物语～》 游戏引擎
   ============================================================ */
(function () {
  "use strict";

  var D = window.GAME_DATA;
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };

  var LS_SLOTS = "mft_v1_slots";
  var LS_META = "mft_v1_meta";

  /* ================= 持久化 ================= */
  function freshMeta() {
    return {
      seenPhotos: [],
      seenVideos: [],
      endings: [],
      settings: { speed: 4, vol: 80, se: true }
    };
  }
  var meta = freshMeta();
  try {
    var savedMeta = JSON.parse(localStorage.getItem(LS_META));
    if (savedMeta && typeof savedMeta === "object") {
      meta = {
        seenPhotos: savedMeta.seenPhotos || [],
        seenVideos: savedMeta.seenVideos || [],
        endings: savedMeta.endings || [],
        settings: Object.assign(freshMeta().settings, savedMeta.settings || {})
      };
    }
  } catch (e) { meta = freshMeta(); }

  function saveMeta() {
    try { localStorage.setItem(LS_META, JSON.stringify(meta)); } catch (e) {}
  }
  function loadSlots() {
    try { return JSON.parse(localStorage.getItem(LS_SLOTS)) || {}; } catch (e) { return {}; }
  }
  function saveSlots(slots) {
    try { localStorage.setItem(LS_SLOTS, JSON.stringify(slots)); } catch (e) {}
  }
  function hasSeenPhoto(id) { return meta.seenPhotos.indexOf(id) !== -1; }
  function hasSeenVideo(id) { return meta.seenVideos.indexOf(id) !== -1; }
  function markSeenPhoto(id) {
    if (meta.seenPhotos.indexOf(id) === -1) { meta.seenPhotos.push(id); saveMeta(); updateHUD(); }
  }
  function markSeenVideo(id) {
    if (meta.seenVideos.indexOf(id) === -1) { meta.seenVideos.push(id); saveMeta(); }
  }
  function markEnding(id) {
    if (meta.endings.indexOf(id) === -1) { meta.endings.push(id); saveMeta(); updateHUD(); }
  }

  /* ================= 音效 ================= */
  var audioCtx = null;
  function beep(freq, dur, gain) {
    if (!meta.settings.se) return;
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === "suspended") audioCtx.resume();
      var o = audioCtx.createOscillator();
      var g = audioCtx.createGain();
      o.type = "sine";
      o.frequency.value = freq || 520;
      g.gain.value = gain || 0.045;
      o.connect(g); g.connect(audioCtx.destination);
      o.start();
      g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + (dur || 0.06));
      o.stop(audioCtx.currentTime + (dur || 0.06) + 0.02);
    } catch (e) {}
  }

  /* ================= BGM ================= */
  var bgm = $("#bgm");
  var bgmTried = false;
  function bgmEnsure() {
    if (bgmTried) return;
    bgmTried = true;
    bgm.src = "audio/bgm.m4a";
    bgm.addEventListener("error", function () {
      if (bgm.src.indexOf("bgm.m4a") !== -1) { bgm.src = "audio/bgm.mp3"; }
    });
  }
  function bgmPlay() {
    try {
      bgmEnsure();
      bgm.volume = (meta.settings.vol || 80) / 100;
      bgm.play().catch(function () {});
    } catch (e) {}
  }
  function bgmSetVolume() {
    bgm.volume = (meta.settings.vol || 80) / 100;
  }

  /* ================= 黄昏光尘与向日葵花瓣(与资源站一致) ================= */
  function buildStars() {
    var wrap = $("#stars");
    var i, el;
    for (i = 0; i < 70; i++) {
      el = document.createElement("i");
      el.className = "dust";
      var s = (Math.random() * 4 + 2).toFixed(1);
      el.style.cssText =
        "left:" + (Math.random() * 100).toFixed(2) + "%;" +
        "top:" + (Math.random() * 100).toFixed(2) + "%;" +
        "width:" + s + "px;height:" + s + "px;" +
        "--dur:" + (Math.random() * 8 + 6).toFixed(1) + "s;" +
        "animation-delay:" + (Math.random() * 8).toFixed(1) + "s;";
      wrap.appendChild(el);
    }
    for (i = 0; i < 10; i++) {
      el = document.createElement("i");
      el.className = "petal";
      var w = (Math.random() * 6 + 9).toFixed(1);
      el.style.cssText =
        "left:" + (Math.random() * 98).toFixed(2) + "%;" +
        "width:" + w + "px;height:" + (w * 1.55).toFixed(1) + "px;" +
        "--dur:" + (Math.random() * 8 + 10).toFixed(1) + "s;" +
        "animation-delay:" + (Math.random() * 12).toFixed(1) + "s;" +
        "opacity:" + (Math.random() * 0.35 + 0.6).toFixed(2) + ";";
      wrap.appendChild(el);
    }
  }

  /* ================= 标题拍立得轮播(与资源站首页精选一致) ================= */
  var titlePicks = [1, 9, 16, 34, 43, 50, 73, 74];
  var titlePickIdx = 0;
  function cycleTitlePhoto() {
    var img = $("#title-frame-img");
    var cap = $("#title-frame-cap");
    if (!img || !cap) return;
    var p = D.photoById(titlePicks[titlePickIdx]);
    titlePickIdx = (titlePickIdx + 1) % titlePicks.length;
    if (!p) return;
    img.style.opacity = "0.2";
    setTimeout(function () {
      img.src = p.file;
      img.onload = function () { img.style.opacity = "1"; };
      img.onerror = function () { img.style.opacity = "1"; };
      cap.textContent = "时光碎片 · " + String(p.id).padStart(3, "0") + " · " + p.date;
    }, 300);
  }

  /* ================= 屏幕切换 ================= */
  function showScreen(id) {
    $$(".screen").forEach(function (el) { el.classList.remove("active"); });
    $("#" + id).classList.add("active");
  }
  function showOverlay(id) { $("#" + id).classList.remove("hidden"); }
  function hideOverlay(id) { $("#" + id).classList.add("hidden"); }

  /* ================= 运行状态 ================= */
  var run = null;          // {sceneId, lineIdx, pts, chapter}
  var scene = null;
  var lineIdx = 0;
  var typing = null;       // {timer, text, i, done, who}
  var virtualLine = null;  // 选项后的回应台词
  var awaitingChoice = false;
  var awaitingVideo = false;
  var busy = false;
  var autoMode = false;
  var skipMode = false;
  var autoTimer = null;
  var skipTimer = null;
  var logLines = [];

  function setAutoBtn() {
    $$("#game-menu-bar button").forEach(function (b) {
      if (b.getAttribute("data-act") === "auto") b.classList.toggle("on", autoMode);
    });
  }
  function setSkipBtn() {
    $$("#game-menu-bar button").forEach(function (b) {
      if (b.getAttribute("data-act") === "skip") b.classList.toggle("on", skipMode);
    });
  }

  var gameEl = $("#screen-game");
  var textEl = $("#text-line");
  var namePlate = $("#name-plate");
  var speakerName = $("#speaker-name");
  var advanceHint = $("#advance-hint");
  var photoImg = $("#photo-img");
  var photoFrame = $("#photo-frame");
  var photoDate = $("#photo-date");
  var choicesBox = $("#choices");

  function clearTimers() {
    if (autoTimer) { clearTimeout(autoTimer); autoTimer = null; }
    if (skipTimer) { clearTimeout(skipTimer); skipTimer = null; }
  }

  /* ================= 标题菜单 ================= */
  function buildTitleMenu() {
    var menu = $("#title-menu");
    menu.innerHTML = "";
    var hasAuto = !!loadSlots().auto;
    var items = [
      { label: "开始旅程", act: "new" },
      { label: "继续旅程", act: "continue", disabled: !hasAuto },
      { label: "时光图库", act: "gallery" },
      { label: "结局收藏", act: "endings" },
      { label: "系统设置", act: "settings" },
      { label: "操作说明", act: "help" }
    ];
    items.forEach(function (it) {
      var b = document.createElement("button");
      b.className = "btn";
      b.textContent = it.label;
      if (it.disabled) b.disabled = true;
      b.addEventListener("click", function () {
        beep(660, 0.05);
        onTitleAct(it.act);
      });
      menu.appendChild(b);
    });
  }

  function onTitleAct(act) {
    if (act === "new") {
      if (loadSlots().auto) {
        showConfirm("已有进行中的旅程,开始新旅程会覆盖自动存档。确定重新开始吗?", function () {
          startNewGame();
        });
      } else {
        startNewGame();
      }
    } else if (act === "continue") {
      var slots = loadSlots();
      if (slots.auto) { restoreRun(slots.auto); } else { startNewGame(); }
    } else if (act === "gallery") { renderGallery(); showScreen("screen-gallery"); }
    else if (act === "endings") { renderEndings(); showScreen("screen-endings"); }
    else if (act === "settings") { showScreen("screen-settings"); }
    else if (act === "help") { showScreen("screen-help"); }
  }

  /* ================= 旅程开始 ================= */
  function startNewGame() {
    run = { sceneId: "pro_1", lineIdx: 0, pts: 0, chapter: "pro" };
    logLines = [];
    $("#log-body").innerHTML = "";
    showScreen("screen-game");
    bgmPlay();
    enterScene("pro_1");
  }

  function restoreRun(save) {
    run = { sceneId: save.sceneId, lineIdx: save.lineIdx || 0, pts: save.pts || 0, chapter: save.chapter || "pro" };
    logLines = [];
    $("#log-body").innerHTML = "";
    showScreen("screen-game");
    bgmPlay();
    enterScene(save.sceneId, save.lineIdx || 0);
  }

  function autosave() {
    if (!run) return;
    var slots = loadSlots();
    var ch = D.CHAPTERS[run.chapter];
    slots.auto = {
      sceneId: run.sceneId,
      lineIdx: run.lineIdx,
      pts: run.pts,
      chapter: run.chapter,
      time: new Date().toLocaleString("zh-CN"),
      label: (ch ? ch.title + " " + ch.name : "")
    };
    saveSlots(slots);
  }

  function exitToTitle() {
    autosave();
    clearTimers();
    if (typing && typing.timer) { clearInterval(typing.timer); }
    typing = null; virtualLine = null;
    awaitingChoice = awaitingVideo = false;
    busy = false;
    autoMode = false; skipMode = false;
    setAutoBtn(); setSkipBtn();
    hideChoices();
    $$(".overlay").forEach(function (o) { o.classList.add("hidden"); });
    buildTitleMenu();
    showScreen("screen-title");
  }

  /* ================= 场景 ================= */
  function enterScene(sceneId, startLine) {
    scene = D.sceneById(sceneId);
    if (!scene) { exitToTitle(); return; }
    lineIdx = startLine || 0;
    run.sceneId = sceneId;
    run.chapter = scene.chapter;
    busy = true;
    clearTimers();

    if (lastChapter !== scene.chapter) {
      lastChapter = scene.chapter;
      showBanner(scene.chapter, function () {
        busy = false;
        beginSceneContent();
      });
    } else {
      busy = false;
      beginSceneContent();
    }
    autosave();
  }

  var lastChapter = null;

  function showBanner(chId, done) {
    var ch = D.CHAPTERS[chId];
    var banner = $("#chapter-banner");
    $("#chapter-title").textContent = ch.title;
    $("#chapter-name").textContent = ch.name;
    banner.classList.add("show");
    beep(392, 0.12, 0.03);
    setTimeout(function () {
      banner.classList.remove("show");
      setTimeout(done, 650);
    }, 1700);
  }

  function beginSceneContent() {
    updateHUD();
    if (scene.photos && scene.photos.length) {
      setPhoto(scene.photos[0], false);
      preloadPhotos(scene.photos.slice(1));
    }
    showLine(lineIdx);
  }

  function preloadPhotos(ids) {
    ids.forEach(function (id) {
      var p = D.photoById(id);
      if (!p) return;
      var im = new Image();
      im.src = p.file;
    });
  }

  function setPhoto(photoId, animate) {
    var p = D.photoById(photoId);
    if (!p) return;
    if (photoImg.dataset.id === String(photoId)) return; // 同一张照片不重复切换
    photoImg.dataset.id = String(photoId);
    if (animate) {
      photoFrame.classList.add("fade-swap");
      photoImg.style.opacity = "0.2";
      setTimeout(function () {
        photoImg.src = p.file;
        photoImg.onload = function () {
          photoFrame.classList.remove("fade-swap");
          photoImg.style.opacity = "1";
        };
        photoImg.onerror = function () {
          photoFrame.classList.remove("fade-swap");
          photoImg.style.opacity = "1";
        };
      }, 160);
    } else {
      photoImg.style.opacity = "1";
      photoImg.src = p.file;
    }
    photoDate.textContent = "时光碎片 · " + p.date;
    photoFrame.style.setProperty("--tilt", ((Math.random() * 2.6) - 1.3).toFixed(1) + "deg");
    markSeenPhoto(photoId);
  }

  /* ================= 台词 ================= */
  function showLine(i) {
    clearTimers();
    awaitingChoice = false;
    awaitingVideo = false;
    hideChoices();

    if (i >= scene.lines.length) {
      if (scene.next) { enterScene(scene.next); }
      else { exitToTitle(); }
      return;
    }
    lineIdx = i;
    run.lineIdx = i;

    var line = scene.lines[i];
    if (line.ending) { finishGame(); return; }
    if (line.p && scene.photos) { setPhoto(scene.photos[line.p - 1], true); }
    if (line.choice) {
      awaitingChoice = true;
      renderChoices(line.choice);
      return;
    }
    pushLog(line.who, line.text);
    typeLine(line.who, line.text);
    if (skipMode && !line.video) {
      skipTimer = setTimeout(function () { advance(); }, 220);
    }
  }

  function pushLog(who, text) {
    logLines.push({ who: who, text: text });
    var body = $("#log-body");
    var item = document.createElement("div");
    item.className = "log-item";
    var w = document.createElement("span");
    w.className = "log-who" + (who === "旁白" ? " narrator" : "");
    w.textContent = who;
    var t = document.createElement("span");
    t.className = "log-text";
    t.textContent = text;
    item.appendChild(w);
    item.appendChild(t);
    body.appendChild(item);
    body.scrollTop = body.scrollHeight;
  }

  function typeLine(who, text, onTyped) {
    if (typing && typing.timer) { clearInterval(typing.timer); }
    namePlate.classList.add("show");
    speakerName.textContent = who;
    if (who === "旁白") { speakerName.style.color = "var(--pink)"; }
    else if (who === "熙叆") { speakerName.style.color = "var(--gold)"; }
    else { speakerName.style.color = "#9ec7ff"; }

    textEl.textContent = "";
    advanceHint.classList.add("hidden");
    var speed = meta.settings.speed || 4;
    var interval = Math.max(12, 78 - speed * 8);
    var i = 0;
    typing = { timer: null, text: text, i: 0, done: false, who: who, onTyped: onTyped || null };
    typing.timer = setInterval(function () {
      i++;
      typing.i = i;
      textEl.textContent = text.slice(0, i);
      if (i >= text.length) {
        clearInterval(typing.timer);
        typing.done = true;
        typing.timer = null;
        advanceHint.classList.remove("hidden");
        if (autoMode) {
          autoTimer = setTimeout(function () { advance(); }, 1600);
        }
        if (typing.onTyped) {
          var cb = typing.onTyped;
          typing.onTyped = null;
          cb();
        }
      }
    }, interval);
  }

  function finishTyping() {
    if (!typing) return;
    if (typing.timer) { clearInterval(typing.timer); typing.timer = null; }
    textEl.textContent = typing.text;
    typing.done = true;
    advanceHint.classList.remove("hidden");
    if (typing.onTyped) {
      var cb = typing.onTyped;
      typing.onTyped = null;
      cb();
    }
  }

  function advance() {
    if (busy || awaitingChoice || awaitingVideo) return;
    clearTimers();
    if (virtualLine) {
      if (typing && !typing.done) { finishTyping(); return; }
      virtualLine = null;
      lineIdx++;
      showLine(lineIdx);
      return;
    }
    if (typing && !typing.done) { finishTyping(); beep(600, 0.03, 0.02); return; }
    var line = scene.lines[lineIdx];
    if (line.video) { playVideo(scene.video); return; }
    beep(600, 0.03, 0.02);
    lineIdx++;
    showLine(lineIdx);
  }

  /* ================= 选项 ================= */
  function renderChoices(choices) {
    choicesBox.innerHTML = "";
    choicesBox.classList.remove("hidden");
    choices.forEach(function (opt, idx) {
      var b = document.createElement("button");
      b.className = "choice-btn";
      b.textContent = opt.label;
      b.addEventListener("click", function () {
        chooseOption(opt);
      });
      choicesBox.appendChild(b);
    });
  }
  function hideChoices() {
    choicesBox.classList.add("hidden");
    choicesBox.innerHTML = "";
  }

  function chooseOption(opt) {
    if (!awaitingChoice) return;
    awaitingChoice = false;
    beep(740, 0.06);
    run.pts = (run.pts || 0) + (opt.pts || 0);
    hideChoices();
    pushLog("你", opt.label);
    if (opt.say) {
      virtualLine = { who: "熙叆", text: opt.say };
      typeLine("熙叆", opt.say);
    } else {
      lineIdx++;
      showLine(lineIdx);
    }
  }

  /* ================= 影像 ================= */
  function playVideo(videoId) {
    var v = D.videoById(videoId);
    if (!v) { lineIdx++; showLine(lineIdx); return; }
    awaitingVideo = true;
    clearTimers();
    var overlay = $("#video-overlay");
    var el = $("#video-el");
    $("#video-title").textContent = v.title + " · " + v.date;
    el.src = v.file;
    el.currentTime = 0;
    showOverlay("video-overlay");
    var finished = false;
    function resume() {
      if (finished) return;
      finished = true;
      try { el.pause(); } catch (e) {}
      hideOverlay("video-overlay");
      awaitingVideo = false;
      lineIdx++;
      showLine(lineIdx);
    }
    el.onended = resume;
    el.onerror = function () {
      if (finished) return;
      finished = true;
      hideOverlay("video-overlay");
      awaitingVideo = false;
      pushLog("旁白", "影像似乎在沉睡,化作一片安静的碎片……");
      lineIdx++;
      showLine(lineIdx);
    };
    $("#btn-video-skip").onclick = function () {
      markSeenVideo(videoId);
      resume();
    };
    try {
      el.play().then(function () {
        markSeenVideo(videoId);
      }).catch(function () {
        el.onerror && el.onerror();
      });
    } catch (e) {
      el.onerror && el.onerror();
    }
  }

  /* ================= 结局 ================= */
  function finishGame() {
    busy = true;
    var endingId = D.endingFor(run.pts);
    markEnding(endingId);
    var slots = loadSlots();
    delete slots.auto;
    saveSlots(slots);

    var script = D.ENDING_SCRIPTS[endingId];
    var idx = 0;
    function next() {
      if (idx >= script.length) {
        showEndingCard(endingId);
        return;
      }
      var line = script[idx++];
      pushLog(line.who, line.text);
      typeLine(line.who, line.text, next);
    }
    next();
  }

  function showEndingCard(endingId) {
    var ed = null;
    D.ENDINGS.forEach(function (e) { if (e.id === endingId) ed = e; });
    $("#ending-type").textContent = ed.type;
    $("#ending-name").textContent = ed.name;
    $("#ending-desc").textContent = ed.desc;
    showOverlay("ending-overlay");
    $("#btn-ending-next").onclick = function () {
      hideOverlay("ending-overlay");
      if (endingId === "endA") {
        playMontage();
      } else {
        exitToTitle();
      }
    };
  }

  /* ---------- 真结局蒙太奇 + 片尾 ---------- */
  function playMontage() {
    hideOverlay("ending-overlay");
    var photos = D.PHOTOS.slice();
    var i = 0;
    function step() {
      if (i >= photos.length) { playCredits(); return; }
      var p = photos[i++];
      photoFrame.classList.add("fade-swap");
      photoImg.style.opacity = "0.15";
      setTimeout(function () {
        photoImg.src = p.file;
        photoDate.textContent = "时光碎片 · " + p.date;
        photoFrame.classList.remove("fade-swap");
        photoImg.style.opacity = "1";
        setTimeout(step, 950);
      }, 200);
    }
    step();
  }

  function playCredits() {
    var box = $("#credits-scroll");
    box.innerHTML = "";
    D.CREDITS.forEach(function (line) {
      var div = document.createElement("div");
      if (line === "《魔法时间的童话》" || line === "～ 熙叆的时光物语 ～" || line === "— 完 —") {
        div.className = "c-big";
      } else if (!line) {
        div.innerHTML = "&nbsp;";
      }
      div.textContent = line;
      box.appendChild(div);
    });
    showOverlay("credits-overlay");
    box.style.animation = "none";
    void box.offsetWidth;
    box.style.animation = "";
    $("#btn-credits-skip").onclick = function () {
      hideOverlay("credits-overlay");
      exitToTitle();
    };
    setTimeout(function () {
      hideOverlay("credits-overlay");
      exitToTitle();
    }, 48000);
  }

  /* ================= HUD ================= */
  function updateHUD() {
    var ch = D.CHAPTERS[run ? run.chapter : "pro"];
    $("#hud-chapter").textContent = ch ? ch.title : "";
    $("#hud-progress").textContent = "碎片 " + meta.seenPhotos.length + "/" + D.PHOTOS.length;
    var stars = "";
    for (var i = 0; i < meta.endings.length; i++) stars += "★";
    $("#hud-endings").textContent = stars;
  }

  /* ================= 存档界面 ================= */
  var saveTab = "save";
  function openSave() {
    saveTab = "save";
    renderSaveSlots();
    showOverlay("save-overlay");
  }
  function renderSaveSlots() {
    var slots = loadSlots();
    var box = $("#save-slots");
    box.innerHTML = "";
    $("#save-title").textContent = saveTab === "save" ? "存档" : "读档";
    $$(".save-tabs .tab").forEach(function (t) {
      t.classList.toggle("active", t.getAttribute("data-tab") === saveTab);
    });

    var entries = [
      { key: "auto", name: "自动存档" },
      { key: "1", name: "存档槽 1" },
      { key: "2", name: "存档槽 2" },
      { key: "3", name: "存档槽 3" }
    ];
    if (saveTab === "save") entries = entries.filter(function (e) { return e.key !== "auto"; });

    entries.forEach(function (e) {
      var row = document.createElement("div");
      row.className = "save-slot";
      var s = slots[e.key];
      var left = document.createElement("div");
      if (s) {
        var t = document.createElement("div");
        t.className = "slot-title";
        t.textContent = e.name + " · " + (s.label || s.sceneId);
        var m = document.createElement("div");
        m.className = "slot-meta";
        m.textContent = s.time + " · 羁绊 " + (s.pts || 0);
        left.appendChild(t);
        left.appendChild(m);
      } else {
        var em = document.createElement("div");
        em.className = "slot-empty";
        em.textContent = e.name + " · 空";
        left.appendChild(em);
      }
      row.appendChild(left);

      if (saveTab === "save") {
        row.addEventListener("click", function () {
          if (!run) return;
          var all = loadSlots();
          var ch = D.CHAPTERS[run.chapter];
          all[e.key] = {
            sceneId: run.sceneId, lineIdx: run.lineIdx, pts: run.pts,
            chapter: run.chapter, time: new Date().toLocaleString("zh-CN"),
            label: (ch ? ch.title + " " + ch.name : "")
          };
          saveSlots(all);
          beep(880, 0.06);
          renderSaveSlots();
        });
      } else {
        if (s) {
          row.addEventListener("click", function () {
            hideOverlay("save-overlay");
            restoreRun(s);
          });
        }
      }
      if (s) {
        var del = document.createElement("button");
        del.className = "slot-del";
        del.textContent = "删除";
        del.addEventListener("click", function (ev) {
          ev.stopPropagation();
          var all = loadSlots();
          delete all[e.key];
          saveSlots(all);
          renderSaveSlots();
        });
        row.appendChild(del);
      }
      box.appendChild(row);
    });
  }

  /* ================= 相册 ================= */
  function renderGallery() {
    var grid = $("#gallery-grid");
    grid.innerHTML = "";
    $("#gallery-count").textContent = meta.seenPhotos.length + "/" + D.PHOTOS.length;

    D.PHOTOS.forEach(function (p) {
      var card = document.createElement("div");
      card.className = "g-card";
      var wrap = document.createElement("div");
      wrap.className = "g-img-wrap";
      var img = document.createElement("img");
      img.loading = "lazy";
      img.src = p.file;
      img.alt = "时光碎片 " + p.id;
      wrap.appendChild(img);
      card.appendChild(wrap);

      var date = document.createElement("div");
      date.className = "g-date";
      date.textContent = p.date;
      card.appendChild(date);

      if (!hasSeenPhoto(p.id)) {
        var lock = document.createElement("div");
        lock.className = "g-lock";
        var icon = document.createElement("div");
        icon.className = "lock-icon";
        icon.textContent = "🔒";
        var hint = document.createElement("div");
        var ch = D.CHAPTERS[p.ch];
        hint.textContent = (ch ? ch.title + " · " + ch.name : "");
        lock.appendChild(icon);
        lock.appendChild(hint);
        card.appendChild(lock);
      } else {
        card.addEventListener("click", function () {
          $("#photo-big").src = p.file;
          $("#photo-big-date").textContent = "时光碎片 · " + p.date;
          showOverlay("photo-overlay");
        });
      }
      grid.appendChild(card);
    });

    var vHead = document.createElement("div");
    vHead.className = "g-section-head";
    vHead.textContent = "会动的碎片";
    grid.appendChild(vHead);

    D.VIDEOS.forEach(function (v) {
      var card = document.createElement("div");
      card.className = "g-card video-card";
      var wrap = document.createElement("div");
      wrap.className = "g-img-wrap";
      var icon = document.createElement("div");
      icon.className = "g-video-icon";
      icon.textContent = "▶";
      wrap.appendChild(icon);
      card.appendChild(wrap);
      var date = document.createElement("div");
      date.className = "g-date";
      date.textContent = v.date;
      card.appendChild(date);
      if (!hasSeenVideo(v.id)) {
        var lock = document.createElement("div");
        lock.className = "g-lock";
        var li = document.createElement("div");
        li.className = "lock-icon";
        li.textContent = "🔒";
        var hint = document.createElement("div");
        hint.textContent = "第四章 · 春";
        lock.appendChild(li);
        lock.appendChild(hint);
        card.appendChild(lock);
      } else {
        var badge = document.createElement("div");
        badge.className = "g-badge";
        badge.textContent = "影像";
        card.appendChild(badge);
        card.addEventListener("click", function () {
          galleryPlayVideo(v);
        });
      }
      grid.appendChild(card);
    });
  }

  function galleryPlayVideo(v) {
    var overlay = $("#video-overlay");
    var el = $("#video-el");
    $("#video-title").textContent = v.title + " · " + v.date;
    el.src = v.file;
    showOverlay("video-overlay");
    $("#btn-video-skip").onclick = function () {
      try { el.pause(); } catch (e) {}
      hideOverlay("video-overlay");
    };
    el.onended = function () { hideOverlay("video-overlay"); };
    el.onerror = function () { hideOverlay("video-overlay"); };
    try { el.play().catch(function () {}); } catch (e) {}
  }

  /* ================= 结局收藏 ================= */
  function renderEndings() {
    var grid = $("#endings-grid");
    grid.innerHTML = "";
    D.ENDINGS.forEach(function (ed) {
      var card = document.createElement("div");
      card.className = "end-card" + (meta.endings.indexOf(ed.id) !== -1 ? " unlocked" : " locked");
      var type = document.createElement("div");
      type.className = "end-type";
      type.textContent = meta.endings.indexOf(ed.id) !== -1 ? ed.type : "？？？";
      var name = document.createElement("div");
      name.className = "end-name";
      name.textContent = meta.endings.indexOf(ed.id) !== -1 ? ed.name : "尚未抵达";
      var need = document.createElement("div");
      need.className = "end-need";
      need.textContent = ed.need;
      var desc = document.createElement("div");
      desc.className = "end-desc";
      desc.textContent = meta.endings.indexOf(ed.id) !== -1 ? ed.desc : "不同的选择,会把你带向不同的结局……";
      card.appendChild(type);
      card.appendChild(name);
      card.appendChild(need);
      card.appendChild(desc);
      grid.appendChild(card);
    });
  }

  /* ================= 设置 ================= */
  function bindSettings() {
    var speedEl = $("#set-speed");
    var volEl = $("#set-vol");
    var seEl = $("#set-se");
    speedEl.value = meta.settings.speed;
    volEl.value = meta.settings.vol;
    seEl.checked = meta.settings.se;
    $("#speed-val").textContent = meta.settings.speed;
    $("#vol-val").textContent = meta.settings.vol;

    speedEl.addEventListener("input", function () {
      meta.settings.speed = parseInt(speedEl.value, 10);
      $("#speed-val").textContent = meta.settings.speed;
      saveMeta();
    });
    volEl.addEventListener("input", function () {
      meta.settings.vol = parseInt(volEl.value, 10);
      $("#vol-val").textContent = meta.settings.vol;
      saveMeta();
      bgmSetVolume();
    });
    seEl.addEventListener("change", function () {
      meta.settings.se = seEl.checked;
      saveMeta();
    });
    $("#btn-wipe").addEventListener("click", function () {
      showConfirm("确定要清除全部存档与收集进度吗?此操作无法撤销。", function () {
        try {
          localStorage.removeItem(LS_SLOTS);
          localStorage.removeItem(LS_META);
        } catch (e) {}
        meta = freshMeta();
        bindSettings();
        buildTitleMenu();
        exitToTitle();
      });
    });
  }

  /* ================= 确认框 ================= */
  function showConfirm(text, onYes) {
    $("#confirm-text").textContent = text;
    showOverlay("confirm-overlay");
    $("#btn-confirm-yes").onclick = function () {
      hideOverlay("confirm-overlay");
      beep(700, 0.05);
      onYes && onYes();
    };
    $("#btn-confirm-no").onclick = function () {
      hideOverlay("confirm-overlay");
      beep(500, 0.05);
    };
  }

  /* ================= 事件绑定 ================= */
  function bindEvents() {
    // 游戏画面:点击推进
    gameEl.addEventListener("click", function (ev) {
      if (busy) return;
      if (ev.target.closest("button") || ev.target.closest("#choices") || ev.target.closest("#game-menu-bar")) return;
      advance();
    });

    // 底栏按钮
    $("#game-menu-bar").addEventListener("click", function (ev) {
      var btn = ev.target.closest("button");
      if (!btn) return;
      var act = btn.getAttribute("data-act");
      if (act === "log") {
        beep(600, 0.04);
        showOverlay("log-overlay");
      } else if (act === "auto") {
        autoMode = !autoMode;
        setAutoBtn();
        beep(autoMode ? 800 : 400, 0.05);
      } else if (act === "skip") {
        skipMode = !skipMode;
        setSkipBtn();
        beep(skipMode ? 800 : 400, 0.05);
        if (skipMode) advance();
      } else if (act === "save") {
        beep(600, 0.04);
        openSave();
      } else if (act === "menu") {
        beep(500, 0.05);
        showConfirm("要回到标题画面吗?当前进度会自动保存。", function () {
          exitToTitle();
        });
      }
    });

    // 日志
    $("#btn-log-close").addEventListener("click", function () { hideOverlay("log-overlay"); });

    // 存档
    $("#btn-save-close").addEventListener("click", function () { hideOverlay("save-overlay"); });
    $$(".save-tabs .tab").forEach(function (t) {
      t.addEventListener("click", function () {
        saveTab = t.getAttribute("data-tab");
        renderSaveSlots();
      });
    });

    // 照片放大
    $("#btn-photo-close").addEventListener("click", function () { hideOverlay("photo-overlay"); });

    // 返回按钮
    $$(".back-btn").forEach(function (b) {
      b.addEventListener("click", function () {
        beep(550, 0.05);
        var nav = b.getAttribute("data-nav");
        if (nav === "title") {
          exitToTitle();
        }
      });
    });

    // 键盘
    document.addEventListener("keydown", function (ev) {
      var k = ev.key;
      if (k === " " || k === "Enter") {
        var gameActive = $("#screen-game").classList.contains("active");
        var anyOverlayOpen = !$("#confirm-overlay").classList.contains("hidden") ||
          !$("#save-overlay").classList.contains("hidden") ||
          !$("#log-overlay").classList.contains("hidden") ||
          !$("#video-overlay").classList.contains("hidden") ||
          !$("#ending-overlay").classList.contains("hidden") ||
          !$("#credits-overlay").classList.contains("hidden") ||
          !$("#photo-overlay").classList.contains("hidden");
        if (gameActive && !anyOverlayOpen) {
          ev.preventDefault();
          advance();
        }
      } else if (k === "Escape") {
        var openOverlays = $$(".overlay").filter(function (o) { return !o.classList.contains("hidden"); });
        if (openOverlays.length) {
          // 关掉最上层普通面板,但不强行关确认框
          var closable = openOverlays.filter(function (o) {
            return o.id !== "confirm-overlay" && o.id !== "video-overlay" && o.id !== "ending-overlay" && o.id !== "credits-overlay";
          });
          if (closable.length) { hideOverlay(closable[closable.length - 1].id); }
          else if (!openOverlays.some(function (o) { return o.id === "ending-overlay" || o.id === "credits-overlay"; })) {
            hideOverlay("video-overlay");
          }
        } else if ($("#screen-game").classList.contains("active")) {
          showConfirm("要回到标题画面吗?当前进度会自动保存。", function () { exitToTitle(); });
        }
      } else if (k === "l" || k === "L") {
        var lo = $("#log-overlay");
        if ($("#screen-game").classList.contains("active")) {
          if (lo.classList.contains("hidden")) showOverlay("log-overlay");
          else hideOverlay("log-overlay");
        }
      } else if (k === "a" || k === "A") {
        if ($("#screen-game").classList.contains("active")) {
          autoMode = !autoMode;
          setAutoBtn();
          beep(autoMode ? 800 : 400, 0.05);
        }
      }
    });

    // 遮罩点击关闭(仅部分)
    $$(".overlay").forEach(function (o) {
      o.addEventListener("click", function (ev) {
        if (ev.target === o) {
          if (o.id === "photo-overlay" || o.id === "log-overlay" || o.id === "save-overlay") hideOverlay(o.id);
        }
      });
    });
  }

  /* ================= 初始化 ================= */
  /* ================= 自测模式(?selftest=1) ================= */
  function runSelfTest() {
    var results = [];
    window.__selftestErrors = [];
    window.addEventListener("error", function (e) {
      window.__selftestErrors.push(e.message);
    });

    function finish(msg) {
      var div = document.createElement("div");
      div.id = "selftest-result";
      div.textContent = "RESULT: " + msg +
        " | errors: " + (window.__selftestErrors.join(";") || "none") +
        " | scenesVisited: " + scenesVisited.join(",");
      document.body.appendChild(div);
      window.__selftestDone = true;
    }

    var scenesVisited = [];
    var steps = 0;
    try {
      meta.settings.se = false; // 静音测试
      startNewGame();
      function tick() {
        steps++;
        if (steps > 6000) { finish("TIMEOUT"); return; }
        try {
          if (!run) { finish("RUN LOST"); return; }
          if (scenesVisited.indexOf(run.sceneId) === -1) scenesVisited.push(run.sceneId);
          var endingOverlay = document.getElementById("ending-overlay");
          if (!endingOverlay.classList.contains("hidden")) {
            finish("ENDED pts=" + run.pts +
              " photos=" + meta.seenPhotos.length +
              " endings=" + meta.endings.join(","));
            return;
          }
          if (awaitingChoice) {
            var btn = document.querySelector("#choices .choice-btn");
            if (btn) btn.click();
            else finish("CHOICE WITHOUT BTN");
          } else if (awaitingVideo) {
            var skipBtn = document.getElementById("btn-video-skip");
            if (skipBtn) skipBtn.click();
          } else if (!busy) {
            advance();
          }
        } catch (e) {
          finish("EXCEPTION: " + e.message);
          return;
        }
        setTimeout(tick, 50);
      }
      setTimeout(tick, 300);
    } catch (e) {
      finish("BOOT EXCEPTION: " + e.message);
    }
  }

  function init() {
    buildStars();
    buildTitleMenu();
    bindSettings();
    bindEvents();
    updateHUD();
    bgmEnsure();
    showScreen("screen-title");
    cycleTitlePhoto();
    setInterval(cycleTitlePhoto, 4200);
    if (window.location.search.indexOf("selftest") !== -1) {
      runSelfTest();
    }
  }

  init();
})();
