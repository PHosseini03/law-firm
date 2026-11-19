import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Award, Phone } from "lucide-react";
import { Reveal } from "../components/Reveal";
import { AttorneyCard, InsightCard, PracticeCard, ResultCard, TestimonialCard } from "../components/Cards";
import { useApi } from "../hooks/useApi";
import { useCountUp } from "../hooks/useCountUp";
import {
  CONTACT, DEMO_ATTORNEYS, DEMO_INSIGHTS, DEMO_PRACTICE_AREAS, DEMO_RESULTS, DEMO_TESTIMONIALS,
  type Attorney, type CaseResult, type Insight, type PracticeArea, type Testimonial,
} from "../data/demo";

const RECOGNITION = ["Top-Prozesskanzlei 2026", "Beste Wirtschaftskanzlei · Hessen", "Mandantenpreis", "Prozessanwältin des Jahres", "Von Kollegen empfohlen"];

function Counter({ value, prefix = "", suffix = "", label }: { value: number; prefix?: string; suffix?: string; label: string }) {
  const { ref, value: current } = useCountUp(value);
  return (
    <div>
      <p className="font-serif text-3xl text-forest sm:text-5xl">
        {prefix}<span ref={ref}>{Math.round(current)}</span>{suffix}
      </p>
      <p className="mt-1 text-[10px] font-semibold tracking-[0.14em] text-stone uppercase sm:text-xs">{label}</p>
    </div>
  );
}

function SectionHead({ kicker, title, link }: { kicker: string; title: string; link?: { to: string; label: string } }) {
  return (
    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
      <Reveal className="max-w-2xl">
        <span className="kicker">{kicker}</span>
        <h2 className="heading mt-5">{title}</h2>
      </Reveal>
      {link && <Link to={link.to} className="link-arrow shrink-0">{link.label} <ArrowRight className="size-4" aria-hidden /></Link>}
    </div>
  );
}

function Hero() {
  return (
    <section className="paper-texture relative overflow-hidden">
      <div className="container-x grid items-center gap-14 py-16 sm:py-20 lg:grid-cols-[1.1fr_1fr] lg:py-24">
        <div>
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="kicker">Seit 2002 · Frankfurt am Main &amp; Düsseldorf</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mt-7 text-5xl leading-[0.98] text-forest sm:text-7xl lg:text-[5.4rem]">
            Beistand, der <em className="text-brass-2">standhält</em>.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.8 }} className="lead mt-7 max-w-xl">
            Sterling &amp; Partner ist eine prozesserfahrene Kanzlei für Unternehmen, Familien und Menschen in den wichtigsten rechtlichen Momenten ihres Lebens. Wir bereiten jedes Mandat so vor, als ginge es vor Gericht – deshalb müssen es so viele gar nicht erst.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.8 }} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link to="/contact" className="btn-primary">Vertrauliche Erstberatung anfragen <ArrowRight className="size-4" aria-hidden /></Link>
            <a href={`tel:${CONTACT.phone}`} className="btn-outline"><Phone className="size-4" aria-hidden /> {CONTACT.phone}</a>
          </motion.div>
          <div className="rule mt-12 grid grid-cols-3 gap-4 pt-8">
            <Counter value={180} suffix="+" label="Mio. € erstritten" />
            <Counter value={24} label="Jahre Erfahrung" />
            <Counter value={98} suffix="%" label="Zufriedene Mandanten" />
          </div>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="relative mx-auto w-full max-w-lg lg:max-w-none">
          <div className="absolute -right-3 -bottom-3 hidden size-full border border-brass sm:block" aria-hidden />
          <img src="/images/hero.jpg" alt="Juristische Bibliothek mit Marmorbüsten und ledergebundenen Büchern" className="relative aspect-[4/5] w-full object-cover" fetchPriority="high" />
          <div className="absolute -bottom-6 left-4 max-w-[16rem] bg-forest p-5 text-cream shadow-xl sm:-left-8">
            <Award className="size-6 text-brass" aria-hidden />
            <p className="mt-3 font-serif text-3xl">8,75 Mio. €</p>
            <p className="mt-1 text-xs leading-relaxed text-cream/75">Abfindung für einen Minderheitsgesellschafter, 2025</p>
          </div>
        </motion.div>
      </div>
      <div className="border-y border-forest/10 bg-parchment/60">
        <ul className="container-x flex flex-wrap items-center justify-center gap-x-10 gap-y-3 py-5 text-sm text-stone" aria-label="Auszeichnungen">
          {RECOGNITION.map((r) => <li key={r} className="font-serif text-base italic">{r}</li>)}
        </ul>
      </div>
    </section>
  );
}

