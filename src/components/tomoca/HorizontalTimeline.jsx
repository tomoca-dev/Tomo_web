import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { img } from '@/components/tomoca/Data';

const EVENTS = [
  {
    year: '1953',
    title: 'A Legend Is Born',
    text: "Tomoca Coffee opens its doors on Wavel Street, Piazza — Addis Ababa's first modern espresso bar. Founded with a deep love for Ethiopian Arabica, it instantly becomes the city's most beloved gathering place.",
    photo: img.store,
    photoCaption: 'The original Tomoca Piazza storefront, 1953',
    accent: '#E8721A',
    tag: 'Founding',
  },
  {
    year: '1960s',
    title: 'The Espresso Culture',
    text: "Tomoca introduces Italian espresso technique to Addis Ababa, marrying it with Ethiopia's own ancient coffee tradition. The short, intense shot — served standing — becomes a city ritual.",
    photo: img.lady,
    photoCaption: 'The Lady of Tomoca — an icon of the Piazza era',
    accent: '#D4650F',
    tag: 'Culture',
  },
  {
    year: '1970s',
    title: 'Rooted in Community',
    text: 'Through political upheaval and social change, Tomoca remains open and constant. The roastery hum becomes the heartbeat of Piazza, serving diplomats, artists, merchants, and workers alike.',
    photo: img.farm,
    photoCaption: "Ethiopian coffee highlands — source of Tomoca's soul",
    accent: '#B8560A',
    tag: 'Resilience',
  },
  {
    year: '1991',
    title: 'Ethiopian Ownership',
    text: 'Tomoca passes fully into Ethiopian hands, deepening its identity as a homegrown institution. The roasting traditions, the espresso recipes, and the warmth of service are preserved with fierce pride.',
    photo: img.workers,
    photoCaption: 'Farm workers at harvest — the backbone of Tomoca',
    accent: '#E8721A',
    tag: 'Legacy',
  },
  {
    year: '2000s',
    title: 'Packaging the Legacy',
    text: "The iconic Standing Pouch, Heritage Pack, and Collectible Tin are introduced — bringing Tomoca's roast into Ethiopian homes and onto international shelves.",
    photo: img.pouch500,
    photoCaption: 'The Standing Pouch 500g — a design icon',
    accent: '#D4650F',
    tag: 'Expansion',
  },
  {
    year: '2010s',
    title: 'A City-Wide Icon',
    text: 'New branches open in Bole, Sarbet, Atlas, Megenagna, and beyond. Each location carries its own character but shares the same uncompromising roast profile and century-old hospitality.',
    photo: img.aerial,
    photoCaption: 'Addis Ababa aerial — Tomoca now spans the city',
    accent: '#B8560A',
    tag: 'Growth',
  },
  {
    year: 'Today',
    title: 'A Global Ethiopian Story',
    text: 'With 10+ locations across Addis Ababa and growing international reach, Tomoca champions Ethiopian coffee culture — from the highlands of Yirgacheffe to cafes around the world.',
    photo: img.tokens,
    photoCaption: 'Coffee ceremony tokens — tradition carried forward',
    accent: '#E8721A',
    tag: 'Global',
  },
];

/* ── Photo pop-up modal ──────────────────────────────────────────────────── */
function PhotoModal({ event, onClose }) {
  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/85 backdrop-blur-xl"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 32 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 16 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-2xl w-full overflow-hidden rounded-[2.5rem] bg-[hsl(20,15%,6%)] shadow-[0_60px_120px_rgba(0,0,0,0.7)]"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Year badge */}
        <div
          className="absolute top-5 left-5 z-10 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.35em]"
          style={{ backgroundColor: event.accent + '33', color: event.accent }}
        >
          {event.year}
        </div>

        {/* Image */}
        <div className="relative h-60 md:h-80 overflow-hidden">
          <img src={event.photo} alt={event.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(20,15%,6%)] via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="p-8 md:p-10">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.45em]" style={{ color: event.accent }}>
            {event.tag}
          </p>
          <h3 className="font-display text-3xl font-light text-white italic">{event.title}</h3>
          <p className="mt-4 leading-relaxed text-white/55">{event.text}</p>
          <p className="mt-5 text-xs italic text-white/25">{event.photoCaption}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Timeline card ───────────────────────────────────────────────────────── */
