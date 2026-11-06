// ===== Content: edit these lists to change featured videos =====
const VIDEOS = [
  { id: "JHw6U5ZOqk8", title: "I GOT my PB in MCSR ranked (13:52) — 3 minute reduction", views: 148, tag: "PB" },
  { id: "OiDnunluXaA", title: "13:03 ranked PB (private room)", views: 46, tag: "PB" },
  { id: "6_IzbIvLS3Y", title: "a true arsonists death", views: 89, tag: "NEW" },
  { id: "FeDt3FI8k3Q", title: "How Did We Get Here tutorial + map download", views: 86, tag: "TUTORIAL" },
  { id: "lMSqQ36goGw", title: "How I sold my fastest ranked run (private room)", views: 50 },
  { id: "Bite9i-S-bI", title: "Obtain Emerald (8.01)", views: 35 },
];

const SHORTS = [
  { id: "GuCG4IFQSpk", title: "CRAZY SECRETS YOU DIDNT KNOW", views: "2.8K" },
  { id: "BeUmHeaj--w", title: "ABSOLUTELY INSANE RSG double bridge bastion", views: "2.4K" },
  { id: "Ffa1k7Pisxg", title: "Another crazy unlucky moment", views: "2.2K" },
  { id: "3opXk1D4aMc", title: "THE most unlucky moment in my speedrun :(", views: "1.7K" },
  { id: "xw4WTtHWlTs", title: "Crazy 1.16.1 seed with woodland mansion at spawn", views: "1.6K" },
  { id: "VZ3C6_BiOZU", title: "Getting jumped by a coordinated piglin attack", views: "1.5K" },
  { id: "w5_KjVTDTfc", title: "THE BIGGEST DOUBLE TRIPLE RANKED SAVE", views: "1.3K" },
  { id: "KdHz1uapkt4", title: "Killing the dragon in one shot!", views: "1K" },
];

// ===== Render videos (click-to-load embeds keep the page fast) =====
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

document.getElementById("videoGrid").innerHTML = VIDEOS.map((v) => `
  <article class="video-card reveal">
    <button class="video-thumb" data-id="${v.id}" aria-label="Play: ${esc(v.title)}">
      <img src="https://i.ytimg.com/vi/${v.id}/hqdefault.jpg" alt="" loading="lazy">
      <span class="play"></span>
    </button>
    <div class="video-body">
      <h4>${v.tag ? `<span class="badge">${v.tag}</span>` : ""}${esc(v.title)}</h4>
      <p class="video-meta">${v.views} views · <a href="https://www.youtube.com/watch?v=${v.id}" target="_blank" rel="noopener">Open on YouTube</a></p>
    </div>
  </article>`).join("");

document.getElementById("videoGrid").addEventListener("click", (e) => {
  const btn = e.target.closest(".video-thumb");
  if (!btn || btn.querySelector("iframe")) return;
  btn.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${btn.dataset.id}?autoplay=1" title="YouTube video" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
});

document.getElementById("shortsRow").innerHTML = SHORTS.map((s) => `
  <a class="short" href="https://www.youtube.com/shorts/${s.id}" target="_blank" rel="noopener">
    <img src="https://i.ytimg.com/vi/${s.id}/oar2.jpg" onerror="this.onerror=null;this.src='https://i.ytimg.com/vi/${s.id}/hqdefault.jpg'" alt="" loading="lazy">
    <div class="short-info"><p>${esc(s.title)}</p><span>${s.views} views</span></div>
  </a>`).join("");

// ===== Hero PB timer: counts up to 13:03.000 =====
(function pbTimer() {
  const el = document.getElementById("pbTimer");
  const target = 13 * 60 + 3; // seconds
  const fmt = (ms) => {
    const m = Math.floor(ms / 60000), s = Math.floor((ms % 60000) / 1000), x = Math.floor(ms % 1000);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(x).padStart(3, "0")}`;
  };
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) { el.textContent = fmt(target * 1000); return; }
  const dur = 2200, start = performance.now();
  const tick = (now) => {
    const p = Math.min(1, (now - start) / dur);
    el.textContent = fmt(target * 1000 * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
})();

// ===== Stat counters + reveal on scroll =====
const countUp = (el) => {
  const target = +el.dataset.count, dur = 1400, start = performance.now();
  const tick = (now) => {
    const p = Math.min(1, (now - start) / dur);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString();
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

document.querySelectorAll(".section-title, .about-grid, .stat, .timeline li, .social, .business-box, .short")
  .forEach((el) => el.classList.add("reveal"));

const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return;
    en.target.classList.add("visible");
    en.target.querySelectorAll("[data-count]").forEach(countUp);
    io.unobserve(en.target);
  });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// ===== Mobile nav, copy email, year =====
const toggle = document.querySelector(".nav-toggle");
const links = document.querySelector(".nav-links");
toggle.addEventListener("click", () => {
  const open = links.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
});
links.addEventListener("click", (e) => { if (e.target.tagName === "A") links.classList.remove("open"); });

document.getElementById("copyEmail").addEventListener("click", async (e) => {
  try {
    await navigator.clipboard.writeText("Scroogiobusiness@gmail.com");
    e.target.textContent = "Copied!";
  } catch { e.target.textContent = "Scroogiobusiness@gmail.com"; }
  setTimeout(() => (e.target.textContent = "Copy email"), 2000);
});

document.getElementById("year").textContent = new Date().getFullYear();
