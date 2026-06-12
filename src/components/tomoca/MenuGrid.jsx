import React from 'react';
import { Badge } from '@/components/ui/badge';
import { menu } from './Data';

export default function MenuGrid() {
  return (
    <div className="grid gap-px overflow-hidden rounded-[2rem] border bg-border md:grid-cols-2">
      {menu.map(([name, desc, price, tag]) => (
        <div key={name} className="bg-card p-6 transition hover:bg-primary hover:text-primary-foreground">
          <div className="flex items-start justify-between gap-4">
            <div><h3 className="font-display text-3xl font-black">{name}</h3><p className="mt-2 text-sm opacity-75">{desc}</p></div>
            <span className="font-display text-2xl font-black">{price}</span>
          </div>
          {tag && <Badge className="mt-4 rounded-full bg-foreground text-background">{tag}</Badge>}
        </div>
      ))}
    </div>
  );
}