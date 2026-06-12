import React from 'react';
import PageShell from '@/components/tomoca/PageShell';
import SectionHeading from '@/components/tomoca/SectionHeading';
import InquiryForm from '@/components/tomoca/InquiryForm';

export default function Events() {
  return <PageShell><main className="pt-32"><section className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-2"><div><SectionHeading eyebrow="Catering & Events" title="Coffee carts, ceremonies and corporate service." text="Book Tomoca for weddings, conferences, private parties, offices, launches, and Ethiopian coffee ceremony experiences." /><div className="grid gap-4 md:grid-cols-2"><div className="rounded-2xl bg-primary p-5 font-bold">Coffee Cart Service</div><div className="rounded-2xl bg-primary p-5 font-bold">Ethiopian Ceremony</div><div className="rounded-2xl bg-primary p-5 font-bold">Corporate Events</div><div className="rounded-2xl bg-primary p-5 font-bold">Private Packages</div></div></div><InquiryForm defaultType="events" /></section></main></PageShell>;
}