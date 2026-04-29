"use client";

import { type FormEvent, useMemo, useState } from "react";

type EmptyLeg = {
  id: string;
  from: string;
  fromCity?: string;
  to: string;
  toCity?: string;
  departure: string;
  passengers: number;
  aircraftType: string;
  priceMargin?: number;
  currency?: string;
  notes?: string;
  imageUrl?: string;
};

type RequestStatus = "idle" | "loading" | "success" | "error";

const airportLabels: Record<string, { city: string }> = {
  KLAS: { city: "Las Vegas, NV" },
  KJAC: { city: "Jackson Hole, WY" },
  KTEB: { city: "Teterboro, NJ" },
  KHPN: { city: "White Plains, NY" },
  KTEX: { city: "Telluride, CO" },
  KVNY: { city: "Van Nuys, CA" },
  KFLL: { city: "Fort Lauderdale, FL" },
  KPBI: { city: "West Palm Beach, FL" },
  KPDK: { city: "Atlanta, GA" },
  KSFO: { city: "San Francisco, CA" },
  KDAL: { city: "Dallas, TX" },
  KSUN: { city: "Sun Valley, ID" },
  CYWG: { city: "Winnipeg, MB" },
  MMTL: { city: "Tulum, MX" },
};

function formatAirport(code: string) {
  const normalized = code.toUpperCase();
  const entry = airportLabels[normalized];
  if (entry) return { city: entry.city, code: normalized };
  return { city: normalized, code: normalized };
}

function formatAirportOptionLabel(airport: { city: string; code: string }) {
  if (airport.city === airport.code) return airport.code;
  return `${airport.city} (${airport.code})`;
}

function formatDeparture(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "TBD";
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    month: "short",
    day: "numeric",
  }).format(date);
}

function toDateKey(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "unknown-date";
  return d.toISOString().slice(0, 10);
}

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

