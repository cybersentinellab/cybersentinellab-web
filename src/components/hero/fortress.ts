// 4. Digital fortress — binary code assembles into a shield and lock while a radar sweeps,
//    revealing (and clearing) threats around it.
import { type Scene, type Palette, rgba, rand } from './core';

type Bit = { x: number; y: number; tx: number; ty: number; d: number; ch: string; flip: number };
type Blip = { a: number; r: number; seen: number };
let W = 0, H = 0, P: Palette, cx = 0, cy = 0, S = 0, bits: Bit[] = [], blips: Blip[] = [];

function shieldPath(c: CanvasRenderingContext2D | Path2D, s: number) {
  c.moveTo(0, -s); c.lineTo(s * 0.78, -s * 0.7); c.lineTo(s * 0.78, -s * 0.05);
  c.quadraticCurveTo(s * 0.7, s * 0.7, 0, s); c.quadraticCurveTo(-s * 0.7, s * 0.7, -s * 0.78, -s * 0.05);
  c.lineTo(-s * 0.78, -s * 0.7); c.closePath();
}

function sampleTargets(s: number, step: number) {
  const off = document.createElement('canvas');
  const sz = Math.ceil(s * 2.2); off.width = off.height = sz;
  const c = off.getContext('2d')!;
  c.translate(sz / 2, sz / 2);
  c.beginPath(); shieldPath(c, s); c.lineWidth = s * 0.09; c.stroke(); // outline band
  // lock body + shackle + keyhole (punched out)
  c.fillRect(-s * 0.3, -s * 0.05, s * 0.6, s * 0.45);
  c.beginPath(); c.lineWidth = s * 0.08; c.arc(0, -s * 0.07, s * 0.2, Math.PI, 0); c.stroke();
  c.globalCompositeOperation = 'destination-out';
  c.beginPath(); c.arc(0, s * 0.12, s * 0.06, 0, 7); c.fill(); c.fillRect(-s * 0.025, s * 0.12, s * 0.05, s * 0.16);
  const data = c.getImageData(0, 0, sz, sz).data, out: [number, number][] = [];
  for (let y = 0; y < sz; y += step) for (let x = 0; x < sz; x += step) if (data[(y * sz + x) * 4 + 3] > 128) out.push([x - sz / 2, y - sz / 2]);
  return out;
}

export const scene: Scene = {
  staticTime: 5,
  init(w, h, pal) {
    W = w; H = h; P = pal;
    S = Math.min(h * 0.34, w * 0.22, 190); cx = w / 2; cy = h * 0.54;
    const step = Math.max(7, Math.round(S / 17));
    bits = sampleTargets(S, step).map(([x, y]) => ({
      x: rand(0, w), y: rand(0, h), tx: cx + x, ty: cy + y, d: rand(0, 1.6), ch: Math.random() < 0.5 ? '0' : '1', flip: rand(0, 3),
    }));
    blips = Array.from({ length: 7 }, () => ({ a: rand(0, Math.PI * 2), r: rand(S * 1.3, Math.min(S * 2.3, cy - 40)), seen: -1 }));
  },
  frame(ctx, t, dt) {
    ctx.clearRect(0, 0, W, H);
    const RR = Math.min(S * 2.5, cy - 30);
    // radar rings + cross
    ctx.strokeStyle = rgba(P.accent, 0.12); ctx.lineWidth = 1;
    for (let i = 1; i <= 4; i++) { ctx.beginPath(); ctx.arc(cx, cy, (RR / 4) * i, 0, 7); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(cx - RR, cy); ctx.lineTo(cx + RR, cy); ctx.moveTo(cx, cy - RR); ctx.lineTo(cx, cy + RR); ctx.stroke();
    // sweep wedge
    const ang = (t * 0.9) % (Math.PI * 2);
    for (let i = 0; i < 24; i++) {
      const a0 = ang - (i + 1) * 0.03, a1 = ang - i * 0.03;
      ctx.fillStyle = rgba(P.accent, 0.16 * (1 - i / 24));
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, RR, a0, a1); ctx.closePath(); ctx.fill();
    }
    ctx.strokeStyle = rgba(P.accent, 0.7); ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(ang) * RR, cy + Math.sin(ang) * RR); ctx.stroke();
    // threat blips: revealed by the sweep, then neutralised
    for (const b of blips) {
      const diff = (ang - b.a + Math.PI * 4) % (Math.PI * 2);
      if (diff < 0.06 && t > 1.5) b.seen = t;
      if (b.seen < 0) continue;
      const age = t - b.seen;
      const bx = cx + Math.cos(b.a) * b.r, by = cy + Math.sin(b.a) * b.r;
      if (age < 1.2) {
        ctx.fillStyle = rgba(P.threat, 1 - age / 1.6); ctx.beginPath(); ctx.arc(bx, by, 4, 0, 7); ctx.fill();
        ctx.strokeStyle = rgba(P.threat, 0.6 * (1 - age / 1.2)); ctx.beginPath(); ctx.arc(bx, by, 8 + age * 10, 0, 7); ctx.stroke();
      } else if (age < 2) {
        const k = (age - 1.2) / 0.8;
        ctx.strokeStyle = rgba(P.accent, 1 - k); ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(bx - 6, by - 6); ctx.lineTo(bx + 6, by + 6); ctx.moveTo(bx + 6, by - 6); ctx.lineTo(bx - 6, by + 6); ctx.stroke();
      } else { b.seen = -1; b.a = rand(0, Math.PI * 2); b.r = rand(S * 1.3, Math.min(S * 2.3, cy - 40)); }
    }
    // assembling binary
    ctx.font = `600 ${Math.max(9, S / 15)}px ui-monospace, "JetBrains Mono", monospace`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    let settled = 0;
    for (const b of bits) {
      const k = Math.min(1, Math.max(0, (t - b.d) / 1.4)), e = 1 - (1 - k) ** 3;
      const x = b.x + (b.tx - b.x) * e, y = b.y + (b.ty - b.y) * e;
      if (k >= 1) settled++;
      b.flip -= dt; if (b.flip < 0) { b.ch = b.ch === '0' ? '1' : '0'; b.flip = rand(0.4, 3); }
      ctx.fillStyle = k >= 1 ? rgba(P.accent, 0.75 + 0.25 * Math.sin(t * 3 + b.tx)) : rgba(P.accent, 0.25 + 0.5 * e);
      ctx.fillText(b.ch, x, y);
    }
    // glow once assembled
    if (settled > bits.length * 0.9) {
      const g = Math.min(1, (t - 3) / 1.2);
      ctx.save(); ctx.translate(cx, cy);
      ctx.strokeStyle = rgba(P.accent, 0.6 * g); ctx.lineWidth = 2; ctx.shadowColor = P.accent; ctx.shadowBlur = 24 * g;
      ctx.beginPath(); shieldPath(ctx, S * 1.12); ctx.stroke(); ctx.restore();
    }
  },
};
