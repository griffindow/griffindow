import Image from "next/image";
import { XCard } from "@/components/XCard";
import { InstagramCard } from "@/components/InstagramCard";
import { LinkedInCard } from "@/components/LinkedInCard";
import { GitHubCard } from "@/components/GitHubCard";

export default function Home() {
  return (
    <div className="font-sans">
      <main id="home" className="mx-auto max-w-7xl px-4 py-24">
        <section className="flex flex-col items-start justify-center gap-8 min-h-screen">
          <div className="self-center">
            <div className="relative h-40 w-40 overflow-hidden rounded-full ring-1 ring-black/10 dark:ring-white/10">
              <Image
                src="/apple-touch-icon.png"
                alt="Portrait of Griffin Dow"
                fill
                sizes="160px"
                priority
                className="object-cover"
              />
            </div>
          </div>
          <div className="self-center text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-tight [text-wrap:balance]">Griffin Dow</h1>
            <p className="mt-1 text-base sm:text-lg text-black/75 dark:text-white/75 font-medium tracking-wide">Product Engineer</p>
          </div>
          <blockquote className="max-w-3xl text-lg sm:text-xl md:text-2xl leading-relaxed text-center mx-auto [text-wrap:balance] text-black/80 dark:text-white/80">
            “Relentlessly shaped by vision, I build toward what does not yet exist — beginning with myself.”
          </blockquote>
          <div className="flex flex-wrap gap-3 self-center">
            <a href="#learn" className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium bg-foreground text-background hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50">
              Connect
            </a>
          </div>
        </section>

        <section id="learn" className="mt-24 min-h-screen flex items-center justify-center">
          <h2 className="sr-only">Social profiles</h2>
          <div className="mx-auto max-w-screen-2xl px-6 md:px-8 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
              <XCard />
              <InstagramCard />
              <LinkedInCard />
              <GitHubCard />
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-3xl px-4 pb-12 text-xs text-black/60 dark:text-white/60 text-center">
        © {new Date().getFullYear()} Griffin Dow
      </footer>
    </div>
  );
}