export function EmptyLegBrowser({ legs }: { legs: EmptyLeg[] }) {
  const defaultFromLabel = "All origins";
  const defaultToLabel = "All destinations";
  const [fromCode, setFromCode] = useState("all");
  const [toCode, setToCode] = useState("all");
  const [fromQuery, setFromQuery] = useState("");
  const [toQuery, setToQuery] = useState("");
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);
  const [dateKey, setDateKey] = useState("");
  const [paxCount, setPaxCount] = useState("any");
  const [priceBand, setPriceBand] = useState("any");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => monthStart(new Date()));
  const [requestLeg, setRequestLeg] = useState<EmptyLeg | null>(null);
  const [requestStatus, setRequestStatus] = useState<RequestStatus>("idle");
  const [requestMessage, setRequestMessage] = useState("");

  const candidateFromLegs = useMemo(
    () =>
      toCode === "all"
        ? legs
        : legs.filter((l) => l.to.toUpperCase() === toCode),
    [legs, toCode],
  );

  const candidateToLegs = useMemo(
    () =>
      fromCode === "all"
        ? legs
        : legs.filter((l) => l.from.toUpperCase() === fromCode),
    [fromCode, legs],
  );

  const fromOptions = useMemo(
    () =>
      [
        { value: "all", label: "All origins" },
        ...Array.from(new Set(candidateFromLegs.map((l) => l.from.toUpperCase())))
          .sort()
          .map((code) => {
            const sample = candidateFromLegs.find((l) => l.from.toUpperCase() === code);
            const a = formatAirport(code);
            const city = sample?.fromCity?.trim() || a.city;
            const normalized = { city, code: a.code };
            return { value: code, label: formatAirportOptionLabel(normalized) };
          }),
      ],
    [candidateFromLegs],
  );

  const toOptions = useMemo(
    () =>
      [
        { value: "all", label: "All destinations" },
        ...Array.from(new Set(candidateToLegs.map((l) => l.to.toUpperCase())))
          .sort()
          .map((code) => {
            const sample = candidateToLegs.find((l) => l.to.toUpperCase() === code);
            const a = formatAirport(code);
            const city = sample?.toCity?.trim() || a.city;
            const normalized = { city, code: a.code };
            return { value: code, label: formatAirportOptionLabel(normalized) };
          }),
      ],
    [candidateToLegs],
  );

  const filteredFromOptions = useMemo(() => {
    const q = fromQuery.trim().toLowerCase();
    if (!q) return fromOptions;
    return fromOptions.filter(
      (opt) =>
        opt.value === "all" ||
        opt.label.toLowerCase().includes(q) ||
        opt.value.toLowerCase().includes(q),
    );
  }, [fromOptions, fromQuery]);

  const filteredToOptions = useMemo(() => {
    const q = toQuery.trim().toLowerCase();
    if (!q) return toOptions;
    return toOptions.filter(
      (opt) =>
        opt.value === "all" ||
        opt.label.toLowerCase().includes(q) ||
        opt.value.toLowerCase().includes(q),
    );
  }, [toOptions, toQuery]);

  const paxOptions = useMemo(
    () =>
      [
        { value: "any", label: "Any passenger count" },
        { value: "4_plus", label: "4+ passengers" },
        { value: "6_plus", label: "6+ passengers" },
        { value: "8_plus", label: "8+ passengers" },
        { value: "10_plus", label: "10+ passengers" },
      ],
    [],
  );

  const dateCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const leg of legs) {
      const key = toDateKey(leg.departure);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return counts;
  }, [legs]);

  const calendarCells = useMemo(() => {
    const first = monthStart(calendarMonth);
    const firstWeekday = first.getDay();
    const daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
    const cells: Array<{ key: string; day: number; inMonth: boolean }> = [];
    for (let i = 0; i < firstWeekday; i++) {
      cells.push({ key: `pad-start-${i}`, day: 0, inMonth: false });
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(first.getFullYear(), first.getMonth(), day);
      cells.push({ key: ymd(date), day, inMonth: true });
    }
    while (cells.length % 7 !== 0) {
      cells.push({ key: `pad-end-${cells.length}`, day: 0, inMonth: false });
    }
    return cells;
  }, [calendarMonth]);

  const filtered = useMemo(() => {
    const result = legs.filter((leg) => {
      if (fromCode !== "all" && leg.from.toUpperCase() !== fromCode) return false;
      if (toCode !== "all" && leg.to.toUpperCase() !== toCode) return false;
      if (dateKey && toDateKey(leg.departure) !== dateKey) return false;

      if (paxCount === "4_plus" && leg.passengers < 4) return false;
      if (paxCount === "6_plus" && leg.passengers < 6) return false;
      if (paxCount === "8_plus" && leg.passengers < 8) return false;
      if (paxCount === "10_plus" && leg.passengers < 10) return false;

      if (priceBand === "priced" && leg.priceMargin === undefined) return false;
      if (priceBand === "under_5000") {
        if (leg.priceMargin === undefined || leg.priceMargin > 5000) return false;
      }
      if (priceBand === "under_10000") {
        if (leg.priceMargin === undefined || leg.priceMargin > 10000) return false;
      }
      if (priceBand === "under_20000") {
        if (leg.priceMargin === undefined || leg.priceMargin > 20000) return false;
      }

      return true;
    });

    result.sort((a, b) => new Date(a.departure).getTime() - new Date(b.departure).getTime());

    return result;
  }, [
    dateKey,
    fromCode,
    legs,
    paxCount,
    priceBand,
    toCode,
  ]);

  function clearFilters() {
    setFromCode("all");
    setToCode("all");
    setFromQuery("");
    setToQuery("");
    setDateKey("");
    setPaxCount("any");
    setPriceBand("any");
  }

  async function handleRequestSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!requestLeg) return;

    const formData = new FormData(event.currentTarget);
    formData.set("emptyLegId", requestLeg.id);
    formData.set("from", requestLeg.from);
    formData.set("to", requestLeg.to);
    formData.set("departure", requestLeg.departure);
    formData.set("aircraftType", requestLeg.aircraftType);
    if (!formData.get("passengers")) {
      formData.set("passengers", String(Math.max(requestLeg.passengers || 1, 1)));
    }

    setRequestStatus("loading");
    setRequestMessage("");
    try {
      const res = await fetch("/api/rfq", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const text = await res.text();
        setRequestStatus("error");
        setRequestMessage("Failed to submit request. Please try again.");
        console.error(text);
        return;
      }
      setRequestStatus("success");
      setRequestMessage("Request sent. Our team and operator desk are now coordinating your flight.");
    } catch (err) {
      setRequestStatus("error");
      setRequestMessage("Failed to submit request. Please try again.");
      console.error(err);
    }
  }

  function selectFrom(value: string, label: string) {
    setFromCode(value);
    setFromQuery(value === "all" ? "" : label);
    setFromOpen(false);

    if (toCode === "all") return;
    const stillValid = legs.some(
      (leg) =>
        (value === "all" || leg.from.toUpperCase() === value) &&
        leg.to.toUpperCase() === toCode,
    );
    if (!stillValid) {
      setToCode("all");
      setToQuery("");
    }
  }

  function selectTo(value: string, label: string) {
    setToCode(value);
    setToQuery(value === "all" ? "" : label);
    setToOpen(false);

    if (fromCode === "all") return;
    const stillValid = legs.some(
      (leg) =>
        (value === "all" || leg.to.toUpperCase() === value) &&
        leg.from.toUpperCase() === fromCode,
    );
    if (!stillValid) {
      setFromCode("all");
      setFromQuery("");
    }
  }

  return (
    <div className="space-y-6">
      <div className="border border-[var(--brand-border)] bg-[rgba(205,163,73,0.03)] px-3 py-3 sm:px-4">
        {/* Filter grid: 1 column on phones (each filter full width), 2 on
            small tablets, then a full row on xl+. Each filter wrapper stays
            relative so the dropdown anchors correctly inside its own grid
            cell instead of stretching unpredictably. */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:flex xl:flex-nowrap xl:items-center">
          <div
            className="relative xl:flex-1"
            onBlur={() => {
              setTimeout(() => setFromOpen(false), 100);
            }}
          >
            <input
              className="w-full border border-[var(--brand-border)] bg-[rgba(205,163,73,0.04)] px-3 py-2.5 sm:py-2 font-[var(--font-mono)] text-[12px] tracking-[0.5px] pr-9 outline-none transition focus:border-[var(--brand)]"
              value={fromQuery}
              onFocus={() => setFromOpen(true)}
              onChange={(e) => {
                const next = e.target.value;
                setFromQuery(next);
                setFromOpen(true);
                if (!next.trim()) {
                  setFromCode("all");
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const pick = filteredFromOptions.find((opt) => opt.value !== "all");
                  if (pick) selectFrom(pick.value, pick.label);
                }
              }}
              placeholder="Origin city or airport.."
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-300">▼</span>
            {fromOpen && (
              <div className="absolute z-20 mt-2 max-h-56 w-full overflow-auto border border-[var(--brand-border)] bg-[rgba(15,26,20,0.98)] p-1 shadow-2xl">
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    selectFrom("all", defaultFromLabel);
                  }}
                  className="block w-full px-2.5 py-2 text-left font-[var(--font-mono)] text-[12px] text-slate-200 hover:bg-[rgba(205,163,73,0.1)]"
                >
                  {defaultFromLabel}
                </button>
                {filteredFromOptions
                  .filter((opt) => opt.value !== "all")
                  .map((opt) => (
                    <button
                      type="button"
                      key={opt.value}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        selectFrom(opt.value, opt.label);
                      }}
                      className="block w-full px-2.5 py-2 text-left font-[var(--font-mono)] text-[12px] text-slate-200 hover:bg-[rgba(205,163,73,0.1)]"
                    >
                      {opt.label}
                    </button>
                  ))}
                {!filteredFromOptions.filter((opt) => opt.value !== "all").length && (
                  <div className="px-2.5 py-2 text-sm text-slate-400">No matching origins</div>
                )}
              </div>
            )}
          </div>
          <div
            className="relative xl:flex-1"
            onBlur={() => {
              setTimeout(() => setToOpen(false), 100);
            }}
          >
            <input
              className="w-full border border-[var(--brand-border)] bg-[rgba(205,163,73,0.04)] px-3 py-2.5 sm:py-2 font-[var(--font-mono)] text-[12px] tracking-[0.5px] pr-9 outline-none transition focus:border-[var(--brand)]"
              value={toQuery}
              onFocus={() => setToOpen(true)}
              onChange={(e) => {
                const next = e.target.value;
                setToQuery(next);
                setToOpen(true);
                if (!next.trim()) {
                  setToCode("all");
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const pick = filteredToOptions.find((opt) => opt.value !== "all");
                  if (pick) selectTo(pick.value, pick.label);
                }
              }}
              placeholder="Destination city or airport.."
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-300">▼</span>
            {toOpen && (
              <div className="absolute z-20 mt-2 max-h-56 w-full overflow-auto border border-[var(--brand-border)] bg-[rgba(15,26,20,0.98)] p-1 shadow-2xl">
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    selectTo("all", defaultToLabel);
                  }}
                  className="block w-full px-2.5 py-2 text-left font-[var(--font-mono)] text-[12px] text-slate-200 hover:bg-[rgba(205,163,73,0.1)]"
                >
                  {defaultToLabel}
                </button>
                {filteredToOptions
                  .filter((opt) => opt.value !== "all")
                  .map((opt) => (
                    <button
                      type="button"
                      key={opt.value}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        selectTo(opt.value, opt.label);
                      }}
                      className="block w-full px-2.5 py-2 text-left font-[var(--font-mono)] text-[12px] text-slate-200 hover:bg-[rgba(205,163,73,0.1)]"
                    >
                      {opt.label}
                    </button>
                  ))}
                {!filteredToOptions.filter((opt) => opt.value !== "all").length && (
                  <div className="px-2.5 py-2 text-sm text-slate-400">No matching destinations</div>
                )}
              </div>
            )}
          </div>

          <div className="relative xl:flex-1">
            <button
              type="button"
              onClick={() => setCalendarOpen((v) => !v)}
              className="w-full border border-[var(--brand-border)] bg-[rgba(205,163,73,0.04)] px-3 py-2.5 sm:py-2 font-[var(--font-mono)] text-[12px] tracking-[0.5px] text-left outline-none transition hover:border-[var(--brand)]/70"
            >
              {dateKey ? `Date: ${dateKey}` : "Any date"}
            </button>
            {calendarOpen && (
              <div className="absolute right-0 z-20 mt-2 w-[min(290px,calc(100vw-2rem))] border border-[var(--brand-border)] bg-[rgba(12,19,35,0.98)] p-3 shadow-2xl xl:left-0 xl:right-auto">
                <div className="mb-2 flex items-center justify-between">
                  <button
                    type="button"
                    className="border border-[var(--brand-border)] px-2 py-1 font-[var(--font-mono)] text-[11px] text-slate-200 hover:border-[var(--brand)]"
                    onClick={() => setCalendarMonth((m) => shiftMonth(m, -1))}
                  >
                    Prev
                  </button>
                  <div className="text-sm font-semibold text-[var(--brand)]">
                    {toMonthLabel(calendarMonth)}
                  </div>
                  <button
                    type="button"
                    className="border border-[var(--brand-border)] px-2 py-1 font-[var(--font-mono)] text-[11px] text-slate-200 hover:border-[var(--brand)]"
                    onClick={() => setCalendarMonth((m) => shiftMonth(m, 1))}
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
                  {calendarCells.map((cell) => {
                    if (!cell.inMonth) {
                      return <div key={cell.key} className="h-8" />;
                    }
                    const hasFlights = (dateCounts.get(cell.key) ?? 0) > 0;
                    const selected = dateKey === cell.key;
                    return (
                      <button
                        type="button"
                        key={cell.key}
                        onClick={() => {
                          setDateKey(cell.key);
                          setCalendarOpen(false);
                        }}
                        className={`relative h-8 rounded-md text-xs transition ${
                          selected
                            ? "bg-[var(--brand)] text-slate-950"
                            : hasFlights
                              ? "bg-[var(--brand)]/20 text-[var(--brand)] hover:bg-[var(--brand)]/30"
                              : "bg-white/5 text-slate-300 hover:bg-white/10"
                        }`}
                      >
                        {cell.day}
                        {hasFlights && !selected && (
                          <span className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[var(--brand)]" />
                        )}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-300/80">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand)]/30" />
                    Days with flights
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setDateKey("");
                      setCalendarOpen(false);
                    }}
                    className="text-[var(--brand)]"
                  >
                    Clear date
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="relative xl:flex-1">
            <select
              className="w-full appearance-none border border-[var(--brand-border)] bg-[rgba(205,163,73,0.04)] px-3 py-2.5 sm:py-2 font-[var(--font-mono)] text-[12px] tracking-[0.5px] pr-9 outline-none transition focus:border-[var(--brand)]"
              value={paxCount}
              onChange={(e) => setPaxCount(e.target.value)}
            >
              {paxOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-300">
              ▼
            </span>
          </div>

          <div className="relative xl:flex-1">
            <select
              className="w-full appearance-none border border-[var(--brand-border)] bg-[rgba(205,163,73,0.04)] px-3 py-2.5 sm:py-2 font-[var(--font-mono)] text-[12px] tracking-[0.5px] pr-9 outline-none transition focus:border-[var(--brand)]"
              value={priceBand}
              onChange={(e) => setPriceBand(e.target.value)}
            >
              <option value="any">Any pricing</option>
              <option value="priced">Priced flights only</option>
              <option value="under_5000">Under $5,000</option>
              <option value="under_10000">Under $10,000</option>
              <option value="under_20000">Under $20,000</option>
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-300">
              ▼
            </span>
          </div>

          {/* Count + Clear share a single row on mobile (col-span-full)
              and trail the filters inline on xl+. */}
          <div className="col-span-full flex items-center justify-between border-t border-[var(--brand-border)]/50 pt-2 sm:col-span-2 xl:col-span-1 xl:flex-none xl:border-t-0 xl:pt-0">
            <span className="font-[var(--font-mono)] text-[11px] tabular-nums tracking-[0.5px] text-slate-500">
              {filtered.length} of {legs.length}
            </span>
            <button
              className="px-3 py-1.5 font-[var(--font-mono)] text-[11px] uppercase tracking-[1px] text-slate-400 transition hover:text-[var(--brand)]"
              onClick={clearFilters}
              type="button"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((leg) => {
          const fromBase = formatAirport(leg.from);
          const toBase = formatAirport(leg.to);
          const from = {
            city: leg.fromCity?.trim() || fromBase.city,
            code: fromBase.code,
          };
          const to = {
            city: leg.toCity?.trim() || toBase.city,
            code: toBase.code,
          };
          return (
            <div
              key={leg.id}
              className="group h-full border border-[var(--brand-border)] bg-gradient-to-br from-[rgba(205,163,73,0.06)] to-[rgba(11,18,32,0.85)] p-5 transition hover:border-[var(--brand)] hover:shadow-[0_16px_50px_rgba(0,0,0,0.4)]"
            >
              <div className="flex h-full flex-col">
                {leg.imageUrl && (
                  <div className="mb-4 overflow-hidden border border-[var(--brand-border)]">
                    <img
                      src={leg.imageUrl}
                      alt={`${leg.aircraftType} empty leg`}
                      className="h-36 w-full object-cover"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
                <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-lg font-semibold text-slate-100">{from.city}</p>
                    {from.city !== from.code && (
                      <p className="mt-0.5 text-xs uppercase tracking-[0.14em] text-slate-400">{from.code}</p>
                    )}
                  </div>
                  <div className="pt-1 text-sm text-[var(--brand)]/90">→</div>
                  <div className="min-w-0 text-right">
                    <p className="truncate text-lg font-semibold text-slate-100">{to.city}</p>
                    {to.city !== to.code && (
                      <p className="mt-0.5 text-xs uppercase tracking-[0.14em] text-slate-400">{to.code}</p>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-slate-300/70">{formatDeparture(leg.departure)}</p>
                  <span className="border border-[var(--brand)] bg-[var(--brand)] px-2.5 py-1 font-[var(--font-mono)] text-[11px] font-medium uppercase tracking-[1px] text-[#0a0c12]">
                    {leg.aircraftType}
                  </span>
                </div>
                <div className="mt-3 border-t border-white/10 pt-3 text-sm text-slate-200/80">
                  Pax: {leg.passengers}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-base font-semibold text-[var(--brand)]">
                    {leg.priceMargin
                      ? `${leg.currency ?? "USD"} ${leg.priceMargin.toLocaleString()}`
                      : "Inquire for pricing"}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setRequestLeg(leg);
                      setRequestStatus("idle");
                      setRequestMessage("");
                    }}
                    className="font-[var(--font-mono)] text-[11px] uppercase tracking-[1px] text-[var(--brand)] transition group-hover:translate-x-0.5"
                  >
                    Request Flight →
                  </button>
                </div>
                {leg.notes && <div className="mt-2 text-xs text-slate-400">{leg.notes}</div>}
              </div>
            </div>
          );
        })}
      </div>
      {requestLeg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-xl border border-[var(--brand-border)] bg-[#0d1528] p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="font-[var(--font-display)] text-2xl text-[var(--brand)]">Request This Flight</h4>
                <p className="mt-1 text-sm text-slate-300/85">
                  {requestLeg.from} → {requestLeg.to} · {formatDeparture(requestLeg.departure)} · {requestLeg.aircraftType}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setRequestLeg(null)}
                className="border border-[var(--brand-border)] px-2 py-1 font-[var(--font-mono)] text-[11px] uppercase tracking-[1px] text-slate-200 hover:border-[var(--brand)]"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleRequestSubmit} className="mt-4 grid gap-3 md:grid-cols-2">
              <input
                name="name"
                required
                className="border border-[var(--brand-border)] bg-[rgba(205,163,73,0.04)] px-3 py-2 font-[var(--font-mono)] text-[12px] tracking-[0.5px] text-sm outline-none transition focus:border-[var(--brand)]"
                placeholder="Name"
              />
              <input
                name="email"
                type="email"
                required
                className="border border-[var(--brand-border)] bg-[rgba(205,163,73,0.04)] px-3 py-2 font-[var(--font-mono)] text-[12px] tracking-[0.5px] text-sm outline-none transition focus:border-[var(--brand)]"
                placeholder="Email"
              />
              <input
                name="phone"
                type="tel"
                className="border border-[var(--brand-border)] bg-[rgba(205,163,73,0.04)] px-3 py-2 font-[var(--font-mono)] text-[12px] tracking-[0.5px] text-sm outline-none transition focus:border-[var(--brand)]"
                placeholder="Phone (optional)"
              />
              <input
                name="passengers"
                type="number"
                min={1}
                className="border border-[var(--brand-border)] bg-[rgba(205,163,73,0.04)] px-3 py-2 font-[var(--font-mono)] text-[12px] tracking-[0.5px] text-sm outline-none transition focus:border-[var(--brand)]"
                placeholder="Passengers"
              />
              <textarea
                name="clientMessage"
                rows={3}
                defaultValue={`Hi Black Star team, I’m interested in this empty leg (${requestLeg.from} → ${requestLeg.to} on ${formatDeparture(requestLeg.departure)}). Please proceed with availability and next steps.`}
                className="md:col-span-2 border border-[var(--brand-border)] bg-[rgba(205,163,73,0.04)] px-3 py-2 font-[var(--font-mono)] text-[12px] tracking-[0.5px] text-sm outline-none transition focus:border-[var(--brand)]"
                placeholder="Client message"
              />
              <textarea
                name="notes"
                rows={3}
                className="md:col-span-2 border border-[var(--brand-border)] bg-[rgba(205,163,73,0.04)] px-3 py-2 font-[var(--font-mono)] text-[12px] tracking-[0.5px] text-sm outline-none transition focus:border-[var(--brand)]"
                placeholder="Any trip notes or preferences"
              />
              <button
                type="submit"
                disabled={requestStatus === "loading" || requestStatus === "success"}
                className="btn-sharp btn-primary md:col-span-2 w-full disabled:opacity-60"
              >
                {requestStatus === "loading" ? "Submitting..." : "Send Request"}
              </button>
              {requestMessage && (
                <p
                  className={`md:col-span-2 text-sm ${
                    requestStatus === "success" ? "text-[var(--brand)]" : "text-red-300"
                  }`}
                >
                  {requestMessage}
                </p>
              )}
            </form>
          </div>
        </div>
      )}
      {!filtered.length && (
        <div className="border border-[var(--brand-border)] bg-[rgba(205,163,73,0.03)] p-5 text-sm text-slate-300/80">
          No results match your filters. Try broadening route, date, or pricing criteria.
        </div>
      )}
    </div>
  );
}
