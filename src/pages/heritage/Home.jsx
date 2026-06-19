import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, MapPin, Play, Star, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, useScroll, useTransform } from 'framer-motion';
import PageShell from '@/components/tomoca/PageShell';
import HomeJournal from '@/components/tomoca/HomeJournal';
import HomeSpotify from '@/components/tomoca/HomeSpotify';
import HomeSubscription from '@/components/tomoca/HomeSubscription';
import { img, locations } from '@/components/tomoca/Data';
import { Reveal, StaggerContainer, fadeUp, slideLeft, slideRight, scaleIn } from '@/components/tomoca/ScrollReveal';
import CoffeeCupDeco from '@/components/tomoca/CoffeeCupDeco';
import { useCurrency } from '@/contexts/CurrencyContext';

/* ─── HERO ────────────────────────────────────────────────────────────────── */
function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '28%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '16%']);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} className="relative h-screen min-h-[760px] overflow-hidden bg-[hsl(20,15%,5%)]">

      {/* Grain overlay */}
      <div className="absolute inset-0 z-10 opacity-[0.04] [background-image:url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJuIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC45IiBudW1PY3RhdmVzPSI0IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbHRlcj0idXJsKCNuKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==')] [background-size:200px_200px] pointer-events-none" />

      {/* Parallax hero image */}
      <motion.div className="absolute inset-0 scale-110 transform-gpu" style={{ y: imgY }}>
        <img
          src={img.lady}
          alt="Tomoca heritage"
          className="h-full w-full object-cover object-center" />
        
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(20,15%,5%)] via-[hsl(20,15%,5%)/50] to-[hsl(20,15%,5%)/20]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(20,15%,5%)] via-transparent to-[hsl(20,15%,5%)/40]" />
      </motion.div>

      {/* Decorative glow */}
      <div className="absolute right-[15%] top-[30%] h-[600px] w-[600px] rounded-full bg-primary/10 blur-[120px] pointer-events-none z-10" />

      {/* Content */}
      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-20 flex h-full flex-col justify-between px-6 pb-16 pt-32 md:px-14">
        
        <div className="mx-auto max-w-7xl w-full flex flex-col justify-between h-full">

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="flex items-center justify-between">
            
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-primary/60" />
              <p className="text-xs font-semibold uppercase tracking-[0.5em] text-white/40">
                Addis Ababa · Ethiopia
              </p>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="hidden items-center gap-6 text-xs font-medium uppercase tracking-[0.35em] text-white/30 md:flex">
              
              <span>Est. 1953</span>
              <span className="h-px w-8 bg-white/15" />
              <span>Ethiopian Arabica</span>
            </motion.div>
          </motion.div>

          {/* Main headline */}
          <div className="max-w-3xl">
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-light text-white leading-[0.92] tracking-[-0.02em]"
              style={{ fontSize: 'clamp(3.8rem, 11vw, 10rem)' }}>
              
              Roasted<br />
              <em className="text-primary not-italic">with soul.</em>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.55 }}
              className="mt-7 max-w-md text-lg leading-relaxed text-white/50 font-light">
              
              A heritage coffee house roasting the finest Ethiopian Arabica since 1953 — for cafés, homes, ceremonies, and those who taste the difference.
            </motion.p>
          </div>

          {/* CTAs + scroll cue */}
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.75 }}
              className="flex flex-wrap gap-3">
              
              <motion.a
                href="https://t.me/TomTomChan?text=Hi%20Tomoca!%20I'd%20like%20to%20place%20an%20order"
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2.5 rounded-full bg-primary px-8 py-4 text-sm font-semibold text-white shadow-2xl shadow-primary/40 transition-all hover:bg-primary/90">
                
                Order Coffee <ArrowUpRight className="h-4 w-4" />
              </motion.a>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/6 px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/12">
                  
                  Shop Beans
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="flex items-center gap-4 text-white/30">
              
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                className="h-12 w-7 rounded-full border border-white/15 flex items-start justify-center pt-2.5">
                
                <div className="h-2.5 w-[3px] rounded-full bg-white/25" />
              </motion.div>
              <span className="text-[10px] uppercase tracking-[0.45em] font-medium">Scroll</span>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>);

}

