"use client";

import { useMemo, useState } from "react";
import type React from "react";

const inputClass =
  "w-full border border-[var(--brand-border)] bg-[rgba(205,163,73,0.04)] px-4 py-3 font-[var(--font-mono)] text-[12px] tracking-[0.5px] text-slate-100 placeholder:text-slate-400/50 outline-none transition focus:border-[var(--brand)] focus:bg-[rgba(205,163,73,0.07)]";

function toMonthLabel(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function monthStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function shiftMonth(date: Date, delta: number) {
  return new Date(date.getFullYear(), date.getMonth() + delta, 1);
}

function ymd(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDateDisplay(key: string) {
  const d = new Date(key + "T12:00:00");
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

type AircraftCategory = "light" | "mid" | "super_mid" | "heavy";
type TripType = "one_way" | "round_trip";

const aircraftCategories: Array<{
  value: AircraftCategory;
  label: string;
  description: string;
}> = [
  {
    value: "light",
    label: "Light",
    description:
      "Light jets like the Citation CJ3 or Phenom 300. Comfortable for up to 5 passengers with carry-on luggage. A tight fit at 6–7. Best for shorter hops up to ~3 hours.",
  },
  {
    value: "mid",
    label: "Midsize",
    description:
      "Midsize jets like the Hawker 800 or Citation XLS. Stand-up cabin, comfortable for 6–7 passengers with full luggage. Good for cross-country trips with one fuel stop.",
  },
  {
    value: "super_mid",
    label: "Super Midsize",
    description:
      "Super-mids like the Challenger 300 or Citation Sovereign. Full stand-up cabin, comfortable for 8 passengers with luggage, generous range. Transcontinental nonstop capability.",
  },
  {
    value: "heavy",
    label: "Heavy",
    description:
      "Heavy jets like the Gulfstream G450 or Falcon 2000. Full galley and lavatory, comfortable for 10–14 passengers with large luggage capacity. Intercontinental range.",
  },
];

/** Reusable calendar dropdown — used for both departure and return dates. */
function CalendarPicker({
  value,
  onChange,
  placeholder,
  minDateKey,
}: {
  value: string;
  onChange: (key: string) => void;
  placeholder: string;
  minDateKey: string;
}) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState<Date>(() =>
    value ? monthStart(new Date(value + "T12:00:00")) : monthStart(new Date()),
  );

  const cells = useMemo(() => {
    const first = monthStart(month);
    const firstWeekday = first.getDay();
    const daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
    const out: Array<{ key: string; day: number; inMonth: boolean }> = [];
    for (let i = 0; i < firstWeekday; i++) {
      out.push({ key: `pad-start-${i}`, day: 0, inMonth: false });
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(first.getFullYear(), first.getMonth(), day);
      out.push({ key: ymd(date), day, inMonth: true });
    }
    while (out.length % 7 !== 0) {
      out.push({ key: `pad-end-${out.length}`, day: 0, inMonth: false });
    }
    return out;
  }, [month]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full border border-[var(--brand-border)] bg-[rgba(205,163,73,0.04)] px-4 py-3 font-[var(--font-mono)] text-[12px] tracking-[0.5px] text-left outline-none transition hover:border-[var(--brand)]/70"
      >
        <span className={value ? "text-slate-100" : "text-slate-400/50"}>
          {value ? formatDateDisplay(value) : placeholder}
        </span>
      </button>
      {open && (
        <div className="absolute z-20 mt-2 w-[290px] border border-[var(--brand-border)] bg-[rgba(12,19,35,0.98)] p-3 shadow-2xl">
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              className="border border-[var(--brand-border)] px-2 py-1 font-[var(--font-mono)] text-[11px] text-slate-200 hover:border-[var(--brand)]"
              onClick={() => setMonth((m) => shiftMonth(m, -1))}
            >
              Prev
            </button>
            <div className="text-sm font-semibold text-[var(--brand)]">
              {toMonthLabel(month)}
            </div>
            <button
              type="button"
              className="border border-[var(--brand-border)] px-2 py-1 font-[var(--font-mono)] text-[11px] text-slate-200 hover:border-[var(--brand)]"
              onClick={() => setMonth((m) => shiftMonth(m, 1))}
            >
              Next
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] uppercase tracking-[0.1em] text-slate-400">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-1">
            {cells.map((cell) => {
              if (!cell.inMonth) {
                return <div key={cell.key} className="h-8" />;
              }
              const selected = value === cell.key;
              const isDisabled = cell.key < minDateKey;
              return (
                <button
                  type="button"
                  key={cell.key}
                  disabled={isDisabled}
                  onClick={() => {
                    onChange(cell.key);
                    setOpen(false);
                  }}
                  className={`relative h-8 rounded-md text-xs transition ${
                    selected
                      ? "bg-[var(--brand)] text-slate-950"
                      : isDisabled
                        ? "bg-white/5 text-slate-500 cursor-not-allowed"
                        : "bg-white/5 text-slate-300 hover:bg-white/10"
                  }`}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex items-center justify-end">
            <button
              type="button"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              className="text-[11px] text-[var(--brand)]"
            >
              Clear date
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function OnDemandForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");
  const [tripType, setTripType] = useState<TripType>("one_way");
  const [departureKey, setDepartureKey] = useState("");
  const [returnKey, setReturnKey] = useState("");
  const [aircraftCategory, setAircraftCategory] = useState<AircraftCategory | "">("");

  const todayKey = ymd(new Date());

  // If departure changes and return is now invalid, clear return.
  function handleDepartureChange(key: string) {
    setDepartureKey(key);
    if (returnKey && key && returnKey < key) {
      setReturnKey("");
    }
  }

  // If user switches back to one-way, clear the return date so we don't send it.
  function handleTripTypeChange(t: TripType) {
    setTripType(t);
    if (t === "one_way") setReturnKey("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!aircraftCategory) {
      setStatus("error");
      setMessage("Please select an aircraft category.");
      return;
    }
    if (tripType === "round_trip" && !returnKey) {
      setStatus("error");
      setMessage("Please select a return date or switch to one-way.");
      return;
    }
    const formData = new FormData(event.currentTarget);
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/rfq", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const text = await res.text();
        setStatus("error");
        setMessage("Failed to submit. Please try again.");
        console.error(text);
        return;
      }
      setStatus("success");
      setMessage("Request received — we're sourcing quotes from our operator network now. You'll hear from us shortly.");
    } catch (err) {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
      console.error(err);
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-4 py-10 text-center">
        <div className="text-4xl text-[var(--brand)]">&#10003;</div>
        <p className="text-lg text-white font-[var(--font-display)]">Request Submitted</p>
        <p className="text-sm text-slate-300/80 max-w-md">
          {message}
        </p>
        <button
          onClick={() => {
            setStatus("idle");
            setMessage("");
            setDepartureKey("");
            setReturnKey("");
            setAircraftCategory("");
            setTripType("one_way");
          }}
          className="mt-2 text-xs uppercase tracking-[1.5px] text-[var(--brand)] font-[var(--font-mono)] hover:text-[var(--brand-soft)] transition"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
      <input type="hidden" name="departure" value={departureKey} />
      {tripType === "round_trip" && (
        <input type="hidden" name="returnDate" value={returnKey} />
      )}
      <input type="hidden" name="aircraftCategory" value={aircraftCategory} />

      {/* Flight Details */}
      <div className="md:col-span-2">
        <p className="font-[var(--font-mono)] text-[10px] uppercase tracking-[2px] text-slate-400/60 mb-3">
          Flight Details
        </p>
      </div>

      {/* Trip type toggle */}
      <div className="md:col-span-2">
        <div className="inline-flex border border-[var(--brand-border)]">
          {(
            [
              { value: "one_way", label: "One Way" },
              { value: "round_trip", label: "Round Trip" },
            ] as const
          ).map((opt) => {
            const selected = tripType === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleTripTypeChange(opt.value)}
                className={`px-5 py-2 font-[var(--font-mono)] text-[11px] uppercase tracking-[1px] transition ${
                  selected
                    ? "bg-[var(--brand)] text-slate-950"
                    : "bg-transparent text-slate-300 hover:text-slate-100"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <input
        className={inputClass}
        placeholder="From (city or airport code)"
        name="from"
        required
      />
      <input
        className={inputClass}
        placeholder="To (city or airport code)"
        name="to"
        required
      />

      <CalendarPicker
        value={departureKey}
        onChange={handleDepartureChange}
        placeholder="Departure date"
        minDateKey={todayKey}
      />

      {tripType === "round_trip" ? (
        <CalendarPicker
          value={returnKey}
          onChange={setReturnKey}
          placeholder="Return date"
          minDateKey={departureKey || todayKey}
        />
      ) : (
        <div>{/* spacer */}</div>
      )}

      <input
        className={inputClass}
        placeholder="Passengers"
        name="passengers"
        type="number"
        min={1}
      />
      <input
        className={inputClass}
        placeholder="Specific aircraft (optional, e.g. G550)"
        name="aircraftType"
      />

      {/* Aircraft category selector — required */}
      <div className="md:col-span-2">
        <p className="font-[var(--font-mono)] text-[10px] uppercase tracking-[2px] text-slate-400/60 mb-3">
          Aircraft Category <span className="text-red-300/80">*</span>
        </p>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {aircraftCategories.map((cat) => {
            const selected = aircraftCategory === cat.value;
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => setAircraftCategory(cat.value)}
                className={`border px-3 py-3 font-[var(--font-mono)] text-[11px] uppercase tracking-[1px] transition ${
                  selected
                    ? "border-[var(--brand)] bg-[var(--brand)]/15 text-[var(--brand)]"
                    : "border-[var(--brand-border)] bg-[rgba(205,163,73,0.04)] text-slate-300 hover:border-[var(--brand)]/70 hover:text-slate-100"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
        {aircraftCategory && (
          <div className="mt-3 border-l-2 border-[var(--brand)] bg-[rgba(205,163,73,0.06)] px-4 py-3 text-[12px] leading-relaxed text-slate-200/90">
            {aircraftCategories.find((c) => c.value === aircraftCategory)?.description}
          </div>
        )}
      </div>
      <textarea
        className={`md:col-span-2 ${inputClass}`}
        placeholder="Additional notes — pets, catering, Wi-Fi, flexibility on dates, special handling..."
        rows={3}
        name="notes"
      />

      {/* Contact Info */}
      <div className="md:col-span-2 mt-2">
        <p className="font-[var(--font-mono)] text-[10px] uppercase tracking-[2px] text-slate-400/60 mb-3">
          Your Contact Info
        </p>
      </div>
      <input
        className={inputClass}
        placeholder="Full name"
        name="name"
        required
      />
      <input
        className={inputClass}
        placeholder="Email address"
        name="email"
        type="email"
        required
      />
      <input
        className={inputClass}
        placeholder="Phone (optional)"
        name="phone"
        type="tel"
      />
      <div>{/* spacer for grid alignment */}</div>

      <button
        className="btn-sharp btn-primary md:col-span-2 w-full py-4 disabled:opacity-60"
        type="submit"
        disabled={status === "loading"}
      >
        {status === "loading" ? "Submitting..." : "Request Quotes"}
      </button>

      {status === "error" && message && (
        <div className="md:col-span-2 text-sm text-red-300">
          {message}
        </div>
      )}
    </form>
  );
}
