import React from 'react';
import PageShell from '@/components/tomoca/PageShell';
import SectionHeading from '@/components/tomoca/SectionHeading';
import { img } from '@/components/tomoca/Data';

export default function Roastery() {
  return <PageShell><main className="pt-32"><section className="mx-auto max-w-7xl px-6 py-20"><SectionHeading eyebrow="Roastery" title="Freshness, sourcing standards and quality control." text="Tomoca roasts for aroma, depth and consistency, supporting packaged coffee, café service and wholesale supply." /><div className="grid gap-6 md:grid-cols-3"><img src={img.aerial} alt="Coffee processing aerial view" className="rounded-[2rem]" /><img src={img.workers} alt="Workers drying coffee" className="rounded-[2rem]" /><img src={img.farmer} alt="Farmers with coffee" className="rounded-[2rem]" /></div></section></main></PageShell>;
}