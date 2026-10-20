// 2. Rotating globe — attacks from around the world intercepted at the CSL shield (UAE),
//    with Europe and GCC nodes highlighted.
import { type Scene, type Palette, rgba, rand } from './core';

const D = Math.PI / 180;
// [lat, lon]
const UAE: [number, number] = [25.2, 55.3];
const NODES: { ll: [number, number]; label: string }[] = [
  { ll: UAE, label: 'UAE · HQ' },
  { ll: [56, 10], label: 'EUROPE' },
  { ll: [24.7, 46.7], label: 'GCC' },
  { ll: [15.5, 74], label: 'INDIA' },
];
const SOURCES: [number, number][] = [[40, -100], [55, 37], [35, 105], [-15, -55], [50, 0], [5, 20], [-30, 135], [60, 90], [20, -10], [-5, 110]];

type Atk = { from: [number, number]; p: number; sp: number; done: number };
let W = 0, H = 0, P: Palette, cx = 0, cy = 0, R = 0;
let dots: [number, number][] = [], atks: Atk[] = [], spawn = 0, rot = 0;

// orthographic projection; lon rotated so UAE faces viewer slightly right of centre
function proj(lat: number, lon: number) {
  const la = lat * D, lo = (lon - rot) * D, tilt = -18 * D;
  let x = Math.cos(la) * Math.sin(lo), y = Math.sin(la), z = Math.cos(la) * Math.cos(lo);
  const y2 = y * Math.cos(tilt) - z * Math.sin(tilt), z2 = y * Math.sin(tilt) + z * Math.cos(tilt);
  return { x: cx + x * R, y: cy - y2 * R, z: z2 };
}
// great-circle interpolation
function slerp(a: [number, number], b: [number, number], t: number): [number, number] {
  const v = (ll: [number, number]) => [Math.cos(ll[0] * D) * Math.cos(ll[1] * D), Math.cos(ll[0] * D) * Math.sin(ll[1] * D), Math.sin(ll[0] * D)];
  const p = v(a), q = v(b), dot = Math.min(1, p[0] * q[0] + p[1] * q[1] + p[2] * q[2]), om = Math.acos(dot);
  if (om < 1e-4) return a;
  const s1 = Math.sin((1 - t) * om) / Math.sin(om), s2 = Math.sin(t * om) / Math.sin(om);
  const r = [p[0] * s1 + q[0] * s2, p[1] * s1 + q[1] * s2, p[2] * s1 + q[2] * s2];
  return [Math.asin(r[2]) / D, Math.atan2(r[1], r[0]) / D];
}

export const scene: Scene = {
  staticTime: 3.5,
  init(w, h, pal) {
    W = w; H = h; P = pal;
    R = Math.min(w * 0.3, h * 1.05, 520); cx = w / 2; cy = h + R * 0.28;
    dots = [];
    const n = 1400, g = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < n; i++) {
      const y = 1 - (i / (n - 1)) * 2, r = Math.sqrt(1 - y * y), th = g * i;
      dots.push([Math.asin(y) / D, Math.atan2(Math.sin(th) * r, Math.cos(th) * r) / D]);
    }
    atks = []; spawn = 0; rot = 40;
  },
  frame(ctx, t, dt) {
    ctx.clearRect(0, 0, W, H);
    rot = 40 + Math.sin(t * 0.08) * 14;
    // halo + sphere
    const halo = ctx.createRadialGradient(cx, cy, R * 0.9, cx, cy, R * 1.3);
    halo.addColorStop(0, rgba(P.accent, 0.18)); halo.addColorStop(1, rgba(P.accent, 0));
    ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(cx, cy, R * 1.3, 0, 7); ctx.fill();
    const sg = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.4, R * 0.1, cx, cy, R);
    sg.addColorStop(0, rgba(P.accent, 0.28)); sg.addColorStop(0.5, P.deep); sg.addColorStop(1, '#05070d');
    ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fill();
    ctx.strokeStyle = rgba(P.accent, 0.5); ctx.lineWidth = 1.2; ctx.stroke();
    // dots
    for (const [la, lo] of dots) {
      const p = proj(la, lo);
      if (p.z <= 0) continue;
      ctx.fillStyle = rgba('#7fc8ff', 0.12 + p.z * 0.35);
      ctx.fillRect(p.x, p.y, 1.6, 1.6);
    }
    // attacks
    spawn -= dt;
    if (spawn <= 0) { atks.push({ from: SOURCES[(Math.random() * SOURCES.length) | 0], p: 0, sp: rand(0.28, 0.45), done: 0 }); spawn = rand(0.5, 1); }
    const u = proj(...UAE);
    for (const a of atks) {
      if (a.p < 0.86) a.p = Math.min(0.86, a.p + a.sp * dt); else a.done += dt;
      const N = 36;
      for (let i = 0; i < N; i++) {
        const t0 = (i / N) * a.p, t1 = ((i + 1) / N) * a.p;
        const ll0 = slerp(a.from, UAE, t0), ll1 = slerp(a.from, UAE, t1);
        const lift = (q: number) => 1 + Math.sin(q * Math.PI) * 0.22;
        const p0 = proj(...ll0), p1 = proj(...ll1);
        if (p0.z < -0.05 || p1.z < -0.05) continue;
        const x0 = cx + (p0.x - cx) * lift(t0), y0 = cy + (p0.y - cy) * lift(t0);
        const x1 = cx + (p1.x - cx) * lift(t1), y1 = cy + (p1.y - cy) * lift(t1);
        const fade = (i / N) * Math.max(0, 1 - a.done * 1.5);
        ctx.strokeStyle = rgba(P.threat, fade * 0.9); ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
        if (i === N - 1 && a.done === 0) { ctx.fillStyle = P.threat; ctx.beginPath(); ctx.arc(x1, y1, 2.8, 0, 7); ctx.fill(); }
      }
      if (a.done > 0) { // interception burst at the shield ring
        const k = a.done / 0.7;
        ctx.strokeStyle = rgba(P.accent, Math.max(0, 1 - k)); ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(u.x, u.y, 34 + k * 30, 0, 7); ctx.stroke();
      }
    }
    atks = atks.filter((a) => a.done < 0.7);
    // nodes
    for (const n of NODES) {
      const p = proj(...n.ll);
      if (p.z <= 0) continue;
      const hq = n.ll === UAE;
      ctx.fillStyle = hq ? P.accent : rgba(P.accent, 0.8);
      ctx.beginPath(); ctx.arc(p.x, p.y, hq ? 4 : 3, 0, 7); ctx.fill();
      ctx.strokeStyle = rgba(P.accent, 0.35 + 0.25 * Math.sin(t * 3)); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(p.x, p.y, hq ? 34 : 9 + 3 * Math.sin(t * 2), 0, 7); ctx.stroke();
      ctx.font = '600 10px "Inter Variable", sans-serif'; ctx.fillStyle = rgba(P.text, 0.75);
      ctx.fillText(n.label, p.x + (hq ? 40 : 12), p.y + 4);
    }
    // shield glyph at HQ
    ctx.save(); ctx.translate(u.x, u.y - 1);
    ctx.fillStyle = '#06070c'; ctx.strokeStyle = P.accent; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, -14); ctx.lineTo(11, -10); ctx.lineTo(11, -2); ctx.quadraticCurveTo(10, 9, 0, 14); ctx.quadraticCurveTo(-10, 9, -11, -2); ctx.lineTo(-11, -10); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-5, 0); ctx.lineTo(-1, 4); ctx.lineTo(6, -4); ctx.stroke();
    ctx.restore();
  },
};
