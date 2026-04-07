import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Operator Disclosure | Black Star Aviation",
  description:
    "Black Star Aviation is an air charter broker, not a direct air carrier. Read our operator disclosure and DOT compliance information.",
};

export default function OperatorDisclosure() {
  return (
    <div className="min-h-screen text-slate-100">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#070b14]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="/" className="flex items-center gap-3">
            <img src="/black-star-icon.png" alt="" className="h-9 w-auto" />
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
            <a href="/#empty-legs" className="pb-1 transition hover:text-[var(--brand)]">
              Empty Legs
            </a>
            <a href="/#quote" className="pb-1 transition hover:text-[var(--brand)]">
              On-Demand
            </a>
            <a href="/#chat" className="pb-1 transition hover:text-[var(--brand)]">
              Concierge
            </a>
          </nav>
          <a href="/#quote" className="btn-sharp btn-primary">
            Start a Quote →
          </a>
        </div>
      </header>

      <section className="grid-bg relative border-b border-[var(--brand-border)]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
          <p className="font-[var(--font-mono)] text-[11px] uppercase tracking-[3px] text-[var(--brand)]">
            Legal &nbsp;·&nbsp; Compliance
          </p>
          <h1 className="mt-4 max-w-3xl font-[var(--font-display)] text-5xl leading-[1.05] text-white md:text-6xl">
            Operator Disclosure
          </h1>
        </div>
      </section>

      <main className="grid-bg mx-auto flex max-w-7xl flex-col gap-12 px-6 py-12 md:py-16">

        <section className="max-w-3xl space-y-5">
          <h2 className="font-[var(--font-display)] text-3xl text-white">
            Broker Status
          </h2>
          <p className="text-slate-300/90 leading-relaxed">
            Black Star Aviation LLC is an air charter broker, not a direct air carrier. Black Star Aviation LLC does not own or operate aircraft. All flights arranged through Black Star Aviation are operated by FAA-certificated Part 135 direct air carriers that maintain full operational control of the aircraft and crew.
          </p>
          <p className="text-slate-300/90 leading-relaxed">
            As required by the U.S. Department of Transportation (DOT), Black Star Aviation LLC discloses that it acts solely as an agent in arranging air transportation. The direct air carrier providing the transportation will be identified to the customer prior to booking confirmation.
          </p>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-[var(--brand)] to-transparent opacity-25" />

        <section className="max-w-3xl space-y-5">
          <h2 className="font-[var(--font-display)] text-3xl text-white">
            Safety Standards
          </h2>
          <p className="text-slate-300/90 leading-relaxed">
            Black Star Aviation works exclusively with operators that hold valid FAA Part 135 Air Carrier Certificates. All operators are vetted for current insurance coverage, pilot qualifications, and maintenance compliance. We do not arrange flights on aircraft or with operators that fail to meet these minimum safety standards.
          </p>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-[var(--brand)] to-transparent opacity-25" />

        <section className="max-w-3xl space-y-5">
          <h2 className="font-[var(--font-display)] text-3xl text-white">
            DOT Compliance
          </h2>
          <p className="text-slate-300/90 leading-relaxed">
            In accordance with 14 CFR Part 295 and DOT guidance, Black Star Aviation LLC makes the following disclosures:
          </p>
          <div className="space-y-4">
            <div className="border border-[var(--brand-border)] bg-[rgba(205,163,73,0.04)] p-5">
              <p className="mb-1 font-[var(--font-mono)] text-[11px] uppercase tracking-[1.5px] text-[var(--brand)]">
                Disclosure 1
              </p>
              <p className="text-slate-300/90 leading-relaxed">
                Black Star Aviation LLC is not a direct air carrier. Black Star Aviation LLC is an air charter broker as defined by the Department of Transportation.
              </p>
            </div>
            <div className="border border-[var(--brand-border)] bg-[rgba(205,163,73,0.04)] p-5">
              <p className="mb-1 font-[var(--font-mono)] text-[11px] uppercase tracking-[1.5px] text-[var(--brand)]">
                Disclosure 2
              </p>
              <p className="text-slate-300/90 leading-relaxed">
                All air transportation arranged by Black Star Aviation LLC is provided by FAA-certificated and DOT-registered direct air carriers that will be identified to the customer prior to the commencement of any flight.
              </p>
            </div>
            <div className="border border-[var(--brand-border)] bg-[rgba(205,163,73,0.04)] p-5">
              <p className="mb-1 font-[var(--font-mono)] text-[11px] uppercase tracking-[1.5px] text-[var(--brand)]">
                Disclosure 3
              </p>
              <p className="text-slate-300/90 leading-relaxed">
                Black Star Aviation LLC does not own or operate any aircraft. The direct air carrier providing the air transportation maintains operational control of the aircraft at all times.
              </p>
            </div>
          </div>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-[var(--brand)] to-transparent opacity-25" />

        <section className="max-w-3xl space-y-5">
          <h2 className="font-[var(--font-display)] text-3xl text-white">
            Consumer Protection
          </h2>
          <p className="text-slate-300/90 leading-relaxed">
            Customers booking air charter transportation through Black Star Aviation will receive written confirmation identifying the direct air carrier operating the flight, the aircraft type, and applicable terms prior to departure. Pricing presented by Black Star Aviation includes the broker&apos;s service fee. The operating carrier&apos;s identity and safety record can be independently verified through the FAA and DOT.
          </p>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-[var(--brand)] to-transparent opacity-25" />

        <section className="max-w-3xl space-y-5">
          <h2 className="font-[var(--font-display)] text-3xl text-white">
            Contact
          </h2>
          <p className="text-slate-300/90 leading-relaxed">
            For questions about this disclosure or Black Star Aviation&apos;s broker status, contact us at:
          </p>
          <div className="border border-[var(--brand-border)] bg-[rgba(205,163,73,0.04)] p-5">
            <p className="font-[var(--font-mono)] text-[13px] leading-relaxed text-slate-200">
              Black Star Aviation LLC<br />
              Henderson, Nevada<br />
              info@flyblackstar.com
            </p>
          </div>
        </section>

        <div className="pt-4">
          <a href="/" className="btn-sharp btn-outline">
            ← Back to Home
          </a>
        </div>

      </main>

      <footer className="border-t border-[var(--brand-border)] bg-[#060a12]">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 py-10 md:flex-row md:justify-between">
          <div className="flex items-center gap-3">
            <img src="/black-star-icon.png" alt="" className="h-8 w-auto" />
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
