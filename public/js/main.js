(() => {
  // ----- Mobile nav -----
  const navbar = document.querySelector(".navbar");
  const toggle = document.querySelector(".navbar__toggle");
  const setNav = (open) => {
    navbar.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };
  toggle.addEventListener("click", () => setNav(!navbar.classList.contains("is-open")));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setNav(false); });
  document.querySelectorAll(".navbar__links a").forEach((a) => a.addEventListener("click", () => setNav(false)));

  // ----- Course category tabs -----
  const tabs = [...document.querySelectorAll('.segmented [role="tab"]')];
  const selectTab = (tab) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    });
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => selectTab(tab));
    tab.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const next = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
      selectTab(next);
      next.focus();
    });
  });

  // ----- Testimonial carousel -----
  const track = document.querySelector(".carousel__track");
  if (track) {
    const prev = document.querySelector(".carousel__btn--prev");
    const next = document.querySelector(".carousel__btn--next");
    const step = () => track.firstElementChild.getBoundingClientRect().width + 4;
    const updateButtons = () => {
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
    };
    prev.addEventListener("click", () => track.scrollBy({ left: -step() }));
    next.addEventListener("click", () => track.scrollBy({ left: step() }));
    track.addEventListener("scroll", updateButtons, { passive: true });
    window.addEventListener("resize", updateButtons);
    updateButtons();
  }

  // ----- Testimonials: "Read more" on clamped quotes -----
  document.querySelectorAll(".testimonial").forEach((card) => {
    const quote = card.querySelector("blockquote");
    if (quote.scrollHeight <= quote.clientHeight + 1) return;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "testimonial__more";
    btn.textContent = "Read more";
    btn.setAttribute("aria-expanded", "false");
    btn.addEventListener("click", () => {
      const open = card.classList.toggle("is-expanded");
      btn.textContent = open ? "Show less" : "Read more";
      btn.setAttribute("aria-expanded", String(open));
    });
    quote.after(btn);
  });

  // ----- FAQ: keep one answer open at a time -----
  const faqs = document.querySelectorAll(".faq__item");
  faqs.forEach((d) => d.addEventListener("toggle", () => {
    if (d.open) faqs.forEach((o) => { if (o !== d) o.open = false; });
  }));

  // ----- Contact form -----
  const form = document.querySelector(".contact__form");
  if (form) {
    const status = form.querySelector(".contact__status");
    const setStatus = (msg, kind) => {
      status.textContent = msg;
      status.className = "contact__status" + (kind ? " is-" + kind : "");
    };
    form.addEventListener("input", (e) => {
      if (e.target.matches("[required]") && e.target.checkValidity()) e.target.removeAttribute("aria-invalid");
    });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const required = [...form.querySelectorAll("input[required], textarea[required]")];
      const invalid = required.filter((input) => !input.value.trim() || !input.checkValidity());
      required.forEach((input) => input.toggleAttribute("aria-invalid", invalid.includes(input)));
      if (invalid.length) {
        invalid[0].focus();
        setStatus("Please fill in all required fields with valid details.", "error");
        return;
      }

      // Submissions go to Excel Academy's official WhatsApp as a pre-filled chat.
      const labels = {
        firstName: "First name", lastName: "Last name", fullName: "Full name",
        email: "Email", whatsapp: "WhatsApp number", subject: "Subject", message: "Message",
      };
      const lines = [];
      for (const [key, label] of Object.entries(labels)) {
        const value = form.elements[key] && form.elements[key].value.trim();
        if (value) lines.push(label + ": " + value);
      }
      const interests = form.elements.interests ? new FormData(form).getAll("interests") : [];
      if (interests.length) lines.push("Interested in: " + interests.join(", "));
      const text = "Hello Excel Academy,\n\n" + lines.join("\n");
      window.open("https://wa.me/" + form.dataset.whatsapp + "?text=" + encodeURIComponent(text), "_blank", "noopener");
      setStatus("Opening WhatsApp… just tap send to reach us.", "success");
    });
  }

  document.getElementById("year").textContent = new Date().getFullYear();
})();
