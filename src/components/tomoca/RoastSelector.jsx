import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { img } from '@/components/tomoca/Data';

/* ─────────────────────────────────────────────
   ROAST DATA
────────────────────────────────────────────── */
const ROASTS = [
  {
    id: 'light',
    label: 'Light Roast',
    subtitle: 'Bright · Floral · Complex',
    color: 'from-amber-200 to-amber-100',
    accent: 'bg-amber-400',
    textAccent: 'text-amber-700',
    borderAccent: 'border-amber-400',
    packImage: img.compact,
    packName: 'Compact Pack · 250g',
    price: '$11',
    flavours: ['Jasmine', 'Citrus zest', 'Peach', 'Light cocoa'],
    body: 'Tea-like, delicate',
    acidity: '●●●●○',
    strength: '●●○○○',
    description: 'Light roast preserves the altitude-grown brightness of Ethiopian Arabica — floral, fruity, clean. Best for pour-over and filter brewing where complexity shines.',
    brews: ['Pour Over', 'Aeropress', 'Filter Drip'],
    tasteWords: ['Fruity', 'Delicate', 'Aromatic', 'Clean'],
  },
  {
    id: 'medium',
    label: 'Medium Roast',
    subtitle: 'Balanced · Honey · Sweet',
    color: 'from-orange-300 to-amber-200',
    accent: 'bg-orange-500',
    textAccent: 'text-orange-700',
    borderAccent: 'border-orange-500',
    packImage: img.heritage,
    packName: 'Heritage Pack · 375g',
    price: '$15',
    flavours: ['Dried fruit', 'Dark honey', 'Toasted spice', 'Brown sugar'],
    body: 'Smooth, rounded',
    acidity: '●●●○○',
    strength: '●●●○○',
    description: 'The everyday Tomoca roast. Medium heat unlocks honey sweetness and a rich body without losing Ethiopian character. Versatile across all brew methods.',
    brews: ['Espresso', 'Moka Pot', 'French Press', 'Filter'],
    tasteWords: ['Balanced', 'Sweet', 'Smooth', 'Versatile'],
  },
  {
    id: 'dark',
    label: 'Dark Roast',
    subtitle: 'Bold · Chocolatey · Deep',
    color: 'from-stone-700 to-stone-900',
    accent: 'bg-stone-800',
    textAccent: 'text-stone-100',
    borderAccent: 'border-stone-600',
    packImage: img.tin,
    packName: 'Collectible Tin · 200g',
    price: '$22',
    flavours: ['Dark chocolate', 'Charred wood', 'Molasses', 'Smoky finish'],
    body: 'Full, heavy',
    acidity: '●○○○○',
    strength: '●●●●●',
    description: 'Bold and ceremonial. The dark roast is crafted specifically for the Ethiopian jebena — robust enough to fill a room with aroma, with a long bittersweet finish.',
    brews: ['Jebena Ceremony', 'Espresso', 'Moka Pot'],
    tasteWords: ['Bold', 'Intense', 'Smoky', 'Ceremonial'],
  },
];

const TASTE_TAGS = ['Fruity', 'Balanced', 'Bold', 'Delicate', 'Aromatic', 'Intense', 'Sweet', 'Smooth', 'Smoky', 'Clean'];
const BREW_TAGS = ['Espresso', 'Pour Over', 'Moka Pot', 'Jebena Ceremony', 'Aeropress', 'French Press', 'Filter Drip'];

