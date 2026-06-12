import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, X, Check, EyeOff, Eye } from 'lucide-react';
import PageShell from '@/components/tomoca/PageShell';
import SectionHeading from '@/components/tomoca/SectionHeading';

const ROAST_LEVELS = ['Light', 'Medium-Light', 'Medium', 'Medium-Dark', 'Dark'];

const EMPTY = {
  name: '', weight: '', price_usd: '', price_etb: '', origin: '',
  roast_level: 'Medium', roast_profile: '', description: '',
  brew_methods: '', grind_options: '', image_url: '', badge: '',
  available: true, sort_order: 0,
};

function ProductForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({ ...EMPTY, ...initial });
  const f = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 p-4 backdrop-blur-sm">
      <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[2.5rem] bg-card p-8 shadow-2xl">
        <button onClick={onCancel} className="absolute right-5 top-5 rounded-full bg-muted p-2 hover:bg-border"><X className="h-5 w-5" /></button>
        <h2 className="font-display text-3xl font-black">{initial?.id ? 'Edit Product' : 'New Product'}</h2>

        <div className="mt-6 grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Product Name *</label><Input value={form.name} onChange={e => f('name', e.target.value)} placeholder="Standing Pouch 500g" /></div>
            <div><label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Weight</label><Input value={form.weight} onChange={e => f('weight', e.target.value)} placeholder="500g" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Price USD *</label><Input type="number" value={form.price_usd} onChange={e => f('price_usd', e.target.value)} placeholder="18" /></div>
            <div><label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Price ETB</label><Input type="number" value={form.price_etb} onChange={e => f('price_etb', e.target.value)} placeholder="990" /></div>
          </div>
          <div><label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Origin / Tagline</label><Input value={form.origin} onChange={e => f('origin', e.target.value)} placeholder="Ethiopia · Signature Blend" /></div>
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Roast Level</label>
            <div className="flex flex-wrap gap-2">
              {ROAST_LEVELS.map(r => (
                <button key={r} type="button" onClick={() => f('roast_level', r)} className={`rounded-full px-4 py-1.5 text-sm font-bold transition-all ${form.roast_level === r ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-border'}`}>{r}</button>
              ))}
            </div>
          </div>
          <div><label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Flavour Notes / Roast Profile</label><Input value={form.roast_profile} onChange={e => f('roast_profile', e.target.value)} placeholder="Dark cocoa, toasted almond, caramel body" /></div>
          <div><label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Description</label><Textarea className="h-28" value={form.description} onChange={e => f('description', e.target.value)} placeholder="A detailed description for the product detail page..." /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Brew Methods</label><Input value={form.brew_methods} onChange={e => f('brew_methods', e.target.value)} placeholder="Espresso · Moka Pot · Jebena" /></div>
            <div><label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Available As</label><Input value={form.grind_options} onChange={e => f('grind_options', e.target.value)} placeholder="Whole Bean · Ground" /></div>
          </div>
          <div><label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Pack Image URL *</label><Input value={form.image_url} onChange={e => f('image_url', e.target.value)} placeholder="https://..." /></div>
          {form.image_url && <img src={form.image_url} alt="preview" className="h-32 rounded-2xl object-contain bg-muted p-2" />}
          <div className="grid grid-cols-2 gap-4">
            <div><label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Badge Label</label><Input value={form.badge} onChange={e => f('badge', e.target.value)} placeholder="Best Seller" /></div>
            <div><label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Sort Order</label><Input type="number" value={form.sort_order} onChange={e => f('sort_order', Number(e.target.value))} placeholder="1" /></div>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => f('available', !form.available)} className={`flex h-8 w-14 items-center rounded-full transition-colors ${form.available ? 'bg-primary' : 'bg-muted'}`}><span className={`ml-1 h-6 w-6 rounded-full bg-white shadow transition-transform ${form.available ? 'translate-x-6' : ''}`} /></button>
            <span className="text-sm font-semibold">{form.available ? 'Visible on website' : 'Hidden from website'}</span>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <Button variant="outline" className="rounded-full" onClick={onCancel}>Cancel</Button>
          <Button className="rounded-full px-8" onClick={() => onSave({ ...form, price_usd: Number(form.price_usd), price_etb: Number(form.price_etb), sort_order: Number(form.sort_order) })}>
            <Check className="mr-2 h-4 w-4" />{initial?.id ? 'Save Changes' : 'Create Product'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ProductPortfolio() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => base44.entities.Product.list('sort_order', 50),
  });

  const create = useMutation({
    mutationFn: d => base44.entities.Product.create(d),
    onSuccess: () => { qc.invalidateQueries(['products']); setCreating(false); },
  });
  const update = useMutation({
    mutationFn: ({ id, ...d }) => base44.entities.Product.update(id, d),
    onSuccess: () => { qc.invalidateQueries(['products']); setEditing(null); },
  });
  const remove = useMutation({
    mutationFn: id => base44.entities.Product.delete(id),
    onSuccess: () => qc.invalidateQueries(['products']),
  });
  const toggleVisible = (p) => update.mutate({ ...p, id: p.id, available: !p.available });

  const ROAST_BAR = { Light: 20, 'Medium-Light': 40, Medium: 60, 'Medium-Dark': 80, Dark: 100 };

  return (
    <PageShell>
      <main className="pt-32">
        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="Admin · Product Portfolio" title="Manage your coffee products." text="Add, edit, reorder, or hide packs. Changes reflect live on the Shop and Gallery pages." />
            <Button className="mb-10 rounded-full px-6" onClick={() => setCreating(true)}><Plus className="mr-2 h-4 w-4" />New Product</Button>
          </div>

          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1,2,3].map(i => <div key={i} className="h-40 animate-pulse rounded-[2rem] bg-muted" />)}
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {products.map(p => (
                <div key={p.id} className={`relative rounded-[2rem] border bg-card shadow-sm ${!p.available ? 'opacity-50' : ''}`}>
                  <div className="flex items-start gap-4 p-5">
                    <img src={p.image_url} alt={p.name} className="h-24 w-24 flex-shrink-0 rounded-2xl object-contain bg-muted p-2" />
                    <div className="flex-1 min-w-0">
                      <div className="flex gap-2 flex-wrap">
                        <p className="text-xs font-black uppercase tracking-wider text-primary">{p.roast_level}</p>
                        {p.badge && <Badge className="bg-primary text-primary-foreground text-xs">{p.badge}</Badge>}
                        {!p.available && <Badge variant="outline" className="text-xs">Hidden</Badge>}
                      </div>
                      <h3 className="mt-1 font-display text-xl font-black leading-tight">{p.name}</h3>
                      <p className="text-sm text-muted-foreground">{p.weight} · ${p.price_usd}</p>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{p.roast_profile}</p>
                      {/* roast bar */}
                      <div className="mt-2 h-1.5 w-full rounded-full bg-border overflow-hidden">
                        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${ROAST_BAR[p.roast_level] || 60}%` }} />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 border-t px-5 py-3">
                    <Button size="sm" variant="ghost" className="rounded-full" onClick={() => toggleVisible(p)} title={p.available ? 'Hide' : 'Show'}>
                      {p.available ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                    <Button size="sm" variant="ghost" className="rounded-full" onClick={() => setEditing(p)}><Pencil className="h-4 w-4" /></Button>
                    <Button size="sm" variant="ghost" className="rounded-full text-destructive hover:text-destructive" onClick={() => remove.mutate(p.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {creating && <ProductForm onSave={d => create.mutate(d)} onCancel={() => setCreating(false)} />}
      {editing && <ProductForm initial={editing} onSave={d => update.mutate({ ...d, id: editing.id })} onCancel={() => setEditing(null)} />}
    </PageShell>
  );
}