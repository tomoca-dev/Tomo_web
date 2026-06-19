import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ShoppingBag, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCurrency } from '@/contexts/CurrencyContext';

const ROAST_COLORS = {
  'Light': { bar: 'bg-amber-300', text: 'text-amber-800', bg: 'bg-amber-50' },
  'Medium-Light': { bar: 'bg-amber-400', text: 'text-amber-900', bg: 'bg-amber-50' },
  'Medium': { bar: 'bg-orange-500', text: 'text-orange-900', bg: 'bg-orange-50' },
  'Medium-Dark': { bar: 'bg-orange-700', text: 'text-orange-950', bg: 'bg-orange-50' },
  'Dark': { bar: 'bg-stone-800', text: 'text-stone-900', bg: 'bg-stone-100' }
};

const ROAST_ORDER = ['Light', 'Medium-Light', 'Medium', 'Medium-Dark', 'Dark'];

function RoastBar({ level }) {
  const idx = ROAST_ORDER.indexOf(level);
  const pct = (idx + 1) / ROAST_ORDER.length * 100;
  const c = ROAST_COLORS[level] || ROAST_COLORS['Medium'];
  return (
    <div className="mt-4">
      <div className="mb-1 flex justify-between text-xs font-semibold">
        
        <span className={c.text}>{level}</span>
      </div>
      

      
    </div>);

}

function BeanCard({ product, onClick }) {
  const c = ROAST_COLORS[product.roast_level] || ROAST_COLORS['Medium'];
  const { formatPrice, currency } = useCurrency();
  const basePrice = product.price_etb || product.price || (product.price_usd ? product.price_usd * 65 : 0);

  return (
    <motion.button
      onClick={() => onClick(product)}
      whileHover={{ y: -8, scale: 1.02, boxShadow: '0 24px 64px rgba(255,107,0,0.18)' }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="group relative flex flex-col overflow-hidden rounded-[2rem] border bg-card text-left shadow-sm h-full">
      
      {/* product image */}
      <div className="relative flex h-64 items-center justify-center overflow-hidden bg-primary/10 p-6">
        <img
          src={product.image_url}
          alt={product.name}
          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105 drop-shadow-xl" />
        
        {product.badge &&
        <span className="absolute right-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-black text-primary-foreground">
            {product.badge}
          </span>
        }
      </div>

      {/* details */}
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-primary">{product.origin}</p>
        <h3 className="mt-2 font-display text-2xl font-black leading-tight">{product.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{product.weight}</p>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-2">{product.roast_profile}</p>
        <RoastBar level={product.roast_level} />
        
        <div className="mt-5 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            {currency === "ETB" ? (
              <span className="font-display text-2xl font-black text-foreground">
                {formatPrice(basePrice)}
              </span>
            ) : (
              <>
                <span className="font-display text-xl font-black text-foreground">
                  {formatPrice(basePrice)}
                </span>
                <span className="text-[10px] text-amber-500 font-bold uppercase tracking-wider mt-0.5">Inquiry Only</span>
                <span className="text-[10px] text-muted-foreground font-normal">{formatPrice(basePrice, "ETB")}</span>
              </>
            )}
          </div>
          
          {currency === "ETB" ? (
            <Button asChild size="sm" className="rounded-full shrink-0">
              <Link to="/order" onClick={(e) => e.stopPropagation()}><ShoppingBag className="mr-1 h-3 w-3" />Order</Link>
            </Button>
          ) : (
            <Button 
              size="sm" 
              className="rounded-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-4 py-1.5 shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                const subject = encodeURIComponent(`Inquiry about ${product.name}`);
                const body = encodeURIComponent(`Hello,\n\nI would like to inquire about the following product:\nProduct: ${product.name}\n\nPlease provide me with more details including pricing.\n\nThank you.`);
                window.location.href = `mailto:info@tomocacoffee.com?subject=${subject}&body=${body}`;
              }}
            >
              Inquire
            </Button>
          )}
        </div>
      </div>
      </motion.button>);

      }

