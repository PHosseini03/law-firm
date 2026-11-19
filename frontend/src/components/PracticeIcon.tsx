import { Briefcase, Building2, HeartPulse, Scale, ScrollText, Users, type LucideIcon } from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  briefcase: Briefcase,
  "heart-pulse": HeartPulse,
  scroll: ScrollText,
  users: Users,
  building: Building2,
  scale: Scale,
};

export function PracticeIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Scale;
  return <Icon className={className} strokeWidth={1.5} aria-hidden />;
}