/* ─── TICKER ─────────────────────────────────────────────────────────────── */
function Ticker() {
  const items = ['Since 1953', 'Ethiopian Arabica', 'Addis Ababa', 'Roasted to Order', 'Ceremonial Culture', 'Specialty Grade', 'Highland Harvest', 'Single Origin'];
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-border/40 bg-foreground py-5 select-none">
      <div className="flex animate-ticker gap-0 will-change-transform">
        {doubled.map((item, i) =>
        <span key={i} className="flex items-center whitespace-nowrap px-8 text-[11px] font-semibold uppercase tracking-[0.5em] text-white/20">
            {item}
            <span className="ml-8 text-primary/50">◆</span>
          </span>
        )}
      </div>
    </div>);

}

/* ─── STATS ──────────────────────────────────────────────────────────────── */
const STATS = [
{ value: '70+', label: 'Years Roasting', suffix: '' },
{ value: '1953', label: 'Year Founded', suffix: '' },
{ value: '100%', label: 'Ethiopian Arabica', suffix: '' },
{ value: "Global", label: 'Locations', suffix: '' }];


function StatsBar() {
  return (
    <div className="bg-background border-b border-border/50">
      <StaggerContainer
        className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4 divide-x divide-border/40"
        stagger={0.08}>
        
        {STATS.map((s, i) =>
        <motion.div
          key={s.label}
          variants={fadeUp}
          custom={i}
          className="flex flex-col items-center py-12 px-6 text-center">
          
            <span className="font-display text-5xl font-light italic text-foreground md:text-6xl">
              {s.value}
            </span>
            <span className="mt-3 text-[10px] font-semibold uppercase tracking-[0.35em] text-muted-foreground">
              {s.label}
            </span>
          </motion.div>
        )}
      </StaggerContainer>
    </div>);

}

