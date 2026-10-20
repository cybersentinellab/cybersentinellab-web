// 1. Shield dome over a city skyline — threats strike the dome and are deflected.
import { type Scene, type Palette, rgba, rand } from './core';

type Bld = { x: number; w: number; h: number; kind: 'box' | 'spire' | 'dome'; lights: [number, number][] };
type Threat = { x: number; y: number; vx: number; vy: number; hit: boolean; life: number; trail: [number, number][] };
type Ripple = { x: number; y: number; age: number };

let W = 0, H = 0, P: Palette, cx = 0, R = 0, ry = 0;
let blds: Bld[] = [], threats: Threat[] = [], ripples: Ripple[] = [], spawn = 0, hex: HTMLCanvasElement;

// point on the dome ellipse at angle a (0 = right, PI = left)
const onDome = (a: number) => [cx + Math.cos(a) * R, H - Math.sin(a) * ry] as const;
const inside = (x: number, y: number) => y < H && ((x - cx) / R) ** 2 + ((H - y) / ry) ** 2 <= 1;

function makeHex() {
  hex = document.createElement('canvas');
  hex.width = 56; hex.height = 48;
  const c = hex.getContext('2d')!;
  c.strokeStyle = rgba(P.accent, 0.13); c.lineWidth = 1;
  c.beginPath(); c.moveTo(14, 0); c.lineTo(42, 0); c.lineTo(56, 24); c.lineTo(42, 48); c.lineTo(14, 48); c.lineTo(0, 24); c.closePath(); c.stroke();
}

function newThreat(): Threat {
  const a = rand(0.25, Math.PI - 0.25);
  const [tx, ty] = onDome(a);
  const side = Math.random() < 0.5 ? -1 : 1;
  const sx = side < 0 ? rand(-60, W * 0.25) : rand(W * 0.75, W + 60), sy = rand(-40, H * 0.15);
  const d = Math.hypot(tx - sx, ty - sy), sp = rand(260, 380);
  return { x: sx, y: sy, vx: ((tx - sx) / d) * sp, vy: ((ty - sy) / d) * sp, hit: false, life: 1, trail: [] };
}

