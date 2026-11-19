import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

interface Props {
  eyebrow: string;
  title: ReactNode;
  lead: string;
  image?: string;
  children?: ReactNode;
}

export function PageHeader({ eyebrow, title, lead, image, children }: Props) {
  return (
    <section className="relative overflow-hidden bg-forest text-cream">
      {image && <img src={image} alt="" className="absolute inset-0 size-full object-cover opacity-20 mix-blend-luminosity" />}
      <div className="absolute inset-0 bg-gradient-to-r from-forest via-forest/90 to-forest/60" />
      <div className="container-x relative py-20 sm:py-28">
        <Reveal className="max-w-3xl">
          <span className="kicker kicker-light">{eyebrow}</span>
          <h1 className="mt-6 text-4xl leading-[1.05] text-cream sm:text-6xl lg:text-7xl">{title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-cream/75">{lead}</p>
          {children}
        </Reveal>
      </div>
    </section>
  );
}
