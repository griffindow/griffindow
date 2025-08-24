import Image from "next/image";

export function InstagramCard() {
  return (
    <a
      href="https://instagram.com/griffinodow"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Instagram profile @griffinodow"
      className="group relative overflow-hidden rounded-3xl border border-black/15 dark:border-white/20 aspect-[16/10] text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 transition-transform transition-shadow duration-300 ease-out will-change-transform hover:scale-[1.02] sm:hover:scale-[1.025] hover:border-white/25 dark:hover:border-white/30 hover:shadow-[0_0_12px_rgba(255,255,255,0.10)] motion-reduce:transition-none motion-reduce:hover:scale-100"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_75%_25%,rgba(255,200,80,0.6),transparent),linear-gradient(135deg,#f97316_0%,#ef4444_40%,#a855f7_80%)] opacity-90" />

      {/* Wobbling camera module (smooth continuous orbit, no spin) */}
      <style>
        {`
          @keyframes ig-orbit { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes ig-counter { from { transform: translate3d(0,-12px,0) rotate(0deg); } to { transform: translate3d(0,-12px,0) rotate(-360deg); } }
          @keyframes ig-tilt { 
            0% { transform: rotate(-2deg); }
            25% { transform: rotate(0deg); }
            50% { transform: rotate(2deg); }
            75% { transform: rotate(0deg); }
            100% { transform: rotate(-2deg); }
          }
          .ig-orbit { animation: ig-orbit 7.5s linear infinite; transform-origin: center center; }
          .ig-cam { animation: ig-counter 7.5s linear infinite; transform-origin: center center; }
          .ig-tilt { animation: ig-tilt 3.2s linear infinite; transform-origin: center center; }

          /* Animated sheen crossing the full camera surface */
          @keyframes ig-sheen-move {
            0% { transform: translateX(-160%); }
            100% { transform: translateX(160%); }
          }
          .ig-sheen {
            position: absolute;
            inset: 0;
            border-radius: 1rem; /* matches rounded-2xl */
            pointer-events: none;
            overflow: hidden;
          }
          .ig-sheen::before {
            content: "";
            position: absolute;
            inset: -25%;
            border-radius: inherit;
            background: linear-gradient(115deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.08) 35%, rgba(255,255,255,0.55) 50%, rgba(255,255,255,0.08) 65%, rgba(255,255,255,0) 100%);
            animation: ig-sheen-move 2.4s linear infinite;
            will-change: transform;
            mix-blend-mode: screen;
            opacity: 0.65;
          }
        `}
      </style>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[78%] h-[68%]">
          <div className="ig-orbit absolute inset-0 flex items-center justify-center">
            <div className="ig-cam relative w-full h-full">
              <div className="ig-tilt relative w-full h-full">
                {/* Camera frame border */}
                <div className="absolute inset-0 border-2 border-white/40 rounded-2xl" />
                {/* Sheen overlay masked to the border ring */}
                <div className="ig-sheen rounded-2xl" aria-hidden />

                {/* REC indicator (text + dot together) */}
                <svg className="absolute top-3 right-3" width="56" height="20" viewBox="0 0 70 24" aria-hidden>
                  <text
                    x="0"
                    y="16"
                    fontSize="12"
                    fontFamily="system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
                    fill="#ffffff"
                    opacity="0.9"
                    letterSpacing=".15em"
                  >
                    REC
                  </text>
                  <circle cx="48" cy="12" r="6" fill="#ef4444">
                    <animate attributeName="opacity" values="1;0.2;1" dur="1.2s" repeatCount="indefinite" />
                  </circle>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* centered overlay: blurred background behind label */}
      <div
        className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center backdrop-blur-[2px]"
        aria-hidden
      >
        <div className="px-3 py-1.5 sm:px-4 sm:py-2 md:px-4 md:py-2 rounded-full bg-white/5">
          <span className="text-center font-bold uppercase tracking-wide text-white/90 text-xl sm:text-2xl md:text-2xl lg:text-4xl">
            life
          </span>
        </div>
      </div>

      {/* Instagram logo + label */}
      <div className="absolute right-4 bottom-4 sm:right-5 sm:bottom-5 md:right-6 md:bottom-6 lg:right-7 lg:bottom-7 z-20 w-10 h-10 sm:w-12 sm:h-12 md:w-12 md:h-12 lg:w-[72px] lg:h-[72px] opacity-90">
        <Image
          src="/assets/instagram.svg"
          alt="Instagram logo"
          fill
          sizes="(min-width: 1024px) 72px, (min-width: 768px) 48px, (min-width: 640px) 48px, 40px"
          className="invert brightness-0"
        />
      </div>
      <div className="absolute left-5 top-5 text-white drop-shadow z-20">
        <div className="text-base sm:text-lg font-semibold">Instagram</div>
        <div className="text-[12px] sm:text-sm text-white/80">@griffinodow</div>
      </div>
    </a>
  );
}