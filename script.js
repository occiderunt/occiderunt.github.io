(function () {
  var root = document.documentElement;
  root.classList.add("js");

  /* theme ---------------------------------------------------------- */
  var toggle = document.getElementById("theme-toggle");
  var meta = document.querySelector('meta[name="theme-color"]');

  function setTheme(night, animate) {
    if (night) root.dataset.theme = "night";
    else delete root.dataset.theme;
    if (meta) meta.setAttribute("content", night ? "#111110" : "#f4f0e7");
    if (toggle) {
      toggle.setAttribute("aria-label", night ? "Switch to paper theme" : "Switch to night theme");
      toggle.setAttribute("title", night ? "Switch to paper theme" : "Switch to night theme");
    }
    try { localStorage.setItem("occiderunt-theme", night ? "night" : "paper"); } catch (e) {}
  }

  // if nothing was saved, follow the system preference once
  var saved = null;
  try { saved = localStorage.getItem("occiderunt-theme"); } catch (e) {}
  if (!saved && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    setTheme(true, false);
  } else {
    setTheme(root.dataset.theme === "night", false);
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      setTheme(root.dataset.theme !== "night", true);
    });
  }

  /* sticky header shadow ------------------------------------------- */
  var head = document.getElementById("site-head");
  function onScroll() {
    if (!head) return;
    head.classList.toggle("scrolled", window.scrollY > 8);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* reveal on scroll ----------------------------------------------- */
  var rises = Array.prototype.slice.call(document.querySelectorAll("[data-rise]"));
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduced || !("IntersectionObserver" in window)) {
    rises.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    rises.forEach(function (el) { io.observe(el); });
  }

  /* year ----------------------------------------------------------- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
