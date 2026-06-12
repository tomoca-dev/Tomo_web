import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Coffee, ShoppingBag, User, LogOut, Shield } from 'lucide-react';
import { img } from '@/components/tomoca/Data';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';

const NAV = [
  { label: 'About', path: '/about' },
  { label: 'Heritage', path: '/heritage' },
  { label: 'Shop', path: '/shop' },
  { label: 'Menu', path: '/menu' },
  { label: 'Locations', path: '/locations' },
  { label: 'Wholesale', path: '/wholesale' },
  { label: 'Journal', path: '/journal' },
  { label: 'Events', path: '/events' },
];

export default function TomocaHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => setOpen(false), [location]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        {/* Top accent bar */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="h-[2px] w-full origin-left bg-gradient-to-r from-primary/80 via-primary to-accent/80"
        />

        <motion.div
          animate={{
            backgroundColor: scrolled ? 'hsla(20,15%,6%,0.95)' : 'hsla(20,15%,6%,0)',
            backdropFilter: scrolled ? 'blur(32px) saturate(200%)' : 'blur(0px)',
          }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="px-6 py-4 md:px-14"
        >
          <div className="mx-auto flex max-w-8xl items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <motion.img
                src={img.logo}
                alt="Tomoca Coffee"
                whileHover={{ scale: 1.06 }}
                transition={{ type: 'spring', stiffness: 400 }}
                className="h-9 w-auto object-contain brightness-0 invert drop-shadow-[0_0_20px_rgba(230,110,0,0.5)]"
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden items-center gap-1 lg:flex">
              {NAV.map(({ label, path }) => {
                const active = location.pathname === path;
                return (
                  <motion.div key={path} whileHover={{ y: -1 }} transition={{ type: 'spring', stiffness: 600 }}>
                    <Link
                      to={path}
                      className={`relative px-4 py-2 text-[13px] font-medium tracking-wide transition-colors rounded-full
                        ${active ? 'text-primary' : 'text-white/55 hover:text-white/90'}`}
                    >
                      {label}
                      {active && (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 rounded-full bg-white/7"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {isAdmin && (
                <Link
                  to="/admin"
                  className="hidden items-center gap-2 rounded-full border border-primary/40 px-4 py-2.5 text-[13px] font-semibold text-primary transition-all hover:bg-primary/10 md:inline-flex"
                >
                  <Shield className="h-3.5 w-3.5" />
                  Admin
                </Link>
              )}

              {user ? (
                <button
                  type="button"
                  onClick={async () => { await signOut(); }}
                  className="hidden items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 text-[13px] font-semibold text-white/75 transition-all hover:bg-white/15 hover:text-white md:inline-flex"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign out
                </button>
              ) : (
                <Link
                  to="/login"
                  className="hidden items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 text-[13px] font-semibold text-white/75 transition-all hover:bg-white/15 hover:text-white md:inline-flex"
                >
                  <User className="h-3.5 w-3.5" />
                  Sign in
                </Link>
              )}

              <motion.a
                href="https://t.me/Tomocashopbot?text=Hi%20Tomoca!%20I'd%20like%20to%20place%20an%20order"
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="hidden items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-[13px] font-semibold text-white shadow-xl shadow-primary/25 transition-all hover:bg-primary/90 md:inline-flex"
              >
                <Coffee className="h-3.5 w-3.5" />
                Order Now
              </motion.a>

              <motion.button
                onClick={() => setOpen(!open)}
                whileTap={{ scale: 0.93 }}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/60 transition-colors hover:border-white/30 hover:text-white lg:hidden"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {open
                    ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><X className="h-4 w-4" /></motion.div>
                    : <motion.div key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><Menu className="h-4 w-4" /></motion.div>
                  }
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed inset-y-0 right-0 z-50 flex w-80 flex-col bg-[hsl(20,15%,7%)] px-8 py-10 shadow-2xl"
            >
              {/* Header accent */}
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-primary to-accent" />

              <div className="flex items-center justify-between mb-12">
                <img src={img.logo} alt="Tomoca" className="h-8 brightness-0 invert" />
                <button onClick={() => setOpen(false)} className="rounded-full p-2 text-white/40 hover:text-white transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex flex-col gap-0.5">
                {NAV.map(({ label, path }, i) => {
                  const active = location.pathname === path;
                  return (
                    <motion.div
                      key={path}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.045, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Link
                        to={path}
                        onClick={() => setOpen(false)}
                        className={`flex items-center justify-between rounded-2xl px-4 py-3.5 text-base font-medium transition-all
                          ${active ? 'bg-primary/15 text-primary' : 'text-white/50 hover:bg-white/6 hover:text-white'}`}
                      >
                        {label}
                        {active && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-auto space-y-3"
              >
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-full border border-primary/40 py-3.5 text-sm font-semibold text-primary"
                  >
                    <Shield className="h-4 w-4" />
                    Admin Dashboard
                  </Link>
                )}

                {user ? (
                  <button
                    type="button"
                    onClick={async () => { await signOut(); setOpen(false); }}
                    className="flex items-center justify-center gap-2 rounded-full border border-white/12 py-3.5 text-sm font-medium text-white/70 hover:text-white transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-full border border-white/12 py-3.5 text-sm font-medium text-white/70 hover:text-white transition-colors"
                  >
                    <User className="h-4 w-4" />
                    Sign in
                  </Link>
                )}

                <a
                  href="https://t.me/Tomocashopbot?text=Hi%20Tomoca!%20I'd%20like%20to%20place%20an%20order"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 rounded-full bg-primary py-4 text-sm font-semibold text-white shadow-xl shadow-primary/30"
                >
                  <Coffee className="h-4 w-4" />
                  Order Now
                </a>
                <Link
                  to="/shop"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-full border border-white/12 py-3.5 text-sm font-medium text-white/60 hover:text-white transition-colors"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Shop Beans
                </Link>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}