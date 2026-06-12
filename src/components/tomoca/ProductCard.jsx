import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ProductCard({ product }) {
  return (
    <article className="group overflow-hidden rounded-[2rem] border bg-card shadow-xl shadow-primary/5 transition duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/15">
      <div className="relative aspect-[4/5] overflow-hidden bg-primary/10">
        <img src={product.image} alt={product.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <span className="absolute left-4 top-4 rounded-full bg-foreground px-4 py-2 text-xs font-bold text-background">{product.weight}</span>
      </div>
      <div className="p-6">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-primary">{product.origin}</p>
        <h3 className="mt-2 font-display text-3xl font-black">{product.name}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{product.notes}</p>
        <div className="mt-5 flex items-center justify-between">
          <span className="font-display text-2xl font-black">{product.price}</span>
          <Button asChild className="rounded-full"><Link to="/order"><ShoppingBag className="mr-2 h-4 w-4" />Add</Link></Button>
        </div>
      </div>
    </article>
  );
}