export default function Home() {
  const { data: areas } = useApi<PracticeArea[]>("/api/practice-areas", DEMO_PRACTICE_AREAS);
  const { data: results } = useApi<CaseResult[]>("/api/results", DEMO_RESULTS);
  const { data: attorneys } = useApi<Attorney[]>("/api/attorneys", DEMO_ATTORNEYS);
  const { data: testimonials } = useApi<Testimonial[]>("/api/testimonials", DEMO_TESTIMONIALS);
  const { data: insights } = useApi<Insight[]>("/api/insights", DEMO_INSIGHTS);

  return (
    <>
      <Hero />

      <section className="section">
        <div className="container-x">
          <SectionHead kicker="Rechtsgebiete" title="Fundierte Expertise, wo es darauf ankommt" link={{ to: "/practice-areas", label: "Alle Rechtsgebiete" }} />
          <div className="mt-14 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
            {areas.map((a, i) => <Reveal key={a.slug} delay={(i % 3) * 0.06}><PracticeCard area={a} index={i} /></Reveal>)}
          </div>
        </div>
      </section>

      <section className="section bg-forest text-cream">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <Reveal className="max-w-2xl">
              <span className="kicker kicker-light">Erfolge</span>
              <h2 className="mt-5 text-4xl leading-[1.08] text-cream sm:text-5xl lg:text-6xl">Ergebnisse, die für sich sprechen</h2>
            </Reveal>
            <Link to="/results" className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-cream underline decoration-brass decoration-2 underline-offset-[6px] hover:text-brass">Alle Ergebnisse <ArrowRight className="size-4" aria-hidden /></Link>
          </div>
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {results.slice(0, 3).map((r, i) => <Reveal key={r.id} delay={i * 0.08}><ResultCard result={r} dark /></Reveal>)}
          </div>
          <p className="mt-12 text-xs text-cream/50">Frühere Ergebnisse sind keine Garantie für den Ausgang künftiger Verfahren. Alle gezeigten Ergebnisse sind fiktive Demo-Inhalte.</p>
        </div>
      </section>

      <section className="section">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <img src="/images/justice.jpg" alt="Statue der Justitia mit Waage" loading="lazy" className="aspect-[5/4] w-full object-cover" />
          </Reveal>
          <Reveal delay={0.1}>
            <span className="kicker">Unser Ansatz</span>
            <h2 className="heading mt-5">Großkanzlei-Expertise. Persönliche Betreuung.</h2>
            <p className="dropcap mt-7 text-lg leading-relaxed text-stone">
              Jede Mandantin und jeder Mandant arbeitet vom ersten Gespräch bis zum Abschluss direkt mit einer Partnerin oder einem Partner zusammen. Wir halten die Zahl unserer Mandate bewusst klein, erklären Ihre Optionen verständlich und legen die Kosten offen, bevor wir tätig werden. Scheitern Verhandlungen, ist unser Prozessteam bereit – und die Gegenseite weiß das.
            </p>
            <Link to="/attorneys" className="link-arrow mt-8">Unser Team kennenlernen <ArrowRight className="size-4" aria-hidden /></Link>
          </Reveal>
        </div>
      </section>

      <section className="section bg-parchment/50">
        <div className="container-x">
          <SectionHead kicker="Das Team" title="Anwälte, die Sie an Ihrer Seite wissen wollen" link={{ to: "/attorneys", label: "Gesamtes Team" }} />
          <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-8 lg:grid-cols-4">
            {attorneys.map((a, i) => <Reveal key={a.slug} delay={i * 0.06}><AttorneyCard attorney={a} /></Reveal>)}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-x">
          <SectionHead kicker="Stimmen unserer Mandanten" title="Vertrauen, wenn es darauf ankommt" />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => <Reveal key={t.id} delay={i * 0.06}><TestimonialCard testimonial={t} /></Reveal>)}
          </div>
        </div>
      </section>

      <section className="section border-t border-forest/10">
        <div className="container-x">
          <SectionHead kicker="Fachbeiträge" title="Rechtliche Einordnungen, verständlich geschrieben" link={{ to: "/insights", label: "Alle Beiträge" }} />
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {insights.slice(0, 3).map((n, i) => <Reveal key={n.id} delay={i * 0.06}><InsightCard insight={n} /></Reveal>)}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-forest">
        <img src="/images/courthouse.jpg" alt="" className="absolute inset-0 size-full object-cover opacity-15" />
        <div className="container-x relative py-20 text-center sm:py-28">
          <Reveal>
            <span className="kicker kicker-light justify-center">Vertrauliche Erstberatung</span>
            <h2 className="mx-auto mt-6 max-w-3xl text-4xl leading-tight text-cream sm:text-6xl">Schildern Sie uns Ihren Fall. Wir sagen Ihnen, wo Sie stehen.</h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-cream/75">Kostenlose, unverbindliche Ersteinschätzung durch eine Partnerin oder einen Partner – in der Regel innerhalb eines Werktags.</p>
            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/contact" className="btn-light">Fallprüfung starten <ArrowRight className="size-4" aria-hidden /></Link>
              <a href={`tel:${CONTACT.phone}`} className="btn border border-cream/30 text-cream hover:border-cream">Anrufen: {CONTACT.phone}</a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
