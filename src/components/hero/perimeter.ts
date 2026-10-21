// v2 hero — "Perimeter".
// The logo's three-segment triangle (Assess = yellow, Protect = pink, Respond = red)
// draws itself in, then acts as a live perimeter around an organisation's assets.
// Incoming threats are caught on the segment they hit and neutralised.
import type { Scene } from './core';

type V = { x: number; y: number };
type Threat = { x: number; y: number; vx: number; vy: number; caught: number; seg: number; trail: V[] };
type Burst = { x: number; y: number; age: number; seg: number };

let W = 0, H = 0, A: V, B: V, C: V, G: V, band = 0, size = 0;
let COLORS: string[] = [], INK = '#13221a', GREEN = '#40870a', LINE = '#d8e0d6';
let assets: (V & { ph: number; hot: boolean })[] = [], threats: Threat[] = [], bursts: Burst[] = [], spawn = 0;
let flash = [0, 0, 0];

// Perimeter parameter p in [0,3): edge 0 = A→C (right), 1 = C→B (bottom), 2 = B→A (left)
const EDGES = () => [[A, C], [C, B], [B, A]] as const;
const SEGS: [number, number][] = [[2.56, 3.5], [0.56, 1.47], [1.54, 2.5]]; // yellow (wraps over apex), red, pink
const SEG_COLOR = [0, 2, 1]; // index into COLORS [assess, protect, respond] → yellow, red, pink
const lerp = (a: V, b: V, t: number): V => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
function at(p: number): V {
  const q = ((p % 3) + 3) % 3, i = Math.floor(q), e = EDGES()[i];
  return lerp(e[0], e[1], q - i);
}
function segPath(ctx: CanvasRenderingContext2D, from: number, to: number) {
  ctx.beginPath();
  const s = at(from); ctx.moveTo(s.x, s.y);
  for (let k = Math.floor(from) + 1; k < to; k++) { const v = at(k); ctx.lineTo(v.x, v.y); }
  const e = at(to); ctx.lineTo(e.x, e.y);
}
// Which segment does perimeter parameter p belong to?
function segOf(p: number) {
  const q = ((p % 3) + 3) % 3;
  if (q >= 0.53 && q < 1.505) return 1;
  if (q >= 1.505 && q < 2.53) return 2;
  return 0;
}
const cross = (o: V, a: V, b: V) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
function inside(p: V, pad = 0) {
  // shrink-free test against triangle expanded by pad (approx via centroid scaling)
  const k = 1 + pad / size;
  const a = lerp(G, A, k), b = lerp(G, B, k), c = lerp(G, C, k);
  const d1 = cross(a, c, p), d2 = cross(c, b, p), d3 = cross(b, a, p);
  return (d1 >= 0 && d2 >= 0 && d3 >= 0) || (d1 <= 0 && d2 <= 0 && d3 <= 0);
}
// Nearest perimeter parameter to point p
function nearestP(p: V) {
  let best = 0, bd = Infinity;
  EDGES().forEach(([a, b], i) => {
    const dx = b.x - a.x, dy = b.y - a.y, t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy)));
    const q = lerp(a, b, t), d = (q.x - p.x) ** 2 + (q.y - p.y) ** 2;
    if (d < bd) { bd = d; best = i + t; }
  });
  return best;
}
function rgba(hex: string, a: number) {
  const n = parseInt(hex.replace('#', ''), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

function newThreat(): Threat {
  const ang = Math.random() * Math.PI * 2, r = Math.max(W, H) * 0.58;
  const x = G.x + Math.cos(ang) * r, y = G.y + Math.sin(ang) * r;
  const tx = G.x + (Math.random() - 0.5) * size * 0.3, ty = G.y + (Math.random() - 0.5) * size * 0.3;
  const d = Math.hypot(tx - x, ty - y), sp = 90 + Math.random() * 70;
  return { x, y, vx: ((tx - x) / d) * sp, vy: ((ty - y) / d) * sp, caught: 0, seg: -1, trail: [] };
}

export const scene: Scene = {
  staticTime: 6,
  init(w, h) {
    W = w; H = h;
    const cs = getComputedStyle(document.documentElement), v = (n: string, f: string) => cs.getPropertyValue(n).trim() || f;
    COLORS = [v('--assess', '#ffc636'), v('--protect', '#ff45a5'), v('--respond', '#ff2e3a')];
    INK = v('--ink', INK); GREEN = v('--green', GREEN); LINE = v('--line', LINE);
    size = Math.min(w * 0.82, h * 0.86 / 0.866);
    const top = (h - size * 0.866) / 2 + size * 0.02;
    A = { x: w / 2, y: top }; B = { x: w / 2 - size / 2, y: top + size * 0.866 }; C = { x: w / 2 + size / 2, y: top + size * 0.866 };
    G = { x: (A.x + B.x + C.x) / 3, y: (A.y + B.y + C.y) / 3 };
    band = Math.max(10, size * 0.07);
    // assets: a dot grid clipped to the inner triangle
    assets = [];
    const step = Math.max(12, size / 17);
    for (let y = A.y; y < B.y; y += step) for (let x = B.x; x < C.x; x += step) {
      const p = { x, y };
      const inner = { x: G.x + (x - G.x) / 0.6, y: G.y + (y - G.y) / 0.6 };
      if (inside(inner)) assets.push({ ...p, ph: Math.random() * 6.28, hot: Math.random() < 0.12 });
    }
    threats = []; bursts = []; spawn = 0.8; flash = [0, 0, 0];
  },
  frame(ctx, t, dt) {
    ctx.clearRect(0, 0, W, H);
    // zones: faint outer triangles
    ctx.setLineDash([2, 7]); ctx.lineWidth = 1; ctx.strokeStyle = LINE;
    for (const k of [1.32, 1.66]) {
      ctx.beginPath(); const a = lerp(G, A, k), b = lerp(G, B, k), c = lerp(G, C, k);
      ctx.moveTo(a.x, a.y); ctx.lineTo(c.x, c.y); ctx.lineTo(b.x, b.y); ctx.closePath(); ctx.stroke();
    }
    ctx.setLineDash([]);

    // assets
    const scan = (t * 0.35) % 1; // scan ring travelling outward from centroid
    for (const a of assets) {
      const d = Math.hypot(a.x - G.x, a.y - G.y) / (size * 0.5);
      const lit = Math.max(0, 1 - Math.abs(d - scan) * 6);
      ctx.fillStyle = a.hot ? rgba(GREEN, 0.55 + 0.45 * lit) : rgba(INK, 0.26 + 0.5 * lit);
      const s = a.hot ? 5 : 3.2;
      ctx.fillRect(a.x - s / 2, a.y - s / 2, s, s);
    }

    // perimeter segments draw in, in order: yellow, pink, red
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const order = [0, 2, 1];
    order.forEach((si, n) => {
      const k = Math.max(0, Math.min(1, (t - 0.15 - n * 0.28) / 0.8));
      if (k <= 0) return;
      const e = 1 - (1 - k) ** 3, [from, to] = SEGS[si];
      const col = COLORS[SEG_COLOR[si]];
      segPath(ctx, from, from + (to - from) * e);
      ctx.lineWidth = band; ctx.strokeStyle = col; ctx.stroke();
      if (flash[si] > 0) { ctx.lineWidth = band + 10 * flash[si]; ctx.strokeStyle = rgba(col, 0.25 * flash[si]); ctx.stroke(); }
    });
    flash = flash.map((f) => Math.max(0, f - dt * 2.2));

    // threats begin once the perimeter is up
    if (t > 1.4) {
      spawn -= dt;
      if (spawn <= 0) { threats.push(newThreat()); spawn = 0.25 + Math.random() * 0.45; }
    }
    for (const th of threats) {
      if (!th.caught) {
        th.x += th.vx * dt; th.y += th.vy * dt;
        th.trail.push({ x: th.x, y: th.y }); if (th.trail.length > 18) th.trail.shift();
        if (inside(th, band * 0.5)) {
          th.caught = 0.001; th.seg = segOf(nearestP(th));
          bursts.push({ x: th.x, y: th.y, age: 0, seg: th.seg });
          flash[th.seg] = 1;
        }
      } else th.caught += dt;
      const fade = th.caught ? Math.max(0, 1 - th.caught * 2.5) : 1;
      for (let i = 1; i < th.trail.length; i++) {
        ctx.strokeStyle = rgba(INK, (i / th.trail.length) * 0.35 * fade); ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(th.trail[i - 1].x, th.trail[i - 1].y); ctx.lineTo(th.trail[i].x, th.trail[i].y); ctx.stroke();
      }
      ctx.fillStyle = rgba(INK, 0.8 * fade);
      ctx.fillRect(th.x - 2.5, th.y - 2.5, 5, 5);
    }
    threats = threats.filter((th) => th.caught < 0.4);

    for (const b of bursts) {
      b.age += dt;
      const a = Math.max(0, 1 - b.age / 0.7), col = COLORS[SEG_COLOR[b.seg]];
      ctx.strokeStyle = rgba(col, a); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(b.x, b.y, 4 + b.age * 34, 0, Math.PI * 2); ctx.stroke();
    }
    bursts = bursts.filter((b) => b.age < 0.7);
  },
};
