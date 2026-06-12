import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowUpRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { img } from './Data';

const ROASTS = [
  { id: 'light', label: 'Light', tagline: 'Bright & Floral', desc: 'Delicate citrus, high clarity, tea-like body.', hex: '#F59E0B' },
  { id: 'medium', label: 'Medium', tagline: 'Balanced & Sweet', desc: 'Caramel sweetness, smooth classic Ethiopian character.', hex: '#D97706' },
  { id: 'dark', label: 'Dark', tagline: 'Bold & Smoky', desc: 'Deep cocoa, toasted spice, rich crema.', hex: '#92400E' },
];

export default function HomeSubscription() {
  const [roast, setRoast] = useState('medium');
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const selected = ROASTS.find(r => r.id === roast);

  return (
    <section className="relative overflow-hidden bg-foreground">
      {/* Subtle grain */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] [background-image:url('data:image/svg+xml,%3Csvg viewBox=%220 0 512 512%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.75%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')]" />

      {/* Top divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-background/10 to-transparent" />

      <div className="mx-auto grid max-w-7xl gap-0 md:grid-cols-2">
        {/* LEFT — image */}
        <div className="relative min-h-[400px] overflow-hidden md:min-h-[640px]">
          <img
            src={img.pouch}
            alt="Tomoca Coffee Pouch"
            className="absolute inset-0 h-full w-full object-cover object-center opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/10 via-transparent to-foreground/80 md:bg-gradient-to-l" />
          {/* Floating label */}
          <div className="absolute bottom-8 left-8 right-8 md:bottom-12 md:left-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={roast}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="font-display text-4xl font-black text-background leading-tight md:text-5xl">
                  {selected.label} Roast
                </p>
                <p className="mt-2 text-lg font-semibold text-background/60">{selected.tagline}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT — form */}
        <div className="flex flex-col justify-center px-8 py-16 md:px-14 md:py-20">
          <AnimatePresence mode="wait">
            {done ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
                  <Check className="h-8 w-8 text-foreground" />
                </div>
                <h3 className="font-display text-4xl font-black text-background">You're on the list.</h3>
                <p className="mt-4 text-background/55 leading-relaxed">
                  We'll reach out with your first shipment details shortly. Your{' '}
                  <span className="font-black text-primary capitalize">{roast} roast</span> is coming.
                </p>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p className="mb-2 text-xs font-black uppercase tracking-[0.45em] text-primary">Coffee Subscription</p>
                <h2 className="font-display text-4xl font-black leading-tight tracking-tight text-background md:text-5xl">
                  Tomoca,<br />to your door.
                </h2>
                <p className="mt-5 text-background/55 leading-relaxed">
                  Choose your roast. Fresh Ethiopian beans, roasted to order, shipped anywhere.
                </p>

                {/* Roast selector */}
                <div className="mt-9 mb-8 flex gap-3">
                  {ROASTS.map(r => (
                    <motion.button
                      key={r.id}
                      onClick={() => setRoast(r.id)}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.96 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                      className={`relative flex-1 rounded-2xl border py-4 text-center transition-all ${roast === r.id ? 'border-primary bg-primary/10' : 'border-background/10 bg-background/5 hover:border-background/25'}`}
                    >
                      <span
                        className="mx-auto mb-2 block h-3 w-3 rounded-full"
                        style={{ backgroundColor: r.hex }}
                      />
                      <p className={`text-xs font-black uppercase tracking-[0.2em] transition-colors ${roast === r.id ? 'text-primary' : 'text-background/50'}`}>
                        {r.label}
                      </p>
                      {roast === r.id && (
                        <motion.div
                          layoutId="roast-sel"
                          className="absolute inset-0 rounded-2xl ring-2 ring-primary ring-inset"
                          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                        />
                      )}
                    </motion.button>
                  ))}
                </div>

                {/* Description */}
                <AnimatePresence mode="wait">
                  <motion.p
                    key={roast}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                    className="mb-8 text-sm text-background/45"
                  >
                    {selected.desc}
                  </motion.p>
                </AnimatePresence>

                {/* Email input */}
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && email && setDone(true)}
                    className="flex-1 rounded-full border-background/15 bg-background/8 text-background placeholder:text-background/30 focus:border-primary focus-visible:ring-0"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => email && setDone(true)}
                    disabled={!email}
                    className="flex-shrink-0 rounded-full bg-primary px-6 py-2.5 text-sm font-black text-foreground shadow-lg shadow-primary/30 transition-all hover:bg-primary/90 disabled:opacity-40"
                  >
                    Subscribe
                  </motion.button>
                </div>
                <p className="mt-4 text-xs text-background/30">No commitment. We'll confirm before your first shipment.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}