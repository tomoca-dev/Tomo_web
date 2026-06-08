import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingBag, Search, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SectionBeans } from "@/components/SectionBeans";
import { useCurrency } from "@/contexts/CurrencyContext";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
  origin: string | null;
  roast_level: string | null;
  weight_grams: number | null;
  is_featured: boolean | null;
}

export default function Merchandise() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { formatPrice, currency } = useCurrency();

  useEffect(() => {
    fetchMerchandise();
  }, []);

  const fetchMerchandise = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_available", true)
      .eq("category", "merchandise")
      .order("is_featured", { ascending: false });

    if (error) {
      console.error("Error fetching merchandise products:", error);
    } else if (data) {
      setProducts(data);
    }
    setLoading(false);
  };

  const filteredProducts = products.filter((product) => {
    return (
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <Layout showGlobalBeans={true} beanCount={12}>
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-50" />
        <SectionBeans pattern="scattered" count={8} className="opacity-30" />
        
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-primary mb-3">
              <Tag className="w-3.5 h-3.5" /> Exquisite Collectibles
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-4">
              TOMOCA <span className="text-gradient-gold">Merchandise</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Premium branded apparel, accessories, and limited-edition collectibles 
              crafted to complement your daily coffee ritual.
            </p>
          </motion.div>

          {/* Search Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-10 max-w-md mx-auto"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search merchandise..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-card/50 border-border"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-card/30 rounded-2xl h-96 animate-pulse" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-display text-2xl mb-2">No merchandise found</h3>
              <p className="text-muted-foreground">Check back soon for new additions to our collection.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link to={`/product/${product.id}`}>
                    <div className="group bg-card/30 backdrop-blur-sm border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-500 hover:shadow-glow flex flex-col h-full">
                      {/* Product Image */}
                      <div className="aspect-square bg-gradient-to-br from-bean-light/20 to-bean-dark/40 relative overflow-hidden flex items-center justify-center">
                        {product.image_url ? (
                          <img 
                            src={product.image_url} 
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-24 h-32 relative">
                              <svg viewBox="0 0 80 100" className="w-full h-full">
                                <defs>
                                  <linearGradient id={`merch-${product.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="hsl(var(--bean-light))" />
                                    <stop offset="100%" stopColor="hsl(var(--bean-dark))" />
                                  </linearGradient>
                                </defs>
                                <path
                                  d="M10 25 L10 90 Q10 95 15 95 L65 95 Q70 95 70 90 L70 25 Q70 20 65 20 L55 20 L55 15 Q55 5 40 5 Q25 5 25 15 L25 20 L15 20 Q10 20 10 25"
                                  fill={`url(#merch-${product.id})`}
                                  className="drop-shadow-lg"
                                />
                                <circle cx="40" cy="55" r="15" fill="hsl(var(--gold))" opacity="0.3" />
                              </svg>
                            </div>
                          </div>
                        )}
                        
                        {product.is_featured && (
                          <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                            Featured
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex items-start justify-between mb-2 gap-4">
                          <h3 className="font-display text-xl group-hover:text-primary transition-colors duration-200 line-clamp-1">
                            {product.name}
                          </h3>
                          <span className="text-primary font-semibold shrink-0">
                            {currency === "ETB" ? formatPrice(product.price) : "Inquiry Only"}
                          </span>
                        </div>
                        
                        <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-grow">
                          {product.description || "No description provided."}
                        </p>

                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-auto">
                          <span className="bg-secondary/50 px-2.5 py-1 rounded">
                            Merchandise
                          </span>
                          {product.weight_grams ? (
                            <span className="bg-secondary/50 px-2.5 py-1 rounded">
                              {product.weight_grams}g
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