function TimelineCard({ event, index, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex-shrink-0 w-80 md:w-96 snap-center"
    >
      {/* Connector dot to rail */}
      <div className="absolute -bottom-[3.5rem] left-10 h-8 w-px" style={{ backgroundColor: event.accent + '50' }} />
      <div className="absolute -bottom-[3.5rem] left-[2.2rem] h-4 w-4 rounded-full border-2 flex items-center justify-center" style={{ borderColor: event.accent }}>
        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: event.accent }} />
      </div>

      <motion.div
        whileHover={{ y: -10 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 280, damping: 22 }}
        onClick={onClick}
        className="group relative cursor-pointer overflow-hidden rounded-[2rem] border border-white/6 bg-[hsl(20,15%,9%)]"
        style={{ boxShadow: 'none' }}
        onHoverStart={(e) => {
          e.currentTarget.style.boxShadow = `0 32px 80px ${event.accent}20`;
        }}
        onHoverEnd={(e) => {
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {/* Accent top bar animates on view */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: index * 0.05 + 0.2, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="absolute inset-x-0 top-0 h-[2px] origin-left"
          style={{ backgroundColor: event.accent }}
        />

        {/* Photo */}
        <div className="relative h-44 overflow-hidden">
          <img
            src={event.photo}
            alt={event.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-108"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(20,15%,9%)] via-transparent to-transparent" />

          {/* Zoom hint on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm text-white/80">
              <ZoomIn className="h-4 w-4" />
            </div>
          </div>

          {/* Tag pill */}
          <div
            className="absolute bottom-3 right-3 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em]"
            style={{ backgroundColor: event.accent + '25', color: event.accent }}
          >
            {event.tag}
          </div>
        </div>

        <div className="p-6">
          <span className="block font-display text-5xl font-light italic leading-none" style={{ color: event.accent }}>
            {event.year}
          </span>
          <h3 className="mt-3 font-display text-xl font-semibold text-white">{event.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-white/45 line-clamp-3">{event.text}</p>
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.3em] transition-colors" style={{ color: event.accent + '70' }}>
            View Archive →
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Main component ──────────────────────────────────────────────────────── */
export default function HorizontalTimeline() {
  const trackRef = useRef(null);
  const [activeModal, setActiveModal] = useState(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [progress, setProgress] = useState(0);

  const checkScroll = () => {
    if (!trackRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    setProgress(scrollLeft / Math.max(scrollWidth - clientWidth, 1));
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
    return () => el.removeEventListener('scroll', checkScroll);
  }, []);

  const scrollBy = (dir) => {
    if (!trackRef.current) return;
    trackRef.current.scrollBy({ left: dir * 420, behavior: 'smooth' });
  };

  const scrollToIndex = (i) => {
    if (!trackRef.current) return;
    const CARD_W = 420;
    trackRef.current.scrollTo({ left: i * (CARD_W + 24), behavior: 'smooth' });
  };

  return (
    <section className="bg-[hsl(20,15%,5%)] py-24 md:py-36 overflow-hidden">
      {/* Header */}
      <div className="mx-auto max-w-7xl px-6 md:px-14 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.5em] text-primary">
              <span className="h-px w-8 bg-primary" />Timeline
            </p>
            <h2 className="font-display font-light text-5xl italic leading-[0.9] text-white md:text-7xl">
              Seventy years<br />
              <span className="not-italic font-semibold">of the perfect cup.</span>
            </h2>
          </div>

          {/* Arrow nav */}
          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => scrollBy(-1)}
              disabled={!canScrollLeft}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/12 text-white/50 transition-all disabled:opacity-25 hover:border-white/30 hover:text-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </motion.button>
            <motion.button
              onClick={() => scrollBy(1)}
              disabled={!canScrollRight}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/12 text-white/50 transition-all disabled:opacity-25 hover:border-white/30 hover:text-white"
            >
              <ChevronRight className="h-5 w-5" />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Scrollable track */}
      <div
        ref={trackRef}
        className="flex gap-6 overflow-x-auto px-6 pb-20 md:px-14 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {EVENTS.map((event, i) => (
          <TimelineCard
            key={event.year}
            event={event}
            index={i}
            onClick={() => setActiveModal(event)}
          />
        ))}
        <div className="flex-shrink-0 w-6 md:w-10" />
      </div>

      {/* Rail + dots */}
      <div className="relative mx-6 mt-2 md:mx-14">
        {/* Progress rail */}
        <div className="relative h-px bg-white/8 rounded-full">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-accent origin-left"
            animate={{ scaleX: progress }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          />
        </div>
        {/* Dot nav */}
        <div className="absolute -top-2 inset-x-0 flex justify-between">
          {EVENTS.map((e, i) => (
            <motion.button
              key={e.year}
              onClick={() => scrollToIndex(i)}
              whileHover={{ scale: 1.8 }}
              transition={{ type: 'spring', stiffness: 400 }}
              title={e.year}
              className="h-4 w-4 flex items-center justify-center"
            >
              <span
                className="block h-2 w-2 rounded-full border transition-all duration-300"
                style={{
                  borderColor: e.accent,
                  backgroundColor: progress >= (i / (EVENTS.length - 1)) - 0.08 ? e.accent : 'transparent',
                }}
              />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Progress label */}
      <div className="mt-8 mx-6 md:mx-14 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.4em] text-white/20">
        <span>1953</span>
        <span>{Math.round(progress * 100)}% explored</span>
        <span>Today</span>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {activeModal && (
          <PhotoModal event={activeModal} onClose={() => setActiveModal(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}