/* Proper Tools 404
   Static. Weird. Resilient.
   Keep it readable. Keep it shippable.
*/

(() => {
  "use strict";

  // -------------------------
  // Config: assets + filenames
  // -------------------------

  // Use paths relative to the HTML file (works on GitHub Pages and on propertools.be)
  const ASSET_BASE = new URL("./assets/", document.baseURI).href;
  const GIF_BASE = new URL("./gifs/404/", ASSET_BASE).href;

  const TOTAL_GIFS = 34;
  const PAD = 2;                 // gif01.gif
  const FILENAME_PREFIX = "gif"; // gif01.gif
  const EXT = ".gif";

  // Layout tuning: bigger + more whitespace + a bit of intentional chaos
  const LAYOUT = {
    minW: 110,
    maxW: 210,
    margin: 22,
    maxAttempts: 900,
    allowSomeOverlap: 0.08,
    edgePad: 16,
    rotateDeg: 2.0
  };

  // Physics tuning (pleasant chaos)
  const PHYS = {
    g: 1600,
    attract: 1500,
    restitution: 0.84,
    wallToastChance: 0.02,
    maxV: 2000,
    drag: 0.995,
    popChance: 0.20,
    popVyMin: 520,
    popVyMax: 980
  };

  // -------------------------
  // DOM references
  // -------------------------

  const chaosBtn = document.getElementById("chaos-button");
  const foxBtn = document.getElementById("fox-button");
  const shuffleBtn = document.getElementById("shuffle-button");

  const chaosCanvas = document.getElementById("chaos-canvas");
  const gifField = document.getElementById("gif-field");
  const foxPre = document.getElementById("fox-easter-egg");
  const poemCard = document.getElementById("poem-card");

  // Core Wars canvas
  const cwCanvas = document.getElementById("corewars-canvas");
  const cwCtx = cwCanvas?.getContext("2d", { alpha: true });

  // -------------------------
  // Small utilities
  // -------------------------

  function padNumber(n, width) {
    const s = String(n);
    return s.length >= width ? s : "0".repeat(width - s.length) + s;
  }

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function clamp(n, a, b) {
    return Math.max(a, Math.min(b, n));
  }

  function clampAbs(v, maxAbs) {
    if (v > maxAbs) return maxAbs;
    if (v < -maxAbs) return -maxAbs;
    return v;
  }

  // -------------------------
  // Toast system
  // -------------------------

  let lastToastAt = 0;
  const TOAST_COOLDOWN_MS = 1200;

  function maybeToast(msg) {
    const now = Date.now();
    if (now - lastToastAt < TOAST_COOLDOWN_MS) return;
    lastToastAt = now;

    const t = document.createElement("div");
    t.className = "toast";
    t.textContent = msg;
    document.body.appendChild(t);

    setTimeout(() => t.classList.add("visible"), 10);

    setTimeout(() => {
      t.classList.remove("visible");
      setTimeout(() => t.remove(), 280);
    }, 2200);
  }

  const TOASTS = [
    "💥 ABI stability not guaranteed beyond 2038.",
    "💥 Undefined behavior detected. Proceeding anyway.",
    "💥 time_t extended. Feelings not extended.",
    "💥 Proof by induction failed at boundary condition.",
    "💥 Leap second rejected as non-harmonised.",
    "💥 Vendor response: “works as designed.”",
    "💥 Signed integer overflow achieved enlightenment.",
    "💥 Conformance assumed. Testing deferred.",
    "💥 Modular arithmetic has left the chat.",
    "💥 Temporal semantics downgraded to advisory."
  ];

  const FOX_LINES = [
    "Fox says: “who signed off on modular arithmetic?”",
    "Fox says: “boundary conditions are not optional.”",
    "Fox says: “show me the proof, not the patch.”",
    "Fox says: “integer overflow is a governance issue.”",
    "Fox says: “this is why we specify semantics.”"
  ];

  function foxSpeak() {
    const line = FOX_LINES[Math.floor(Math.random() * FOX_LINES.length)];
    maybeToast(line);
  }

  // -------------------------
  // Chaos visibility + tremor
  // -------------------------

  function setChaosCanvasVisible(isVisible) {
    chaosCanvas.classList.toggle("chaos-visible", isVisible);
    chaosCanvas.classList.toggle("chaos-hidden", !isVisible);
    chaosCanvas.setAttribute("aria-hidden", String(!isVisible));
    gifField.setAttribute("aria-hidden", String(!isVisible));
  }

  let lastTremorAt = 0;
  const TREMOR_COOLDOWN_MS = 260;
  const TREMOR_CHANCE = 0.18;

  function tremor() {
    const now = Date.now();
    if (now - lastTremorAt < TREMOR_COOLDOWN_MS) return;
    lastTremorAt = now;

    chaosCanvas.classList.add("bureaucratic-tremor");
    setTimeout(() => chaosCanvas.classList.remove("bureaucratic-tremor"), 140);
  }

  function bounceWall() {
    if (Math.random() < TREMOR_CHANCE) tremor();
    if (Math.random() < PHYS.wallToastChance) {
      const msg = TOASTS[Math.floor(Math.random() * TOASTS.length)];
      maybeToast(msg);
    }
  }

  // -------------------------
  // Build + layout GIF elements
  // -------------------------

  function buildGifElements() {
    gifField.innerHTML = "";

    const frag = document.createDocumentFragment();
    const els = [];

    for (let i = 1; i <= TOTAL_GIFS; i++) {
      const img = document.createElement("img");
      img.loading = "lazy";
      img.decoding = "async";
      img.alt = "";
      img.setAttribute("aria-hidden", "true");

      const filename = `${FILENAME_PREFIX}${padNumber(i, PAD)}${EXT}`;
      img.src = `${GIF_BASE}${filename}`;

      // randomize size/tilt/opacity a bit
      const w = Math.round(rand(LAYOUT.minW, LAYOUT.maxW));
      img.style.setProperty("--w", `${w}px`);
      img.style.setProperty("--r", `${rand(-LAYOUT.rotateDeg, LAYOUT.rotateDeg).toFixed(2)}deg`);
      img.style.setProperty("--o", `${rand(0.92, 1).toFixed(2)}`);

      frag.appendChild(img);

      // height estimate corrected later when naturalHeight is available
      els.push({ el: img, w, h: Math.round(w * 0.78) });
    }

    gifField.appendChild(frag);
    return els;
  }

  function rectsOverlap(a, b) {
    return !(a.x + a.w < b.x || b.x + b.w < a.x || a.y + a.h < b.y || b.y + b.h < a.y);
  }

  function placeScatter(items, containerW, containerH) {
    const placed = [];

    for (const it of items) {
      const w = it.w;
      const h = it.h;
      let best = null;

      for (let attempt = 0; attempt < LAYOUT.maxAttempts; attempt++) {
        const x = rand(LAYOUT.edgePad, Math.max(LAYOUT.edgePad, containerW - w - LAYOUT.edgePad));
        const y = rand(LAYOUT.edgePad, Math.max(LAYOUT.edgePad, containerH - h - LAYOUT.edgePad));

        const paddedRect = {
          x: x - LAYOUT.margin,
          y: y - LAYOUT.margin,
          w: w + LAYOUT.margin * 2,
          h: h + LAYOUT.margin * 2
        };

        let overlaps = 0;
        for (const p of placed) {
          if (rectsOverlap(paddedRect, p.rect)) overlaps++;
          if (overlaps / Math.max(1, placed.length) > LAYOUT.allowSomeOverlap) break;
        }

        if (overlaps / Math.max(1, placed.length) <= LAYOUT.allowSomeOverlap) {
          best = { x, y, rect: paddedRect };
          break;
        }
      }

      if (!best) {
        const x = rand(LAYOUT.edgePad, Math.max(LAYOUT.edgePad, containerW - w - LAYOUT.edgePad));
        const y = rand(LAYOUT.edgePad, Math.max(LAYOUT.edgePad, containerH - h - LAYOUT.edgePad));
        best = { x, y, rect: { x, y, w, h } };
      }

      placed.push({ el: it.el, x: best.x, y: best.y, rect: best.rect, w, h });
    }

    return placed;
  }

  function relayoutScatter(els) {
    const rect = gifField.getBoundingClientRect();
    const containerW = Math.floor(rect.width);
    const containerH = Math.floor(rect.height);

    const measured = els.map((it) => {
      const naturalW = it.el.naturalWidth || it.w;
      const naturalH = it.el.naturalHeight || it.h;
      const targetW = parseInt(getComputedStyle(it.el).getPropertyValue("--w"), 10) || it.w;
      const scale = targetW / naturalW;
      const h = Math.max(40, Math.round(naturalH * scale));
      return { el: it.el, w: targetW, h };
    });

    const placed = placeScatter(measured, containerW, containerH);

    for (const p of placed) {
      p.el.style.left = `${clamp(p.x, 0, containerW - p.w)}px`;
      p.el.style.top = `${clamp(p.y, 0, containerH - p.h)}px`;
    }
  }

  // -------------------------
  // Popcorn physics (GIFs as particles)
  // -------------------------

  let anim = null;
  let particles = [];
  let lastT = 0;

  function buildParticlesFromEls(els) {
    const rect = gifField.getBoundingClientRect();
    const W = rect.width;
    const H = rect.height;

    particles = els.map((it) => {
      const el = it.el;
      const w = it.w;
      const h = it.h;

      const x = parseFloat(el.style.left) || rand(0, Math.max(0, W - w));
      const y = parseFloat(el.style.top) || rand(0, Math.max(0, H - h));

      return {
        el,
        x,
        y,
        vx: rand(-520, 520),
        vy: rand(-900, -220),
        w,
        h
      };
    });
  }

  let lastKickAt = 0;

  function periodicKick(now) {
    if (now - lastKickAt < 4000) return;
    lastKickAt = now;

    const n = Math.floor(rand(2, 5));
    for (let i = 0; i < n; i++) {
      const p = particles[Math.floor(Math.random() * particles.length)];
      if (!p) continue;
      p.vy -= rand(600, 1200);
      p.vx += rand(-220, 220);
    }
  }

  function startPopcorn() {
    if (anim) return;
    lastT = performance.now();
    anim = requestAnimationFrame(tick);
  }

  function stopPopcorn() {
    if (!anim) return;
    cancelAnimationFrame(anim);
    anim = null;
  }

  function tick(now) {
    const dt = Math.min(0.028, (now - lastT) / 1000);
    lastT = now;

    const rect = gifField.getBoundingClientRect();
    const W = rect.width;
    const H = rect.height;

    // “EU harmonised standards gravity well” point: slightly below the bottom
    const wellX = W * 0.5;
    const wellY = H + 260;

    for (const p of particles) {
      // gravity down
      p.vy += PHYS.g * dt;

      // attractor (soft pull toward the well)
      const cx = p.x + p.w * 0.5;
      const cy = p.y + p.h * 0.5;
      const dx = wellX - cx;
      const dy = wellY - cy;
      const dist2 = dx * dx + dy * dy + 14000;
      const dist = Math.sqrt(dist2);

      const ax = (dx / dist) * (PHYS.attract / (dist2 / 40000));
      const ay = (dy / dist) * (PHYS.attract / (dist2 / 40000));
      p.vx += ax * dt;
      p.vy += ay * dt;

      // air drag
      p.vx *= PHYS.drag;
      p.vy *= PHYS.drag;

      // cap velocity
      p.vx = clampAbs(p.vx, PHYS.maxV);
      p.vy = clampAbs(p.vy, PHYS.maxV);

      // integrate
      p.x += p.vx * dt;
      p.y += p.vy * dt;

      // collisions
      if (p.x < 0) {
        p.x = 0;
        p.vx = -p.vx * PHYS.restitution;
        bounceWall();
      } else if (p.x + p.w > W) {
        p.x = W - p.w;
        p.vx = -p.vx * PHYS.restitution;
        bounceWall();
      }

      if (p.y < 0) {
        p.y = 0;
        p.vy = -p.vy * PHYS.restitution;
        bounceWall();
      } else if (p.y + p.h > H) {
        p.y = H - p.h;
        p.vy = -Math.abs(p.vy) * PHYS.restitution;
        p.vx *= 0.92;

        if (Math.random() < PHYS.popChance) {
          p.vy -= rand(PHYS.popVyMin, PHYS.popVyMax);
          p.vx += rand(-140, 140);
        }

        bounceWall();
      }

      p.el.style.left = `${p.x}px`;
      p.el.style.top = `${p.y}px`;
    }

    periodicKick(performance.now());
    anim = requestAnimationFrame(tick);
  }

  // -------------------------
  // Chaos mode: toggle + lifecycle
  // -------------------------

  let gifEls = null;
  let resizeTimer = null;

  function enableChaosMode() {
    document.body.classList.add("chaos-mode");
    chaosBtn.textContent = "🧯 Disable GIF Chaos Mode";
    setChaosCanvasVisible(true);

    if (!gifEls) {
      gifEls = buildGifElements();
      relayoutScatter(gifEls);

      // catch late decodes
      setTimeout(() => relayoutScatter(gifEls), 350);
      setTimeout(() => relayoutScatter(gifEls), 900);

      // show Core Wars button in chaos mode
      if (shuffleBtn) shuffleBtn.style.display = "inline-block";

      window.addEventListener("resize", () => {
        if (!document.body.classList.contains("chaos-mode")) return;
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => relayoutScatter(gifEls), 120);
      });
    } else {
      relayoutScatter(gifEls);
      if (shuffleBtn) shuffleBtn.style.display = "inline-block";
    }

    buildParticlesFromEls(gifEls);
    startPopcorn();
  }

  function disableChaosMode() {
    document.body.classList.remove("chaos-mode");
    chaosBtn.textContent = "⚡ Activate GIF Chaos Mode ⚡";
    setChaosCanvasVisible(false);
    if (shuffleBtn) shuffleBtn.style.display = "none";
    stopPopcorn();
  }

  // -------------------------
  // Core Wars (background margins sim)
  // -------------------------

  let cwAnim = null;
  let cwW = 0;
  let cwH = 0;

  const GRID = { w: 220, h: 140 };
  let grid = new Uint8Array(GRID.w * GRID.h);

  const WARRIORS = [
    { id: 1, x: 20, y: 30, vx: 1, vy: 0, jitter: 0.08 },
    { id: 2, x: 190, y: 90, vx: -1, vy: 0, jitter: 0.08 }
  ];

  function cwResize() {
    cwW = cwCanvas.width = Math.floor(window.innerWidth * devicePixelRatio);
    cwH = cwCanvas.height = Math.floor(window.innerHeight * devicePixelRatio);
  }

  function idx(x, y) {
    x = (x + GRID.w) % GRID.w;
    y = (y + GRID.h) % GRID.h;
    return y * GRID.w + x;
  }

  function cwStep() {
    for (const w of WARRIORS) {
      grid[idx(w.x, w.y)] = w.id;

      if (Math.random() < w.jitter) {
        const turn = Math.random();
        if (turn < 0.33) [w.vx, w.vy] = [w.vy, -w.vx];
        else if (turn < 0.66) [w.vx, w.vy] = [-w.vy, w.vx];
        else { w.vx = -w.vx; w.vy = -w.vy; }
      }

      w.x = (w.x + w.vx + GRID.w) % GRID.w;
      w.y = (w.y + w.vy + GRID.h) % GRID.h;

      if (Math.random() < 0.006) {
        maybeToast("🪱 COREWAR: self-modifying code detected. Assimilation pending...");
      }

      if (Math.random() < 0.035) {
        for (let dy = -2; dy <= 2; dy++) {
          for (let dx = -2; dx <= 2; dx++) {
            if (Math.random() < 0.62) grid[idx(w.x + dx, w.y + dy)] = w.id;
          }
        }
      }
    }

    // decay
    for (let i = 0; i < 70; i++) {
      const j = (Math.random() * grid.length) | 0;
      if (grid[j] !== 0 && Math.random() < 0.22) grid[j] = 0;
    }
  }

  function cwDraw() {
    cwCtx.clearRect(0, 0, cwW, cwH);

    const cellW = cwW / GRID.w;
    const cellH = cwH / GRID.h;

    // cells
    for (let y = 0; y < GRID.h; y++) {
      for (let x = 0; x < GRID.w; x++) {
        const v = grid[y * GRID.w + x];
        if (!v) continue;

        const fill = (v === 1) ? "rgba(0,255,110,0.55)" : "rgba(255,155,0,0.48)";

        cwCtx.fillStyle = (v === 1) ? "rgba(0,255,110,0.12)" : "rgba(255,155,0,0.10)";
        cwCtx.fillRect(x * cellW - cellW * 0.35, y * cellH - cellH * 0.35, cellW * 1.7, cellH * 1.7);

        cwCtx.fillStyle = fill;
        cwCtx.fillRect(x * cellW, y * cellH, cellW + 0.5, cellH + 0.5);
      }
    }

    // heads
    for (const w of WARRIORS) {
      const hx = w.x * cellW;
      const hy = w.y * cellH;

      cwCtx.fillStyle = (w.id === 1) ? "rgba(200,255,220,0.95)" : "rgba(255,235,200,0.92)";
      cwCtx.fillRect(hx - cellW * 0.25, hy - cellH * 0.25, cellW * 1.5, cellH * 1.5);
    }

    // mask out main content (margins-only)
    const card = document.querySelector(".pt-404 .section-card");
    if (card) {
      const r = card.getBoundingClientRect();
      const pad = 26;

      const x = (r.left - pad) * devicePixelRatio;
      const y = (r.top - pad) * devicePixelRatio;
      const w = (r.width + pad * 2) * devicePixelRatio;
      const h = (r.height + pad * 2) * devicePixelRatio;

      cwCtx.clearRect(x, y, w, h);
    }

    // scanlines
    cwCtx.fillStyle = "rgba(0,0,0,0.14)";
    const step = Math.max(2, (devicePixelRatio * 2) | 0);
    for (let y = 0; y < cwH; y += step) cwCtx.fillRect(0, y, cwW, 1);

    // vignette
    const g = cwCtx.createRadialGradient(
      cwW * 0.5, cwH * 0.5, cwH * 0.12,
      cwW * 0.5, cwH * 0.5, cwH * 0.75
    );
    g.addColorStop(0, "rgba(0,0,0,0.00)");
    g.addColorStop(1, "rgba(0,0,0,0.48)");
    cwCtx.fillStyle = g;
    cwCtx.fillRect(0, 0, cwW, cwH);
  }

  function cwTick() {
    for (let i = 0; i < 7; i++) cwStep();
    cwDraw();
    cwAnim = requestAnimationFrame(cwTick);
  }

  function cwStart() {
    if (!cwCanvas || !cwCtx || cwAnim) return;

    cwResize();
    window.addEventListener("resize", cwResize);

    grid.fill(0);
    WARRIORS[0].x = 20;  WARRIORS[0].y = 30;  WARRIORS[0].vx = 1;  WARRIORS[0].vy = 0;
    WARRIORS[1].x = 190; WARRIORS[1].y = 90;  WARRIORS[1].vx = -1; WARRIORS[1].vy = 0;

    document.body.classList.add("corewars-on");
    shuffleBtn.textContent = "🧯 Stop Core Wars";
    cwAnim = requestAnimationFrame(cwTick);
    maybeToast("⚔️ Core Wars: engaged. Governance is now emergent.");
  }

  function cwStop() {
    if (!cwAnim) return;

    cancelAnimationFrame(cwAnim);
    cwAnim = null;
    window.removeEventListener("resize", cwResize);

    document.body.classList.remove("corewars-on");
    shuffleBtn.textContent = "⚔️ Run Core Wars";
    cwCtx.clearRect(0, 0, cwW, cwH);
    maybeToast("🧾 Core Wars halted. Compliance restored.");
  }

  // -------------------------
  // Fox button: toggle poem + toast
  // -------------------------

  function togglePoem() {
    if (!poemCard) return;

    const isVisible = poemCard.classList.contains("is-visible");
    poemCard.classList.toggle("is-visible", !isVisible);
    poemCard.setAttribute("aria-hidden", String(isVisible));

    if (!isVisible) {
      poemCard.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  // -------------------------
  // Hash triggers
  // -------------------------

  function applyHashTriggers() {
    const h = (location.hash || "").toLowerCase();

    if (h.includes("chaos")) enableChaosMode();
    if (h.includes("fox")) {
      foxSpeak();
      togglePoem();
    }
  }

  // -------------------------
  // Wire up events
  // -------------------------

  if (chaosBtn) {
    chaosBtn.addEventListener("click", () => {
      const isOn = document.body.classList.contains("chaos-mode");
      if (isOn) disableChaosMode();
      else enableChaosMode();
    });
  }

  if (shuffleBtn) {
    shuffleBtn.addEventListener("click", () => {
      if (cwAnim) cwStop();
      else cwStart();
    });
  }

  if (foxBtn) {
    foxBtn.addEventListener("click", () => {
      foxPre?.classList.toggle("fox-visible");
      foxSpeak();
      togglePoem();
    });
  }

  window.addEventListener("hashchange", applyHashTriggers);
  applyHashTriggers();
})();
