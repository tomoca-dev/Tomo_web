import React from 'react';
import PageShell from '@/components/tomoca/PageShell';
import SectionHeading from '@/components/tomoca/SectionHeading';
import InquiryForm from '@/components/tomoca/InquiryForm';

export default function Careers() {
  return <PageShell><main className="pt-32"><section className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-2"><div><SectionHeading eyebrow="Careers" title="Work with coffee, culture and craft." text="Tomoca hires baristas, roasters, managers, service teams and operations talent. Training and hospitality culture are part of the journey." /><div className="rounded-[2rem] bg-primary p-6 font-bold">Open roles: Barista · Store Manager · Roastery Assistant · Events Crew</div></div><InquiryForm defaultType="careers" /></section></main></PageShell>;
}