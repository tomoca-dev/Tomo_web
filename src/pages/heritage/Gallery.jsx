import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import PageShell from '@/components/tomoca/PageShell';
import SectionHeading from '@/components/tomoca/SectionHeading';
import BeansGallery from '@/components/tomoca/BeansGallery';
import { img } from '@/components/tomoca/Data';

const farmPhotos = [
  img.pouch500, img.tin, img.compact, img.heritage,
  img.farm, img.drying, img.harvest, img.smile,
  img.lady, img.store, img.tokens, img.poster
];

export default function Gallery() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => base44.entities.Product.list('sort_order', 20),
  });

  return (
    <PageShell>
      <main className="pt-32">
        {/* Beans section */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          <SectionHeading
            eyebrow="Coffee Beans Gallery"
            title="Discover our roast profiles."
            text="Every Tomoca pack tells a story of origin, craft, and ceremony. Tap any variety for full tasting notes, roast profile, and brew method recommendations."
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
        </section>

        {/* Visual journal */}
        <section className="bg-foreground py-20">
          <div className="mx-auto max-w-7xl px-6">
            <SectionHeading
              light
              eyebrow="Visual Journal"
              title="Coffee, ceremony, farm and heritage."
            />
            <div className="columns-1 gap-4 md:columns-3">
              {farmPhotos.map((p, i) => (
                <img key={i} src={p} alt={`Tomoca gallery ${i + 1}`} className="mb-4 rounded-[2rem] w-full" />
              ))}
            </div>
          </div>
        </section>
      </main>
    </PageShell>
  );
}