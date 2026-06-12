import React from 'react';
import { motion } from 'framer-motion';
import { Reveal, slideLeft, slideRight } from './ScrollReveal';

function SpotifyIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 fill-black">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

function EqBars() {
  return (
    <div className="flex items-end gap-[3px] h-6">
      {[4, 7, 5, 9, 6, 8, 4, 7].map((h, i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full bg-[#1DB954]"
          animate={{ height: [`${h * 2}px`, `${(h + 5) * 2}px`, `${h * 2}px`] }}
          transition={{ duration: 0.6 + i * 0.08, repeat: Infinity, ease: 'easeInOut', delay: i * 0.07 }}
        />
      ))}
    </div>
  );
}

export default function HomeSpotify() {
  return (
    <section className="relative overflow-hidden bg-foreground py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 opacity-[0.025] [background-image:url('data:image/svg+xml,%3Csvg viewBox=%220 0 512 512%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.75%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')]" />
      <div className="h-px w-full bg-gradient-to-r from-transparent via-background/10 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 pt-24 md:px-16">
        <div className="flex flex-col gap-12 md:flex-row md:items-center md:justify-between">
          <Reveal variant={slideLeft} className="max-w-xl">
            <p className="mb-4 flex items-center gap-3 text-xs font-black uppercase tracking-[0.4em] text-primary">
              <span className="h-px w-8 bg-primary" />Now Playing at Tomoca
            </p>
            <h2 className="font-display text-4xl font-black leading-[0.88] tracking-tight text-background md:text-6xl">
              Set the mood.<br />Play the house.
            </h2>
            <p className="mt-5 max-w-sm text-background/50 leading-relaxed">
              The official Tomoca Coffee House playlist — curated for ceremony, conversation, and the perfect brew.
            </p>
          </Reveal>

          <Reveal variant={slideRight}>
            <motion.a
              href="https://open.spotify.com/playlist/37i9dQZF1DX0SM0LYsmbMT"
              target="_blank"
              rel="noreferrer"
              whileHover={{ y: -6, boxShadow: '0 24px 80px rgba(29,185,84,0.18)' }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="group flex items-center gap-6 rounded-[2.5rem] border border-background/10 bg-background/5 p-7 pr-10 backdrop-blur transition-all hover:border-[#1DB954]/30 hover:bg-background/8"
            >
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-[#1DB954] shadow-xl shadow-[#1DB954]/30">
                <SpotifyIcon />
              </div>
              <div>
                <div className="mb-2">
                  <EqBars />
                </div>
                <p className="font-black text-background text-lg leading-tight">Coffee House Playlist</p>
                <p className="text-sm text-background/40 mt-0.5 group-hover:text-[#1DB954] transition-colors">
                  Listen on Spotify
                </p>
              </div>
              <motion.span
                className="ml-4 flex h-8 w-8 items-center justify-center rounded-full bg-background/10 text-background/50 transition-all group-hover:bg-[#1DB954] group-hover:text-black"
                whileHover={{ scale: 1.1 }}
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
              </motion.span>
            </motion.a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}