/* ─── FEATURED PRODUCTS ───────────────────────────────────────────────────── */
function ProductFeature() {
  const { data: dbProducts = [], isLoading } = useQuery({
    queryKey: ['home-featured-products'],
    queryFn: () => base44.entities.Product.list('created_at', 12),
  });

  const { formatPrice, currency } = useCurrency();

  const fallbackProducts = [
    { image_url: img.pouch500, name: 'Standing Pouch', weight: '500g', price_usd: 18, price_etb: 1170, badge: 'Best Seller', bg: 'bg-stone-100' },
    { image_url: img.heritage, name: 'Heritage Pack', weight: '375g', price_usd: 15, price_etb: 975, badge: 'Classic', bg: 'bg-amber-50', tall: true },
    { image_url: img.compact, name: 'Compact Pack', weight: '250g', price_usd: 11, price_etb: 715, badge: 'Starter', bg: 'bg-orange-50' },
    { image_url: img.tin, name: 'Collectible Tin', weight: '200g', price_usd: 22, price_etb: 1430, badge: 'Limited', bg: 'bg-amber-100', tall: true },
  ];

  const products = (dbProducts.length ? dbProducts.filter(p => p.is_featured || p.available !== false).slice(0, 4) : fallbackProducts);

  return (
    <section className="relative overflow-hidden bg-background py-32 md:py-44">
      <div className="mx-auto max-w-7xl px-6 md:px-14">
        <div className="mb-20 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal variant={slideLeft}>
            <div>
              <p className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.45em] text-primary">
                <span className="h-px w-8 bg-primary" />Coffee Collection
              </p>
              <h2 className="font-display font-light text-5xl tracking-tight text-foreground md:text-7xl lg:text-8xl leading-[0.9] italic">
                Packaging as<br /><span className="not-italic font-semibold">collectible art.</span>
              </h2>
            </div>
          </Reveal>
          <Reveal variant={slideRight}>
            <Link to="/shop" className="group inline-flex items-center gap-2 rounded-full border border-foreground/12 px-6 py-3 text-sm font-medium text-foreground transition-all hover:border-primary hover:text-primary">
              View Full Shop
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-80 animate-pulse rounded-[2.5rem] bg-muted" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {products.map((p, i) => {
              const basePrice = p.price_etb || p.price || (p.price_usd ? p.price_usd * 65 : 0) || fallbackProducts[i % fallbackProducts.length].price_etb;
              const src = p.image_url || p.image || fallbackProducts[i % fallbackProducts.length].image_url;
              return (
                <motion.div key={p.id || p.name} variants={scaleIn} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} custom={i} whileHover={{ y: -12 }} transition={{ type: 'spring', stiffness: 260, damping: 22 }} className={`group relative overflow-hidden rounded-[2.5rem] ${p.bg || 'bg-stone-100'} ${p.tall ? 'md:mt-10' : ''}`}>
                  {(p.badge || p.is_featured) && <div className="absolute top-4 left-4 z-10 rounded-full bg-foreground/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-background">{p.badge || 'Featured'}</div>}
                  <div className={`relative flex items-center justify-center p-8 ${p.tall ? 'min-h-[360px]' : 'min-h-[280px]'}`}>
                    <img src={src} alt={p.name} className="relative h-full max-h-52 w-full object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-108" />
                  </div>
                  <div className="p-5 pt-0 text-left">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-muted-foreground">{p.weight || (p.weight_grams ? `${p.weight_grams}g` : 'Coffee')}</p>
                    <p className="mt-1 font-display text-xl font-semibold text-foreground">{p.name}</p>
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <div className="flex flex-col">
                        {currency === "ETB" ? (
                          <span className="font-display text-2xl font-light italic text-foreground">
                            {formatPrice(basePrice)}
                          </span>
                        ) : (
                          <>
                            <span className="font-display text-xl font-light italic text-foreground">
                              {formatPrice(basePrice)}
                            </span>
                            <span className="text-[10px] text-amber-500 font-bold uppercase tracking-wider mt-0.5">Inquiry Only</span>
                            <span className="text-[10px] text-muted-foreground font-normal">{formatPrice(basePrice, "ETB")}</span>
                          </>
                        )}
                      </div>
                      <Link to={p.id ? `/product/${p.id}` : '/shop'}>
                        <motion.span whileHover={{ scale: 1.1 }} className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-background transition-all group-hover:bg-primary group-hover:text-white shrink-0">
                          <ArrowUpRight className="h-4 w-4" />
                        </motion.span>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── LOCATIONS ───────────────────────────────────────────────────────────── */
function LocationsSection() {
  return (
    <section className="bg-background py-32 md:py-44">
      <div className="mx-auto max-w-7xl px-6 md:px-14">
        <div className="mb-20 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal variant={slideLeft}>
            <div>
              <p className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.45em] text-primary">
                <span className="h-px w-8 bg-primary" />Locations
              </p>
              <h2 className="font-display font-light text-5xl tracking-tight text-foreground md:text-7xl leading-[0.9] italic">
                Find your<br /><span className="not-italic font-semibold">Tomoca.</span>
              </h2>
            </div>
          </Reveal>
          <Reveal variant={slideRight}>
            <Link
              to="/locations"
              className="group inline-flex items-center gap-2 rounded-full border border-foreground/12 px-6 py-3 text-sm font-medium text-foreground transition-all hover:border-primary hover:text-primary">
              
              All Locations <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        </div>

        <StaggerContainer className="grid gap-5 md:grid-cols-3" stagger={0.1}>
          {locations.map((l, i) =>
          <motion.a
            key={l.name}
            href="https://maps.google.com"
            target="_blank"
            rel="noreferrer"
            variants={fadeUp}
            custom={i}
            whileHover={{ y: -8 }}
            transition={{ type: 'spring', stiffness: 280 }}
            className="group relative overflow-hidden rounded-[2.5rem] border border-border/50 bg-card p-8 transition-all hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/6">
            
              <motion.div
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-0 top-0 h-[2px] origin-left bg-gradient-to-r from-primary to-accent" />
            
              <span className="mb-6 inline-flex rounded-full bg-primary/8 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-primary">
                {l.vibe}
              </span>
              <h3 className="font-display text-3xl font-semibold leading-tight text-foreground transition-colors group-hover:text-primary">
                {l.name}
              </h3>
              <p className="mt-3 text-sm text-muted-foreground">{l.address}</p>
              <p className="mt-1 text-sm font-medium text-foreground">{l.hours}</p>
              <p className="mt-4 text-xs text-muted-foreground">{l.services}</p>
              <div className="mt-8 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground transition-colors group-hover:text-primary">
                <MapPin className="h-3.5 w-3.5" />
                Get Directions
                <ArrowUpRight className="h-3 w-3 ml-1 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
            </motion.a>
          )}
        </StaggerContainer>
      </div>
    </section>);

}

/* ─── FULL-BLEED POSTER ───────────────────────────────────────────────────── */
function PosterSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);

  return (
    <section ref={ref} className="relative h-[75vh] min-h-[540px] overflow-hidden md:h-screen">
      <motion.div style={{ y }} className="absolute inset-0 scale-110 transform-gpu">
        <img src={img.poster} alt="Tomoca Coffee" className="h-full w-full object-cover object-center" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-[hsl(20,15%,5%)/90] via-[hsl(20,15%,5%)/50] to-transparent" />
      <div className="relative flex h-full items-center px-6 md:px-14">
        <Reveal variant={slideLeft}>
          <div className="max-w-2xl">
            <p className="mb-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.5em] text-primary">
              <span className="h-px w-8 bg-primary" />Maison Tomoca
            </p>
            <h2 className="font-display font-light text-5xl leading-[0.9] tracking-tight text-white md:text-7xl lg:text-8xl italic">
              The art of<br /><span className="not-italic font-semibold">Ethiopian</span><br />coffee.
            </h2>
            <div className="mt-12 flex flex-wrap gap-4">
              <Link
                to="/merchandise"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-primary/90">
                
                Shop Merchandise <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                to="/wholesale"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/8 px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/15">
                
                Wholesale
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>);

}

