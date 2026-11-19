import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Phone, X } from "lucide-react";
import { CONTACT } from "../data/demo";

export const NAV_LINKS = [
  { to: "/practice-areas", label: "Rechtsgebiete" },
  { to: "/attorneys", label: "Anwälte" },
  { to: "/results", label: "Erfolge" },
  { to: "/insights", label: "Fachbeiträge" },
  { to: "/contact", label: "Kontakt" },
];

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="group flex items-center gap-3" aria-label="Sterling & Partner – zur Startseite">
      <span className={`grid size-10 place-items-center border font-serif text-lg ${light ? "border-brass text-cream" : "border-forest bg-forest text-cream"}`}>S</span>
      <span className="leading-none">
        <span className={`block font-serif text-xl ${light ? "text-cream" : "text-forest"}`}>Sterling &amp; Partner</span>
        <span className={`mt-1 block text-[10px] font-semibold tracking-[0.3em] uppercase ${light ? "text-brass" : "text-brass-2"}`}>Rechtsanwälte</span>
      </span>
    </Link>
  );
}

const SCROLL_THRESHOLD = 40;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className={`sticky top-0 z-50 bg-cream/95 backdrop-blur transition-shadow ${scrolled ? "shadow-[0_1px_0_rgb(15_42_34/0.12)]" : ""}`}>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:bg-forest focus:px-4 focus:py-2 focus:text-cream">Zum Inhalt springen</a>
      <div className="hidden bg-forest text-xs text-cream/80 sm:block">
        <div className="container-x flex h-9 items-center justify-between">
          <span>Demo-Website · Keine Rechtsberatung</span>
          <a href={`tel:${CONTACT.phone}`} className="flex items-center gap-2 hover:text-brass"><Phone className="size-3.5" aria-hidden /> Notfall-Hotline rund um die Uhr: {CONTACT.phone}</a>
        </div>
      </div>
      <nav className="container-x flex h-20 items-center justify-between border-b border-forest/10" aria-label="Hauptnavigation">
        <Logo />
        <ul className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} className={({ isActive }) => `relative py-2 text-sm font-medium transition after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:bg-brass after:transition-transform ${isActive ? "text-forest after:scale-x-100" : "text-stone after:scale-x-0 hover:text-forest hover:after:scale-x-100"}`}>
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <Link to="/contact" className="btn-primary hidden lg:inline-flex">Erstberatung</Link>
        <button type="button" className="grid size-11 place-items-center border border-forest/20 text-forest lg:hidden" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Menü schließen" : "Menü öffnen"}>
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div id="mobile-menu" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden border-b border-forest/10 bg-cream lg:hidden">
            <ul className="container-x flex flex-col py-4">
              {NAV_LINKS.map((l) => (
                <li key={l.to} className="border-b border-forest/10 last:border-0">
                  <NavLink to={l.to} className={({ isActive }) => `block py-4 font-serif text-2xl ${isActive ? "text-brass-2" : "text-forest"}`}>{l.label}</NavLink>
                </li>
              ))}
              <li className="pt-4"><Link to="/contact" className="btn-primary w-full">Erstberatung anfragen</Link></li>
              <li className="pt-3 text-center text-sm text-stone"><a href={`tel:${CONTACT.phone}`}>{CONTACT.phone}</a></li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
