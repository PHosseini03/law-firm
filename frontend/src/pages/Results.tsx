import { useState } from "react";
import { PageHeader } from "../components/PageHeader";
import { Reveal } from "../components/Reveal";
import { InsightCard, ResultCard } from "../components/Cards";
import { useApi } from "../hooks/useApi";
import { DEMO_INSIGHTS, DEMO_PRACTICE_AREAS, DEMO_RESULTS, type CaseResult, type Insight } from "../data/demo";
import { formatAmount } from "../lib/format";

const ALL = "all";

interface FilterBarProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  label: string;
}

function FilterBar({ options, value, onChange, label }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o.value} type="button" onClick={() => onChange(o.value)} aria-pressed={value === o.value} className={`border px-4 py-2 text-sm transition ${value === o.value ? "border-forest bg-forest text-cream" : "border-forest/20 text-forest hover:border-forest"}`}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Results() {
  const { data: results, loading } = useApi<CaseResult[]>("/api/results", DEMO_RESULTS);
  const [category, setCategory] = useState(ALL);
  const categories = DEMO_PRACTICE_AREAS.filter((p) => results.some((r) => r.category === p.slug));
  const visible = category === ALL ? results : results.filter((r) => r.category === category);
  const total = results.reduce((sum, r) => sum + r.amount, 0);

  return (
    <>
      <PageHeader eyebrow="Erfolge" title="Eine Bilanz, die vor Gericht entstanden ist." lead={`Über ${formatAmount(total)} allein in den hier gezeigten Verfahren – dazu zahlreiche vertrauliche Vergleiche, die wir nicht veröffentlichen.`} image="/images/courthouse.jpg" />
      <section className="section">
        <div className="container-x">
          <FilterBar label="Ergebnisse nach Rechtsgebiet filtern" value={category} onChange={setCategory} options={[{ value: ALL, label: "Alle Ergebnisse" }, ...categories.map((c) => ({ value: c.slug, label: c.name }))]} />
          <div className="mt-12 grid gap-x-10 gap-y-14 md:grid-cols-2 lg:grid-cols-3" aria-busy={loading}>
            {visible.map((r, i) => <Reveal key={r.id} delay={(i % 3) * 0.06}><ResultCard result={r} /></Reveal>)}
          </div>
          {visible.length === 0 && <p className="mt-12 text-stone">In diesem Bereich sind noch keine Ergebnisse veröffentlicht.</p>}
          <p className="mt-16 border-t border-forest/10 pt-6 text-xs text-stone">Frühere Ergebnisse sind keine Garantie für den Ausgang künftiger Verfahren. Jeder Fall ist anders. Alle gezeigten Ergebnisse sind fiktive Demo-Inhalte.</p>
        </div>
      </section>
    </>
  );
}

export function Insights() {
  const { data: insights } = useApi<Insight[]>("/api/insights", DEMO_INSIGHTS);
  const [category, setCategory] = useState(ALL);
  const categories = Array.from(new Set(insights.map((n) => n.category)));
  const visible = category === ALL ? insights : insights.filter((n) => n.category === category);
  const [featured, ...rest] = visible;

  return (
    <>
      <PageHeader eyebrow="Fachbeiträge" title="Perspektiven aus der Praxis." lead="Praktische Orientierung zu den Rechtsfragen, die unsere Mandanten am häufigsten stellen – verständlich erklärt." image="/images/contract.jpg" />
      <section className="section">
        <div className="container-x">
          <FilterBar label="Beiträge nach Thema filtern" value={category} onChange={setCategory} options={[{ value: ALL, label: "Alle Themen" }, ...categories.map((c) => ({ value: c, label: c }))]} />
          {featured && (
            <Reveal className="mt-12 grid gap-8 border-t-2 border-forest pt-8 lg:grid-cols-[1.2fr_1fr]">
              <img src="/images/signing.jpg" alt="Anwältin unterzeichnet ein Dokument" loading="lazy" className="aspect-[16/10] w-full object-cover" />
              <div className="self-center"><InsightCard insight={featured} /></div>
            </Reveal>
          )}
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {rest.map((n, i) => <Reveal key={n.id} delay={i * 0.06}><InsightCard insight={n} /></Reveal>)}
          </div>
        </div>
      </section>
    </>
  );
}
