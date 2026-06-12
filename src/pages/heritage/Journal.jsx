import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import PageShell from '@/components/tomoca/PageShell';
import { Button } from '@/components/ui/button';
import { BookOpen, Calendar, Tag, ArrowUpRight } from 'lucide-react';
import { img } from '@/components/tomoca/Data';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ['All', 'Tomoca Stories', 'Industry News', 'Brewing Guides', 'Origin & Farm', 'Events & Culture'];
const COVERS = [img.farm, img.drying, img.lady, img.store, img.field, img.aerial, img.smile, img.harvest];

function normaliseCategory(post) {
  return post.category || post.topic || 'Tomoca Stories';
}

function ArticleCard({ article, index }) {
  const cover = article.image || article.cover_image_url || COVERS[index % COVERS.length];
  const slug = article.slug || article.id;
  const dateSource = article.published_at || article.created_at || article.created_date;
  const date = dateSource ? new Date(dateSource).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Journal';

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0, transition: { delay: index * 0.06 } }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group flex flex-col overflow-hidden rounded-[2rem] border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10"
    >
      <Link to={`/journal/${slug}`} className="block">
        <div className="relative overflow-hidden">
          <img src={cover} alt={article.title} className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/55 to-transparent" />
          <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-black text-primary-foreground">
            {normaliseCategory(article)}
          </span>
          <span className="absolute bottom-3 right-4 text-xs font-bold text-white/85">{date}</span>
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary">
          <BookOpen className="h-3 w-3" /> Tomoca Journal
        </p>
        <Link to={`/journal/${slug}`}>
          <h3 className="font-display text-xl font-black leading-snug transition-colors group-hover:text-primary">
            {article.title}
          </h3>
        </Link>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
          {article.summary || article.excerpt || 'Read the latest story from Tomoca Coffee.'}
        </p>
        <Button asChild variant="ghost" className="mt-5 justify-start rounded-full px-0 font-black text-primary hover:bg-transparent">
          <Link to={`/journal/${slug}`}>Read more <ArrowUpRight className="ml-1 h-4 w-4" /></Link>
        </Button>
      </div>
    </motion.article>
  );
}

export default function Journal() {
  const [cat, setCat] = useState('All');
  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['heritage-journal-posts'],
    queryFn: () => base44.entities.JournalPost.list('created_at', 60),
  });

  const filtered = cat === 'All' ? articles : articles.filter(a => normaliseCategory(a) === cat);

  return (
    <PageShell>
      <main className="pt-32">
        <section className="relative overflow-hidden bg-foreground pb-16 pt-20 text-background">
          <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(circle_at_1px_1px,hsl(var(--primary))_1px,transparent_0)] [background-size:28px_28px]" />
          <div className="relative mx-auto max-w-7xl px-6">
            <div className="max-w-3xl">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.4em] text-primary">Tomoca Journal</p>
              <h1 className="font-display text-6xl font-black leading-none tracking-tight md:text-8xl">
                Stories from<br />the coffee house.
              </h1>
              <p className="mt-6 max-w-xl text-lg text-background/70">
                Notes from the roastery, Ethiopian coffee culture, origin stories, brewing craft, and events — all managed from your Supabase admin dashboard.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="mb-10 flex flex-wrap gap-2">
            {CATEGORIES.map(c => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-full px-5 py-2 text-sm font-black transition-all ${cat === c ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25' : 'border border-border bg-card hover:border-primary/40'}`}
              >
                {c}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-96 animate-pulse rounded-[2rem] bg-muted" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-border bg-card p-12 text-center">
              <h3 className="font-display text-3xl font-black">No published journal posts yet.</h3>
              <p className="mt-3 text-muted-foreground">Publish a post from the admin dashboard and it will appear here for all visitors.</p>
            </div>
          ) : (
            <motion.div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" layout>
              <AnimatePresence mode="popLayout">
                {filtered.map((article, i) => <ArticleCard key={article.id || article.slug || i} article={article} index={i} />)}
              </AnimatePresence>
            </motion.div>
          )}
        </section>
      </main>
    </PageShell>
  );
}
