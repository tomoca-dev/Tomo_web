import React from 'react';
import PageShell from '@/components/tomoca/PageShell';
import SectionHeading from '@/components/tomoca/SectionHeading';
import InquiryForm from '@/components/tomoca/InquiryForm';

export default function Press() {
  return <PageShell><main className="pt-32"><section className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-2"><div><SectionHeading eyebrow="Press Kit" title="Brand overview, images, facts and media contact." text="Download-ready brand assets, approved photos, founder bio, company facts, press releases, and recognition requests can be coordinated here." /><div className="rounded-[2rem] border bg-card p-6"><p className="font-bold">Company facts: Ethiopian coffee house · Since 1953 · Roasted coffee, retail, wholesale and culture.</p></div></div><InquiryForm defaultType="press" /></section></main></PageShell>;
}