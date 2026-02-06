import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/20 to-transparent" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-secondary-light/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold">
            <span className="bg-gradient-to-r from-brand-primary-light via-brand-accent to-brand-secondary-light bg-clip-text text-transparent">
              Watch Live Streams
            </span>
          </h1>
          <p className="mt-6 text-xl text-fg-secondary max-w-2xl mx-auto">
            Join millions watching live gaming, music, art, and more. Start
            streaming or discover your new favorite creator.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/register"
              className="px-8 py-3 bg-gradient-to-r from-brand-primary-dark to-brand-secondary hover:from-brand-primary hover:to-brand-secondary-light text-fg-primary font-semibold rounded-xl transition-all shadow-lg shadow-brand-primary/25"
            >
              Start Streaming
            </Link>
            <a
              href="#live-streams"
              className="px-8 py-3 border border-border-subtle hover:border-text-secondary text-fg-primary font-semibold rounded-xl transition-colors"
            >
              Browse Streams
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
