import { Link } from "react-router-dom";
import { ArrowUpRight, Quote } from "lucide-react";
import type { Attorney, CaseResult, Insight, PracticeArea, Testimonial } from "../data/demo";
import { DEMO_PRACTICE_AREAS } from "../data/demo";
import { formatAmount, formatDate } from "../lib/format";
import { PracticeIcon } from "./PracticeIcon";

const practiceName = (slug: string): string => DEMO_PRACTICE_AREAS.find((p) => p.slug === slug)?.name ?? slug;

interface PracticeCardProps {
  area: PracticeArea;
  index: number;
}

export function PracticeCard({ area, index }: PracticeCardProps) {
  return (
    <Link to={`/practice-areas/${area.slug}`} className="group flex h-full flex-col border-t border-forest/15 bg-transparent pt-6 pb-8 transition hover:border-brass">
      <div className="flex items-start justify-between">
        <span className="font-serif text-sm text-brass-2">{String(index + 1).padStart(2, "0")}</span>
        <PracticeIcon name={area.icon} className="size-7 text-forest/70 transition group-hover:text-brass-2" />
      </div>
      <h3 className="mt-6 text-2xl text-forest sm:text-3xl">{area.name}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-stone">{area.summary}</p>
      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-forest group-hover:text-brass-2">
        Mehr erfahren <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
      </span>
    </Link>
  );
}

export function AttorneyCard({ attorney }: { attorney: Attorney }) {
  return (
    <Link to={`/attorneys/${attorney.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-parchment">
        <img src={attorney.image} alt={`Porträt von ${attorney.name}`} loading="lazy" className="size-full object-cover grayscale transition duration-700 group-hover:scale-[1.03] group-hover:grayscale-0" />
        <div className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-brass transition-transform duration-500 group-hover:scale-x-100" />
      </div>
      <h3 className="mt-4 text-xl text-forest sm:mt-5 sm:text-2xl">{attorney.name}</h3>
      <p className="mt-1 text-sm font-medium text-brass-2">{attorney.title}</p>
      <p className="mt-2 text-xs text-stone sm:text-sm">{attorney.practice.map(practiceName).join(" · ")}</p>
    </Link>
  );
}

interface ResultCardProps {
  result: CaseResult;
  dark?: boolean;
}

export function ResultCard({ result, dark = false }: ResultCardProps) {
  return (
    <article className={`flex h-full flex-col border-t-2 pt-6 ${dark ? "border-brass" : "border-forest"}`}>
      <p className={`font-serif text-5xl leading-none sm:text-6xl ${dark ? "text-cream" : "text-forest"}`}>{formatAmount(result.amount)}</p>
      <p className={`mt-3 text-xs font-semibold tracking-[0.18em] uppercase ${dark ? "text-brass" : "text-brass-2"}`}>
        {result.label} · {result.year}
      </p>
      <h3 className={`mt-4 text-xl ${dark ? "text-cream" : "text-forest"}`}>{result.title}</h3>
      <p className={`mt-2 flex-1 text-sm leading-relaxed ${dark ? "text-cream/70" : "text-stone"}`}>{result.summary}</p>
      <p className={`mt-4 text-xs ${dark ? "text-cream/50" : "text-stone/80"}`}>{practiceName(result.category)}</p>
    </article>
  );
}

export function InsightCard({ insight }: { insight: Insight }) {
  return (
    <article className="group flex h-full flex-col border-t border-forest/15 pt-6">
      <p className="text-xs font-semibold tracking-[0.18em] text-brass-2 uppercase">{insight.category}</p>
      <h3 className="mt-3 text-2xl leading-snug text-forest group-hover:text-pine">{insight.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-stone">{insight.excerpt}</p>
      <p className="mt-5 text-xs text-stone">
        <time dateTime={insight.date}>{formatDate(insight.date)}</time> · {insight.minutes} Min. Lesezeit
      </p>
    </article>
  );
}

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="flex h-full flex-col bg-white/70 p-8 shadow-[0_1px_0_rgb(15_42_34/0.08)]">
      <Quote className="size-8 text-brass" aria-hidden />
      <blockquote className="mt-5 flex-1 font-serif text-xl leading-snug text-forest">“{testimonial.quote}”</blockquote>
      <figcaption className="mt-6 text-sm text-stone">
        <span className="text-brass" aria-label={`${testimonial.rating} von 5 Sternen`}>{"★".repeat(testimonial.rating)}</span>
        <span className="mt-1 block">{testimonial.author}</span>
      </figcaption>
    </figure>
  );
}
