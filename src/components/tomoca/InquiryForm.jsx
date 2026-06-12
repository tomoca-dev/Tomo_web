import React from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function InquiryForm({ defaultType = 'general' }) {
  const [form, setForm] = React.useState({ name: '', email: '', phone: '', company: '', type: defaultType, message: '' });
  const [sent, setSent] = React.useState(false);
  const submit = async (e) => { e.preventDefault(); await base44.entities.Inquiry.create(form); setSent(true); };
  if (sent) return <div className="rounded-[2rem] bg-primary p-8 text-primary-foreground"><h3 className="font-display text-3xl font-black">Thank you.</h3><p className="mt-2">Tomoca will respond to your inquiry shortly.</p></div>;
  return (
    <form onSubmit={submit} className="grid gap-4 rounded-[2rem] border bg-card p-6 shadow-xl">
      <div className="grid gap-4 md:grid-cols-2"><Input required placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /><Input required type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
      <div className="grid gap-4 md:grid-cols-2"><Input placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /><Input placeholder="Company" value={form.company} onChange={e => setForm({...form, company: e.target.value})} /></div>
      <Select value={form.type} onValueChange={type => setForm({...form, type})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="general">General</SelectItem><SelectItem value="wholesale">Wholesale</SelectItem><SelectItem value="events">Events</SelectItem><SelectItem value="careers">Careers</SelectItem><SelectItem value="press">Press</SelectItem></SelectContent></Select>
      <Textarea required placeholder="How can we help?" className="min-h-36" value={form.message} onChange={e => setForm({...form, message: e.target.value})} />
      <Button className="h-12 rounded-full">Send Inquiry</Button>
    </form>
  );
}