export const scene: Scene = {
  staticTime: 3.2,
  init(w, h, pal) {
    W = w; H = h; P = pal; cx = w / 2;
    R = Math.min(w * 0.36, 560); ry = Math.min(h * 0.86, R * 0.9);
    makeHex();
    blds = []; threats = []; ripples = []; spawn = 0;
    let x = cx - R * 0.72;
    while (x < cx + R * 0.72) {
      const bw = rand(R * 0.05, R * 0.12), mid = Math.abs(x - cx) < R * 0.06;
      const kind = mid ? 'spire' : Math.random() < 0.08 ? 'dome' : 'box';
      const max = ry * (1 - ((x + bw / 2 - cx) / R) ** 2) ** 0.5 * 0.82;
      const bh = kind === 'spire' ? max * 0.98 : rand(max * 0.25, max * 0.7);
      const lights: [number, number][] = Array.from({ length: Math.round(rand(1, 4)) }, () => [rand(0.15, 0.8), rand(0.1, 0.85)]);
      blds.push({ x, w: kind === 'spire' ? R * 0.05 : bw, h: bh, kind, lights });
      x += (kind === 'spire' ? R * 0.05 : bw) + rand(2, R * 0.025);
    }
  },
  frame(ctx, t, dt) {
    ctx.clearRect(0, 0, W, H);
    // dome glow + hex pattern
    ctx.save();
    ctx.beginPath(); ctx.ellipse(cx, H, R, ry, 0, Math.PI, 0); ctx.closePath();
    const g = ctx.createRadialGradient(cx, H, 0, cx, H, R);
    const pulse = 0.04 * Math.sin(t * 1.4);
    g.addColorStop(0, rgba(P.accent, 0.2 + pulse)); g.addColorStop(0.8, rgba(P.accent, 0.05)); g.addColorStop(1, rgba(P.accent, 0.02));
    ctx.fillStyle = g; ctx.fill();
    ctx.clip();
    ctx.fillStyle = ctx.createPattern(hex, 'repeat')!; ctx.fillRect(cx - R, H - ry, R * 2, ry);
    // scanning band
    const sy = H - ((t * 0.25) % 1) * ry;
    const sg = ctx.createLinearGradient(0, sy - 40, 0, sy);
    sg.addColorStop(0, rgba(P.accent, 0)); sg.addColorStop(1, rgba(P.accent, 0.12));
    ctx.fillStyle = sg; ctx.fillRect(cx - R, sy - 40, R * 2, 40);
    ctx.restore();
    // dome rim
    ctx.lineWidth = 2; ctx.strokeStyle = rgba(P.accent, 0.85);
    ctx.beginPath(); ctx.ellipse(cx, H, R, ry, 0, Math.PI, 0); ctx.stroke();
    ctx.lineWidth = 1; ctx.strokeStyle = rgba(P.accent, 0.2);
    ctx.beginPath(); ctx.ellipse(cx, H, R * 0.92, ry * 0.9, 0, Math.PI, 0); ctx.stroke();

    // skyline
    for (const b of blds) {
      const top = H - b.h;
      const bg = ctx.createLinearGradient(0, top, 0, H);
      bg.addColorStop(0, '#16243c'); bg.addColorStop(1, '#090e18');
      ctx.fillStyle = bg; ctx.strokeStyle = 'rgba(70,120,180,0.35)'; ctx.lineWidth = 1;
      ctx.beginPath();
      if (b.kind === 'spire') {
        const m = b.x + b.w / 2;
        ctx.moveTo(b.x, H); ctx.lineTo(b.x, top + b.h * 0.45); ctx.lineTo(m - b.w * 0.2, top + b.h * 0.2); ctx.lineTo(m, top); ctx.lineTo(m + b.w * 0.2, top + b.h * 0.2); ctx.lineTo(b.x + b.w, top + b.h * 0.45); ctx.lineTo(b.x + b.w, H);
      } else if (b.kind === 'dome') {
        ctx.rect(b.x, top + b.w * 0.3, b.w, b.h - b.w * 0.3);
        ctx.moveTo(b.x + b.w * 0.2, top + b.w * 0.3); ctx.arc(b.x + b.w / 2, top + b.w * 0.3, b.w * 0.3, Math.PI, 0);
      } else ctx.rect(b.x, top, b.w, b.h);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = rgba(P.accent, 0.55 + 0.25 * Math.sin(t * 2 + b.x));
      for (const [lx, ly] of b.lights) ctx.fillRect(b.x + lx * b.w, top + b.h * 0.35 + ly * b.h * 0.6, 3, 3);
    }

    // threats
    spawn -= dt;
    if (spawn <= 0) { threats.push(newThreat()); spawn = rand(0.45, 1.1); }
    for (const th of threats) {
      th.x += th.vx * dt; th.y += th.vy * dt;
      th.trail.push([th.x, th.y]); if (th.trail.length > 14) th.trail.shift();
      if (!th.hit && inside(th.x, th.y)) {
        th.hit = true; ripples.push({ x: th.x, y: th.y, age: 0 });
        // deflect along the outward normal
        const nx = (th.x - cx) / (R * R), ny = -(H - th.y) / (ry * ry), nl = Math.hypot(nx, ny);
        const ux = nx / nl, uy = ny / nl, dot = th.vx * ux + th.vy * uy;
        th.vx = (th.vx - 2 * dot * ux) * 0.35; th.vy = (th.vy - 2 * dot * uy) * 0.35;
      }
      if (th.hit) th.life -= dt * 1.6;
      const col = th.hit ? P.accent : P.threat;
      for (let i = 1; i < th.trail.length; i++) {
        ctx.strokeStyle = rgba(col, (i / th.trail.length) * th.life * 0.9); ctx.lineWidth = 2.2;
        ctx.beginPath(); ctx.moveTo(...th.trail[i - 1]); ctx.lineTo(...th.trail[i]); ctx.stroke();
      }
      ctx.fillStyle = rgba(th.hit ? P.text : P.threat, th.life);
      ctx.beginPath(); ctx.arc(th.x, th.y, 2.6, 0, 7); ctx.fill();
    }
    threats = threats.filter((th) => th.life > 0 && th.y < H + 50 && th.x > -100 && th.x < W + 100);

    // impact ripples
    for (const r of ripples) {
      r.age += dt;
      const a = Math.max(0, 1 - r.age / 0.9);
      ctx.strokeStyle = rgba(P.accent, a); ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(r.x, r.y, 4 + r.age * 40, 0, 7); ctx.stroke();
      ctx.fillStyle = rgba(P.text, a); ctx.beginPath(); ctx.arc(r.x, r.y, 3.5 * a, 0, 7); ctx.fill();
    }
    ripples = ripples.filter((r) => r.age < 0.9);
  },
};
