import React from 'react';
import PageShell from '@/components/tomoca/PageShell';
import SectionHeading from '@/components/tomoca/SectionHeading';
import MenuGrid from '@/components/tomoca/MenuGrid';
import { img } from '@/components/tomoca/Data';

export default function Menu() {
  return <PageShell><main className="pt-32"><section className="mx-auto max-w-7xl px-6 py-20"><SectionHeading eyebrow="Menu" title="Espresso, ceremony, cold drinks and bites." text="Prices shown are sample menu prices. Ask in-store about allergens, seasonal specials, vegan options, and daily pastries." /><div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr]"><img src={img.tokens} alt="Tomoca macchiato and coffee tokens" className="h-full rounded-[3rem] object-cover" /><MenuGrid /></div></section></main></PageShell>;
}