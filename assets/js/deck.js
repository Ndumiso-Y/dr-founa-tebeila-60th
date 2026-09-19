/* Deck engine (prototype form).
   Holds the scene list, activates one scene at a time, and exposes a small
   review navigation. In the full build this same engine gains a timeline
   (per-scene dwell from the Design Constitution), autoplay, preloading of
   the next movement, and a seamless loop seam — the scene/activation model
   stays identical, so prototype scenes carry forward unchanged. */
(function () {
  var scenes = Array.prototype.slice.call(document.querySelectorAll(".scene"));
  var nav = document.querySelector(".deck-nav");
  var buttons = nav
    ? Array.prototype.slice.call(nav.querySelectorAll("button"))
    : [];
  var current = 0;

  function show(i) {
    current = (i + scenes.length) % scenes.length;
    scenes.forEach(function (s, k) {
      s.classList.toggle("is-active", k === current);
    });
    buttons.forEach(function (b, k) {
      b.classList.toggle("is-current", k === current);
    });
    if (nav) {
      nav.classList.toggle(
        "on-dark",
        scenes[current].classList.contains("scene--dark")
      );
    }
  }

  buttons.forEach(function (b, k) {
    b.addEventListener("click", function () { show(k); });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight" || e.key === "PageDown") show(current + 1);
    if (e.key === "ArrowLeft" || e.key === "PageUp") show(current - 1);
  });

  show(0);
})();
