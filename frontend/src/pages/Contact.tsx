import { useSearchParams } from "react-router-dom";
import { Clock, MapPin, Phone, ShieldCheck } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { Reveal } from "../components/Reveal";
import { ConsultationForm } from "../components/ConsultationForm";
import { useApi } from "../hooks/useApi";
import { DEMO_OFFICES, type Office } from "../data/demo";

const PROMISES = [
  "Eine Partnerin oder ein Partner prüft jede Anfrage persönlich",
  "Antwort innerhalb eines Werktags, in Eilfällen innerhalb von zwei Stunden",
  "Kostenlose und unverbindliche Ersteinschätzung",
];

export default function Contact() {
  const [params] = useSearchParams();
  const { data: offices } = useApi<Office[]>("/api/offices", DEMO_OFFICES);

  return (
    <>
      <PageHeader eyebrow="Kontakt" title="Vertrauliche Erstberatung anfragen." lead="Schildern Sie uns kurz Ihre Situation. Wir prüfen Ihr Anliegen und melden uns auf dem von Ihnen gewünschten Weg." image="/images/signing.jpg" />
      <section className="section">
        <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.5fr]">
          <Reveal className="space-y-10">
            <div>
              <h2 className="text-3xl text-forest">So geht es weiter</h2>
              <ul className="mt-6 space-y-4">
                {PROMISES.map((p) => <li key={p} className="flex gap-3 text-ink/85"><ShieldCheck className="mt-0.5 size-5 shrink-0 text-brass-2" aria-hidden />{p}</li>)}
              </ul>
            </div>
            {offices.map((o) => (
              <div key={o.city} className="border-t border-forest/15 pt-6">
                <h2 className="text-2xl text-forest">Standort {o.city}</h2>
                <ul className="mt-4 space-y-3 text-sm text-stone">
                  <li className="flex gap-3"><MapPin className="size-4 shrink-0 text-brass-2" aria-hidden />{o.address}</li>
                  <li className="flex gap-3"><Phone className="size-4 shrink-0 text-brass-2" aria-hidden /><a href={`tel:${o.phone}`} className="hover:text-forest">{o.phone}</a></li>
                  <li className="flex gap-3"><Clock className="size-4 shrink-0 text-brass-2" aria-hidden />{o.hours}</li>
                </ul>
              </div>
            ))}
          </Reveal>
          <Reveal delay={0.1}>
            <div className="border-t-4 border-brass bg-white p-6 shadow-[0_1px_0_rgb(15_42_34/0.1)] sm:p-10">
              <h2 className="text-3xl text-forest">Ihre Fallprüfung</h2>
              <p className="mt-2 mb-8 text-sm text-stone">Alle Felder sind Pflichtfelder. Bitte bleiben Sie vorerst allgemein.</p>
              <ConsultationForm defaultArea={params.get("area") ?? ""} />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
