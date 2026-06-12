import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Mail, MapPin, Phone, ArrowUpRight, ArrowUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { img } from '@/components/tomoca/Data';
import { motion } from 'framer-motion';
import { Reveal, fadeUp, slideLeft } from '@/components/tomoca/ScrollReveal';

const COLS = [
  {
    heading: 'Experience',
    links: [['Shop Beans', '/shop'], ['Menu', '/menu'], ['Events', '/events'], ['Gallery', '/gallery'], ['Roastery', '/roastery'], ['Loyalty', '/loyalty']],
  },
  {
    heading: 'Company',
    links: [['About', '/about'], ['Heritage', '/heritage'], ['Wholesale', '/wholesale'], ['Careers', '/careers'], ['Press Kit', '/press'], ['Reviews', '/reviews']],
  },
  {
    heading: 'Support',
    links: [['FAQ', '/faq'], ['Policies', '/policies'], ['Contact', '/contact'], ['Promotions', '/promotions'], ['Merchandise', '/merchandise'], ['Journal', '/journal']],
  },
];

const INSTAGRAM_URL = 'https://www.instagram.com/tomoca_coffee';
const FACEBOOK_URL = 'https://www.facebook.com/share/1B1Ew6vUdA/';

export default function TomocaFooter() {
  const [time, setTime] = useState('');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const update = () => setTime(
      new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Africa/Addis_Ababa',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      }).format(new Date())
    );
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) setSubscribed(true);
  };

  return (
    <footer className="relative overflow-hidden bg-[hsl(20,15%,5%)] text-white">
      {/* Texture */}
      <div className="absolute inset-0 opacity-[0.03] [background-image:url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IndoaXRlIi8+PC9zdmc+')] [background-size:30px_30px]" />

      {/* Top border gradient */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6 pt-24 pb-10 md:px-14">

        {/* ── Top section ── */}
        <div className="mb-20 grid gap-16 lg:grid-cols-[1.6fr_1fr] lg:items-end">
          <div>
            <Reveal variant={slideLeft}>
              <motion.img
                src={img.logo}
                alt="Tomoca Coffee"
                whileHover={{ scale: 1.03 }}
                className="h-16 w-auto object-contain mb-7 drop-shadow-[0_0_40px_rgba(230,110,0,0.15)]"
              />
              <p className="max-w-lg text-xl leading-relaxed text-white/50 font-light">
                Authentic Ethiopian coffee roasted with soul since 1953 — for cafés, homes, ceremonies, and those who taste the difference.
              </p>
            </Reveal>

            <Reveal variant={fadeUp} className="mt-8 flex flex-wrap items-center gap-3">
              {[
                { SocialIcon: Instagram, label: 'Instagram', href: INSTAGRAM_URL, color: 'hover:text-pink-400 hover:border-pink-400/40' },
                { SocialIcon: Facebook, label: 'Facebook', href: FACEBOOK_URL, color: 'hover:text-blue-400 hover:border-blue-400/40' },
              ].map(({ SocialIcon, label, href, color }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ y: -2 }}
                  className={`flex items-center gap-2 rounded-full border border-white/12 px-5 py-2.5 text-sm font-medium text-white/50 transition-all ${color}`}
                >
                  <SocialIcon className="h-4 w-4" />{label}
                </motion.a>
              ))}
            </Reveal>
          </div>

          {/* Live clock */}
          <Reveal variant={fadeUp}>
            <div className="rounded-3xl border border-white/8 bg-white/4 p-8 backdrop-blur-sm">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.4em] text-primary">Addis Ababa</p>
              <motion.p
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="font-display text-6xl font-light text-white tabular-nums italic"
              >
                {time}
              </motion.p>
              <p className="mt-3 text-sm text-white/35">Local time at our roastery</p>
              <div className="mt-5 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-medium text-emerald-400/80">Roasting now</span>
              </div>
            </div>
          </Reveal>
        </div>

        {/* ── Links grid ── */}
        <div className="grid gap-12 border-t border-white/8 pt-16 md:grid-cols-4">
          {COLS.map((col, ci) => (
            <Reveal key={col.heading} variant={fadeUp} custom={ci}>
              <div>
                <h4 className="mb-6 text-[11px] font-semibold uppercase tracking-[0.4em] text-primary">{col.heading}</h4>
                <ul className="space-y-3">
                  {col.links.map(([label, path]) => (
                    <li key={path}>
                      <motion.div whileHover={{ x: 4 }} transition={{ type: 'spring', stiffness: 500 }}>
                        <Link to={path} className="text-sm text-white/45 hover:text-white transition-colors">{label}</Link>
                      </motion.div>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}

          {/* Newsletter */}
          <Reveal variant={fadeUp} custom={3}>
            <div>
              <h4 className="mb-6 text-[11px] font-semibold uppercase tracking-[0.4em] text-primary">Stay Connected</h4>
              {subscribed ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-2xl border border-emerald-500/20 bg-emerald-500/8 p-4 text-center"
                >
                  <p className="text-sm font-medium text-emerald-400">Welcome to Tomoca.</p>
                  <p className="mt-1 text-xs text-white/40">You'll hear from us soon.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-2">
                  <Input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Your email"
                    className="bg-white/5 text-white placeholder:text-white/30 border-white/10 rounded-xl focus:border-primary/50 focus:bg-white/8"
                  />
                  <Button type="submit" className="w-full rounded-xl bg-primary hover:bg-primary/90 text-white font-medium">
                    Subscribe
                  </Button>
                </form>
              )}

              {/* Spotify */}
              <div className="mt-7">
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.35em] text-white/30">Now Playing</p>
                <motion.a
                  href="https://open.spotify.com/playlist/37i9dQZF1DX0SM0LYsmbMT"
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/4 p-3.5 hover:bg-white/8 transition-all group"
                >
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#1DB954] shadow-lg shadow-[#1DB954]/30">
                    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-black">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                    </svg>
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate">Coffee House Playlist</p>
                    <p className="text-xs text-white/35 group-hover:text-[#1DB954] transition-colors">Listen on Spotify</p>
                  </div>
                </motion.a>
              </div>
            </div>
          </Reveal>
        </div>

        {/* ── Bottom bar ── */}
        <Reveal variant={fadeUp}>
          <div className="mt-16 flex flex-wrap items-center gap-5 border-t border-white/8 pt-8 text-xs text-white/30">
            <span>© 2026 Tomoca Coffee. Est. Addis Ababa, 1953.</span>
            <div className="flex items-center gap-4 ml-auto">
              {[['Privacy', '/policies'], ['Terms', '/policies'], ['Shipping', '/policies']].map(([l, p]) => (
                <Link key={l} to={p} className="hover:text-white/60 transition-colors">{l}</Link>
              ))}
              <Link to="/portfolio" className="opacity-40 hover:opacity-70 transition-opacity">Admin</Link>
            </div>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}