import React from 'react';
import PageShell from '@/components/tomoca/PageShell';
import SectionHeading from '@/components/tomoca/SectionHeading';
import { img } from '@/components/tomoca/Data';

export default function Experience() {
  const steps = ['Grow · Ethiopian highland Arabica develops floral brightness', 'Roast · Beans darken into the Golden Roast profile', 'Grind · Aroma opens before brewing', 'Pour · Ceremony gathers people around the cup'];
  return <PageShell><main className="pt-32"><section className="relative overflow-hidden bg-foreground py-24 text-background"><img src={img.pattern} alt="Orange pattern" className="absolute inset-0 h-full w-full object-cover opacity-10" /><div className="relative mx-auto max-w-7xl px-6"><SectionHeading light eyebrow="Coffee Culture" title="From bean to cup, ritual becomes memory." text="Ethiopian coffee culture is origin, ceremony, fragrance, patience, and hospitality. Tomoca keeps that culture moving forward." /><div className="grid gap-5 md:grid-cols-4">{steps.map(s => <div key={s} className="rounded-[2rem] border border-background/15 bg-background/10 p-6"><p className="text-lg font-bold">{s}</p></div>)}</div><img src={img.harvest} alt="Harvested coffee cherries" className="mt-10 rounded-[3rem]" /></div></section></main></PageShell>;
}