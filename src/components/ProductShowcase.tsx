import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { CoffeeSplash } from "./CoffeeSplash";
import { SectionBeans } from "./SectionBeans";
import { supabase } from "@/integrations/supabase/client";
import tomocaBeansCloseup from "@/assets/tomoca-beans-closeup.png";
import tomoca100gDouble from "@/assets/tomoca-100g-double.png";
import tomoca375g from "@/assets/tomoca-375g.png";
import tomoca500g from "@/assets/tomoca-500g.png";

const fallbackImages = [tomoca375g, tomoca500g, tomocaBeansCloseup, tomoca100gDouble, tomoca375g, tomoca500g];

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  origin: string | null;
  roast_level: string | null;
  is_featured: boolean | null;
}

export function ProductShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from("products")
        .select("id, name, description, price, image_url, origin, roast_level, is_featured")
        .eq("is_available", true)
        .order("is_featured", { ascending: false })
        .limit(6);
      if (data) setProducts(data);
    };
    fetchProducts();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-background overflow-hidden"
      aria-labelledby="products-heading"
    >
      <CoffeeSplash variant="left" intensity="medium" />
      <SectionBeans pattern="arc" count={14} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_hsl(38_72%_52%/0.08)_0%,_transparent_50%)]" />

      <div className="container max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-16"
        >
          <div>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-primary mb-4"
            >
              <span className="w-8 h-px bg-primary" />
              Our Collection
            </motion.span>
            <h2
              id="products-heading"
              className="text-3xl md:text-5xl font-display font-medium text-foreground"
            >
              Signature <span className="text-gradient-gold">Roasts</span>
            </h2>
          </div>
          <Button
            variant="ghost"
            className="mt-6 md:mt-0 text-primary hover:text-primary/80 group"
            asChild
          >
            <Link to="/shop">
              View All Products
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.article
              key={product.id}
              initial={{ opacity: 0, y: 60 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.8,
                ease: [0.22, 0.61, 0.36, 1],
                delay: index * 0.15,
              }}
              className="group relative"
            >
              <Link to={`/product/${product.id}`}>
                <div className="relative aspect-[4/5] mb-6 rounded-2xl overflow-hidden bg-secondary">
                  <motion.img
                    src={product.image_url || fallbackImages[index % fallbackImages.length]}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-contain p-4 drop-shadow-2xl"
                    whileHover={{ scale: 1.08, rotate: 2 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_hsl(38_72%_52%/0.12)_0%,_transparent_70%)]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {product.is_featured && (
                    <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                      Featured
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-display font-medium text-foreground group-hover:text-primary transition-colors duration-200">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description || product.origin}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.origin && (
                      <span className="text-xs px-2 py-1 rounded-full bg-secondary text-muted-foreground">
                        {product.origin}
                      </span>
                    )}
                    {product.roast_level && (
                      <span className="text-xs px-2 py-1 rounded-full bg-secondary text-muted-foreground">
                        {product.roast_level}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-4">
                    <span className="text-2xl font-display text-foreground">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="inline-flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
                      View <ArrowRight className="w-4 h-4 ml-1" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>

      <div className="absolute right-0 top-0 w-1/3 h-1/2 bg-gold/5 blur-[120px] pointer-events-none" />
      <div className="absolute left-0 bottom-0 w-1/4 h-1/2 bg-primary/5 blur-[100px] pointer-events-none" />
    </section>
  );
}
