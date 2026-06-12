import React, { useState } from 'react';
import { MapPin, Phone, Clock, ExternalLink, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageShell from '@/components/tomoca/PageShell';
import SectionHeading from '@/components/tomoca/SectionHeading';
import { img } from '@/components/tomoca/Data';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

const FALLBACK_LOCATIONS = [
  { name: 'Tomoca Coffee — Piazza', address: 'Wavel Street, Piazza, Addis Ababa', hours: 'Mon – Sun 6:30 – 21:00', vibe: 'The original — a place that tells history since 1953', services: ['Dine-in', 'Takeaway', 'Beans to Go'], phone: '+251 911 723 482', mapUrl: 'https://www.google.com/maps/search/?api=1&query=9.0309084,38.7507019', embedSrc: 'https://maps.google.com/maps?q=9.0309084,38.7507019&output=embed&z=18', tag: 'Since 1953' },
];

export default function Locations() {
  const [active, setActive] = useState(0);
  const { data = [], isLoading } = useQuery({
    queryKey: ['heritage-locations'],
    queryFn: () => base44.entities.Location.list('name', 50),
  });

  const locations = data.length ? data : FALLBACK_LOCATIONS;
  const loc = locations[Math.min(active, locations.length - 1)] || locations[0];

  return (
    <PageShell>
      <main className="pt-32">
        <section className="mx-auto max-w-7xl px-6 py-20">
          <SectionHeading
            eyebrow="Store Locator"
            title="Find your nearest Tomoca house."
            text="Locations are fetched from Supabase when available, while the Heritage Brew interface keeps the premium store-locator experience."
          />

          {isLoading ? (
            <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
              <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-32 animate-pulse rounded-[2rem] bg-muted" />)}</div>
              <div className="h-[520px] animate-pulse rounded-[3rem] bg-muted" />
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-start">
              <div className="flex flex-col gap-4">
                {locations.map((l, i) => (
                  <motion.button
                    key={l.id || l.name}
                    onClick={() => setActive(i)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`rounded-[2rem] border p-6 text-left transition-all duration-300 ${active === i ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10' : 'border-border bg-card hover:border-primary/30'}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="font-display text-2xl font-black">{l.name}</h3>
                          <span className="rounded-full bg-primary/15 px-3 py-0.5 text-xs font-black text-primary">{l.tag}</span>
                        </div>
                        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground"><MapPin className="h-3.5 w-3.5 flex-shrink-0 text-primary" />{[l.address, l.city, l.country].filter(Boolean).join(', ')}</p>
                        <p className="mt-1 flex items-center gap-1.5 text-sm font-bold"><Clock className="h-3.5 w-3.5 flex-shrink-0 text-primary" />{typeof l.hours === 'string' ? l.hours : 'Open daily'}</p>
                      </div>
                      <ChevronRight className={`h-5 w-5 flex-shrink-0 text-primary transition-transform duration-300 ${active === i ? 'rotate-90' : ''}`} />
                    </div>

                    {active === i && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.3 }} className="mt-4 overflow-hidden">
                        {l.vibe && <p className="mb-3 text-sm italic text-muted-foreground">“{l.vibe}”</p>}
                        <div className="mb-4 flex flex-wrap gap-2">
                          {(l.services || ['Dine-in', 'Takeaway']).map(s => <span key={s} className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-bold">{s}</span>)}
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <Button asChild className="rounded-full"><a href={l.mapUrl} target="_blank" rel="noreferrer"><MapPin className="mr-2 h-4 w-4" />Get Directions</a></Button>
                          {l.phone && <Button asChild variant="outline" className="rounded-full"><a href={`tel:${l.phone}`}><Phone className="mr-2 h-4 w-4" />Call</a></Button>}
                          <Button asChild variant="ghost" className="rounded-full" size="sm"><a href={l.mapUrl} target="_blank" rel="noreferrer"><ExternalLink className="mr-2 h-3 w-3" />Google Maps</a></Button>
                        </div>
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>

              <motion.div key={active} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="overflow-hidden rounded-[3rem] border-4 border-primary shadow-2xl shadow-primary/15 lg:sticky lg:top-28">
                <iframe title={loc.name} src={loc.embedSrc} className="h-[520px] w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              </motion.div>
            </div>
          )}

          <img src={loc?.image || loc?.image_url || img.store} alt="Tomoca storefront" className="mt-14 w-full rounded-[3rem] object-cover" style={{ maxHeight: 420 }} />
        </section>
      </main>
    </PageShell>
  );
}
