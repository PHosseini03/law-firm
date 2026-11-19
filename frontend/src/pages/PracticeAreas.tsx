import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { Reveal } from "../components/Reveal";
import { AttorneyCard, PracticeCard, ResultCard } from "../components/Cards";
import { ConsultationForm } from "../components/ConsultationForm";
import { useApi } from "../hooks/useApi";
import { DEMO_PRACTICE_AREAS, demoPracticeDetail, type PracticeArea, type PracticeDetail } from "../data/demo";
import NotFound from "./NotFound";

export function PracticeAreas() {
  const { data: areas } = useApi<PracticeArea[]>("/api/practice-areas", DEMO_PRACTICE_AREAS);
  return (
    <>
      <PageHeader eyebrow="Rechtsgebiete" title="Wo wir beraten, setzen wir Maßstäbe." lead="Sechs Schwerpunkte, jeweils geführt von einer Partnerin oder einem Partner mit langjähriger Erfahrung vor Gericht und am Verhandlungstisch." image="/images/books.jpg" />
      <section className="section">
        <div className="container-x grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((a, i) => <Reveal key={a.slug} delay={(i % 3) * 0.06}><PracticeCard area={a} index={i} /></Reveal>)}
        </div>
      </section>
    </>
  );
}

export function PracticeAreaDetail() {
  const { slug = "" } = useParams();
  const { data: area, loading } = useApi<PracticeDetail | null>(`/api/practice-areas/${encodeURIComponent(slug)}`, demoPracticeDetail(slug));

  if (!area) return loading ? <div className="min-h-[60vh]" aria-busy="true" /> : <NotFound />;

  return (
    <>
      <PageHeader eyebrow="Rechtsgebiet" title={area.name} lead={area.summary} image={area.image}>
        <Link to="/practice-areas" className="mt-8 inline-flex items-center gap-2 text-sm text-cream/80 hover:text-brass"><ArrowLeft className="size-4" aria-hidden /> Alle Rechtsgebiete</Link>
      </PageHeader>
      <section className="section">
        <div className="container-x grid gap-14 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <Reveal>
              <p className="dropcap text-xl leading-relaxed text-ink/85">{area.description}</p>
              <h2 className="mt-12 text-3xl text-forest">So helfen wir Ihnen</h2>
              <ul className="mt-6 grid gap-x-8 sm:grid-cols-2">
                {area.services.map((s) => (
                  <li key={s} className="flex items-center gap-3 border-b border-forest/10 py-4 text-forest"><Check className="size-4 text-brass-2" aria-hidden />{s}</li>
                ))}
              </ul>
            </Reveal>
            {area.results.length > 0 && (
              <Reveal className="mt-16">
                <h2 className="text-3xl text-forest">Ausgewählte Ergebnisse</h2>
                <div className="mt-8 grid gap-10 sm:grid-cols-2">
                  {area.results.map((r) => <ResultCard key={r.id} result={r} />)}
                </div>
              </Reveal>
            )}
            {area.attorneys.length > 0 && (
              <Reveal className="mt-16">
                <h2 className="text-3xl text-forest">Ihre Ansprechpartner in diesem Bereich</h2>
                <div className="mt-8 grid gap-10 sm:grid-cols-2">
                  {area.attorneys.map((a) => <AttorneyCard key={a.slug} attorney={a} />)}
                </div>
              </Reveal>
            )}
          </div>
          <aside className="lg:sticky lg:top-36 lg:self-start">
            <div className="border-t-4 border-brass bg-white p-6 shadow-[0_1px_0_rgb(15_42_34/0.1)] sm:p-8">
              <h2 className="text-2xl text-forest">Ihr Anliegen besprechen</h2>
              <p className="mt-2 mb-6 text-sm text-stone">Kostenlos und vertraulich. Eine Partnerin oder ein Partner prüft jede Anfrage.</p>
              <ConsultationForm defaultArea={area.slug} />
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
