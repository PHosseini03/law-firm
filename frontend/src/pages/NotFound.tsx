import { Link } from "react-router-dom";
import { Scale } from "lucide-react";

export default function NotFound() {
  return (
    <section className="paper-texture grid min-h-[70vh] place-items-center px-4 py-20 text-center">
      <div>
        <Scale className="mx-auto size-14 text-brass-2" strokeWidth={1.25} aria-hidden />
        <h1 className="mt-6 text-6xl text-forest">404</h1>
        <p className="lead mt-3">Einspruch stattgegeben: Diese Seite existiert nicht.</p>
        <Link to="/" className="btn-primary mt-8">Zurück zur Startseite</Link>
      </div>
    </section>
  );
}
