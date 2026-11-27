import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

interface AlgoraPreloaderProps {
  onComplete?: () => void;
}

interface BreezeParticle {
  u: number;
  threshold: number;
  localX: number; // relative to leaf canvas center
  localY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  maxAlpha: number;
  released: boolean;
  kind: "leaf-fleck" | "o2";
  r: number;
  g: number;
  b: number;
  rot: number;
  vRot: number;
  phase: number;
  trail: Array<{ x: number; y: number }>;
}

interface WindRibbon {
  yBase: number;
  amp: number;
  freq: number;
  speed: number;
  phase: number;
  width: number;
  alpha: number;
}

const LEAF_BOX = 380; // CSS px for offscreen photorealistic leaf canvas
const LEAF_HALF_LEN = 118;
const LEAF_HALF_WID = 62;
const LEAF_TILT = (-28 * Math.PI) / 180;

/** Organic botanical margin profile (u in [-1..1] from petiole base to acuminate apex). */
function leafProfile(u: number): { top: number; bottom: number; midCurve: number } {
  const c = Math.max(-1, Math.min(1, u));
  // Tapered teardrop + slight natural undulation along the margin
  const baseEnv = Math.pow(Math.max(0, 1 - c * c), 0.68) * (1 - 0.18 * c);
  // Subtle acuminate apex elongation
  const tipBoost = c > 0.55 ? (1 - c) * 0.25 : 0;
  const rippleTop = 1 + 0.022 * Math.sin(c * 24) + 0.015 * Math.cos(c * 13);
  const rippleBot = 1 + 0.02 * Math.cos(c * 22 + 1.1) + 0.015 * Math.sin(c * 11);
  // Gentle natural midrib arch
  const midCurve = -6.5 * Math.sin((c + 1) * Math.PI * 0.5) + c * 2.5;
  const hw = LEAF_HALF_WID * (baseEnv + tipBoost * 0.12);
  return {
    top: midCurve - hw * 1.03 * rippleTop,
    bottom: midCurve + hw * 0.97 * rippleBot,
    midCurve,
  };
}

function localToCanvas(lx: number, ly: number, cx: number, cy: number) {
  const cos = Math.cos(LEAF_TILT);
  const sin = Math.sin(LEAF_TILT);
  return {
    x: cx + lx * cos - ly * sin,
    y: cy + lx * sin + ly * cos,
  };
}

/**
 * Renders a hyper-realistic, studio-lit botanical leaf onto an offscreen canvas
 * with 3D midrib fold shading, waxy cuticle specular sheen, multi-tiered arcuate
 * venation, cellular chlorophyll texture, and refractive micro dew-drops.
 */
