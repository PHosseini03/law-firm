const MILLION = 1_000_000;
const THOUSAND = 1_000;
const GERMAN = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 2 });

export function formatAmount(amount: number): string {
  if (amount <= 0) return "Abgewiesen";
  if (amount >= MILLION) return `${GERMAN.format(amount / MILLION)} Mio. €`;
  return `${GERMAN.format(Math.round(amount / THOUSAND) * THOUSAND)} €`;
}

export function formatDate(iso: string): string {
  const date = new Date(`${iso}T12:00:00Z`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("de-DE", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
}
