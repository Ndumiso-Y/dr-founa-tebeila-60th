/* 16:9 stage scaler — uniform fit inside any viewport, forest letterbox. */
(function () {
  var DESIGN_W = 1920;
  var DESIGN_H = 1080;
  var stage = document.querySelector(".stage");
  if (!stage) return;

  function fit() {
    var scale = Math.min(
      window.innerWidth / DESIGN_W,
      window.innerHeight / DESIGN_H
    );
    stage.style.transform = "translate(-50%, -50%) scale(" + scale + ")";
  }

  window.addEventListener("resize", fit, { passive: true });
  window.addEventListener("orientationchange", fit, { passive: true });
  fit();
})();
