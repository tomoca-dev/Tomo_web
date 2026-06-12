import React from 'react';
import { Star } from 'lucide-react';
import PageShell from '@/components/tomoca/PageShell';
import SectionHeading from '@/components/tomoca/SectionHeading';

export default function Reviews() {
  return <PageShell><main className="pt-32"><section className="mx-auto max-w-7xl px-6 py-20"><SectionHeading eyebrow="Reviews" title="Loved for espresso, ceremony and heritage." /><div className="grid gap-5 md:grid-cols-3">{['The macchiato is a landmark experience.','Beautifully roasted beans with true Ethiopian character.','A heritage brand that feels alive and modern.'].map(r => <div key={r} className="rounded-[2rem] border bg-card p-8"><div className="flex text-primary">{Array.from({length:5}).map((_,i)=><Star key={i} className="h-5 w-5 fill-current" />)}</div><p className="mt-5 text-xl font-bold">“{r}”</p></div>)}</div></section></main></PageShell>;
}