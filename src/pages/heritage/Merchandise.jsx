import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PageShell from '@/components/tomoca/PageShell';
import SectionHeading from '@/components/tomoca/SectionHeading';
import BeansGallery from '@/components/tomoca/BeansGallery';
import { img } from '@/components/tomoca/Data';

export default function Merchandise() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['heritage-merchandise-products'],
    queryFn: () => base44.entities.Product.list('created_at', 60),
  });

  const merch = products.filter((p) => String(p.category || '').toLowerCase() === 'merchandise' && p.available !== false);

  return (
    <PageShell>
      <main className="pt-32">
        <section className="flex flex-col items-center justify-center bg-foreground py-24 text-center">
          <img src={img.logo} alt="Tomoca Coffee" className="w-72 object-contain drop-shadow-[0_0_80px_rgba(255,107,0,0.3)] md:w-[32rem]" />
          <div className="mt-6 h-px w-48 bg-primary/50" />
          <p className="mt-4 text-sm font-black uppercase tracking-[0.6em] text-white/50">Maison Tomoca</p>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20">
          <SectionHeading eyebrow="Maison Tomoca Merchandise" title="Collectible tins, tokens and heritage objects." text="Merchandise is now fetched from Supabase. Create products with category ‘merchandise’ in the admin dashboard and they appear here automatically." />

          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-96 animate-pulse rounded-[2rem] bg-muted" />)}</div>
          ) : merch.length > 0 ? (
            <BeansGallery products={merch} />
          ) : (
            <div className="rounded-[2rem] border border-dashed border-border bg-card p-10 text-center">
              <h3 className="font-display text-3xl font-black">No merchandise products yet.</h3>
              <p className="mt-3 text-muted-foreground">Add a product with category <strong>merchandise</strong> from Admin → Products.</p>
            </div>
          )}

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            <img src={img.tin} alt="Collectible tin" className="rounded-[2rem]" />
            <img src={img.tokens} alt="Coffee tokens" className="rounded-[2rem]" />
            <img src={img.lady} alt="Tomoca artwork" className="rounded-[2rem]" />
          </div>
        </section>
      </main>
    </PageShell>
  );
}
