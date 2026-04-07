import { OnDemandForm } from "@/components/on-demand-form";
import { EmptyLegBrowser } from "@/components/empty-leg-browser";

type EmptyLeg = {
  id: string;
  from: string;
  fromCity?: string;
  to: string;
  toCity?: string;
  departure: string;
  passengers: number;
  aircraftType: string;
  priceRaw?: number;
  priceMargin?: number;
  currency?: string;
  notes?: string;
  imageUrl?: string;
};

async function getEmptyLegs(): Promise<{ legs: EmptyLeg[]; isLive: boolean }> {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
  try {
    const today = new Date().toISOString().split('T')[0];
    const res = await fetch(`${baseUrl}/api/empty-legs?limit=250&startDate=${today}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error("Failed to fetch");
    return { legs: (await res.json()) as EmptyLeg[], isLive: true };
  } catch {
    return { legs: [], isLive: false };
  }
}

export default async function Home() {
  const { legs, isLive } = await getEmptyLegs();

  return (
    <div className="min-h-screen text-slate-100">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#070b14]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="/" className="flex items-center gap-3">
            <img
              src="/black-star-icon.png"
              alt=""
              className="h-9 w-auto"
            />
            <div className="leading-tight">
              <p className="font-[var(--font-display)] text-xl tracking-wide text-white">
                Black Star Aviation
              </p>
              <p className="text-[10px] uppercase tracking-[0.35em] text-[var(--brand)]">
                Charter Brokerage
              </p>
            </div>
          </a>
          <nav className="hidden gap-6 font-[var(--font-mono)] text-[13px] uppercase tracking-[1.4px] text-slate-300/80 md:flex">
            <a href="#empty-legs" className="pb-1 transition hover:text-[var(--brand)]">
              Empty Legs
            </a>
            <a href="#quote" className="pb-1 transition hover:text-[var(--brand)]">
              On-Demand
            </a>
            <a href="#chat" className="pb-1 transition hover:text-[var(--brand)]">
              Concierge
            </a>
          </nav>
          <a href="#quote" className="btn-sharp btn-primary">
            Start a Quote →
          </a>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/europes-ski-resorts-by-private-jet.webp')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#060b15]/90 via-[#071022]/80 to-[#060b15]/70" />
        <div className="relative mx-auto max-w-7xl px-6 py-12 md:py-16">
          <div className="space-y-7">
            <p className="font-[var(--font-mono)] text-[11px] uppercase tracking-[3px] text-[var(--brand)]">
              Performance &nbsp;·&nbsp; Precision &nbsp;·&nbsp; Integrity
            </p>
            <h1 className="max-w-3xl font-[var(--font-display)] text-5xl leading-[1.05] text-white md:text-6xl">
              Private aviation, <br className="hidden md:block" />
              <span className="text-[var(--brand)]">arranged with precision.</span>
            </h1>
            <p className="max-w-2xl text-base text-slate-200/80 md:text-lg">
              On-demand charter and curated empty legs arranged through safety-vetted operators—backed by responsive trip coordination and clear commercial terms.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#quote" className="btn-sharp btn-primary">
                Start a Quote →
              </a>
              <a href="#empty-legs" className="btn-sharp btn-outline">
                Browse Empty Legs →
              </a>
            </div>
            <p className="max-w-3xl text-xs text-slate-300/80">
              Black Star Aviation is an air charter broker. All transportation is provided by properly licensed direct air carriers.
              {" "}
              <a href="/operator-disclosure" className="underline underline-offset-4 text-white">
                Operator Disclosure
              </a>
            </p>
          </div>
        </div>
      </section>

      <main className="grid-bg mx-auto flex max-w-7xl flex-col gap-16 px-6 pt-6 pb-12 md:pt-8 md:pb-16">

        <section id="empty-legs" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-[var(--font-display)] text-4xl text-white">
              Featured Empty Legs
            </h2>
            <span className="border border-[var(--brand-border)] bg-[rgba(205,163,73,0.05)] px-3 py-1.5 font-[var(--font-mono)] text-[11px] uppercase tracking-[1.5px] text-[var(--brand)]">
              Live Feed
            </span>
          </div>
          {!isLive && (
            <div className="border border-amber-300/30 bg-amber-300/10 p-4 text-sm text-amber-100">
              Live feed is temporarily unavailable. No placeholder flights are shown.
            </div>
          )}
          <EmptyLegBrowser legs={legs} />
        </section>

        <section id="quote" className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <p className="font-[var(--font-mono)] text-[11px] uppercase tracking-[3px] text-[var(--brand)]">
              On-Demand Charter
            </p>
            <h2 className="font-[var(--font-display)] text-4xl text-white">
              Your Route, Your Schedule
            </h2>
            <p className="text-sm text-slate-300/70 leading-relaxed">
              Tell us where and when. We reach out to our vetted operator network,
              collect quotes, and present you with the best available option — typically
              within a few hours.
            </p>
          </div>

          <div className="border border-[var(--brand-border)] bg-gradient-to-br from-[rgba(205,163,73,0.05)] to-[rgba(12,19,35,0.6)] p-8 md:p-10">
            <div className="grid md:grid-cols-3 gap-6 mb-8 text-center">
              <div className="space-y-2">
                <div className="text-2xl text-[var(--brand)]">01</div>
                <p className="text-xs uppercase tracking-[1.5px] text-slate-300/80 font-[var(--font-mono)]">Submit Your Trip</p>
                <p className="text-xs text-slate-400/70">Route, dates, passengers, and aircraft category — takes under a minute.</p>
              </div>
              <div className="space-y-2">
                <div className="text-2xl text-[var(--brand)]">02</div>
                <p className="text-xs uppercase tracking-[1.5px] text-slate-300/80 font-[var(--font-mono)]">Live Quotes Roll In</p>
                <p className="text-xs text-slate-400/70">We fan out to vetted operators. Each quote is forwarded to you the moment it lands.</p>
              </div>
              <div className="space-y-2">
                <div className="text-2xl text-[var(--brand)]">03</div>
                <p className="text-xs uppercase tracking-[1.5px] text-slate-300/80 font-[var(--font-mono)]">Lock It In</p>
                <p className="text-xs text-slate-400/70">First come, first serve — confirm any quote that works and we handle the rest.</p>
              </div>
            </div>
            <div className="border-t border-[var(--brand-border)] pt-8">
              <OnDemandForm />
            </div>
          </div>
        </section>

        <section
          id="chat"
          className="border border-[var(--brand-border)] bg-gradient-to-br from-[rgba(205,163,73,0.04)] to-[rgba(12,19,35,0.85)] p-7"
        >
          <div className="flex items-center gap-3">
            <h2 className="font-[var(--font-display)] text-4xl text-white">
              Concierge
            </h2>
            <span className="border border-[var(--brand)] bg-[var(--brand)]/10 px-3 py-1 font-[var(--font-mono)] text-[10px] uppercase tracking-[1.5px] text-[var(--brand)]">
              Coming Soon
            </span>
          </div>
          <p className="mt-3 text-sm text-slate-300/80">
            A guided AI assistant for route refinement, FAQ handling, and instant
            quote requests — all from a single chat. Currently in development.
          </p>
        </section>
      </main>

      <footer className="border-t border-[var(--brand-border)] bg-[#060a12]">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 py-10 md:flex-row md:justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/black-star-icon.png"
              alt=""
              className="h-8 w-auto"
            />
            <div className="leading-tight">
              <p className="font-[var(--font-display)] text-lg tracking-wide text-white">
                Black Star Aviation
              </p>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--brand)]">
                Performance · Precision · Integrity
              </p>
            </div>
          </div>
          <div className="text-center text-xs text-slate-400/60 md:text-right">
            <p>Henderson, Nevada</p>
            <p className="mt-1">&copy; {new Date().getFullYear()} Black Star Aviation LLC. All rights reserved.</p>
            <p className="mt-1">
              Black Star Aviation is an air charter broker. All transportation is provided by properly licensed direct air carriers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
