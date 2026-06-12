import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import PageShell from '@/components/tomoca/PageShell';
import SectionHeading from '@/components/tomoca/SectionHeading';
import BeansGallery from '@/components/tomoca/BeansGallery';
import { img } from '@/components/tomoca/Data';

export default function Shop() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => base44.entities.Product.list('sort_order', 20),
  });

  return (
    <PageShell>
      <main className="pt-32">
        <section className="mx-auto max-w-7xl px-6 py-20">
          <SectionHeading
            eyebrow="Shop Coffee"
            title="Whole bean, ground coffee, gifts and subscriptions."
            text="Choose your roast level, discover flavour notes, and order the pack that fits your brewing ritual. Shipping, office plans, and gift packs are available on request."
          />

          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-96 animate-pulse rounded-[2rem] bg-muted" />
              ))}
            </div>
          ) : (
            <BeansGallery products={products.filter(p => p.available !== false)} />
          )}

          <div className="mt-16 rounded-[2rem] bg-foreground p-8 text-background">
            <h3 className="font-display text-4xl font-black text-primary">Subscription Promise</h3>
            <p className="mt-3 max-w-3xl text-background/75">
              Freshly roasted Ethiopian coffee delivered weekly or monthly with personalised brewing
              recommendations for espresso, moka pot, jebena, French press, and filter.
            </p>
          </div>
        </section>
      </main>
    </PageShell>
  );
}