function BeanModal({ product, onClose }) {
  if (!product) return null;
  const c = ROAST_COLORS[product.roast_level] || ROAST_COLORS['Medium'];
  const { formatPrice, currency } = useCurrency();
  const basePrice = product.price_etb || product.price || (product.price_usd ? product.price_usd * 65 : 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2.5rem] bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}>
        
        <button onClick={onClose} className="absolute right-5 top-5 rounded-full bg-muted p-2 hover:bg-border">
          <X className="h-5 w-5" />
        </button>
        <div className="flex h-64 items-center justify-center bg-primary/10 rounded-t-[2.5rem] p-8">
          <img src={product.image_url} alt={product.name} className="h-full object-contain drop-shadow-2xl" />
        </div>
        <div className="p-8">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-primary">{product.origin}</p>
          <h2 className="mt-2 font-display text-4xl font-black">{product.name}</h2>
          {product.badge && <Badge className="mt-2 bg-primary text-primary-foreground">{product.badge}</Badge>}
          <p className="mt-4 leading-relaxed text-muted-foreground">{product.description || product.roast_profile}</p>
          <RoastBar level={product.roast_level} />
          <div className="mt-6 grid grid-cols-2 gap-4">
            {product.roast_profile &&
            <div className={`rounded-2xl ${c.bg} p-4`}>
                <p className="text-xs font-black uppercase tracking-wider text-muted-foreground">Flavour Notes</p>
                <p className="mt-1 font-semibold">{product.roast_profile}</p>
              </div>
            }
            {product.brew_methods &&
            <div className="rounded-2xl bg-muted p-4">
                <p className="text-xs font-black uppercase tracking-wider text-muted-foreground">Brew Methods</p>
                <p className="mt-1 font-semibold">{product.brew_methods}</p>
              </div>
            }
            {product.grind_options &&
            <div className="rounded-2xl bg-muted p-4">
                <p className="text-xs font-black uppercase tracking-wider text-muted-foreground">Available As</p>
                <p className="mt-1 font-semibold">{product.grind_options}</p>
              </div>
            }
            {product.weight &&
            <div className="rounded-2xl bg-muted p-4">
                <p className="text-xs font-black uppercase tracking-wider text-muted-foreground">Pack Size</p>
                <p className="mt-1 font-semibold">{product.weight}</p>
              </div>
            }
          </div>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col">
              {currency === "ETB" ? (
                <span className="font-display text-4xl font-black text-foreground">
                  {formatPrice(basePrice)}
                </span>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <span className="font-display text-4xl font-black text-foreground">
                      {formatPrice(basePrice)}
                    </span>
                    <span className="text-xs bg-amber-500/20 text-amber-500 px-2.5 py-1 rounded font-bold uppercase tracking-wider">
                      Inquiry Only
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground mt-1 font-normal">
                    Original Price: {formatPrice(basePrice, "ETB")}
                  </span>
                </>
              )}
            </div>
            
            {currency === "ETB" ? (
              <Button asChild size="lg" className="rounded-full px-8">
                <Link to="/order"><ShoppingBag className="mr-2 h-4 w-4" />Order Now</Link>
              </Button>
            ) : (
              <Button 
                size="lg" 
                className="rounded-full px-8 bg-amber-500 hover:bg-amber-600 text-white font-semibold"
                onClick={() => {
                  const subject = encodeURIComponent(`Inquiry about ${product.name}`);
                  const body = encodeURIComponent(`Hello,\n\nI would like to inquire about the following product:\nProduct: ${product.name}\n\nPlease provide me with more details including pricing.\n\nThank you.`);
                  window.location.href = `mailto:info@tomocacoffee.com?subject=${subject}&body=${body}`;
                }}
              >
                Submit Inquiry
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>);

}

const FILTER_OPTIONS = [
{ label: 'All', value: 'All' },
{ label: 'Dark/Bar', value: 'Dark' },
{ label: 'Famiglia/Medium', value: 'Medium' },
{ label: 'Light', value: 'Light' }];


export default function BeansGallery({ products }) {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('All');
  const filtered = filter === 'All' ? products : products.filter((p) => p.roast_level === filter);

  return (
    <>
      {/* filter pills */}
      <motion.div
        className="mb-8 flex flex-wrap gap-2"
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}>
        
        {FILTER_OPTIONS.map(({ label, value }) =>
        <motion.button
          key={value}
          onClick={() => setFilter(value)}
          className={`rounded-full px-5 py-2 text-sm font-bold transition-all ${filter === value ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-border'}`}
          variants={{ hidden: { opacity: 0, y: -10 }, visible: { opacity: 1, y: 0 } }}
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.06 }}>
          
            {label}
          </motion.button>
        )}
      </motion.div>

      {/* grid */}
      <motion.div
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        layout>
        
        <AnimatePresence mode="popLayout">
          {filtered.map((p, i) =>
          <motion.div
            key={p.id || p.name}
            layout
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { delay: i * 0.07 } }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}>
            
              <BeanCard product={p} onClick={setSelected} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <BeanModal product={selected} onClose={() => setSelected(null)} />
    </>);

}