import Image from "next/image";

export function LinkedInCard() {
  // Deterministic seeded layout for organic clusters (SSR/CSR safe)
  type Node = { x: number; y: number; clusterIndex: number };
  const createSeededRandom = (seed: number) => {
    let s = seed;
    return () => {
      s = Math.sin(s) * 10000;
      return s - Math.floor(s);
    };
  };
  const rng = createSeededRandom(42);
  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

  const clusterCenters = [
    { x: 180, y: 130 },
    { x: 560, y: 420 },
    { x: 980, y: 180 },
    { x: 980, y: 600 },
  ];
  const clusterCounts = [10, 11, 9, 9];

  const nodes: Node[] = [];
  clusterCenters.forEach((center, clusterIndex) => {
    const count = clusterCounts[clusterIndex];
    for (let i = 0; i < count; i++) {
      const angle = rng() * Math.PI * 2;
      const radialBase = 90 + rng() * 160; // spread clusters wider
      const xStretch = 0.9 + rng() * 0.9;
      const yStretch = 0.9 + rng() * 0.9;
      const jitterX = (rng() - 0.5) * 24;
      const jitterY = (rng() - 0.5) * 24;
      const x = center.x + Math.cos(angle) * radialBase * xStretch + jitterX;
      const y = center.y + Math.sin(angle) * radialBase * yStretch + jitterY;
      nodes.push({
        x: clamp(x, 24, 1176),
        y: clamp(y, 24, 726),
        clusterIndex,
      });
    }
  });

  // Build edges: nearest-neighbor inside clusters + a few inter-cluster links
  const edges: Array<{ a: number; b: number; weight: number }>= [];
  const indexByCluster: Record<number, number[]> = {};
  nodes.forEach((_, idx) => {
    const c = nodes[idx].clusterIndex;
    (indexByCluster[c] ||= []).push(idx);
  });

  const distance = (i: number, j: number) => {
    const dx = nodes[i].x - nodes[j].x;
    const dy = nodes[i].y - nodes[j].y;
    return Math.hypot(dx, dy);
  };

  // Intra-cluster kNN
  Object.keys(indexByCluster).forEach((key) => {
    const idxs = indexByCluster[+key];
    idxs.forEach((i) => {
      const candidates = idxs
        .filter((j) => j !== i)
        .map((j) => ({ j, d: distance(i, j) }))
        .sort((a, b) => a.d - b.d)
        .slice(0, 2 + Math.floor(rng() * 2)); // 2-3 neighbors to reduce clutter
      candidates.forEach(({ j }, rank) => {
        const a = Math.min(i, j);
        const b = Math.max(i, j);
        if (!edges.find((e) => e.a === a && e.b === b)) {
          edges.push({ a, b, weight: 0.9 - rank * 0.15 });
        }
      });
    });
  });

  // Inter-cluster bridges
  for (let k = 0; k < 6; k++) {
    const c1 = Math.floor(rng() * clusterCenters.length);
    let c2 = Math.floor(rng() * clusterCenters.length);
    if (c2 === c1) c2 = (c1 + 1) % clusterCenters.length;
    const i = indexByCluster[c1][Math.floor(rng() * indexByCluster[c1].length)];
    const j = indexByCluster[c2][Math.floor(rng() * indexByCluster[c2].length)];
    const a = Math.min(i, j);
    const b = Math.max(i, j);
    if (!edges.find((e) => e.a === a && e.b === b)) {
      edges.push({ a, b, weight: 1 });
    }
  }

  return (
    <a
      href="https://www.linkedin.com/in/griffinodow/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="LinkedIn profile"
      className="group relative overflow-hidden rounded-3xl border border-black/15 dark:border-white/20 aspect-[16/10] bg-neutral-950 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 transition-transform transition-shadow duration-300 ease-out will-change-transform hover:scale-[1.02] sm:hover:scale-[1.025] hover:border-white/25 dark:hover:border-white/30 hover:shadow-[0_0_12px_rgba(255,255,255,0.10)] motion-reduce:transition-none motion-reduce:hover:scale-100"
    >
      
      {/* Subtle radial accents in brand hues */}
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(125,211,252,0.20),transparent_65%)] blur-2xl" />
      <div className="absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,rgba(165,180,252,0.18),transparent_65%)] blur-2xl" />

      {/* Social network graph */}
      <svg className="absolute inset-0 blur-[0.25px]" viewBox="0 0 1200 750" aria-hidden>
        <defs>
          <linearGradient id="liStroke" x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#38bdf8" stopOpacity="0.6" />
            <stop offset="0.5" stopColor="#6366f1" stopOpacity="0.6" />
            <stop offset="1" stopColor="#a855f7" stopOpacity="0.6" />
          </linearGradient>
          <filter id="liGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.9" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="fadeY" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="15%" stopColor="white" stopOpacity="1" />
            <stop offset="85%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <mask id="fadeMaskY">
            <rect x="0" y="0" width="1200" height="750" fill="url(#fadeY)" />
          </mask>
          <style>
            {`
              @keyframes dashShift { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -80; } }
              .dash-anim { stroke-dasharray: 3 10; animation: dashShift 9s linear infinite; }
            `}
          </style>
        </defs>

        <g mask="url(#fadeMaskY)" transform="translate(600 375) scale(1.5) translate(-600 -375)">
          {/* Straight edges */}
          {edges.map((edge, i) => {
            const a = edge.a; const b = edge.b;
            const n1 = nodes[a];
            const n2 = nodes[b];
            const width = 1.1 + edge.weight * 1.2;
            return (
              <line
                key={`e${i}`}
                x1={n1.x}
                y1={n1.y}
                x2={n2.x}
                y2={n2.y}
                stroke="url(#liStroke)"
                strokeWidth={width}
                opacity="0.6"
                className="dash-anim"
                filter="url(#liGlow)"
              >
                <animate attributeName="opacity" values="0.35;0.7;0.35" dur="7.2s" begin={`${(i % 9) * 0.25}s`} repeatCount="indefinite" />
              </line>
            );
          })}

          {/* nodes */}
          {nodes.map((n, i) => {
            const baseR = 2.6 + (n.clusterIndex * 0.2) + (i % 3) * 0.25;
            return (
              <circle key={`n${i}`} cx={n.x} cy={n.y} r={baseR} fill="#60a5fa" opacity="0.9" filter="url(#liGlow)">
                <animate attributeName="r" values={`${baseR};${baseR + 1};${baseR}`} dur={`${2.8 + (i % 5) * 0.2}s`} begin={`${(i % 7) * 0.18}s`} repeatCount="indefinite" />
              </circle>
            );
          })}

          {/* emphasize cluster centers as hubs */}
          {clusterCenters.map((c, idx) => (
            <g key={`hub${idx}`}>
              <circle cx={c.x} cy={c.y} r="5.5" fill="#93c5fd" opacity="0.95" filter="url(#liGlow)" />
              <circle cx={c.x} cy={c.y} r="10" fill="none" stroke="#93c5fd" strokeOpacity="0.35" />
            </g>
          ))}
        </g>
      </svg>
      {/* centered overlay: blurred background behind label */}
      <div
        className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center backdrop-blur-[2px]"
        aria-hidden
      >
        <div className="px-3 py-1.5 sm:px-4 sm:py-2 md:px-4 md:py-2 rounded-full bg-white/5">
          <span className="text-center font-bold uppercase tracking-wide text-white/90 text-xl sm:text-2xl md:text-2xl lg:text-4xl">
            connections
          </span>
        </div>
      </div>

      <div className="absolute right-4 bottom-4 sm:right-5 sm:bottom-5 md:right-6 md:bottom-6 lg:right-7 lg:bottom-7 z-20 w-10 h-10 sm:w-12 sm:h-12 md:w-12 md:h-12 lg:w-[72px] lg:h-[72px] opacity-90">
        <Image src="/assets/linkedin.svg" alt="LinkedIn logo" fill sizes="(min-width: 1024px) 72px, (min-width: 768px) 48px, (min-width: 640px) 48px, 40px" className="invert brightness-0" />
      </div>
      <div className="absolute left-5 top-5 text-white drop-shadow z-20">
        <div className="text-lg sm:text-xl font-semibold">LinkedIn</div>
        <div className="text-[13px] sm:text-sm text-white/80">linkedin.com/in/griffinodow</div>
      </div>
    </a>
  );
}