function paintPhotorealisticLeaf(scale: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(LEAF_BOX * scale);
  canvas.height = Math.round(LEAF_BOX * scale);
  const ctx = canvas.getContext("2d")!;
  ctx.scale(scale, scale);

  const cx = LEAF_BOX * 0.5;
  const cy = LEAF_BOX * 0.5;
  const cos = Math.cos(LEAF_TILT);
  const sin = Math.sin(LEAF_TILT);

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(LEAF_TILT);

  // 1. Curved organic petiole stem
  ctx.beginPath();
  ctx.moveTo(-LEAF_HALF_LEN - 42, 11);
  ctx.quadraticCurveTo(-LEAF_HALF_LEN - 18, 6, -LEAF_HALF_LEN + 4, 0);
  ctx.lineWidth = 4.2;
  ctx.lineCap = "round";
  const stemGrad = ctx.createLinearGradient(
    -LEAF_HALF_LEN - 42,
    11,
    -LEAF_HALF_LEN + 4,
    0
  );
  stemGrad.addColorStop(0, "#3A6E31");
  stemGrad.addColorStop(1, "#62A844");
  ctx.strokeStyle = stemGrad;
  ctx.stroke();

  // Stem top highlight
  ctx.beginPath();
  ctx.moveTo(-LEAF_HALF_LEN - 41, 9.8);
  ctx.quadraticCurveTo(-LEAF_HALF_LEN - 18, 4.8, -LEAF_HALF_LEN + 2, -1);
  ctx.lineWidth = 1.1;
  ctx.strokeStyle = "rgba(214, 247, 168, 0.55)";
  ctx.stroke();

  // 2. Build exact leaf lamina path
  const steps = 110;
  const traceLeafPath = () => {
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const u = -1 + (2 * i) / steps;
      const { top } = leafProfile(u);
      const x = u * LEAF_HALF_LEN;
      if (i === 0) ctx.moveTo(x, top);
      else ctx.lineTo(x, top);
    }
    for (let i = steps; i >= 0; i--) {
      const u = -1 + (2 * i) / steps;
      const { bottom } = leafProfile(u);
      const x = u * LEAF_HALF_LEN;
      ctx.lineTo(x, bottom);
    }
    ctx.closePath();
  };

  traceLeafPath();
  ctx.save();
  ctx.clip();

  // 3. Base sunlit-to-shaded chlorophyll gradient across leaf lamina
  const baseGrad = ctx.createLinearGradient(-LEAF_HALF_LEN, -58, LEAF_HALF_LEN, 64);
  baseGrad.addColorStop(0, "#1D6133");
  baseGrad.addColorStop(0.28, "#2F8740");
  baseGrad.addColorStop(0.62, "#51A943");
  baseGrad.addColorStop(1, "#7CCB4E");
  ctx.fillStyle = baseGrad;
  ctx.fillRect(-LEAF_HALF_LEN - 10, -85, LEAF_HALF_LEN * 2 + 20, 170);

  // 4. 3D Fold Lighting: sunlit upper lamina vs deep emerald shaded lower lamina
  const foldGrad = ctx.createLinearGradient(0, -64, 0, 64);
  foldGrad.addColorStop(0, "rgba(182, 238, 108, 0.42)");
  foldGrad.addColorStop(0.45, "rgba(128, 212, 82, 0.18)");
  foldGrad.addColorStop(0.51, "rgba(11, 52, 26, 0.34)"); // sharp shadow crease right under midrib
  foldGrad.addColorStop(0.82, "rgba(17, 74, 38, 0.28)");
  foldGrad.addColorStop(1, "rgba(92, 175, 72, 0.18)"); // soft bounced rim light on lower edge
  ctx.fillStyle = foldGrad;
  ctx.fillRect(-LEAF_HALF_LEN - 10, -85, LEAF_HALF_LEN * 2 + 20, 170);

  // 5. Cellular chlorophyll parenchyma micro-mottling
  for (let i = 0; i < 1600; i++) {
    const rx = (Math.sin(i * 12.9898) * 0.5 + 0.5) * (LEAF_HALF_LEN * 2) - LEAF_HALF_LEN;
    const ry = (Math.cos(i * 78.233) * 0.5 + 0.5) * 130 - 65;
    const rad = 1.4 + (i % 7) * 0.9;
    ctx.fillStyle =
      i % 3 === 0
        ? "rgba(195, 244, 120, 0.055)"
        : i % 3 === 1
        ? "rgba(14, 62, 30, 0.075)"
        : "rgba(74, 158, 62, 0.06)";
    ctx.beginPath();
    ctx.arc(rx, ry, rad, 0, Math.PI * 2);
    ctx.fill();
  }

  // 6. Tertiary reticulate vein network (micro-venation)
  ctx.lineWidth = 0.45;
  for (let i = 0; i < 85; i++) {
    const u = -0.82 + (i / 85) * 1.68;
    const { top, bottom, midCurve } = leafProfile(u);
    const x1 = u * LEAF_HALF_LEN;
    const y1 = midCurve + ((i % 2 === 0 ? -1 : 1) * (0.25 + ((i * 13) % 55) / 100)) * ((bottom - top) * 0.45);
    const x2 = x1 + 9 + (i % 7);
    const y2 = y1 + (i % 2 === 0 ? -7 : 7);
    ctx.strokeStyle = "rgba(194, 238, 146, 0.16)";
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo(x1 + 4, y2 * 0.6 + y1 * 0.4, x2, y2);
    ctx.stroke();
  }

  // 7. Arcuate Secondary Lateral Veins (staggered, curving gracefully toward tip)
  const veinSeeds = [-0.74, -0.54, -0.34, -0.14, 0.06, 0.26, 0.45, 0.64, 0.8];
  veinSeeds.forEach((u, idx) => {
    const { top, bottom, midCurve } = leafProfile(u);
    const x0 = u * LEAF_HALF_LEN;

    // Upper vein (sunlit half)
    const uEndTop = Math.min(0.95, u + 0.28);
    const { top: topMarginAtEnd } = leafProfile(uEndTop);
    const xt = uEndTop * LEAF_HALF_LEN;
    const yt = topMarginAtEnd * 0.86 + midCurve * 0.14;

    ctx.strokeStyle = "rgba(214, 248, 162, 0.48)";
    ctx.lineWidth = Math.max(0.6, 1.8 - idx * 0.13);
    ctx.beginPath();
    ctx.moveTo(x0, midCurve);
    ctx.bezierCurveTo(
      x0 + 14,
      midCurve + (top - midCurve) * 0.35,
      xt - 12,
      yt + 4,
      xt,
      yt
    );
    ctx.stroke();

    // Lower vein (slightly offset stagger for natural botanical asymmetry)
    const uLow = Math.min(0.88, u + 0.06);
    const { bottom: botAtU, midCurve: midLow } = leafProfile(uLow);
    const x0L = uLow * LEAF_HALF_LEN;
    const uEndBot = Math.min(0.95, uLow + 0.27);
    const { bottom: botMarginAtEnd } = leafProfile(uEndBot);
    const xb = uEndBot * LEAF_HALF_LEN;
    const yb = botMarginAtEnd * 0.86 + midLow * 0.14;

    // Soft shadow under lower vein
    ctx.strokeStyle = "rgba(10, 44, 22, 0.28)";
    ctx.lineWidth = Math.max(0.7, 1.9 - idx * 0.13);
    ctx.beginPath();
    ctx.moveTo(x0L, midLow + 1);
    ctx.bezierCurveTo(
      x0L + 13,
      midLow + (botAtU - midLow) * 0.35 + 1,
      xb - 11,
      yb - 3,
      xb,
      yb + 1
    );
    ctx.stroke();

    ctx.strokeStyle = "rgba(182, 232, 134, 0.38)";
    ctx.lineWidth = Math.max(0.55, 1.5 - idx * 0.12);
    ctx.beginPath();
    ctx.moveTo(x0L, midLow);
    ctx.bezierCurveTo(
      x0L + 13,
      midLow + (botAtU - midLow) * 0.35,
      xb - 11,
      yb - 4,
      xb,
      yb
    );
    ctx.stroke();
  });

  // 8. Tapered 3D Central Midrib
  for (let i = 0; i < 60; i++) {
    const t0 = i / 60;
    const t1 = (i + 1) / 60;
    const u0 = -1 + t0 * 1.96;
    const u1 = -1 + t1 * 1.96;
    const m0 = leafProfile(u0).midCurve;
    const m1 = leafProfile(u1).midCurve;
    const w = Math.max(0.45, 3.6 * (1 - t0 * 0.88));

    ctx.beginPath();
    ctx.moveTo(u0 * LEAF_HALF_LEN, m0);
    ctx.lineTo(u1 * LEAF_HALF_LEN, m1);
    ctx.lineWidth = w;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#C7F096";
    ctx.stroke();
  }

  // 9. Waxy Cuticle Specular Highlight along upper sunlit curve
  const sheen = ctx.createRadialGradient(-18, -24, 4, -8, -22, 68);
  sheen.addColorStop(0, "rgba(255, 255, 255, 0.24)");
  sheen.addColorStop(0.55, "rgba(220, 252, 175, 0.08)");
  sheen.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = sheen;
  ctx.fillRect(-LEAF_HALF_LEN, -75, LEAF_HALF_LEN * 2, 150);

  // 10. Crisp Leaf Margin Rim & Micro-Dew Droplets
  traceLeafPath();
  ctx.lineWidth = 1.2;
  ctx.strokeStyle = "rgba(186, 236, 128, 0.45)";
  ctx.stroke();

  const dewDrops = [
    { x: -24, y: -22, r: 4.4 },
    { x: 18, y: -15, r: 3.1 },
    { x: 46, y: 12, r: 3.7 },
    { x: -46, y: 18, r: 2.8 },
  ];
  for (const d of dewDrops) {
    // Contact shadow below drop
    ctx.fillStyle = "rgba(8, 38, 18, 0.38)";
    ctx.beginPath();
    ctx.ellipse(d.x + 1.2, d.y + 1.6, d.r * 1.05, d.r * 0.85, 0, 0, Math.PI * 2);
    ctx.fill();

    // Refractive lens body
    const dg = ctx.createRadialGradient(
      d.x - d.r * 0.3,
      d.y - d.r * 0.3,
      0.4,
      d.x,
      d.y,
      d.r
    );
    dg.addColorStop(0, "rgba(255, 255, 255, 0.82)");
    dg.addColorStop(0.45, "rgba(218, 250, 200, 0.42)");
    dg.addColorStop(1, "rgba(22, 92, 46, 0.55)");
    ctx.fillStyle = dg;
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
    ctx.fill();

    // Specular glint
    ctx.fillStyle = "rgba(255, 255, 255, 0.96)";
    ctx.beginPath();
    ctx.arc(d.x - d.r * 0.34, d.y - d.r * 0.34, d.r * 0.28, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore(); // unclip lamina
  ctx.restore(); // restore transform

  // Unused variables guard
  void cos;
  void sin;
  return canvas;
}

export function AlgoraPreloader({ onComplete }: AlgoraPreloaderProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [visible, setVisible] = useState(true);
  const [percent, setPercent] = useState(0);
  const [phaseLabel, setPhaseLabel] = useState("Cultivating living chlorophyll");

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setPercent(100);
      const timer = setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, 280);
      return () => clearTimeout(timer);
    }

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      if (!canvas || !ctx) return;
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    // Paint master photorealistic leaf once at high DPI
    const masterLeaf = paintPhotorealisticLeaf(dpr);
    const workLeaf = document.createElement("canvas");
    workLeaf.width = masterLeaf.width;
    workLeaf.height = masterLeaf.height;
    const workCtx = workLeaf.getContext("2d")!;

    // Read pixels from master leaf so particles carry authentic photorealistic leaf colors
    const masterCtx = masterLeaf.getContext("2d", { willReadFrequently: true })!;
    const masterData = masterCtx.getImageData(
      0,
      0,
      masterLeaf.width,
      masterLeaf.height
    ).data;

    // Sample ~440 particles directly from visible leaf pixels
    const particles: BreezeParticle[] = [];
    const totalSamples = 440;
    let attempt = 0;
    while (particles.length < totalSamples && attempt < 4000) {
      attempt++;
      const t1 = ((attempt * 0.61803398875) % 1) * 2 - 1;
      const u = Math.sign(t1) * Math.pow(Math.abs(t1), 0.9);
      const { top, bottom } = leafProfile(u);
      const t2 = ((attempt * 97 + 31) % 313) / 313;
      const ly = top + t2 * (bottom - top);
      const lx = u * LEAF_HALF_LEN;

      const canvasPt = localToCanvas(lx, ly, LEAF_BOX * 0.5, LEAF_BOX * 0.5);
      const px = Math.min(
        masterLeaf.width - 1,
        Math.max(0, Math.round(canvasPt.x * dpr))
      );
      const py = Math.min(
        masterLeaf.height - 1,
        Math.max(0, Math.round(canvasPt.y * dpr))
      );
      const idx = (py * masterLeaf.width + px) * 4;
      const a = masterData[idx + 3];
      if (a < 80) continue;

      const isO2 = particles.length % 7 === 0;
      // Organic noisy wind threshold so particles detach along frayed natural curves
      const edgeNoise =
        Math.sin(ly * 0.14 + attempt) * 0.08 + Math.cos(u * 15) * 0.05;

      particles.push({
        u,
        threshold: u + edgeNoise,
        localX: canvasPt.x - LEAF_BOX * 0.5,
        localY: canvasPt.y - LEAF_BOX * 0.5,
        x: 0,
        y: 0,
        vx: 1.15 + ((attempt * 13) % 18) * 0.09,
        vy: -0.28 - ((attempt * 23) % 12) * 0.07,
        size: isO2 ? 2.6 + (attempt % 4) * 1.0 : 2.1 + (attempt % 4) * 1.15,
        alpha: 0,
        maxAlpha: isO2 ? 0.88 : 0.96,
        released: false,
        kind: isO2 ? "o2" : "leaf-fleck",
        r: masterData[idx],
        g: masterData[idx + 1],
        b: masterData[idx + 2],
        rot: (attempt % 360) * (Math.PI / 180),
        vRot: ((attempt % 2 === 0 ? 1 : -1) * (0.02 + (attempt % 5) * 0.012)),
        phase: (attempt * 0.37) % (Math.PI * 2),
        trail: [],
      });
    }

    const ribbons: WindRibbon[] = Array.from({ length: 8 }, (_, i) => ({
      yBase: height * (0.24 + i * 0.075),
      amp: 15 + (i % 3) * 11,
      freq: 0.0042 + (i % 2) * 0.0018,
      speed: 1.05 + i * 0.15,
      phase: i * 1.15,
      width: 1.0 + (i % 2) * 0.55,
      alpha: 0.07 + (i % 3) * 0.035,
    }));

    let pageReady = document.readyState === "complete";
    const onLoad = () => {
      pageReady = true;
    };
    window.addEventListener("load", onLoad);
    document.fonts?.ready.then(() => {
      pageReady = true;
    });

    // Unhurried, deeply smooth botanical metamorphosis timeline (~4.8s)
    const startTime = performance.now();
    const EMERGE_END = 1350; // ms: Leaf gently emerges & breathes in sunlit studio
    const DISSOLVE_START = 1450; // ms: Breeze softly begins eroding leaf
    const DISSOLVE_END = 4150; // ms: Leaf completes metamorphosis into swirling breeze
    const MIN_EXIT = 4750; // ms: Smooth fade into Hero
    const MAX_TIMEOUT = 6500; // ms: Safety cap

    let rafId = 0;
    let exited = false;
    let lastShownPct = -1;
    let lastPhase = "";

    const triggerExit = () => {
      if (exited) return;
      exited = true;
      setPercent(100);
      setPhaseLabel("Pure oxygen released");
      setTimeout(() => {
        setVisible(false);
        document.body.style.overflow = prevOverflow;
        onComplete?.();
      }, 260);
    };

    const render = (now: number) => {
      const elapsed = now - startTime;
      const tSec = elapsed * 0.001;
      const cx = width * 0.5;
      const cy = height * 0.5 - 32;

      const animProgress = Math.min(1, elapsed / MIN_EXIT);
      const targetPct = pageReady
        ? Math.round(animProgress * 100)
        : Math.min(95, Math.round(animProgress * 95));
      if (targetPct !== lastShownPct) {
        lastShownPct = targetPct;
        setPercent(targetPct);
      }

      const nextPhase =
        elapsed < DISSOLVE_START
          ? "Cultivating living chlorophyll"
          : elapsed < DISSOLVE_END
          ? "Transforming leaf into breeze"
          : "Releasing pure oxygen";
      if (nextPhase !== lastPhase) {
        lastPhase = nextPhase;
        setPhaseLabel(nextPhase);
      }

      // Smooth eased dissolve progress [0..1]
      const dissolveT = Math.max(
        0,
        Math.min(1, (elapsed - DISSOLVE_START) / (DISSOLVE_END - DISSOLVE_START))
      );
      const easedDissolve =
        dissolveT < 0.5
          ? 4 * dissolveT * dissolveT * dissolveT
          : 1 - Math.pow(-2 * dissolveT + 2, 3) / 2;
      const uSweep = -1.16 + easedDissolve * 2.38;

      // Gentle emerge scale & sway before/during dissolve
      const emergeT = Math.min(1, elapsed / EMERGE_END);
      const emergeEase = 1 - Math.pow(1 - emergeT, 3);
      const swayAngle = Math.sin(tSec * 1.45) * 0.032 + easedDissolve * 0.06;
      const leafScale = 0.9 + emergeEase * 0.1;

      if (ctx) {
        ctx.clearRect(0, 0, width, height);

        // 1. Sweeping aerodynamic breeze ribbons
        const ribbonStrength =
          elapsed < EMERGE_END
            ? 0.22 * emergeEase
            : elapsed < DISSOLVE_END
            ? 0.22 + easedDissolve * 0.78
            : Math.max(0, 1 - (elapsed - DISSOLVE_END) / 950);

        if (ribbonStrength > 0.02) {
          for (const rb of ribbons) {
            ctx.beginPath();
            const startX = -40;
            const endX = width + 40;
            for (let x = startX; x <= endX; x += 24) {
              const wave =
                Math.sin(x * rb.freq - tSec * rb.speed + rb.phase) * rb.amp +
                Math.cos(x * rb.freq * 0.5 + tSec * 0.85) * (rb.amp * 0.4);
              const lift = ((x - width * 0.35) / width) * -60;
              const y = rb.yBase + wave + lift;
              if (x === startX) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            const grad = ctx.createLinearGradient(0, 0, width, 0);
            grad.addColorStop(0, "rgba(53, 166, 106, 0)");
            grad.addColorStop(
              0.42,
              `rgba(53, 166, 106, ${(rb.alpha * ribbonStrength).toFixed(3)})`
            );
            grad.addColorStop(
              0.76,
              `rgba(132, 204, 22, ${(rb.alpha * 0.85 * ribbonStrength).toFixed(3)})`
            );
            grad.addColorStop(1, "rgba(53, 166, 106, 0)");
            ctx.strokeStyle = grad;
            ctx.lineWidth = rb.width;
            ctx.stroke();
          }
        }

        // 2. Render & organically erode the photorealistic leaf
        if (easedDissolve < 0.995) {
          workCtx.globalCompositeOperation = "source-over";
          workCtx.clearRect(0, 0, workLeaf.width, workLeaf.height);
          workCtx.drawImage(masterLeaf, 0, 0);

          if (easedDissolve > 0) {
            workCtx.save();
            workCtx.scale(dpr, dpr);
            workCtx.translate(LEAF_BOX * 0.5, LEAF_BOX * 0.5);
            workCtx.rotate(LEAF_TILT);
            workCtx.globalCompositeOperation = "destination-out";

            // Organic wavy wind-front eraser from stem (-170) to uSweep
            const frontX = uSweep * LEAF_HALF_LEN;
            workCtx.beginPath();
            workCtx.moveTo(-210, -140);
            for (let y = -140; y <= 140; y += 10) {
              const wave =
                Math.sin(y * 0.09 + tSec * 4.5) * 11 +
                Math.cos(y * 0.18 - tSec * 3.1) * 5;
              workCtx.lineTo(frontX + wave, y);
            }
            workCtx.lineTo(-210, 140);
            workCtx.closePath();
            workCtx.shadowColor = "rgba(0,0,0,1)";
            workCtx.shadowBlur = 14;
            workCtx.fillStyle = "#000";
            workCtx.fill();
            workCtx.restore();
          }

          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(swayAngle);
          ctx.scale(leafScale, leafScale);
          ctx.globalAlpha = emergeEase;
          // Soft physical studio drop shadow underneath leaf
          ctx.shadowColor = "rgba(23, 75, 42, 0.16)";
          ctx.shadowBlur = 24;
          ctx.shadowOffsetY = 18;
          ctx.drawImage(
            workLeaf,
            -LEAF_BOX * 0.5,
            -LEAF_BOX * 0.5,
            LEAF_BOX,
            LEAF_BOX
          );
          ctx.restore();
        }

        // 3. True-color leaf flecks & refractive O2 bubbles sweeping into breeze
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];

          if (!p.released && elapsed >= DISSOLVE_START && p.threshold <= uSweep) {
            p.released = true;
            // Anchor exact screen position matching current leaf sway & scale
            const cosS = Math.cos(swayAngle);
            const sinS = Math.sin(swayAngle);
            p.x = cx + (p.localX * cosS - p.localY * sinS) * leafScale;
            p.y = cy + (p.localX * sinS + p.localY * cosS) * leafScale;
            p.alpha = p.maxAlpha;
          }

          if (!p.released) continue;

          const swirlY =
            Math.sin(p.x * 0.0095 + tSec * 3.2 + p.phase) * 0.11 - 0.032;
          const gustX = 0.055 + Math.cos(p.y * 0.009 + tSec * 2.1) * 0.018;

          p.vx = Math.min(5.6, p.vx + gustX);
          p.vy = p.vy * 0.975 + swirlY;
          p.x += p.vx;
          p.y += p.vy;
          p.rot += p.vRot;

          const distFromCenter = Math.max(0, p.x - cx);
          const fadeRate = distFromCenter > width * 0.3 ? 0.015 : 0.0032;
          p.alpha = Math.max(0, p.alpha - fadeRate);

          if (p.alpha <= 0.01) continue;

          p.trail.push({ x: p.x, y: p.y });
          if (p.trail.length > 7) p.trail.shift();

          if (p.trail.length > 2) {
            ctx.beginPath();
            ctx.moveTo(p.trail[0].x, p.trail[0].y);
            for (let k = 1; k < p.trail.length; k++) {
              ctx.lineTo(p.trail[k].x, p.trail[k].y);
            }
            ctx.strokeStyle =
              p.kind === "o2"
                ? `rgba(167, 243, 208, ${(p.alpha * 0.32).toFixed(3)})`
                : `rgba(${p.r}, ${p.g}, ${p.b}, ${(p.alpha * 0.22).toFixed(3)})`;
            ctx.lineWidth = p.size * 0.45;
            ctx.lineCap = "round";
            ctx.stroke();
          }

          if (p.kind === "o2") {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(236, 253, 245, ${(p.alpha * 0.45).toFixed(3)})`;
            ctx.fill();
            ctx.lineWidth = 1;
            ctx.strokeStyle = `rgba(16, 185, 129, ${(p.alpha * 0.85).toFixed(3)})`;
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(
              p.x - p.size * 0.3,
              p.y - p.size * 0.3,
              Math.max(0.7, p.size * 0.25),
              0,
              Math.PI * 2
            );
            ctx.fillStyle = `rgba(255, 255, 255, ${(p.alpha * 0.95).toFixed(3)})`;
            ctx.fill();
          } else {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = `rgb(${p.r}, ${p.g}, ${p.b})`;
            ctx.beginPath();
            ctx.ellipse(0, 0, p.size * 1.4, p.size * 0.72, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }
      }

      if ((elapsed >= MIN_EXIT && pageReady) || elapsed >= MAX_TIMEOUT) {
        triggerExit();
        return;
      }

      rafId = requestAnimationFrame(render);
    };

    window.addEventListener("resize", resize);
    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("load", onLoad);
      document.body.style.overflow = prevOverflow;
    };
  }, [onComplete]);

  const handleSkip = () => {
    document.body.style.overflow = "";
    setVisible(false);
    onComplete?.();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status"
          aria-live="polite"
          aria-label="Loading Algora"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[90] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-white via-[#F9FCF9] to-[#F2FAF5]"
        >
          {/* Ambient studio halo behind leaf */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(53,166,106,0.12)_0%,rgba(167,243,208,0.05)_52%,transparent_75%)] blur-2xl"
          />

          {/* Full-screen Photorealistic Leaf & Breeze Canvas */}
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full"
          />

          {/* Wordmark & Calm Progress Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 mt-48 flex flex-col items-center text-center"
          >
            <span className="title-2 font-semibold tracking-[0.28em] text-[#171C19]">
              ALGORA
            </span>
            <div className="mt-3 flex items-center gap-3">
              <span className="caption-4 text-[#4A6154]">{phaseLabel}</span>
              <span className="h-3 w-px bg-[#D1FAE5]" aria-hidden="true" />
              <span className="font-mono caption-4 tabular-nums text-[#176B43]">
                {percent}%
              </span>
            </div>
          </motion.div>

          <button
            type="button"
            onClick={handleSkip}
            className="caption-4 absolute bottom-7 right-7 z-20 rounded-full border border-[#D1FAE5] bg-white/85 px-3.5 py-1.5 text-[#4A6154] backdrop-blur transition-all duration-300 hover:border-[#176B43]/40 hover:text-[#171C19] active:scale-[0.98]"
          >
            Skip
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