/* ─── ORIGIN SECTION ──────────────────────────────────────────────────────── */
function OriginSection() {
  const regions = [
    {
      name: 'Yirgacheffe',
      altitude: '1,800 – 2,200m',
      profile: 'Floral & Citrusy',
      desc: 'Renowned for its delicate, tea-like consistency with bright notes of lemon, jasmine, and honey.',
      img: img.farm,
    },
    {
      name: 'Sidama',
      altitude: '1,500 – 2,200m',
      profile: 'Rich & Berry-like',
      desc: 'A complex flavor profile boasting deep fruit notes, vibrant acidity, and a smooth, sweet finish.',
      img: img.drying,
    },
    {
      name: 'Harrar',
      altitude: '1,600 – 2,000m',
      profile: 'Bold & Winey',
      desc: 'Dry-processed beans known for their wild, exotic character, heavy body, and intense blueberry aroma.',
      img: img.harvest,
    },
  ];

  return (
    <section className="bg-[hsl(20,12%,8%)] py-32 md:py-44 text-white overflow-hidden relative">
      <div className="absolute left-[-10%] top-[20%] h-[500px] w-[500px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
      
      <div className="mx-auto max-w-7xl px-6 md:px-14 relative z-10">
        <div className="mb-20 max-w-3xl">
          <Reveal variant={slideLeft}>
            <p className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.45em] text-primary">
              <span className="h-px w-8 bg-primary" />Sourced at the Source
            </p>
            <h2 className="font-display font-light text-5xl tracking-tight text-white md:text-7xl lg:text-8xl leading-[0.9] italic">
              The high highlands of<br /><span className="not-italic font-semibold text-primary">pure Arabica.</span>
            </h2>
            <p className="mt-8 text-lg text-white/50 font-light leading-relaxed">
              Every Tomoca bean is carefully selected from the diverse microclimates of southwestern and eastern Ethiopia. Sown in rich volcanic soil and nourished by high elevations, our single-origin coffees reflect seventy years of direct-trade heritage.
            </p>
          </Reveal>
        </div>

        <StaggerContainer className="grid gap-8 md:grid-cols-3" stagger={0.15}>
          {regions.map((r, i) => (
            <motion.div
              key={r.name}
              variants={fadeUp}
              custom={i}
              whileHover={{ y: -12 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="group relative overflow-hidden rounded-[2.5rem] bg-white/[0.03] border border-white/10 p-6 flex flex-col justify-between min-h-[460px]"
            >
              <div className="relative h-48 w-full overflow-hidden rounded-[1.8rem]">
                <img
                  src={r.img}
                  alt={r.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[hsl(20,12%,8%)]/60 to-transparent" />
              </div>

              <div className="mt-6 flex-grow">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-primary">
                    {r.altitude}
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-white/40">
                    {r.profile}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-3xl font-semibold text-white group-hover:text-primary transition-colors">
                  {r.name}
                </h3>
                <p className="mt-3 text-sm text-white/50 leading-relaxed font-light">
                  {r.desc}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-white/40 group-hover:text-white transition-colors">
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em]">Explore Region</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

/* ─── PROCESS SECTION ─────────────────────────────────────────────────────── */
function ProcessSection() {
  const steps = [
    {
      step: '01',
      title: 'Hand Selection',
      desc: 'Our coffee is meticulously hand-picked. Only perfectly ripe cherries are selected by our local farming partners.',
      img: img.farmer,
    },
    {
      step: '02',
      title: 'Sun Drying',
      desc: 'Cherries are carefully spread on raised African drying beds, turning regularly under the highland sun to build complex sugars.',
      img: img.workers,
    },
    {
      step: '03',
      title: 'Aroma Roasting',
      desc: 'Roasted to order in our historic roasting house. Our master roasters monitor air temperature, drum rotation, and second crack.',
      img: img.aerial,
    },
    {
      step: '04',
      title: 'Ceremonial Pour',
      desc: 'Brewed with patience and served with grace. We treat every single cup as an active celebration of Ethiopian coffee history.',
      img: img.field,
    },
  ];

  return (
    <section className="bg-background py-32 md:py-44 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 md:px-14">
        <div className="mb-24 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal variant={slideLeft}>
            <div>
              <p className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.45em] text-primary">
                <span className="h-px w-8 bg-primary" />The Ritual
              </p>
              <h2 className="font-display font-light text-5xl tracking-tight text-foreground md:text-7xl lg:text-8xl leading-[0.9] italic">
                From organic soil<br /><span className="not-italic font-semibold">to golden crema.</span>
              </h2>
            </div>
          </Reveal>
        </div>

        <StaggerContainer className="grid gap-6 md:grid-cols-4" stagger={0.1}>
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              variants={fadeUp}
              custom={i}
              className="group flex flex-col"
            >
              <div className="relative overflow-hidden rounded-[2rem] aspect-[4/5] bg-stone-100 mb-6">
                <img
                  src={s.img}
                  alt={s.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="absolute top-6 left-6 font-display text-4xl font-light italic text-white/30 group-hover:text-primary transition-colors">
                  {s.step}
                </span>
              </div>
              <h3 className="font-display text-2xl font-semibold text-foreground group-hover:text-primary transition-colors">
                {s.title}
              </h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed font-light">
                {s.desc}
              </p>
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

/* ─── TESTIMONIALS SECTION ────────────────────────────────────────────────── */
function TestimonialsSection() {
  const reviews = [
    {
      quote: "Tomoca is more than coffee; it’s an absolute landmark. Sipping a macchiato at the Piazza bar feels like stepping into a living museum of roasting history.",
      author: "Marcus Samuelsson",
      role: "Chef & Author",
      stars: 5,
    },
    {
      quote: "The richness of the beans is unparalleled. Tomoca's medium roast is wonderfully floral, capturing the genuine wild character of high-altitude Arabica.",
      author: "Sarah Jenkins",
      role: "Specialty Coffee Judge",
      stars: 5,
    },
    {
      quote: "Every time I return to Addis Ababa, my first stop is Tomoca. The aroma on Wavel Street has remained unchanged for decades. It is the soul of the city.",
      author: "Teddy Afro",
      role: "Artist & Musician",
      stars: 5,
    },
  ];

  return (
    <section className="bg-stone-50 py-32 md:py-44 border-y border-border/40 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 md:px-14">
        <div className="mb-20 text-center">
          <Reveal variant={fadeUp}>
            <p className="mb-4 flex items-center justify-center gap-3 text-[11px] font-semibold uppercase tracking-[0.45em] text-primary">
              <span className="h-px w-8 bg-primary" />Testimonials
            </p>
            <h2 className="font-display font-light text-5xl tracking-tight text-foreground md:text-7xl leading-[1] italic">
              Loved by travelers,<br /><span className="not-italic font-semibold">revered by locals.</span>
            </h2>
          </Reveal>
        </div>

        <StaggerContainer className="grid gap-8 md:grid-cols-3" stagger={0.12}>
          {reviews.map((r, i) => (
            <motion.div
              key={r.author}
              variants={fadeUp}
              custom={i}
              whileHover={{ y: -8 }}
              className="relative rounded-[2.5rem] bg-background border border-border/50 p-10 shadow-sm transition-shadow hover:shadow-xl hover:shadow-stone-200/50 flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-1 text-primary mb-6">
                  {Array.from({ length: r.stars }).map((_, idx) => (
                    <Star key={idx} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <blockquote className="text-lg font-light leading-relaxed text-foreground italic">
                  "{r.quote}"
                </blockquote>
              </div>
              <div className="mt-8 pt-6 border-t border-border/40 flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-display text-sm font-semibold text-primary">
                  {r.author.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <cite className="not-italic font-semibold text-foreground text-sm block">
                    {r.author}
                  </cite>
                  <span className="text-xs text-muted-foreground">
                    {r.role}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

/* ─── PAGE ────────────────────────────────────────────────────────────────── */
export default function Home() {
  return (
    <PageShell>
      <HeroSection />
      <Ticker />
      <StatsBar />
      <ProductFeature />
      <OriginSection />
      <ProcessSection />
      <TestimonialsSection />
      <LocationsSection />
      <PosterSection />
      <HomeSubscription />
      <HomeJournal />
      <HomeSpotify />
      <div className="flex justify-center py-16 bg-background">
        <CoffeeCupDeco />
      </div>
    </PageShell>);

}