import { Link } from "react-router-dom";
import { Logo, NAV_LINKS } from "./Navbar";
import { DEMO_OFFICES } from "../data/demo";

export function Footer() {
  return (
    <footer className="bg-forest text-cream/80">
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="space-y-5">
          <Logo light />
          <p className="max-w-sm text-sm leading-relaxed text-cream/70">Prozessanwälte und verlässliche Berater für Unternehmen, Familien und Privatpersonen in Hessen und Nordrhein-Westfalen – seit 2002.</p>
        </div>
        <div>
          <h2 className="mb-4 font-sans text-xs font-semibold tracking-[0.2em] text-brass uppercase">Die Kanzlei</h2>
          <ul className="space-y-2.5 text-sm">
            {NAV_LINKS.map((l) => <li key={l.to}><Link to={l.to} className="hover:text-brass">{l.label}</Link></li>)}
          </ul>
        </div>
        {DEMO_OFFICES.map((o) => (
          <div key={o.city}>
            <h2 className="mb-4 font-sans text-xs font-semibold tracking-[0.2em] text-brass uppercase">{o.city}</h2>
            <address className="space-y-2 text-sm not-italic leading-relaxed">
              <p>{o.address}</p>
              <p><a href={`tel:${o.phone}`} className="hover:text-brass">{o.phone}</a></p>
              <p className="text-cream/60">{o.hours}</p>
            </address>
          </div>
        ))}
      </div>
      <div className="border-t border-cream/10">
        <div className="container-x space-y-2 py-6 text-xs leading-relaxed text-cream/55">
          <p><strong className="text-cream/80">Demo-Website – alle Namen, Personen und Zahlen sind fiktiv. Keine Rechtsberatung.</strong> Die Kontaktaufnahme über diese Website begründet kein Mandatsverhältnis. Frühere Ergebnisse sind keine Garantie für den Ausgang künftiger Verfahren.</p>
          <p>© {new Date().getFullYear()} Sterling &amp; Partner Rechtsanwälte. Fotos: Unsplash.</p>
        </div>
      </div>
    </footer>
  );
}
