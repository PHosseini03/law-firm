import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, Lock } from "lucide-react";
import { SelectField, TextArea, TextField } from "./Field";
import { useToast } from "./toast-context";
import { useSubmit } from "../hooks/useSubmit";
import { rules, validate, type Errors } from "../lib/validation";
import { DEMO_PRACTICE_AREAS } from "../data/demo";

type FormValues = {
  name: string;
  email: string;
  phone: string;
  practice_area: string;
  contact_method: string;
  urgency: string;
  description: string;
};

interface ConsultationResult {
  id: number;
  message: string;
}

interface Props {
  defaultArea?: string;
}

const DESCRIPTION_MIN = 20;
const DESCRIPTION_MAX = 2000;

const SCHEMA = {
  name: [rules.name],
  email: [rules.email],
  phone: [rules.phone],
  practice_area: [rules.required("Rechtsgebiet")],
  description: [rules.minLength("Beschreibung", DESCRIPTION_MIN), rules.safeText],
};

const CONTACT_METHODS = [
  { value: "phone", label: "Telefon" },
  { value: "email", label: "E-Mail" },
  { value: "video", label: "Videocall" },
];

export function ConsultationForm({ defaultArea = "" }: Props) {
  const initial: FormValues = { name: "", email: "", phone: "", practice_area: defaultArea, contact_method: "phone", urgency: "standard", description: "" };
  const [values, setValues] = useState<FormValues>(initial);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors<FormValues & { consent: string }>>({});
  const { status, result, submit, reset } = useSubmit<object, ConsultationResult>("/api/consultations");
  const toast = useToast();
  const confirmationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "success") confirmationRef.current?.scrollIntoView?.({ behavior: "smooth", block: "center" });
  }, [status]);

  const set = (key: keyof FormValues) => (e: { target: { value: string } }) => {
    setValues((prev) => ({ ...prev, [key]: e.target.value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const found: Errors<FormValues & { consent: string }> = validate(values, SCHEMA);
    if (!consent) found.consent = "Bitte bestätigen Sie den Hinweis, um fortzufahren";
    setErrors(found);
    if (Object.keys(found).length) {
      toast("error", "Bitte prüfen Sie die markierten Felder.");
      return;
    }
    const data = await submit({ ...values, consent });
    if (data) toast("success", data.message);
    else toast("error", "Ihre Anfrage konnte nicht gesendet werden. Bitte rufen Sie uns direkt an.");
  }

  function startOver() {
    reset();
    setValues(initial);
    setConsent(false);
  }

  if (status === "success" && result) {
    return (
      <motion.div ref={confirmationRef} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="scroll-mt-32 py-8 text-center" role="status">
        <CheckCircle2 className="mx-auto size-14 text-pine" strokeWidth={1.5} aria-hidden />
        <h2 className="mt-6 text-3xl text-forest sm:text-4xl">Anfrage eingegangen</h2>
        <p className="lead mx-auto mt-3 max-w-md">{result.message}</p>
        <p className="mt-2 text-sm text-stone">Vertrauliches Aktenzeichen SP-{String(result.id).padStart(5, "0")}</p>
        <button type="button" className="btn-outline mt-8" onClick={startOver}>Weitere Anfrage senden</button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
      <TextField label="Vollständiger Name" name="name" autoComplete="name" value={values.name} onChange={set("name")} error={errors.name} maxLength={80} />
      <TextField label="E-Mail" name="email" type="email" autoComplete="email" value={values.email} onChange={set("email")} error={errors.email} maxLength={120} />
      <TextField label="Telefon" name="phone" type="tel" autoComplete="tel" value={values.phone} onChange={set("phone")} error={errors.phone} maxLength={20} />
      <SelectField label="Rechtsgebiet" name="practice_area" value={values.practice_area} onChange={set("practice_area")} error={errors.practice_area}>
        <option value="">Rechtsgebiet wählen …</option>
        {DEMO_PRACTICE_AREAS.map((p) => <option key={p.slug} value={p.slug}>{p.name}</option>)}
        <option value="other">Sonstiges Anliegen</option>
      </SelectField>
      <fieldset className="sm:col-span-2">
        <legend className="field-label">Bevorzugter Kontaktweg</legend>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {CONTACT_METHODS.map((m) => (
            <label key={m.value} className={`cursor-pointer border px-3 py-3 text-center text-sm font-medium transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brass ${values.contact_method === m.value ? "border-forest bg-forest text-cream" : "border-forest/20 bg-white text-forest hover:border-forest/50"}`}>
              <input type="radio" name="contact_method" value={m.value} checked={values.contact_method === m.value} onChange={set("contact_method")} className="sr-only" />
              {m.label}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="sm:col-span-2">
        <TextArea label="Schildern Sie Ihr Anliegen kurz" name="description" value={values.description} onChange={set("description")} error={errors.description} maxLength={DESCRIPTION_MAX} hint={`${values.description.length}/${DESCRIPTION_MAX} Zeichen. Bitte noch keine vertraulichen Details angeben.`} />
      </div>
      <label className="flex items-center gap-3 text-sm text-forest sm:col-span-2">
        <input type="checkbox" checked={values.urgency === "urgent"} onChange={(e) => setValues((prev) => ({ ...prev, urgency: e.target.checked ? "urgent" : "standard" }))} className="size-4 accent-forest" />
        Die Angelegenheit ist eilig (Gerichtstermin oder Frist innerhalb von 14 Tagen)
      </label>
      <div className="sm:col-span-2">
        <label className="flex items-start gap-3 text-sm leading-relaxed text-stone">
          <input type="checkbox" checked={consent} onChange={(e) => { setConsent(e.target.checked); setErrors((prev) => ({ ...prev, consent: undefined })); }} aria-invalid={!!errors.consent} aria-describedby={errors.consent ? "consent-error" : undefined} className="mt-1 size-4 shrink-0 accent-forest" />
          <span>Mir ist bewusst, dass durch das Absenden dieses Formulars noch kein Mandatsverhältnis entsteht und ich vertrauliche Informationen erst nach Mandatserteilung übermitteln sollte. Ich bin einverstanden, dass meine Angaben zur Bearbeitung der Anfrage gespeichert werden.</span>
        </label>
        {errors.consent && <p id="consent-error" className="field-error mt-2" role="alert">{errors.consent}</p>}
      </div>
      <button type="submit" className="btn-primary sm:col-span-2" disabled={status === "submitting"}>
        {status === "submitting" ? <><Loader2 className="size-4 animate-spin" aria-hidden /> Wird sicher übermittelt …</> : "Vertrauliche Erstberatung anfragen"}
      </button>
      <p className="flex items-center justify-center gap-2 text-center text-xs text-stone sm:col-span-2">
        <Lock className="size-3.5" aria-hidden /> Demo-Formular: Die Daten werden nur in der lokalen Demo-Datenbank gespeichert.
      </p>
    </form>
  );
}
