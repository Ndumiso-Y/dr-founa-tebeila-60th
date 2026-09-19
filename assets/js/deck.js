/* Deck engine.

   Two modes, one activation model (a scene is visible while it carries
   .is-active):

   1. PROTOTYPE (no manifest on the page) — static scenes + review navigation,
      exactly as approved at the three-screen gate.

   2. PRESENTATION (window.DECK_MANIFEST present) — the timeline engine:
      builds every scene from the manifest, autoplays by per-scene duration,
      loops forever, preloads ahead of the playhead, never cuts to a scene
      whose photographs are not decoded, and dissolves the closing back into
      the opening without a visible reset.

   QA controls (no on-screen UI unless ?debug=1):
     ←/→ or PgUp/PgDn  step      Space  pause/resume      Home  restart
     F  fullscreen (also: click)  D  toggle HUD
     ?scene=12  start at scene 12      ?pause=1  start paused
     ?step=all|0|1…  montage state when paused      ?debug=1  HUD + cursor */
(function () {
  var stage = document.querySelector(".stage");
  if (!stage) return;
  if (!window.DECK_MANIFEST) { prototypeMode(); return; }

  var DEFS = window.DECK_MANIFEST.scenes;
  var SIZES = window.DECK_IMAGES || {};
  var W = 1920;
  var FADE = { fade: 900, slow: 1800, loop: 2000, cut: 1 };
  var WIPE_MS = 950;
  var params = new URLSearchParams(location.search);
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var debug = params.get("debug") === "1";

  document.body.classList.add("deck-auto");
  if (debug) document.body.classList.add("is-debug");

  /* ------------------------------------------------------------ build --- */
  function key(ft) { return "ft-" + ("0000" + ft).slice(-4); }

  function place(el, it, outerW) {
    if (it.r != null) el.style.left = (W - it.r - outerW) + "px";
    else if (it.x != null) el.style.left = it.x + "px";
    if (it.b != null) el.style.bottom = it.b + "px";
    else if (it.y != null) el.style.top = it.y + "px";
  }

  function fx(el, it) {
    if (it.fx === "none") return;
    el.classList.add("fx", "fx-" + (it.fx || "rise"));
    if (it.d) el.style.setProperty("--d", it.d + "ms");
  }

  function buildImage(it) {
    var size = SIZES[key(it.ft)];
    if (!size) throw new Error("No derivative for FT-" + it.ft);
    var ar = size[0] / size[1];
    var w = it.w, h = it.h;
    if (w && !h) h = Math.round(w / ar);
    else if (h && !w) w = Math.round(h * ar);
    var img = document.createElement("img");
    img.alt = it.alt || "";
    img.decoding = "async";
    img.dataset.ft = it.ft;
    img.width = w; img.height = h;
    var box;
    if (it.kind === "mount") {
      var pad = it.pad == null ? 16 : it.pad;
      box = document.createElement("figure");
      box.className = "it mount mount--clean";
      box.style.setProperty("--pad", pad + "px");
      img.style.width = w + "px"; img.style.height = h + "px";
      img.style.objectFit = "cover";
      box.appendChild(img);
      if (it.cap) {
        var fc = document.createElement("figcaption");
        fc.innerHTML = it.cap;
        box.appendChild(fc);
      }
      place(box, it, w + pad * 2 + 2);
    } else {
      box = document.createElement("div");
      box.className = "it ph" + (it.cls ? " " + it.cls : "");
      box.style.width = w + "px"; box.style.height = h + "px";
      if (it.pos) img.style.objectPosition = it.pos;
      if (it.drift && !reduced) img.className = "drift-" + it.drift;
      box.appendChild(img);
      place(box, it, w);
    }
    if (it.z) box.style.zIndex = it.z;
    fx(box, it);
    return box;
  }

  function buildItem(it) {
    var el;
    if (it.t === "img") el = buildImage(it);
    else {
      el = document.createElement("div");
      if (it.t === "text") {
        el.className = "it tx tx-" + it.cls;
        el.innerHTML = it.html;
        if (it.size) el.style.fontSize = it.size + "px";
        if (it.align) el.style.textAlign = it.align;
        if (it.ghost != null) el.style.setProperty("--ghost", it.ghost);
        if (it.r != null) { el.style.right = it.r + "px"; it = Object.assign({}, it, { r: null }); }
      } else if (it.t === "rule") {
        el.className = "it rule" + (it.cls ? " " + it.cls : "");
        it = Object.assign({}, it, { w: it.w || 128 });
        el.style.width = it.w + "px";
      } else {
        el.className = "it " + it.cls;
      }
      place(el, it, it.w || 0);
      if (it.z) el.style.zIndex = it.z;
      fx(el, it);
    }
    el.dataset.step = it.step || 0;
    if (it.until != null) el.dataset.until = it.until;
    return el;
  }

  var scenes = DEFS.map(function (def) {
    var el = document.createElement("section");
    el.className = "scene sc sc--" + def.bg + (def.cls ? " " + def.cls : "");
    el.id = def.id;
    el.style.setProperty("--dur", (def.dur + 2600) + "ms");
    if (def.html) el.innerHTML = def.html;
    (def.items || []).forEach(function (it) { el.appendChild(buildItem(it)); });
    stage.appendChild(el);
    return {
      def: def, el: el,
      imgs: Array.prototype.slice.call(el.querySelectorAll("img[data-ft]")),
      items: Array.prototype.slice.call(el.querySelectorAll("[data-step]")),
      failed: false
    };
  });

  var seam = document.createElement("div");
  seam.className = "seam";
  stage.appendChild(seam);

  /* ---------------------------------------------------------- preload --- */
  /* Sources are assigned in playback order with small concurrency, so the
     opening never competes with 100 other requests; once fetched, the <img>
     elements stay in the document and the loop no longer needs the network. */
  var queue = [], inflight = 0, MAX = 3;
  function loaded(img) { return img.complete && img.naturalWidth > 0; }
  function ready(s) { return s.imgs.every(loaded); }

  function pump() {
    while (inflight < MAX && queue.length) fetchImg(queue.shift(), 0);
  }
  function fetchImg(job, attempt) {
    inflight++;
    var img = job.img;
    function done(ok) {
      img.onload = img.onerror = null;
      inflight--;
      if (!ok) {
        if (attempt < 6) setTimeout(function () { fetchImg(job, attempt + 1); }, 1200 * (attempt + 1));
        else job.scene.failed = true;
      }
      pump();
    }
    img.onload = function () { done(true); };
    img.onerror = function () { done(false); };
    img.src = "assets/img/" + key(img.dataset.ft) + ".jpg" + (attempt ? "?r=" + attempt : "");
  }
  /* Opening assets first. The rest of the library is queued only once the
     page's own load event has fired, so the document finishes loading in a
     moment instead of looking busy until all ~31 MB have arrived. */
  function enqueueFrom(start) {
    var AHEAD = 1; /* the first scene gets the whole connection to itself */
    function add(from, to) {
      for (var k = from; k < to; k++) {
        var s = scenes[(start + k) % scenes.length];
        s.imgs.forEach(function (img) { queue.push({ img: img, scene: s }); });
      }
      pump();
    }
    add(0, AHEAD);
    var rest = function () { if (rest) { rest = null; add(AHEAD, scenes.length); } };
    if (document.readyState === "complete") rest();
    else { window.addEventListener("load", function () { rest && rest(); }); setTimeout(function () { rest && rest(); }, 6000); }
  }
  function warm(s) {
    s.imgs.forEach(function (img) { if (img.decode) img.decode().catch(function () {}); });
  }

  /* --------------------------------------------------------- timeline --- */
  var current = -1, paused = false, sceneStart = 0, pausedAt = 0, timers = [];
  var log = [];
  window.__deck = { log: log, scenes: scenes, total: DEFS.reduce(function (a, d) { return a + d.dur; }, 0) };

  function elapsed() { return (paused ? pausedAt : performance.now()) - sceneStart; }
  function arm(t) {
    t.id = setTimeout(function () { t.done = true; t.fn(); }, Math.max(0, t.due - elapsed()));
  }
  function at(ms, fn) { var t = { due: ms, fn: fn, done: false }; timers.push(t); if (!paused) arm(t); }
  function clearTimers() { timers.forEach(function (t) { clearTimeout(t.id); }); timers = []; }

  function applyStep(s, n) {
    s.el.dataset.step = n;
    s.items.forEach(function (el) {
      var on = +el.dataset.step <= n;
      var gone = el.dataset.until != null && n > +el.dataset.until;
      el.classList.toggle("on", on && !gone);
      el.classList.toggle("off-again", on && gone);
    });
  }
  function resetItems(s) {
    s.items.forEach(function (el) { el.classList.remove("on", "off-again"); });
    delete s.el.dataset.step;
  }

  function clearSeam() {
    seam.className = "seam";
    seam.getAnimations && seam.getAnimations().forEach(function (a) { a.cancel(); });
  }
  function settle(keep, keepSeam) {
    scenes.forEach(function (s, k) {
      if (k === keep) return;
      if (s.el.classList.contains("is-active")) { s.el.classList.remove("is-active", "is-top"); resetItems(s); }
    });
    if (!keepSeam) clearSeam();
  }

  function enter(i, ms, keepSeam) {
    var s = scenes[i];
    settle(current, keepSeam);
    var prev = current;
    s.el.style.setProperty("--t-in", ms + "ms");
    /* long dissolves (chapter / loop seam) use an even curve so they last their full length */
    if (ms >= 1800) s.el.style.setProperty("--ease-in", "cubic-bezier(0.42, 0, 0.4, 1)");
    else s.el.style.removeProperty("--ease-in");
    s.el.classList.add("is-top");
    void s.el.offsetWidth;
    s.el.classList.add("is-active");
    current = i;
    requestAnimationFrame(function () { requestAnimationFrame(function () { applyStep(s, 0); }); });
    setTimeout(function () {
      if (current !== i) return;
      if (prev >= 0 && prev !== i) { scenes[prev].el.classList.remove("is-active"); resetItems(scenes[prev]); }
      s.el.classList.remove("is-top");
    }, ms + 60);
  }

  function show(i, instant) {
    var s = scenes[i], def = s.def;
    var tr = instant ? "cut" : (current < 0 ? "slow" : def.tr || "fade");
    if (reduced && tr === "wipe") tr = "fade";
    clearTimers();
    waitingFor = null;
    sceneStart = performance.now(); pausedAt = sceneStart;
    log.push({ i: i, id: def.id, t: sceneStart });

    if (tr === "wipe" && seam.animate) {
      var from = { l: "translateX(-100%)", r: "translateX(100%)", u: "translateY(100%)" }[def.wipe || "l"];
      settle(current);
      seam.className = "seam seam--" + def.bg + " is-on";
      var anim = seam.animate([{ transform: from }, { transform: "none" }],
        { duration: WIPE_MS, easing: "cubic-bezier(0.62, 0, 0.18, 1)", fill: "forwards" });
      /* The field stays down a few frames after the swap so the outgoing
         photograph can never flash through before the new scene paints. */
      anim.onfinish = function () {
        if (log[log.length - 1].i !== i) return;
        enter(i, 1, true);
        setTimeout(function () { if (current === i) clearSeam(); }, 160);
      };
    } else {
      enter(i, FADE[tr] || FADE.fade);
    }

    (def.steps || []).forEach(function (ms, k) { at(ms, function () { applyStep(s, k + 1); }); });
    var next = (i + 1) % scenes.length;
    at(Math.max(0, def.dur - 1600), function () { warm(scenes[next]); });
    at(def.dur, function () { advance(next, 0); });
    hud();
  }

  /* Never cut to a scene that is not decoded: hold the current photograph
     (its drift keeps breathing) and, if the network has truly failed for a
     scene, step over it rather than show a blank frame. */
  var waitingFor = null;
  function advance(i, waited) {
    var s = scenes[i];
    waitingFor = null;
    if (ready(s)) { show(i); return; }
    waitingFor = i;
    if (s.failed || waited > 8000) {
      for (var k = 1; k < scenes.length; k++) {
        var j = (i + k) % scenes.length;
        if (ready(scenes[j])) { show(j); return; }
      }
    }
    timers.push({ id: setTimeout(function () { if (!paused) advance(i, waited + 250); }, 250), done: true });
  }

  function pause() { if (paused) return; paused = true; pausedAt = performance.now(); timers.forEach(function (t) { clearTimeout(t.id); }); hud(); }
  function resume() {
    if (!paused) return;
    sceneStart += performance.now() - pausedAt; paused = false;
    timers.forEach(function (t) { if (!t.done) arm(t); });
    if (waitingFor != null) advance(waitingFor, 0);
    hud();
  }
  function jump(i) {
    i = (i + scenes.length) % scenes.length;
    if (!ready(scenes[i])) { warm(scenes[i]); }
    show(i, true);
    if (paused) {
      timers.forEach(function (t) { clearTimeout(t.id); });
      var st = params.get("step");
      var n = st == null || st === "all" ? (scenes[i].def.steps || []).length : +st;
      setTimeout(function () { applyStep(scenes[i], n); }, 80);
    }
  }

  /* -------------------------------------------------------------- HUD --- */
  var hudEl = null;
  function hud() {
    if (!debug) return;
    if (!hudEl) { hudEl = document.createElement("div"); hudEl.className = "hud"; document.body.appendChild(hudEl); setInterval(hud, 250); }
    if (current < 0) { hudEl.textContent = "loading…"; return; }
    var d = scenes[current].def;
    hudEl.textContent = (current + 1) + "/" + scenes.length + " · " + d.id + " · mv " + d.mv + " · " +
      (elapsed() / 1000).toFixed(1) + " / " + (d.dur / 1000).toFixed(1) + " s · " + (paused ? "paused" : "playing") +
      " · loop " + (window.__deck.total / 1000).toFixed(1) + " s";
  }

  /* ------------------------------------------------------------ input --- */
  function fullscreen() {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(function () {});
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight" || e.key === "PageDown") jump(current + 1);
    else if (e.key === "ArrowLeft" || e.key === "PageUp") jump(current - 1);
    else if (e.key === " ") { e.preventDefault(); paused ? resume() : pause(); }
    else if (e.key === "Home") { paused = false; jump(0); }
    else if (e.key === "f" || e.key === "F") fullscreen();
    else if (e.key === "d" || e.key === "D") { debug = !debug; document.body.classList.toggle("is-debug", debug); if (hudEl) hudEl.hidden = !debug; hud(); }
  });
  stage.addEventListener("click", fullscreen);

  /* Keep the display awake for the length of the event. */
  function wake() { if (navigator.wakeLock) navigator.wakeLock.request("screen").catch(function () {}); }
  document.addEventListener("visibilitychange", function () { if (!document.hidden) wake(); });
  wake();

  /* ------------------------------------------------------------ start --- */
  var first = Math.min(Math.max(parseInt(params.get("scene") || "1", 10) - 1, 0), scenes.length - 1);
  enqueueFrom(first);
  hud();
  var fonts = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  fonts.then(function begin() {
    if (!ready(scenes[first])) { setTimeout(begin, 120); return; }
    if (params.get("pause") === "1") { paused = true; jump(first); }
    else show(first);
  });

  /* ======================================================= prototype ==== */
  function prototypeMode() {
    var list = Array.prototype.slice.call(document.querySelectorAll(".scene"));
    var nav = document.querySelector(".deck-nav");
    var buttons = nav ? Array.prototype.slice.call(nav.querySelectorAll("button")) : [];
    var cur = 0;
    function showP(i) {
      cur = (i + list.length) % list.length;
      list.forEach(function (s, k) { s.classList.toggle("is-active", k === cur); });
      buttons.forEach(function (b, k) { b.classList.toggle("is-current", k === cur); });
      if (nav) nav.classList.toggle("on-dark", list[cur].classList.contains("scene--dark"));
    }
    buttons.forEach(function (b, k) { b.addEventListener("click", function () { showP(k); }); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight" || e.key === "PageDown") showP(cur + 1);
      if (e.key === "ArrowLeft" || e.key === "PageUp") showP(cur - 1);
    });
    showP(0);
  }
})();
