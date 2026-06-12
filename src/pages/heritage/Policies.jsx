import React from 'react';
import PageShell from '@/components/tomoca/PageShell';
import SectionHeading from '@/components/tomoca/SectionHeading';

export default function Policies() {
  return <PageShell><main className="pt-32"><section className="mx-auto max-w-4xl px-6 py-20"><SectionHeading eyebrow="Policies" title="Privacy, terms, shipping and refunds." text="This page provides essential customer information for online purchases, delivery, account data, refunds, and general website use." /><div className="prose prose-lg max-w-none"><p>Orders, refunds, shipping timelines, and privacy practices are confirmed by Tomoca customer service at purchase time.</p></div></section></main></PageShell>;
}