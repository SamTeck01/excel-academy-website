// Motion & micro-interactions. Pure progressive enhancement: if this file fails
// or the visitor prefers reduced motion, the page simply shows without animation.
(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const root = document.documentElement;

  // ----- Navbar shadow + scroll progress bar -----
  const navbar = document.querySelector(".navbar");
  const bar = document.createElement("div");
  bar.className = "scroll-progress";
  bar.setAttribute("aria-hidden", "true");
  document.body.appendChild(bar);
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const max = root.scrollHeight - innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
      if (navbar) navbar.classList.toggle("is-scrolled", scrollY > 8);
      ticking = false;
    });
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ----- Sliding pill for the course category tabs -----
  const seg = document.querySelector(".segmented");
  if (seg) {
    const thumb = document.createElement("span");
    thumb.className = "segmented__thumb";
    thumb.setAttribute("aria-hidden", "true");
    seg.prepend(thumb);
    seg.classList.add("has-thumb");
    const move = () => {
      const active = seg.querySelector('[aria-selected="true"]');
      if (!active) return;
      thumb.style.width = active.offsetWidth + "px";
      thumb.style.transform = `translateX(${active.offsetLeft}px)`;
    };
    seg.addEventListener("click", () => requestAnimationFrame(move));
    seg.addEventListener("keydown", () => requestAnimationFrame(move));
    addEventListener("resize", move);
    if (document.fonts) document.fonts.ready.then(move);
    move();
  }

  // ----- Smooth FAQ open/close -----
  document.querySelectorAll(".faq__item").forEach((item) => {
    const summary = item.querySelector("summary");
    const answer = item.querySelector(".faq__answer");
    if (!summary || !answer || reduce) return;
    summary.addEventListener("click", (e) => {
      e.preventDefault();
      if (item.open) {
        answer.style.height = answer.scrollHeight + "px";
        requestAnimationFrame(() => { answer.style.height = "0px"; answer.style.opacity = "0"; });
        answer.addEventListener("transitionend", function done(ev) {
          if (ev.propertyName !== "height") return;
          answer.removeEventListener("transitionend", done);
          item.open = false;
          answer.style.height = answer.style.opacity = "";
        });
      } else {
        item.open = true; // fires "toggle", which closes the others (main.js)
        const h = answer.scrollHeight;
        answer.style.height = "0px";
        requestAnimationFrame(() => { answer.style.height = h + "px"; });
        answer.addEventListener("transitionend", function done(ev) {
          if (ev.propertyName !== "height") return;
          answer.removeEventListener("transitionend", done);
          answer.style.height = "";
        });
      }
    });
  });

  // ----- Button ripple -----
  document.addEventListener("pointerdown", (e) => {
    const btn = e.target.closest(".btn");
    if (!btn || reduce) return;
    const r = btn.getBoundingClientRect();
    const size = Math.max(r.width, r.height);
    const dot = document.createElement("span");
    dot.className = "ripple";
    dot.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px`;
    btn.appendChild(dot);
    dot.addEventListener("animationend", () => dot.remove());
  });

  if (reduce || !("IntersectionObserver" in window)) return;
  root.classList.add("motion");

  // ----- Scroll reveals (staggered within each group) -----
  const groups = [
    [".section-head > *", "", 90],
    [".why__grid > *", "", 110],
    [".track__title, .values__title", "", 0],
    [".track__card", "reveal--zoom", 0],
    [".track__stats > div", "", 110],
    [".segmented", "", 0],
    [".course-row:not(.course-row--reverse) .course-row__text", "reveal--left", 0],
    [".course-row:not(.course-row--reverse) .course-row__img", "reveal--right", 120],
    [".course-row--reverse .course-row__img", "reveal--left", 0],
    [".course-row--reverse .course-row__text", "reveal--right", 120],
    [".carousel", "", 0],
    [".mission__quote", "", 0],
    [".faq__item", "", 80],
    [".contact__interests, .contact__fields", "", 120],
    [".staff__photo", "reveal--zoom", 0],
    [".staff__quote", "reveal--right", 120],
    [".values__item", "", 100],
    [".contact-page__info > *, .contact-details li", "", 80],
    [".contact-page__form", "reveal--right", 150],
    [".pd-card, .blog-card", "", 110],
    [".prose > *", "", 40],
    [".footer__col", "", 90],
  ];
  const seen = new Set();
  for (const [sel, variant, step] of groups) {
    document.querySelectorAll(sel).forEach((el, i) => {
      if (seen.has(el) || el.closest(".hero")) return;
      seen.add(el);
      el.classList.add("reveal");
      if (variant) el.classList.add(variant);
      // Restart the stagger for every new parent so long lists don't lag
      const sibIndex = el.parentElement ? [...el.parentElement.children].indexOf(el) : i;
      el.style.setProperty("--d", Math.min(sibIndex, 6) * step + "ms");
    });
  }
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add("is-visible");
      io.unobserve(entry.target);
    }
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
  seen.forEach((el) => io.observe(el));

  // Safety net: never leave content invisible (printing, crawlers, background tabs
  // where observers are paused). Anything already on screen is shown after a moment.
  const revealAll = () => seen.forEach((el) => el.classList.add("is-visible"));
  addEventListener("beforeprint", revealAll);
  setTimeout(() => {
    seen.forEach((el) => {
      if (el.getBoundingClientRect().top < innerHeight) el.classList.add("is-visible");
    });
  }, 2500);

  // ----- Count-up for the track-record numbers -----
  const counters = document.querySelectorAll(".track__stats dt");
  const countIo = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      countIo.unobserve(entry.target);
      const el = entry.target;
      const m = el.textContent.match(/^([\d.]+)(.*)$/);
      if (!m) continue;
      const target = parseFloat(m[1]);
      const decimals = (m[1].split(".")[1] || "").length;
      const suffix = m[2];
      const start = performance.now(), dur = 1400;
      const tick = (now) => {
        const t = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = (target * eased).toFixed(decimals) + suffix;
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  }, { threshold: 0.6 });
  counters.forEach((c) => countIo.observe(c));
})();
