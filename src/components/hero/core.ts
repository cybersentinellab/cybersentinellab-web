// Shared canvas runner for the hero scenes.
// - DPR-aware, resizes with its container
// - pauses when off-screen or tab hidden
// - reduced motion: renders a single static frame
export type Palette = { accent: string; threat: string; text: string; muted: string; deep: string; line: string };
export type Scene = {
  init(w: number, h: number, pal: Palette): void;
  frame(ctx: CanvasRenderingContext2D, t: number, dt: number): void;
  staticTime?: number; // time (s) to render for the static frame
};

export function palette(): Palette {
  const cs = getComputedStyle(document.documentElement);
  const v = (n: string, f: string) => cs.getPropertyValue(n).trim() || f;
  return {
    accent: v('--accent', '#4fc3ff'),
    threat: v('--threat', '#ff2e3a'),
    text: v('--text', '#f2f4f8'),
    muted: v('--muted', '#8b93a7'),
    deep: v('--deep', '#0b2a4a'),
    line: 'rgba(255,255,255,0.08)',
  };
}

// '#4fc3ff' + alpha -> rgba()
export function rgba(hex: string, a: number) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.replace(/./g, (c) => c + c) : h, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

export const rand = (a: number, b: number) => a + Math.random() * (b - a);

export function run(canvas: HTMLCanvasElement, scene: Scene, reduced: boolean) {
  const ctx = canvas.getContext('2d')!;
  const pal = palette();
  let w = 0, h = 0, raf = 0, visible = true, last = 0, t = 0;

  const size = () => {
    const r = canvas.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    w = r.width; h = r.height;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    scene.init(w, h, pal);
    if (reduced) { t = scene.staticTime ?? 4; renderStatic(); }
  };
  const renderStatic = () => {
    // simulate up to staticTime so the frame looks "mid-action"
    ctx.clearRect(0, 0, w, h);
    const steps = Math.round((scene.staticTime ?? 4) * 30);
    for (let i = 0; i < steps; i++) scene.frame(ctx, i / 30, 1 / 30);
  };
  const loop = (now: number) => {
    const dt = Math.min((now - (last || now)) / 1000, 0.05);
    last = now; t += dt;
    scene.frame(ctx, t, dt);
    raf = requestAnimationFrame(loop);
  };
  const play = () => { if (!raf && visible && !document.hidden && !reduced) { last = 0; raf = requestAnimationFrame(loop); } };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };

  new ResizeObserver(() => size()).observe(canvas);
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? play() : stop(); }).observe(canvas);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : play()));
  size();
  play();
}
