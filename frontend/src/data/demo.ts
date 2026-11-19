// Fictional demo data, exported from the backend (backend/scripts/export_content.py)
// so the site still renders if the API is offline.
import content from "./content.json";

export interface PracticeArea {
  slug: string;
  name: string;
  icon: string;
  image: string;
  summary: string;
  description: string;
  services: string[];
}

export interface Attorney {
  slug: string;
  name: string;
  title: string;
  image: string;
  practice: string[];
  years: number;
  email: string;
  bio: string;
  education: string[];
  admissions: string[];
}

export interface CaseResult {
  id: number;
  amount: number;
  label: string;
  category: string;
  year: number;
  title: string;
  summary: string;
}

export interface Insight {
  id: number;
  title: string;
  category: string;
  date: string;
  minutes: number;
  excerpt: string;
}

export interface Testimonial {
  id: number;
  quote: string;
  author: string;
  rating: number;
}

export interface Office {
  city: string;
  address: string;
  phone: string;
  hours: string;
}

export interface PracticeDetail extends PracticeArea {
  attorneys: Attorney[];
  results: CaseResult[];
}

export const DEMO_PRACTICE_AREAS: PracticeArea[] = content.practiceAreas;
export const DEMO_ATTORNEYS: Attorney[] = content.attorneys;
export const DEMO_RESULTS: CaseResult[] = content.results;
export const DEMO_INSIGHTS: Insight[] = content.insights;
export const DEMO_TESTIMONIALS: Testimonial[] = content.testimonials;
export const DEMO_OFFICES: Office[] = content.offices;

export function demoPracticeDetail(slug: string): PracticeDetail | null {
  const area = DEMO_PRACTICE_AREAS.find((p) => p.slug === slug);
  if (!area) return null;
  return {
    ...area,
    attorneys: DEMO_ATTORNEYS.filter((a) => a.practice.includes(slug)),
    results: DEMO_RESULTS.filter((r) => r.category === slug),
  };
}

export const CONTACT = {
  phone: "+49 69 1234 5670",
  email: "beratung@sterling-partner.example",
  address: "Bockenheimer Landstraße 51, Frankfurt am Main",
};
