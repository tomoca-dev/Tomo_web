import React from 'react';
import PageShell from '@/components/tomoca/PageShell';
import SectionHeading from '@/components/tomoca/SectionHeading';
import InquiryForm from '@/components/tomoca/InquiryForm';
import { img } from '@/components/tomoca/Data';

export default function Wholesale() {
  return <PageShell><main className="pt-32"><section className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-2"><div><SectionHeading eyebrow="Wholesale" title="Coffee supply for hotels, offices, cafés and retailers." text="Tomoca supports business buyers with bulk roasted coffee, office programs, custom packaging, training guidance, and reliable freshness standards." /><div className="grid gap-3 text-lg"><p>• Wholesale coffee supply</p><p>• Office coffee solutions</p><p>• Café and restaurant supply</p><p>• Custom packaging and gift boxes</p><p>• Bulk pricing and training support</p></div><img src={img.field} alt="Coffee drying process" className="mt-8 rounded-[3rem]" /></div><InquiryForm defaultType="wholesale" /></section></main></PageShell>;
}