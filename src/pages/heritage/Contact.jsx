import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageShell from '@/components/tomoca/PageShell';
import SectionHeading from '@/components/tomoca/SectionHeading';
import InquiryForm from '@/components/tomoca/InquiryForm';

export default function Contact() {
  return <PageShell><main className="pt-32"><section className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[.8fr_1.2fr]"><div><SectionHeading eyebrow="Contact" title="Speak with Tomoca." text="For customer service, business inquiries, careers, events, press, and coffee questions." /><div className="flex flex-wrap gap-3"><Button asChild className="rounded-full"><a href="tel:+251911000000"><Phone className="mr-2 h-4 w-4" />Call Now</a></Button><Button asChild variant="outline" className="rounded-full"><a href="https://wa.me/251911000000" target="_blank" rel="noreferrer"><MessageCircle className="mr-2 h-4 w-4" />WhatsApp</a></Button></div><div className="mt-8 rounded-[2rem] bg-primary p-6"><p className="font-bold">Head Office</p><p className="mt-2">Addis Ababa, Ethiopia</p><p className="mt-2">hello@tomocacoffee.com</p></div></div><InquiryForm /></section></main></PageShell>;
}