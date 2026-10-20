// 3. Network constellation — red intrusion packets travel the mesh, are detected by
//    sentinel nodes, isolated (links cut) and neutralised.
import { type Scene, type Palette, rgba, rand } from './core';

type Node = { x: number; y: number; vx: number; vy: number; sentinel: boolean; state: number; isoT: number };
type Pkt = { a: number; b: number; p: number; hops: number; dead: number };
let W = 0, H = 0, P: Palette, nodes: Node[] = [], pkts: Pkt[] = [], spawn = 0, LINK = 140;

const dist = (a: Node, b: Node) => Math.hypot(a.x - b.x, a.y - b.y);
function neighbours(i: number) {
  const out: number[] = [];
  nodes.forEach((n, j) => { if (j !== i && nodes[i].state === 0 && n.state === 0 && dist(nodes[i], n) < LINK) out.push(j); });
  return out;
}

export const scene: Scene = {
  staticTime: 4,
  init(w, h, pal) {
    W = w; H = h; P = pal;
    LINK = Math.max(110, Math.min(170, w / 9));
    const n = Math.round(Math.min(90, (w * h) / 9000));
    nodes = Array.from({ length: n }, (_, i) => ({
      x: rand(0, w), y: rand(h * 0.08, h), vx: rand(-6, 6), vy: rand(-4, 4), sentinel: i % 9 === 0, state: 0, isoT: 0,
    }));
    pkts = []; spawn = 0;
  },
  frame(ctx, t, dt) {
    ctx.clearRect(0, 0, W, H);
    for (const n of nodes) {
      n.x += n.vx * dt; n.y += n.vy * dt;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < H * 0.05 || n.y > H) n.vy *= -1;
      if (n.state === 1) { n.isoT += dt; if (n.isoT > 2.2) { n.state = 0; n.isoT = 0; } }
    }
    // links
    ctx.lineWidth = 1;
    for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i], b = nodes[j], d = dist(a, b);
      if (d > LINK) continue;
      const iso = a.state || b.state;
      ctx.strokeStyle = iso ? rgba(P.threat, 0.08 * (1 - d / LINK)) : rgba(P.accent, 0.28 * (1 - d / LINK));
      if (iso) ctx.setLineDash([3, 5]);
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      if (iso) ctx.setLineDash([]);
    }
    // packets
    spawn -= dt;
    if (spawn <= 0 && pkts.length < 6) {
      const edge = nodes.map((n, i) => [n, i] as const).filter(([n]) => n.x < W * 0.15 || n.x > W * 0.85);
      const s = edge[(Math.random() * edge.length) | 0]?.[1];
      const nb = s != null ? neighbours(s) : [];
      if (nb.length) pkts.push({ a: s!, b: nb[(Math.random() * nb.length) | 0], p: 0, hops: 0, dead: 0 });
      spawn = rand(0.6, 1.2);
    }
    for (const k of pkts) {
      const A = nodes[k.a], B = nodes[k.b];
      if (k.dead > 0) { k.dead += dt; }
      else {
        k.p += dt * 1.4;
        if (k.p >= 1) {
          k.hops++;
          if (B.sentinel || k.hops > 5) { k.dead = 0.001; A.state = 1; A.isoT = 0; }
          else {
            const nb = neighbours(k.b).filter((j) => j !== k.a);
            // bias towards sentinels so detections are visible
            const sent = nb.filter((j) => nodes[j].sentinel);
            const pick = sent.length && Math.random() < 0.6 ? sent : nb;
            if (!pick.length) k.dead = 0.001; else { k.a = k.b; k.b = pick[(Math.random() * pick.length) | 0]; k.p = 0; }
          }
        }
      }
      const x = A.x + (B.x - A.x) * Math.min(k.p, 1), y = A.y + (B.y - A.y) * Math.min(k.p, 1);
      if (k.dead === 0) {
        ctx.strokeStyle = rgba(P.threat, 0.9); ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(x, y); ctx.stroke();
        ctx.fillStyle = P.threat; ctx.shadowColor = P.threat; ctx.shadowBlur = 12;
        ctx.beginPath(); ctx.arc(x, y, 3.2, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
      } else { // neutralised: cyan burst at the sentinel
        const a = Math.max(0, 1 - k.dead / 0.9);
        ctx.strokeStyle = rgba(P.accent, a); ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(B.x, B.y, 6 + k.dead * 36, 0, 7); ctx.stroke();
        ctx.strokeStyle = rgba(P.accent, a * 0.6);
        for (let i = 0; i < 6; i++) { const ang = (i / 6) * Math.PI * 2; const r0 = 6 + k.dead * 20, r1 = r0 + 8; ctx.beginPath(); ctx.moveTo(B.x + Math.cos(ang) * r0, B.y + Math.sin(ang) * r0); ctx.lineTo(B.x + Math.cos(ang) * r1, B.y + Math.sin(ang) * r1); ctx.stroke(); }
      }
    }
    pkts = pkts.filter((k) => k.dead < 0.9);
    // nodes
    for (const n of nodes) {
      if (n.sentinel) {
        ctx.strokeStyle = rgba(P.accent, 0.5 + 0.3 * Math.sin(t * 2.5 + n.x)); ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(n.x, n.y, 9, 0, 7); ctx.stroke();
        ctx.fillStyle = P.accent; ctx.beginPath(); ctx.arc(n.x, n.y, 3.6, 0, 7); ctx.fill();
      } else if (n.state === 1) {
        ctx.strokeStyle = rgba('#ffc636', Math.max(0, 1 - n.isoT / 2.2)); ctx.lineWidth = 1;
        ctx.strokeRect(n.x - 7, n.y - 7, 14, 14);
        ctx.fillStyle = rgba(P.threat, 0.8); ctx.beginPath(); ctx.arc(n.x, n.y, 2.4, 0, 7); ctx.fill();
      } else {
        ctx.fillStyle = rgba('#a9d8ff', 0.75); ctx.beginPath(); ctx.arc(n.x, n.y, 2, 0, 7); ctx.fill();
      }
    }
  },
};
