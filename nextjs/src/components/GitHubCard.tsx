import Image from "next/image";

export function GitHubCard() {
  return (
    <a
      href="https://github.com/griffindow"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="GitHub profile"
      className="group relative overflow-hidden rounded-3xl border border-black/15 dark:border-white/20 aspect-[16/10] bg-neutral-950 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 transition-transform transition-shadow duration-300 ease-out will-change-transform hover:scale-[1.02] sm:hover:scale-[1.025] hover:border-white/25 dark:hover:border-white/30 hover:shadow-[0_0_12px_rgba(255,255,255,0.10)] motion-reduce:transition-none motion-reduce:hover:scale-100"
    >
      {/* faint radial glow */}
      <div className="absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.22),transparent_70%)] blur-3xl" />

      {/* LONG VERTICAL GIT GRAPH with overscan to prevent edge clipping */}
      <svg className="absolute inset-0 blur-[2px]" viewBox="0 0 800 500" aria-hidden>
        <defs>
          <linearGradient id="gitStrokeV" x1="0" y1="0" x2="0" y2="800" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#22c55e" stopOpacity="0.10" />
            <stop offset="0.08" stopColor="#22c55e" stopOpacity="0.35" />
            <stop offset="0.92" stopColor="#34d399" stopOpacity="0.35" />
            <stop offset="1" stopColor="#34d399" stopOpacity="0.10" />
          </linearGradient>

          <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* slightly stronger fade at edges */}
          <linearGradient id="fadeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="black" stopOpacity="0.0" />
            <stop offset="18%" stopColor="white" stopOpacity="1" />
            <stop offset="82%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="black" stopOpacity="0.0" />
          </linearGradient>
          <mask id="fadeMask">
            <rect x="0" y="0" width="800" height="500" fill="url(#fadeGrad)" />
          </mask>

          {/* === LONG TILE: 800px visible + 2x40px overscan = 880px (flipped vertically) === */}
          <pattern
            id="gitPattern"
            x="0"
            y="0"
            width="800"
            height="880"
            patternUnits="userSpaceOnUse"
            patternTransform="translate(0,880) scale(1,-1)"
          >
            <animateTransform
              attributeName="patternTransform"
              type="translate"
              from="0 880"
              to="0 0"
              dur="18s"
              repeatCount="indefinite"
              additive="sum"
            />

            {/* MAIN branch */}
            <path
              d="M 400 -160 V 1040"
              fill="none"
              stroke="url(#gitStrokeV)"
              strokeWidth="8"
              strokeLinecap="butt"
              filter="url(#glow)"
            />

            {/* ===== BRANCHES ===== */}
            {/* Right merge: 40 -> 200 */}
            <path d="M 400 40  L 440 80  V 160 L 400 200"
              fill="none" stroke="url(#gitStrokeV)" strokeWidth="8" strokeLinecap="butt" filter="url(#glow)" />

            {/* Right leaf: 100 -> 380 */}
            <path d="M 400 100 L 440 140 V 380"
              fill="none" stroke="url(#gitStrokeV)" strokeWidth="8" strokeLinecap="butt" filter="url(#glow)" />

            {/* Left leaf (was merge 180->520, now ends at 360) */}
            <path d="M 400 180 L 360 220 V 360"
              fill="none" stroke="url(#gitStrokeV)" strokeWidth="8" strokeLinecap="butt" filter="url(#glow)" />

            {/* Mid right merge: 300 -> 460 */}
            <path d="M 400 300 L 440 340 V 420 L 400 460"
              fill="none" stroke="url(#gitStrokeV)" strokeWidth="8" strokeLinecap="butt" filter="url(#glow)" />

            {/* Right leaf (mid-long): 360 -> 560 */}
            <path d="M 400 360 L 440 400 V 560"
              fill="none" stroke="url(#gitStrokeV)" strokeWidth="8" strokeLinecap="butt" filter="url(#glow)" />

            {/* Left merge (late): 440 -> 780 */}
            <path d="M 400 440 L 360 480 V 720 L 400 780"
              fill="none" stroke="url(#gitStrokeV)" strokeWidth="8" strokeLinecap="butt" filter="url(#glow)" />

            {/* Deep left leaf (late): 520 -> 740 via x=320 */}
            <path d="M 400 520 L 360 560 L 320 600 V 740"
              fill="none" stroke="url(#gitStrokeV)" strokeWidth="8" strokeLinecap="butt" filter="url(#glow)" />

            {/* Right merge (late): 620 -> 780 */}
            <path d="M 400 620 L 440 660 V 740 L 400 780"
              fill="none" stroke="url(#gitStrokeV)" strokeWidth="8" strokeLinecap="butt" filter="url(#glow)" />

            {/* Right leaf (late-long): 700 -> 860 */}
            <path d="M 400 700 L 440 740 V 860"
              fill="none" stroke="url(#gitStrokeV)" strokeWidth="8" strokeLinecap="butt" filter="url(#glow)" />

            {/* ===== NODES ===== */}
            {/* Main nodes where splits/merges happen */}
            {[40, 100, 180, 200, 300, 360, 440, 460, 520, 600, 620, 700, 780].map((y) => (
              <circle key={`m${y}`} cx="400" cy={y} r="3.5" fill="#34d399" filter="url(#glow)" />
            ))}

            {/* Bend nodes (each corner) */}
            {[
              { x: 440, y: 80 }, { x: 440, y: 160 }, // right merge 40→200
              { x: 440, y: 140 },                     // right leaf 100→380
              { x: 360, y: 220 },                     // left leaf 180→360 (bend)
              { x: 440, y: 340 }, { x: 440, y: 420 }, // mid right merge
              { x: 440, y: 400 },                     // right leaf 360→560
              { x: 360, y: 480 }, { x: 360, y: 720 }, // late left merge
              { x: 360, y: 560 }, { x: 320, y: 600 }, // deep left leaf
              { x: 440, y: 660 }, { x: 440, y: 740 }, // late right merge
              { x: 440, y: 740 },                     // late-long right leaf (top bend)
            ].map((p, i) => (
              <circle key={`bend${i}`} cx={p.x} cy={p.y} r="3.5" fill="#22c55e" filter="url(#glow)" />
            ))}

            {/* Merge markers (only real merges) */}
            {[200, 460, 780].map((y) => (
              <circle key={`mm_${y}`} cx="400" cy={y} r="3" fill="#22c55e" opacity="0.95" filter="url(#glow)" />
            ))}

            {/* Leaf tips */}
            {[380, 560, 860].map((y) => (
              <circle key={`leafR_${y}`} cx="440" cy={y} r="4" fill="#22c55e" filter="url(#glow)" />
            ))}
            {[360].map((y) => (
              <circle key={`leafL_${y}`} cx="360" cy={y === 360 ? 360 : 740} r="4" fill="#22c55e" filter="url(#glow)" />
            ))}
            {/* deep-left leaf at x=320 */}
            <circle cx="320" cy="740" r="4" fill="#22c55e" filter="url(#glow)" />
          </pattern>
        </defs>

        <rect x="0" y="0" width="800" height="500" fill="url(#gitPattern)" mask="url(#fadeMask)" />
      </svg>

      {/* center label */}
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center" aria-hidden>
        <div className="px-3 py-1.5 sm:px-4 sm:py-2 md:px-4 md:py-2 rounded-full bg-white/5 backdrop-blur-sm">
          <span className="text-center font-bold uppercase tracking-wide text-white/90 text-xl sm:text-2xl md:text-2xl lg:text-4xl">
            contributions
          </span>
        </div>
      </div>

      {/* GitHub logo + text */}
      <div className="absolute right-4 bottom-4 sm:right-5 sm:bottom-5 md:right-6 md:bottom-6 lg:right-7 lg:bottom-7 z-20 w-10 h-10 sm:w-12 sm:h-12 md:w-12 md:h-12 lg:w-[72px] lg:h-[72px] opacity-90">
        <Image
          src="/assets/github.svg"
          alt="GitHub logo"
          fill
          sizes="(min-width: 1024px) 72px, (min-width: 768px) 56px, (min-width: 640px) 48px, 40px"
          className="invert brightness-0"
        />
      </div>
      <div className="absolute left-5 top-5 z-20">
        <div className="text-lg sm:text-xl font-semibold">GitHub</div>
        <div className="text-[13px] sm:text-sm text-white/80">github.com/griffindow</div>
      </div>
    </a>
  );
}