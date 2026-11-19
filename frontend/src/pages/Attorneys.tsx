import { Link, useParams } from "react-router-dom";
import { ArrowLeft, GraduationCap, Landmark, Mail } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { Reveal } from "../components/Reveal";
import { AttorneyCard } from "../components/Cards";
import { useApi } from "../hooks/useApi";
import { DEMO_ATTORNEYS, DEMO_PRACTICE_AREAS, type Attorney } from "../data/demo";
import NotFound from "./NotFound";

export function Attorneys() {
  const { data: attorneys } = useApi<Attorney[]>("/api/attorneys", DEMO_ATTORNEYS);
  return (
    <>
      <PageHeader eyebrow="Das Team" title="Menschen, die sich gründlicher vorbereiten." lead="Ehemalige Staatsanwälte, erfahrene Prozessanwälte und verlässliche Berater. Jedes Mandat wird von einer Partnerin oder einem Partner verantwortet." image="/images/office.jpg" />
      <section className="section">
        <div className="container-x grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-8 lg:grid-cols-4">
          {attorneys.map((a, i) => <Reveal key={a.slug} delay={i * 0.06}><AttorneyCard attorney={a} /></Reveal>)}
        </div>
      </section>
    </>
  );
}

function Detail({ icon: Icon, title, items }: { icon: typeof Landmark; title: string; items: string[] }) {
  return (
    <div className="border-t border-forest/15 pt-5">
      <h2 className="flex items-center gap-2 font-sans text-xs font-semibold tracking-[0.18em] text-brass-2 uppercase"><Icon className="size-4" aria-hidden />{title}</h2>
      <ul className="mt-3 space-y-1.5 text-forest">{items.map((i) => <li key={i}>{i}</li>)}</ul>
    </div>
  );
}

export function AttorneyProfile() {
  const { slug = "" } = useParams();
  const fallback = DEMO_ATTORNEYS.find((a) => a.slug === slug) ?? null;
  const { data: attorney, loading } = useApi<Attorney | null>(`/api/attorneys/${encodeURIComponent(slug)}`, fallback);

  if (!attorney) return loading ? <div className="min-h-[60vh]" aria-busy="true" /> : <NotFound />;
  const areas = DEMO_PRACTICE_AREAS.filter((p) => attorney.practice.includes(p.slug));

  return (
    <section className="paper-texture">
      <div className="container-x py-14 sm:py-20">
        <Link to="/attorneys" className="inline-flex items-center gap-2 text-sm text-stone hover:text-forest"><ArrowLeft className="size-4" aria-hidden /> Alle Anwälte</Link>
        <div className="mt-10 grid gap-12 lg:grid-cols-[0.9fr_1.3fr] lg:gap-20">
          <Reveal>
            <div className="relative">
              <div className="absolute -right-3 -bottom-3 hidden size-full border border-brass sm:block" aria-hidden />
              <img src={attorney.image} alt={`Porträt von ${attorney.name}`} className="relative aspect-[4/5] w-full object-cover" />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <span className="kicker">{attorney.title}</span>
            <h1 className="mt-5 text-5xl text-forest sm:text-6xl">{attorney.name}</h1>
            <p className="mt-4 text-sm text-stone">{attorney.years} Jahre Berufserfahrung</p>
            <p className="dropcap mt-8 text-lg leading-relaxed text-ink/85">{attorney.bio}</p>
            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              <Detail icon={GraduationCap} title="Ausbildung" items={attorney.education} />
              <Detail icon={Landmark} title="Zulassung & Fachanwaltschaft" items={attorney.admissions} />
            </div>
            <div className="mt-8 border-t border-forest/15 pt-5">
              <h2 className="font-sans text-xs font-semibold tracking-[0.18em] text-brass-2 uppercase">Rechtsgebiete</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {areas.map((p) => <li key={p.slug}><Link to={`/practice-areas/${p.slug}`} className="inline-block border border-forest/20 px-3 py-1.5 text-sm text-forest hover:border-forest">{p.name}</Link></li>)}
              </ul>
            </div>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link to="/contact" className="btn-primary">Beratung anfragen</Link>
              <a href={`mailto:${attorney.email}`} className="btn-outline"><Mail className="size-4" aria-hidden /> {attorney.email}</a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
