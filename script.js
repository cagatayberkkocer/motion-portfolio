/* =========================================================
   Studio Kinetic — motion designer portfolio
   Plain JS + GSAP (core + ScrollTrigger + ScrollToPlugin)
   No build step, no frameworks. Edit PROJECTS below to
   swap in real work.
   ========================================================= */

/* ---------- Data (swap these for real projects) ---------- */
const PROJECTS = [
  {
    id: 1,
    title: "Chromatic Drift",
    client: "Nike",
    year: "2025",
    tags: ["Direction", "3D", "Brand Film"],
    palette: ["#ff4d1f", "#7b61ff"],
  },
  {
    id: 2,
    title: "Soft Machines",
    client: "Figma",
    year: "2025",
    tags: ["Motion", "UI"],
    palette: ["#7b61ff", "#00d4ff"],
  },
  {
    id: 3,
    title: "Neon Gardens",
    client: "A24",
    year: "2024",
    tags: ["Titles", "VFX"],
    palette: ["#ffd84d", "#ff4d1f"],
  },
  {
    id: 4,
    title: "Signal / Noise",
    client: "Spotify",
    year: "2024",
    tags: ["Identity", "3D", "Animation"],
    palette: ["#1ed760", "#7b61ff"],
  },
  {
    id: 5,
    title: "Atlas Rising",
    client: "Moog",
    year: "2023",
    tags: ["Direction", "Sound Design"],
    palette: ["#ff7ab0", "#ffd84d"],
  },
  {
    id: 6,
    title: "Orbital Mechanics",
    client: "Linear",
    year: "2023",
    tags: ["Motion", "Product"],
    palette: ["#00d4ff", "#ff4d1f"],
  },
];

/* ---------- Utilities ---------- */

// Split the text content of an element into per-character <span class="char">
// wrappers. Each character sits inside a .split-wrap for clean overflow clip.
// Preserves <br/> tags and existing inline <span> line wrappers.
function splitChars(el) {
  if (!el || el.dataset.splitDone === "chars") return [];
  const chars = [];
  const walk = (node, parent) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent;
        const frag = document.createDocumentFragment();
        [...text].forEach((c) => {
          if (c === " ") {
            frag.appendChild(document.createTextNode(" "));
            return;
          }
          const wrap = document.createElement("span");
          wrap.className = "split-wrap";
          const inner = document.createElement("span");
          inner.className = "char";
          inner.textContent = c;
          wrap.appendChild(inner);
          frag.appendChild(wrap);
          chars.push(inner);
        });
        parent.replaceChild(frag, child);
      } else if (
        child.nodeType === Node.ELEMENT_NODE &&
        child.tagName !== "BR"
      ) {
        walk(child, child);
      }
    });
  };
  walk(el, el);
  el.dataset.splitDone = "chars";
  return chars;
}

// Split into per-word <span class="word"> wrappers.
function splitWords(el) {
  if (!el || el.dataset.splitDone === "words") return [];
  const words = [];
  const walk = (node, parent) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const parts = child.textContent.split(/(\s+)/);
        const frag = document.createDocumentFragment();
        parts.forEach((p) => {
          if (!p) return;
          if (/^\s+$/.test(p)) {
            frag.appendChild(document.createTextNode(p));
            return;
          }
          const span = document.createElement("span");
          span.className = "word";
          span.textContent = p;
          frag.appendChild(span);
          words.push(span);
        });
        parent.replaceChild(frag, child);
      } else if (
        child.nodeType === Node.ELEMENT_NODE &&
        child.tagName !== "BR"
      ) {
        walk(child, child);
      }
    });
  };
  walk(el, el);
  el.dataset.splitDone = "words";
  return words;
}

// Build the work grid from PROJECTS.
function renderProjects() {
  const host = document.querySelector("[data-projects]");
  if (!host) return;
  const frag = document.createDocumentFragment();
  PROJECTS.forEach((p, i) => {
    const card = document.createElement("article");
    card.className = "work-card";
    card.setAttribute("data-card", "");
    card.style.setProperty("--grad-a", p.palette[0]);
    card.style.setProperty("--grad-b", p.palette[1]);

    card.innerHTML = `
      <div class="work-card__thumb">
        <span class="work-card__num mono">${String(i + 1).padStart(2, "0")}</span>
        <span class="work-card__year mono">${p.year}</span>
      </div>
      <div class="work-card__meta">
        <h3 class="work-card__title">${p.title}</h3>
        <span class="work-card__client mono">${p.client}</span>
      </div>
      <div class="work-card__tags">
        ${p.tags.map((t) => `<span>${t}</span>`).join("")}
      </div>
    `;
    frag.appendChild(card);
  });
  host.appendChild(frag);
}

