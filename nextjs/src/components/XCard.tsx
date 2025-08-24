import Image from "next/image";

export function XCard() {
  // Deterministic OHLC generator so candles form a sensible market-like series
  type Candle = { x: number; open: number; close: number; high: number; low: number };
  const createSeededRandom = (seed: number) => {
    let s = seed;
    return () => {
      s = Math.sin(s) * 10000;
      return s - Math.floor(s);
    };
  };
  const clamp01 = (v: number) => Math.max(0.02, Math.min(0.98, v));
  const rng = createSeededRandom(2025);
  const tileWidth = 6000;
  const tileHeight = 750;
  const leftPadding = 8;
  const step = 6; // horizontal spacing between candles (much denser)
  const bodyWidth = 4;
  const topMargin = 40;
  const bottomMargin = 40;
  const drawableHeight = tileHeight - topMargin - bottomMargin; // 670
  const toY = (v: number) => topMargin + (1 - v) * drawableHeight;

  const candles: Candle[] = [];
  const count = Math.floor((tileWidth - leftPadding * 2) / step);
  let price = 0.58; // start slightly above mid
  for (let i = 0; i < count; i++) {
    let drift = (rng() - 0.5) * 0.1; // gentle random walk
    // occasional larger moves to create spikes/dips
    if (i % 9 === 0) drift += (rng() < 0.5 ? -1 : 1) * (0.18 + rng() * 0.18);
    const open = clamp01(price);
    const close = clamp01(open + drift + (rng() - 0.5) * 0.06);
    // high/low with realistic tails around body
    const bodyMax = Math.max(open, close);
    const bodyMin = Math.min(open, close);
    const high = clamp01(bodyMax + 0.02 + rng() * 0.08);
    const low = clamp01(bodyMin - 0.02 - rng() * 0.08);
    price = close;
    candles.push({ x: leftPadding + i * step, open, close, high, low });
  }

  return (
    <a
      href="https://x.com/griffinodow"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="X profile @griffinodow"
      className="group relative overflow-hidden rounded-3xl border border-black/15 dark:border-white/20 aspect-[16/10] bg-neutral-950 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 transition-transform transition-shadow duration-300 ease-out will-change-transform hover:scale-[1.02] sm:hover:scale-[1.03] hover:border-white/25 dark:hover:border-white/30 hover:shadow-[0_0_12px_rgba(255,255,255,0.10)] motion-reduce:transition-none motion-reduce:hover:scale-100"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-800" />
      <div className="absolute -top-16 -left-24 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,rgba(110,57,219,0.35),transparent_60%)] blur-2xl" />
      <div className="absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.35),transparent_60%)] blur-2xl" />
      <svg className="absolute inset-0" viewBox="0 0 1200 750" aria-hidden shapeRendering="geometricPrecision">
        <defs>
          {/* grid pattern */}
          <pattern id="grid" width="180" height="180" patternUnits="userSpaceOnUse">
            <path d="M 180 0 L 0 0 0 180" fill="none" stroke="#ffffff" strokeOpacity="0.06" strokeWidth="1.2" />
          </pattern>

          {/* glow + fade */}
          <filter id="bizGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.0" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="fadeYBiz" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="15%" stopColor="white" stopOpacity="1" />
            <stop offset="85%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <mask id="fadeMaskBiz">
            <rect x="0" y="0" width="1200" height="750" fill="url(#fadeYBiz)" />
          </mask>

          {/* trend gradient */}
          <linearGradient id="trend" x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#60a5fa" stopOpacity="0.5" />
            <stop offset="0.5" stopColor="#22c55e" stopOpacity="0.7" />
            <stop offset="1" stopColor="#60a5fa" stopOpacity="0.5" />
          </linearGradient>

          {/* subtle soften filter to reduce aliasing on moving candles */}
          <filter id="softenCandles" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.35" />
          </filter>

          {/* single primary scrolling candlestick layer */}
          <pattern id="candleTileFg" x="0" y="0" width="6000" height="750" patternUnits="userSpaceOnUse" patternTransform="rotate(0 0 0)">
            <animateTransform attributeName="patternTransform" type="translate" from="0 0" to="-6000 0" dur="180s" repeatCount="indefinite" additive="sum" />
            <g opacity="1" filter="url(#softenCandles)">
              {/* Procedural candles from seeded OHLC series */}
              {candles.map((c, i) => {
                const yOpen = toY(c.open);
                const yClose = toY(c.close);
                const yHigh = toY(c.high);
                const yLow = toY(c.low);
                const yBody = Math.min(yOpen, yClose);
                const hBody = Math.max(2, Math.abs(yClose - yOpen));
                const isUp = c.close >= c.open;
                return (
                  <g key={`c${i}`} transform={`translate(${c.x} 0)`}>
                    <line x1={0} y1={yHigh} x2={0} y2={yLow} stroke="#ffffff" strokeOpacity="0.35" strokeWidth={1.2} />
                    <rect x={-bodyWidth / 2} y={yBody} width={bodyWidth} height={hBody} rx={2} fill={isUp ? "#22c55e" : "#ef4444"} />
                  </g>
                );
              })}
            </g>
          </pattern>
        </defs>

        <g mask="url(#fadeMaskBiz)">
          {/* grid */}
          <rect x="0" y="0" width="1200" height="750" fill="url(#grid)" />
          {/* scrolling candles */}
          <rect x="0" y="0" width="1200" height="750" fill="url(#candleTileFg)" />
        </g>
      </svg>
      {/* centered overlay: blurred background behind label */}
      <div
        className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center backdrop-blur-[2px]"
        aria-hidden
      >
        <div className="px-3 py-1.5 sm:px-4 sm:py-2 md:px-4 md:py-2 rounded-full bg-white/5">
          <span className="text-center font-bold uppercase tracking-wide text-white/90 text-xl sm:text-2xl md:text-2xl lg:text-4xl">
            thoughts
          </span>
        </div>
      </div>
      <div className="absolute right-4 bottom-4 sm:right-5 sm:bottom-5 md:right-6 md:bottom-6 lg:right-7 lg:bottom-7 z-20 w-10 h-10 sm:w-12 sm:h-12 md:w-12 md:h-12 lg:w-[72px] lg:h-[72px] opacity-90">
        <Image src="/assets/x.svg" alt="X logo" fill sizes="(min-width: 1024px) 72px, (min-width: 768px) 48px, (min-width: 640px) 48px, 40px" className="invert brightness-0" />
      </div>
      <div className="absolute left-5 top-5 text-white drop-shadow z-20">
        <div className="text-lg sm:text-xl font-semibold">X</div>
        <div className="text-[13px] sm:text-sm text-white/80">@griffinodow</div>
      </div>
    </a>
  );
}


