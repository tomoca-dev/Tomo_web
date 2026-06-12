import React from 'react';
import PageShell from '@/components/tomoca/PageShell';
import SectionHeading from '@/components/tomoca/SectionHeading';

export default function FAQ() {
  const qs = ['Where are your branches?', 'Do you offer delivery?', 'Can I buy coffee beans online?', 'Do you ship internationally?', 'Do you offer wholesale?', 'Do you cater events?', 'What payment methods do you accept?', 'Can I reserve a table?'];
  return <PageShell><main className="pt-32"><section className="mx-auto max-w-4xl px-6 py-20"><SectionHeading eyebrow="FAQ" title="Answers before your next cup." />{qs.map(q => <details key={q} className="mb-3 rounded-2xl border bg-card p-5"><summary className="cursor-pointer font-bold">{q}</summary><p className="mt-3 text-muted-foreground">Yes—please contact Tomoca or visit the relevant page for the latest availability, hours, pricing and service details.</p></details>)}</section></main></PageShell>;
}