/* ---------- Animations ---------- */

function initNav() {
  document.querySelectorAll("[data-nav]").forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      e.preventDefault();
      gsap.to(window, {
        duration: 1.2,
        ease: "power3.inOut",
        scrollTo: { y: href, offsetY: 0, autoKill: true },
      });
    });
  });
}

function initHero() {
  const title = document.querySelector(".hero__title");
  const sub = document.querySelector(".hero__sub");
  const label = document.querySelector(".hero__label");
  const tags = document.querySelectorAll(".hero__tags span");
  const cue = document.querySelector(".scroll-cue");

  if (!title) return;

  const chars = splitChars(title);
  splitWords(sub);
  const words = sub ? sub.querySelectorAll(".word") : [];

  gsap.set(chars, { yPercent: 120 });
  gsap.set(words, { opacity: 0, y: 12 });
  gsap.set(label, { opacity: 0, y: 10 });
  gsap.set(tags, { opacity: 0, y: 10 });

  const tl = gsap.timeline({ delay: 0.15 });
  tl.to(label, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" })
    .to(
      chars,
      {
        yPercent: 0,
        duration: 1.05,
        ease: "expo.out",
        stagger: 0.025,
      },
      "-=0.4"
    )
    .to(
      words,
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.02 },
      "-=0.7"
    )
    .to(
      tags,
      { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.06 },
      "-=0.5"
    );

  if (cue) {
    gsap.to(cue, {
      y: 10,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      duration: 1.3,
    });
  }
}

function initMarquee() {
  const track = document.querySelector("[data-marquee]");
  if (!track) return;

  // Duplicate content so the loop is seamless.
  track.innerHTML = track.innerHTML + track.innerHTML;

  const loop = gsap.to(track, {
    xPercent: -50,
    duration: 26,
    ease: "none",
    repeat: -1,
  });

  // Accelerate/decelerate with scroll velocity via ScrollTrigger.
  ScrollTrigger.create({
    trigger: document.body,
    start: "top top",
    end: "bottom bottom",
    onUpdate: (self) => {
      const v = self.getVelocity();
      const target = 1 + gsap.utils.clamp(-0.5, 2.5, Math.abs(v) / 1200);
      gsap.to(loop, { timeScale: target, duration: 0.4, overwrite: true });
    },
  });
}

function initAboutReveal() {
  const bio = document.querySelector(".about__bio");
  const portrait = document.querySelector(".about__portrait");
  const stats = document.querySelectorAll(".about__stats li");
  const title = document.querySelector(".about .section-head__title");

  if (title) {
    const chars = splitChars(title);
    gsap.from(chars, {
      yPercent: 120,
      stagger: 0.02,
      duration: 0.9,
      ease: "expo.out",
      scrollTrigger: {
        trigger: title,
        start: "top 85%",
      },
    });
  }

  if (bio) {
    splitWords(bio);
    const words = bio.querySelectorAll(".word");
    gsap.fromTo(
      words,
      { opacity: 0.15 },
      {
        opacity: 1,
        ease: "none",
        stagger: 0.04,
        scrollTrigger: {
          trigger: bio,
          start: "top 75%",
          end: "bottom 60%",
          scrub: 0.6,
        },
      }
    );
  }

  if (portrait) {
    gsap.from(portrait, {
      scale: 0.85,
      opacity: 0,
      duration: 1.2,
      ease: "expo.out",
      scrollTrigger: { trigger: portrait, start: "top 80%" },
    });
  }

  if (stats.length) {
    gsap.from(stats, {
      y: 30,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: { trigger: stats[0], start: "top 90%" },
    });
  }
}

