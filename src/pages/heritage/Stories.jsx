import React from 'react';
import PageShell from '@/components/tomoca/PageShell';
import SectionHeading from '@/components/tomoca/SectionHeading';
import { img } from '@/components/tomoca/Data';

export default function Stories() {
  const posts = ['Best Ethiopian coffee beans', 'How to brew Ethiopian coffee at home', 'Coffee ceremony explained', 'How to choose the right roast', 'Behind the scenes at Tomoca', 'Seasonal drink launches'];
  return <PageShell><main className="pt-32"><section className="mx-auto max-w-7xl px-6 py-20"><SectionHeading eyebrow="Stories" title="Coffee knowledge, culture and announcements." text="Editorial stories for coffee lovers, travelers, wholesale buyers, and anyone curious about Ethiopian heritage." /><div className="grid gap-5 md:grid-cols-3">{posts.map((p, i) => <article key={p} className="overflow-hidden rounded-[2rem] border bg-card"><img src={[img.farm,img.drying,img.lady][i%3]} alt={p} className="h-56 w-full object-cover" /><div className="p-6"><p className="font-display text-2xl font-black">{p}</p><p className="mt-3 text-sm text-muted-foreground">Read the latest Tomoca story and learn more about origin, roasting and ceremony.</p></div></article>)}</div></section></main></PageShell>;
}