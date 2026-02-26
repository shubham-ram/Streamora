import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/15 via-brand-secondary/5 to-transparent" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-primary/20 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-brand-secondary-light/15 rounded-full blur-[100px] animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-accent/8 rounded-full blur-[150px]" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(oklch(0.6 0.2 293 / 30%) 1px, transparent 1px), linear-gradient(90deg, oklch(0.6 0.2 293 / 30%) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-8">
            <span className="w-2 h-2 bg-status-live rounded-full animate-pulse" />
            <span className="text-sm text-fg-secondary font-medium">
              Live streaming platform
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-brand-primary-light via-brand-accent to-brand-secondary-light bg-clip-text text-transparent glow-text">
              Watch Live Streams
            </span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-fg-secondary max-w-2xl mx-auto leading-relaxed">
            Join millions watching live gaming, music, art, and more. Start
            streaming or discover your new favorite creator.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/register"
              className="btn-premium px-8 py-3.5 text-fg-primary font-semibold rounded-xl transition-all"
            >
              Start Streaming
            </Link>
            <a
              href="#live-streams"
              className="group px-8 py-3.5 rounded-xl font-semibold text-fg-primary transition-all glass hover:border-brand-primary/30"
            >
              <span className="bg-gradient-to-r from-fg-primary to-fg-secondary bg-clip-text text-transparent group-hover:from-brand-primary-light group-hover:to-brand-accent transition-all">
                Browse Streams
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
