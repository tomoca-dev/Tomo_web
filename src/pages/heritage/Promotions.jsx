import React from 'react';
import PageShell from '@/components/tomoca/PageShell';
import SectionHeading from '@/components/tomoca/SectionHeading';

export default function Promotions() {
  return <PageShell><main className="pt-32"><section className="mx-auto max-w-7xl px-6 py-20"><SectionHeading eyebrow="Offers" title="Seasonal deals, launches and corporate packages." text="Current promotions include holiday gift boxes, student moments, new product launches, and office bundle inquiries." /><div className="grid gap-5 md:grid-cols-3">{['Gift Box Season','Office Coffee Bundle','New Seasonal Drink'].map(x => <div key={x} className="rounded-[2rem] bg-primary p-8"><h3 className="font-display text-3xl font-black">{x}</h3><p className="mt-3">Ask in-store or contact Tomoca for availability.</p></div>)}</div></section></main></PageShell>;
}