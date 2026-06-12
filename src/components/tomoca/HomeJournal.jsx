import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { img } from './Data';
import { motion } from 'framer-motion';
import { Reveal, StaggerContainer, fadeUp, slideLeft, slideRight, scaleIn } from './ScrollReveal';

const SOCIAL_PHOTOS = [
  { src: img.pouch, alt: 'Standing Pouch' },
  { src: img.tokens, alt: 'Coffee tokens' },
  { src: img.smile, alt: 'Harvest' },
  { src: img.farm, alt: 'Coffee farm' },
  { src: img.lady, alt: 'Heritage' },
  { src: img.harvest, alt: 'Harvest' },
];

const NEWS = [
  { title: 'Ethiopia remains the birthplace of Arabica, leading global specialty exports', source: 'Coffee Review', url: 'https://www.coffeereview.com' },
  { title: 'Global specialty coffee market projected to reach $83B by 2028', source: 'World Coffee Portal', url: 'https://www.worldcoffeeportal.com' },
  { title: 'Third wave coffee culture spreads to emerging markets across Africa and Asia', source: 'Sprudge', url: 'https://sprudge.com' },
  { title: 'Climate change threatens growing regions; sustainable farming now critical', source: 'Perfect Daily Grind', url: 'https://perfectdailygrind.com' },
];

export default function HomeJournal() {
  return (
    <section className="bg-background py-32 md:py-44">
      <div className="mx-auto max-w-7xl px-6 md:px-16">
        <div className="grid gap-20 lg:grid-cols-[1fr_1fr]">

          {/* Left — social grid */}
          <div>
            <Reveal variant={slideLeft}>
              <p className="mb-4 flex items-center gap-3 text-xs font-black uppercase tracking-[0.4em] text-primary">
                <span className="h-px w-8 bg-primary" />Social
              </p>
              <h2 className="mb-10 font-display text-4xl font-black tracking-tight text-foreground md:text-6xl leading-[0.88]">
                The Tomoca<br />visual journal.
              </h2>
            </Reveal>
            <StaggerContainer className="grid grid-cols-3 gap-2.5" stagger={0.06}>
              {SOCIAL_PHOTOS.map((p, i) => (
                <motion.div
                  key={i}
                  variants={scaleIn}
                  custom={i}
                  whileHover={{ scale: 1.04, y: -4 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="group relative overflow-hidden rounded-2xl"
                >
                  <img src={p.src} alt={p.alt} className="h-36 w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 flex items-end rounded-2xl bg-gradient-to-t from-foreground/70 to-transparent p-2.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="text-[10px] font-bold text-white">{p.alt}</span>
                  </div>
                </motion.div>
              ))}
            </StaggerContainer>
            <Reveal variant={fadeUp} className="mt-6 flex gap-3">
              {[
                { label: 'Instagram', href: 'https://www.instagram.com/tomoca_coffee', color: 'hover:text-pink-500' },
                { label: 'Facebook', href: 'https://www.facebook.com/share/1B1Ew6vUdA/', color: 'hover:text-blue-500' },
              ].map(({ label, href, color }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ y: -2 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                  className={`inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-sm font-black text-muted-foreground transition-colors hover:border-foreground/30 ${color}`}
                >
                  {label} <ArrowUpRight className="h-3.5 w-3.5" />
                </motion.a>
              ))}
            </Reveal>
          </div>

          {/* Right — news */}
          <div>
            <Reveal variant={slideRight}>
              <p className="mb-4 flex items-center gap-3 text-xs font-black uppercase tracking-[0.4em] text-primary">
                <span className="h-px w-8 bg-primary" />World Coffee News
              </p>
              <h2 className="mb-10 font-display text-4xl font-black tracking-tight text-foreground md:text-6xl leading-[0.88]">
                Global coffee<br />intelligence.
              </h2>
            </Reveal>
            <StaggerContainer className="flex flex-col divide-y divide-border/50" stagger={0.08}>
              {NEWS.map((item, i) => (
                <motion.a
                  key={i}
                  variants={fadeUp}
                  custom={i}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ x: 4 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                  className="group flex items-start justify-between gap-4 py-5 first:pt-0"
                >
                  <div>
                    <p className="mb-1.5 text-[10px] font-black uppercase tracking-[0.35em] text-primary">{item.source}</p>
                    <p className="text-sm font-semibold leading-snug text-foreground/80 transition-colors group-hover:text-foreground">{item.title}</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 flex-shrink-0 text-muted-foreground/40 transition-all group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5 mt-0.5" />
                </motion.a>
              ))}
            </StaggerContainer>
            <Reveal variant={fadeUp} className="mt-8">
              <motion.a
                href="https://perfectdailygrind.com"
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.03 }}
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-black text-muted-foreground transition-all hover:border-primary hover:text-primary"
              >
                More Coffee News <ArrowUpRight className="h-3.5 w-3.5" />
              </motion.a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}