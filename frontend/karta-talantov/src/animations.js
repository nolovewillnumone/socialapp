// ── Confetti burst ─────────────────────────────────────────────────────────────
export function fireConfetti() {
  const canvas = document.createElement("canvas");
  canvas.id = "confetti-canvas";
  canvas.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9997;";
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const COLORS = ["#0F6E56","#1D9E75","#5DCAA5","#EF9F27","#FAC775","#7E57C2"];
  const particles = Array.from({ length: 80 }, () => ({
    x: canvas.width  * 0.5 + (Math.random() - 0.5) * 200,
    y: canvas.height * 0.4,
    vx: (Math.random() - 0.5) * 8,
    vy: -(Math.random() * 10 + 4),
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size:  Math.random() * 8 + 4,
    rotation: Math.random() * 360,
    spin: (Math.random() - 0.5) * 8,
    opacity: 1,
    shape: Math.random() > 0.5 ? "rect" : "circle",
  }));

  let frame;
  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    particles.forEach(p => {
      p.vy += 0.25;
      p.x  += p.vx;
      p.y  += p.vy;
      p.rotation += p.spin;
      p.opacity  -= 0.012;
      if (p.opacity <= 0) return;
      alive = true;
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      if (p.shape === "rect") {
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });
    if (alive) {
      frame = requestAnimationFrame(draw);
    } else {
      canvas.remove();
    }
  };
  draw();
  setTimeout(() => { cancelAnimationFrame(frame); canvas.remove(); }, 4000);
}

// ── Animated counter ─────────────────────────────────────────────────────────
export function animateCounter(el, target, duration = 1200, suffix = "") {
  if (!el) return;
  const start     = performance.now();
  const startVal  = 0;
  const update    = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(startVal + (target - startVal) * eased);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target + suffix;
  };
  requestAnimationFrame(update);
}

// ── Ripple on click ──────────────────────────────────────────────────────────
export function addRipple(e) {
  const btn  = e.currentTarget;
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 2;
  const x    = e.clientX - rect.left - size / 2;
  const y    = e.clientY - rect.top  - size / 2;
  const ripple = document.createElement("span");
  ripple.style.cssText = `
    position:absolute; border-radius:50%; pointer-events:none;
    width:${size}px; height:${size}px;
    left:${x}px; top:${y}px;
    background:rgba(255,255,255,0.3);
    transform:scale(0); animation:rippleAnim 0.5s linear;
  `;
  // Ensure btn is relative
  if (getComputedStyle(btn).position === "static") btn.style.position = "relative";
  btn.style.overflow = "hidden";
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
}
