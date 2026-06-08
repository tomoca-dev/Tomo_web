import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, ShoppingCart, Sparkles, Flame, MapPin } from "lucide-react";
import tomoca375g from "@/assets/tomoca-375g.png";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  origin: string | null;
  roast_level: string | null;
  weight_grams: number | null;
  is_featured: boolean | null;
}

export function FeaturedProductAd() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  
  const { formatPrice, currency } = useCurrency();
  const { addItem } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeaturedProduct();
  }, []);

  const fetchFeaturedProduct = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_available", true)
        .eq("is_featured", true)
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) {
        console.error("Error fetching featured product ad:", error);
      } else if (data && data.length > 0) {
        setProduct(data[0]);
      } else {
        // Fallback static product if none found in database
        setProduct({
          id: "fallback-featured",
          name: "Ethiopian Yirgacheffe",
          description: "Bright and fruity with floral notes and a clean finish. Our signature single-origin from the birthplace of coffee.",
          price: 24.99,
          image_url: null,
          origin: "Ethiopia",
          roast_level: "Light",
          weight_grams: 250,
          is_featured: true,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!product) return;

    addItem({
      productId: product.id,
      name: product.name,
      imageUrl: product.image_url,
      unitPrice: product.price,
      variantId: null,
      variantName: null,
      quantity: 1,
    });

    toast({
      title: "Added to cart",
      description: `1x ${product.name} added to your cart`,
    });
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!product) return;
    
    addItem({
      productId: product.id,
      name: product.name,
      imageUrl: product.image_url,
      unitPrice: product.price,
      variantId: null,
      variantName: null,
      quantity: 1,
    });
    
    navigate("/checkout");
  };

  if (loading || !product) return null;

  return (
    <section
      ref={sectionRef}
      className="relative py-20 md:py-28 overflow-hidden bg-background-dark border-y border-border/40"
      aria-labelledby="featured-ad-heading"
    >
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-1/4 h-full bg-gold/5 blur-[100px] pointer-events-none" />

      <div className="container max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Side: Copy and Details */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold tracking-widest text-primary uppercase">
              <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" /> Product Spotlight
            </span>

            <h2
              id="featured-ad-heading"
              className="text-4xl md:text-5xl lg:text-6xl font-display font-medium text-foreground tracking-tight leading-tight"
            >
              Experience the <span className="text-gradient-gold">Best</span> of TOMOCA
            </h2>

            <h3 className="text-2xl font-display text-[#E78A22] font-semibold">
              {product.name}
            </h3>

            <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
              {product.description}
            </p>

            {/* Flavor & Origin tags */}
            <div className="flex flex-wrap gap-3 pt-2">
              {product.origin && (
                <div className="bg-secondary/40 border border-border/50 rounded-xl px-4 py-2 flex items-center gap-2 text-sm font-medium text-foreground">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>Origin: {product.origin}</span>
                </div>
              )}
              {product.roast_level && (
                <div className="bg-secondary/40 border border-border/50 rounded-xl px-4 py-2 flex items-center gap-2 text-sm font-medium text-foreground">
                  <Flame className="w-4 h-4 text-primary" />
                  <span>Roast: {product.roast_level}</span>
                </div>
              )}
              {product.weight_grams && (
                <div className="bg-secondary/40 border border-border/50 rounded-xl px-4 py-2 flex items-center gap-2 text-sm font-medium text-foreground">
                  <span className="text-primary font-semibold">Weight:</span>
                  <span>{product.weight_grams}g</span>
                </div>
              )}
            </div>

            {/* Price indicator */}
            <div className="pt-4 flex items-baseline gap-3">
              <span className="text-sm text-muted-foreground">Premium Selection:</span>
              <span className="text-3xl font-display text-foreground font-semibold">
                {currency === "ETB" ? formatPrice(product.price) : "Inquiry Only"}
              </span>
            </div>

            {/* Action buttons */}
            <div className="pt-6 flex flex-wrap gap-4">
              <Button asChild className="h-12 px-8 gold-gradient text-primary-foreground font-medium rounded-xl">
                <Link to={`/product/${product.id}`}>
                  View Spotlight Product <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              
              {currency === "ETB" && (
                <>
                  <Button 
                    variant="outline" 
                    onClick={handleAddToCart}
                    className="h-12 px-6 border-border hover:bg-secondary/50 rounded-xl"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
                  </Button>
                  <Button 
                    variant="secondary" 
                    onClick={handleBuyNow}
                    className="h-12 px-6 rounded-xl"
                  >
                    Buy Now
                  </Button>
                </>
              )}
            </div>
          </motion.div>

          {/* Right Side: Visual Image Showcase */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 0.61, 0.36, 1] }}
            className="lg:col-span-5 flex justify-center items-center relative"
          >
            {/* Visual spotlight backdrop */}
            <div className="absolute w-[280px] h-[280px] rounded-full bg-gradient-to-tr from-primary/30 to-gold/20 blur-[60px]" />

            <motion.div 
              className="relative w-full max-w-[320px] aspect-[4/5] bg-card/25 backdrop-blur-md border border-border/60 rounded-3xl p-6 hover:shadow-glow hover:border-primary/40 transition-all duration-750 flex flex-col justify-center items-center overflow-hidden"
              whileHover={{ y: -8 }}
            >
              {/* Radial gradient shine inside card */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_hsl(38_72%_52%/0.15)_0%,_transparent_75%)] pointer-events-none" />

              {/* Floating Coffee Bag Illustration */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-full h-full flex items-center justify-center relative z-10 drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
              >
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-contain p-2 max-h-[280px]"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-4">
                    <img 
                      src={tomoca375g} 
                      alt="Featured Bag" 
                      className="w-full h-full object-contain max-h-[250px]"
                    />
                  </div>
                )}
              </motion.div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