function initWorkReveals() {
  const cards = document.querySelectorAll(".work-card");
  const title = document.querySelector(".work .section-head__title");

  if (title) {
    const chars = splitChars(title);
    gsap.from(chars, {
      yPercent: 120,
      stagger: 0.025,
      duration: 0.9,
      ease: "expo.out",
      scrollTrigger: { trigger: title, start: "top 85%" },
    });
  }

  cards.forEach((card) => {
    const thumb = card.querySelector(".work-card__thumb");

    gsap.set(thumb, { clipPath: "inset(100% 0 0 0)" });

    gsap.to(thumb, {
      clipPath: "inset(0% 0 0 0)",
      duration: 1.1,
      ease: "power3.out",
      scrollTrigger: { trigger: card, start: "top 82%" },
    });

    gsap.from(card.querySelector(".work-card__meta"), {
      y: 24,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: { trigger: card, start: "top 82%" },
    });

    gsap.from(card.querySelectorAll(".work-card__tags span"), {
      y: 14,
      opacity: 0,
      stagger: 0.06,
      duration: 0.6,
      ease: "power3.out",
      scrollTrigger: { trigger: card, start: "top 80%" },
    });

    // parallax inside thumb
    gsap.fromTo(
      thumb,
      { yPercent: -4 },
      {
        yPercent: 4,
        ease: "none",
        scrollTrigger: {
          trigger: card,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );

    // hover tilt — desktop only
    card.addEventListener("mousemove", (e) => {
      const rect = thumb.getBoundingClientRect();
      const rx = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
      const ry = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
      gsap.to(thumb, {
        rotateX: rx,
        rotateY: ry,
        duration: 0.5,
        ease: "power3.out",
        transformPerspective: 900,
      });
    });
    card.addEventListener("mouseleave", () => {
      gsap.to(thumb, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.8,
        ease: "power3.out",
      });
    });
  });
}

function initReel() {
  const title = document.querySelector(".reel .section-head__title");
  const items = document.querySelectorAll(".services__item");
  const play = document.querySelector(".reel__play");

  if (title) {
    const chars = splitChars(title);
    gsap.from(chars, {
      yPercent: 120,
      stagger: 0.03,
      duration: 1,
      ease: "expo.out",
      scrollTrigger: { trigger: title, start: "top 85%" },
    });
  }

  if (items.length) {
    gsap.from(items, {
      x: -60,
      opacity: 0,
      stagger: 0.12,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: { trigger: items[0], start: "top 80%" },
    });
  }

  if (play) {
    gsap.from(play, {
      scale: 0.6,
      opacity: 0,
      duration: 1.1,
      ease: "expo.out",
      scrollTrigger: { trigger: play, start: "top 85%" },
    });
  }
}

function initClients() {
  const title = document.querySelector(".clients .section-head__title");
  const items = document.querySelectorAll(".clients__grid li");

  if (title) {
    const chars = splitChars(title);
    gsap.from(chars, {
      yPercent: 120,
      stagger: 0.025,
      duration: 0.9,
      ease: "expo.out",
      scrollTrigger: { trigger: title, start: "top 85%" },
    });
  }

  if (items.length) {
    gsap.from(items, {
      rotateX: -90,
      opacity: 0,
      duration: 0.9,
      ease: "power4.out",
      stagger: {
        amount: 0.9,
        grid: "auto",
        from: "random",
      },
      scrollTrigger: { trigger: items[0], start: "top 85%" },
    });
  }
}

function initContact() {
  const title = document.querySelector(".contact__title");
  const email = document.querySelector(".contact__email");
  const socials = document.querySelectorAll(".contact__socials a");

  if (title) {
    const chars = splitChars(title);
    gsap.from(chars, {
      yPercent: 120,
      stagger: 0.025,
      duration: 1,
      ease: "expo.out",
      scrollTrigger: { trigger: title, start: "top 80%" },
    });
  }

  if (email) {
    gsap.from(email, {
      y: 30,
      opacity: 0,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: { trigger: email, start: "top 90%" },
    });
  }

  if (socials.length) {
    gsap.from(socials, {
      y: 20,
      opacity: 0,
      stagger: 0.08,
      duration: 0.7,
      ease: "power3.out",
      scrollTrigger: { trigger: socials[0], start: "top 92%" },
    });
  }
}

function initMagneticLinks() {
  const els = document.querySelectorAll("[data-magnetic]");
  els.forEach((el) => {
    const strength = 0.35;
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - (rect.left + rect.width / 2)) * strength;
      const y = (e.clientY - (rect.top + rect.height / 2)) * strength;
      gsap.to(el, { x, y, duration: 0.4, ease: "power3.out" });
    });
    el.addEventListener("mouseleave", () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
    });
  });
}

/* ---------- Boot ---------- */

document.addEventListener("DOMContentLoaded", () => {
  if (typeof gsap === "undefined") {
    console.warn("[Studio Kinetic] GSAP failed to load from CDN.");
    return;
  }

  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  renderProjects();

  // Build animations. Wrap desktop-only work in matchMedia so touch devices
  // get a lighter experience.
  const mm = gsap.matchMedia();

  // Always-on (mobile + desktop)
  initNav();
  initHero();
  initMarquee();
  initAboutReveal();
  initWorkReveals();
  initReel();
  initClients();
  initContact();

  // Desktop-only enhancements
  mm.add("(hover: hover) and (pointer: fine)", () => {
    initMagneticLinks();
  });

  // Re-measure once fonts settle — prevents ScrollTrigger positions drifting
  // after custom web fonts change the text metrics.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }

  window.addEventListener("load", () => ScrollTrigger.refresh());
});
