import React from 'react';
import PageShell from '@/components/tomoca/PageShell';
import SectionHeading from '@/components/tomoca/SectionHeading';
import InquiryForm from '@/components/tomoca/InquiryForm';

export default function Loyalty() {
  return <PageShell><main className="pt-32"><section className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-2"><div><SectionHeading eyebrow="MEMBERSHIP - A NEW PROJECT COMING SOON!" title="Earn points, birthday cups and member-only releases." text="Join the Tomoca circle for rewards, private promotions, app/card updates, and early access to limited packs." /><div className="rounded-[2rem] bg-primary p-8"><p className="font-display text-4xl font-black">1 cup = points · 10 visits = reward</p></div></div><InquiryForm /></section></main></PageShell>;
}