/* ─────────────────────────────────────────────
   SCROLL-PARALLAX FLOATING PACK
────────────────────────────────────────────── */
function FloatingPack({ src }) {
  const [offsetY, setOffsetY] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const visible = -rect.top;
      setOffsetY(visible * 0.18);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div ref={sectionRef} className="pointer-events-none absolute right-4 top-0 hidden w-44 md:block lg:w-56" style={{ transform: `translateY(${offsetY}px)` }}>
      <img
        src={src}
        alt="Tomoca pack"
        className="w-full drop-shadow-2xl transition-[filter] duration-500"
        style={{ filter: 'drop-shadow(0 30px 40px rgba(0,0,0,0.25))' }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   ROAST SELECTOR COMPONENT
────────────────────────────────────────────── */
export default function RoastSelector() {
  const [selectedTaste, setSelectedTaste] = useState(null);
  const [selectedBrew, setSelectedBrew] = useState(null);
  const [activeRoast, setActiveRoast] = useState(null);
  const sectionRef = useRef(null);

  // Compute matched roast from selections
  const matchedRoast = useMemo(() => {
    if (!selectedTaste && !selectedBrew) return null;
    const scores = ROASTS.map(r => {
      let score = 0;
      if (selectedTaste && r.tasteWords.includes(selectedTaste)) score += 2;
      if (selectedBrew && r.brews.includes(selectedBrew)) score += 2;
      return { roast: r, score };
    });
    scores.sort((a, b) => b.score - a.score);
    return scores[0].score > 0 ? scores[0].roast : null;
  }, [selectedTaste, selectedBrew]);

  const displayed = activeRoast || matchedRoast;

  const reset = () => {
    setSelectedTaste(null);
    setSelectedBrew(null);
    setActiveRoast(null);
  };

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-secondary/30 py-24 text-foreground">
      {/* Background pattern */}
      <img src={img.pattern} alt="" className="absolute inset-0 h-full w-full object-cover opacity-[0.04]" />

      {/* Floating parallax pack — shows active roast pack */}
      <FloatingPack src={displayed ? displayed.packImage : img.pouch500} />

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Heading */}
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.35em] text-primary">Roast Selector</p>
          <h2 className="font-display text-5xl font-black leading-tight md:text-7xl text-foreground">
            Find your perfect roast.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Tell us how you like your coffee and we'll match you with the right Tomoca variety.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
          {/* LEFT — selector panel */}
          <div className="space-y-8">
            {/* Step 1 — Taste */}
            <div>
              <p className="mb-4 text-xs font-black uppercase tracking-[0.3em] text-primary">
                01 · What flavour do you love?
              </p>
              <div className="flex flex-wrap gap-2">
                {TASTE_TAGS.map(t => (
                  <button
                    key={t}
                    onClick={() => setSelectedTaste(t === selectedTaste ? null : t)}
                    className={`rounded-full border px-4 py-2 text-sm font-bold transition-all duration-200 ${
                      selectedTaste === t
                        ? 'border-primary bg-primary text-primary-foreground scale-105'
                        : 'border-border bg-background text-foreground/80 hover:border-primary/50 hover:bg-muted'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2 — Brew */}
            <div>
              <p className="mb-4 text-xs font-black uppercase tracking-[0.3em] text-primary">
                02 · How do you brew?
              </p>
              <div className="flex flex-wrap gap-2">
                {BREW_TAGS.map(b => (
                  <button
                    key={b}
                    onClick={() => setSelectedBrew(b === selectedBrew ? null : b)}
                    className={`rounded-full border px-4 py-2 text-sm font-bold transition-all duration-200 ${
                      selectedBrew === b
                        ? 'border-primary bg-primary text-primary-foreground scale-105'
                        : 'border-border bg-background text-foreground/80 hover:border-primary/50 hover:bg-muted'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3 — Or browse by roast */}
            <div>
              <p className="mb-4 text-xs font-black uppercase tracking-[0.3em] text-primary">
                03 · Or browse by roast level
              </p>
              <div className="grid grid-cols-3 gap-3">
                {ROASTS.map(r => (
                  <button
                    key={r.id}
                    onClick={() => setActiveRoast(activeRoast?.id === r.id ? null : r)}
                    className={`rounded-2xl border p-4 text-left transition-all duration-200 ${
                      activeRoast?.id === r.id || matchedRoast?.id === r.id
                        ? 'border-primary bg-primary/10 scale-[1.03] shadow-md'
                        : 'border-border bg-background hover:bg-muted'
                    }`}
                  >
                    <div className={`mb-2 h-1.5 w-full rounded-full ${r.accent} opacity-80`} />
                    <p className="text-sm font-black leading-tight text-foreground">{r.label}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{r.subtitle}</p>
                  </button>
                ))}
              </div>
              {(selectedTaste || selectedBrew || activeRoast) && (
                <button onClick={reset} className="mt-3 text-xs text-muted-foreground underline hover:text-foreground">
                  Reset selections
                </button>
              )}
            </div>
          </div>

          {/* RIGHT — result card */}
          <div className="flex flex-col justify-center">
            {displayed ? (
              <div className="rounded-[2.5rem] border border-border bg-card p-6 shadow-xl">
                {/* Pack image */}
                <div className={`flex h-48 items-center justify-center rounded-[2rem] bg-gradient-to-br ${displayed.color} p-6 mb-6`}>
                  <img src={displayed.packImage} alt={displayed.packName} className="h-full object-contain drop-shadow-2xl transition-all duration-500" />
                </div>

                {/* Match label */}
                <p className="mb-1 text-xs font-black uppercase tracking-[0.3em] text-primary">
                  {(selectedTaste || selectedBrew) && !activeRoast ? '✦ Your Match' : 'Selected'}
                </p>
                <h3 className="font-display text-4xl font-black text-foreground">{displayed.label}</h3>
                <p className="mt-1 text-muted-foreground">{displayed.packName} · <span className="font-bold text-primary">{displayed.price}</span></p>

                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{displayed.description}</p>

                {/* Flavour tags */}
                <div className="mt-5 flex flex-wrap gap-2">
                  {displayed.flavours.map(f => (
                    <span key={f} className="rounded-full bg-muted px-3 py-1 text-xs font-bold text-foreground">{f}</span>
                  ))}
                </div>

                {/* Stats */}
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-muted p-3">
                    <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Acidity</p>
                    <p className="mt-1 text-sm font-black tracking-widest text-primary">{displayed.acidity}</p>
                  </div>
                  <div className="rounded-2xl bg-muted p-3">
                    <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Strength</p>
                    <p className="mt-1 text-sm font-black tracking-widest text-primary">{displayed.strength}</p>
                  </div>
                </div>

                {/* Brew methods */}
                <div className="mt-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2">Best Brewed With</p>
                  <div className="flex flex-wrap gap-2">
                    {displayed.brews.map(b => (
                      <span key={b} className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{b}</span>
                    ))}
                  </div>
                </div>

                <Button asChild className="mt-6 w-full rounded-full">
                  <Link to="/order">
                    Order {displayed.label} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-[2.5rem] border border-border bg-card p-10 text-center shadow-sm">
                <div className="mb-6 flex gap-3">
                  {ROASTS.map(r => (
                    <div key={r.id} className={`h-16 w-16 rounded-full ${r.accent} opacity-80 transition-transform hover:scale-110`} />
                  ))}
                </div>
                <p className="text-lg font-bold text-foreground/70">Select a taste or brew method</p>
                <p className="mt-2 text-sm text-muted-foreground">We'll find your perfect Tomoca roast</p>
                <ChevronRight className="mt-6 h-6 w-6 rotate-90 text-primary animate-bounce" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}