import React from 'react';
import { motion } from 'framer-motion';
import PageShell from '@/components/tomoca/PageShell';
import SectionHeading from '@/components/tomoca/SectionHeading';
import HorizontalTimeline from '@/components/tomoca/HorizontalTimeline';
import { img } from '@/components/tomoca/Data';

const Reveal = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 32 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.7, ease: 'easeOut', delay }}
  >
    {children}
  </motion.div>
);

const PILLARS = [
  { label: 'Origin', value: 'Ethiopia', detail: 'Every bean we roast is sourced from Ethiopian highlands — Yirgacheffe, Sidama, Harrar — the birthplace of coffee itself.' },
  { label: 'Est.', value: '1953', detail: "Over 70 years of unbroken craft, making Tomoca one of Africa's oldest continuously operating coffee houses." },
  { label: 'Roast', value: 'In-House', detail: 'We roast on-site at our Piazza roastery, as we always have — slow, attentive, and by trained hands.' },
  { label: 'Locations', value: '10+', detail: 'From the historic Piazza to the Radisson Blu, every branch brings the same legendary cup closer to you.' },
];

export default function Heritage() {
  return (
    <PageShell>
      <main className="pt-32">

        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <img src={img.farm} alt="Ethiopian coffee farm" className="h-full w-full object-cover opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
          </div>
          <div className="mx-auto max-w-7xl px-6 py-24 md:py-36">
            <Reveal>
              <p className="mb-4 text-sm font-black uppercase tracking-[0.35em] text-primary">Our Heritage</p>
              <h1 className="font-display text-5xl font-black leading-[1.05] tracking-tight md:text-8xl">
                Seventy years<br />
                <span className="text-primary">of the perfect cup.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                Tomoca Coffee was born in the streets of Addis Ababa in 1953. What began as a single espresso bar has become Ethiopia's most enduring coffee institution — a story of origin, craft, community, and legacy.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Pillars */}
        <section className="bg-foreground text-background">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <div className="grid gap-px bg-background/20 md:grid-cols-4">
              {PILLARS.map((p, i) => (
                <Reveal key={p.label} delay={i * 0.1}>
                  <div className="bg-foreground px-8 py-10">
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-primary">{p.label}</p>
                    <p className="mt-2 font-display text-5xl font-black">{p.value}</p>
                    <p className="mt-3 text-sm leading-relaxed text-background/70">{p.detail}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Origin Story */}
        <section className="mx-auto max-w-7xl px-6 py-24">
          <div className="grid gap-16 md:grid-cols-2 md:items-center">
            <Reveal>
              <SectionHeading
                eyebrow="The Birthplace of Coffee"
                title="Ethiopia gave the world coffee."
                text="Long before espresso bars existed, Ethiopian highland communities were drinking coffee — the Kaffa region is widely recognised as the original home of Coffea arabica. Tomoca was founded to honour that heritage: to take the world's finest raw material and craft it with Italian espresso discipline into something extraordinary."
              />
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Our beans travel from the sun-drenched terraces of Yirgacheffe, the ancient forests of Jimma, and the dry highlands of Harrar — each region contributing its own character to Tomoca's signature blend. We source directly, roast locally, and serve with the pride of a nation that invented coffee.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="grid grid-cols-2 gap-4">
                <img src={img.farm} alt="Coffee farm" className="rounded-[2rem] object-cover h-56 w-full" />
                <img src={img.drying} alt="Coffee drying" className="rounded-[2rem] object-cover h-56 w-full mt-8" />
                <img src={img.harvest} alt="Coffee harvest" className="rounded-[2rem] object-cover h-56 w-full -mt-4" />
                <img src={img.smile} alt="Coffee farmer" className="rounded-[2rem] object-cover h-56 w-full mt-4" />
              </div>
            </Reveal>
          </div>
        </section>

        {/* Timeline */}
        <HorizontalTimeline />

        {/* The Store */}
        <section className="mx-auto max-w-7xl px-6 py-24">
          <div className="grid gap-16 md:grid-cols-2 md:items-center">
            <Reveal delay={0.1}>
              <img src={img.store} alt="Tomoca Piazza store" className="rounded-[3rem] shadow-2xl w-full object-cover" style={{ maxHeight: 500 }} />
            </Reveal>
            <Reveal>
              <SectionHeading
                eyebrow="The Original House"
                title="Wavel Street, Piazza — since 1953."
                text="The original Tomoca store remains exactly where it has always stood. Its walls carry the scent of decades of roasting. Its counter has served presidents and students, locals and travellers. It is not a landmark because it was designed to be one — it became a landmark by refusing to change."
              />
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Today, the Piazza branch is still our heart. Every bag of Tomoca beans still passes through the same hands, the same drums, the same commitment to quality that has never once been compromised.
              </p>
            </Reveal>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="bg-primary py-20">
          <Reveal>
            <div className="mx-auto max-w-4xl px-6 text-center">
              <p className="text-sm font-black uppercase tracking-[0.35em] text-primary-foreground/70">Taste the History</p>
              <h2 className="mt-3 font-display text-5xl font-black text-foreground md:text-6xl">
                Every cup is a chapter.
              </h2>
              <p className="mt-5 text-lg text-foreground/80 max-w-xl mx-auto">
                Seventy years of craft are poured into every espresso. Visit any of our branches in Addis Ababa and experience history in every sip.
              </p>
              <a
                href="/locations"
                className="mt-8 inline-block rounded-full bg-foreground px-10 py-4 font-black text-background transition hover:bg-foreground/90"
              >
                Find a Location
              </a>
            </div>
          </Reveal>
        </section>

      </main>
    </PageShell>
  );
}