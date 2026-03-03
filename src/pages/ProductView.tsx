import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, ShoppingCart, Coffee, Leaf, MapPin, Flame, Heart, RefreshCw } from "lucide-react";
import { SectionBeans } from "@/components/SectionBeans";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/contexts/CartContext";
import { ProductReviews } from "@/components/ProductReviews";
import { ProductVariantSelector } from "@/components/ProductVariantSelector";

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

interface Variant {
  id: string;
  name: string;
  sku: string | null;
  price_adjustment: number;
  weight_grams: number | null;
  grind_type: string | null;
  is_available: boolean;
}

interface ProductImage {
  id: string;
  image_url: string;
  alt_text: string | null;
  display_order: number;
  is_primary: boolean;
}

interface Review {
  id: string;
  rating: number;
  title: string | null;
  content: string | null;
  helpful_count: number;
  created_at: string;
  is_verified_purchase: boolean;
  user_id: string;
}

export default function ProductView() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchProduct();
      fetchVariants();
      fetchImages();
      fetchReviews();
      if (user) checkWishlist();
    }
  }, [id, user]);

  const fetchProduct = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (!error && data) {
      setProduct(data);
    }
    setLoading(false);
  };

  const fetchVariants = async () => {
    const { data } = await supabase
      .from("product_variants")
      .select("*")
      .eq("product_id", id)
      .order("price_adjustment");
    
    if (data) {
      setVariants(data as Variant[]);
      if (data.length > 0) setSelectedVariant(data[0] as Variant);
    }
  };

  const fetchImages = async () => {
    const { data } = await supabase
      .from("product_images")
      .select("*")
      .eq("product_id", id)
      .order("display_order");
    
    if (data) setImages(data as ProductImage[]);
  };

  const fetchReviews = async () => {
    const { data } = await supabase
      .from("product_reviews")
      .select("*")
      .eq("product_id", id)
      .eq("is_approved", true)
      .order("created_at", { ascending: false });
    
    if (data) setReviews(data as Review[]);
  };

  const checkWishlist = async () => {
    const { data } = await supabase
      .from("wishlists")
      .select("id")
      .eq("product_id", id)
      .eq("user_id", user!.id)
      .maybeSingle();
    
    setIsInWishlist(!!data);
  };

  const toggleWishlist = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save items to your wishlist",
        variant: "destructive",
      });
      return;
    }

    if (isInWishlist) {
      await supabase
        .from("wishlists")
        .delete()
        .eq("product_id", id)
        .eq("user_id", user.id);
      setIsInWishlist(false);
      toast({ title: "Removed from wishlist" });
    } else {
      await supabase.from("wishlists").insert({
        product_id: id,
        user_id: user.id,
        variant_id: selectedVariant?.id || null,
      });
      setIsInWishlist(true);
      toast({ title: "Added to wishlist" });
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    const unitPrice = product.price + (selectedVariant?.price_adjustment ?? 0);
    addItem({
      productId: product.id,
      name: product.name,
      imageUrl: product.image_url,
      unitPrice,
      variantId: selectedVariant?.id ?? null,
      variantName: selectedVariant?.name ?? null,
      quantity,
    });

    const variantInfo = selectedVariant ? ` (${selectedVariant.name})` : "";
    toast({
      title: "Added to cart",
      description: `${quantity}x ${product.name}${variantInfo} added to your cart`,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/checkout");
  };

  // Optional: controlled "Order via Telegram" (make it explicit)
  const TELEGRAM_ORDER_URL = import.meta.env.VITE_TELEGRAM_ORDER_URL as string | undefined;

  const handleOrderViaTelegram = () => {
    if (!product) return;
    const baseUrl = TELEGRAM_ORDER_URL || "";
    if (!baseUrl) {
      toast({
        title: "Telegram not configured",
        description: "Set VITE_TELEGRAM_ORDER_URL in your env to enable Telegram ordering.",
        variant: "destructive",
      });
      return;
    }

    // If the URL points to a Telegram bot (recommended), use deep-linking so the bot can show the exact product.
    // Example: https://t.me/Tomocashopbot?start=product_<uuid>
    const isTelegramLink = /t\.me\//i.test(baseUrl);
    if (isTelegramLink) {
      const clean = baseUrl.replace(/\/$/, "");
      const url = clean.includes("?")
        ? `${clean}&start=product_${product.id}`
        : `${clean}?start=product_${product.id}`;
      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }

    // Fallback: open a chat link with a pre-filled message (works for normal usernames/chats).
    const variant = selectedVariant ? ` (${selectedVariant.name})` : "";
    const message = encodeURIComponent(`Hi, I want to order: ${quantity}x ${product.name}${variant}`);
    const url = baseUrl.includes("?") ? `${baseUrl}&text=${message}` : `${baseUrl}?text=${message}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleSubscribe = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to set up a subscription",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Subscription",
      description: "Subscription feature coming soon!",
    });
  };

  const currentPrice = product 
    ? product.price + (selectedVariant?.price_adjustment || 0) 
    : 0;

  const displayImages = images.length > 0 
    ? images 
    : product?.image_url 
      ? [{ id: "main", image_url: product.image_url, alt_text: product.name, display_order: 0, is_primary: true }]
      : [];

  if (loading) {
    return (
      <Layout showGlobalBeans={true} beanCount={8}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout showGlobalBeans={true} beanCount={8}>
        <div className="min-h-screen flex flex-col items-center justify-center">
          <h1 className="font-display text-3xl mb-4">Product Not Found</h1>
          <Link to="/shop">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Shop
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showGlobalBeans={true} beanCount={10} pageIntensity={selectedVariant ? "collection" : "default"}>
      <section className="pt-28 pb-20 px-4">
        <div className="container mx-auto">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link 
              to="/shop" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Collection</span>
            </Link>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Product Images */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
              className="relative"
            >
              {/* Main Image */}
              <div className="aspect-square bg-card/30 backdrop-blur-sm border border-border rounded-3xl overflow-hidden relative mb-4">
                <SectionBeans pattern="cluster" count={6} className="opacity-20" />
                
                {displayImages.length > 0 ? (
                  <img 
                    src={displayImages[selectedImageIndex]?.image_url} 
                    alt={displayImages[selectedImageIndex]?.alt_text || product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-bean-light/20 to-bean-dark/40">
                    <div className="w-48 h-64 relative">
                      <svg viewBox="0 0 80 100" className="w-full h-full drop-shadow-2xl">
                        <defs>
                          <linearGradient id="product-bag" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="hsl(var(--bean-light))" />
                            <stop offset="100%" stopColor="hsl(var(--bean-dark))" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M10 25 L10 90 Q10 95 15 95 L65 95 Q70 95 70 90 L70 25 Q70 20 65 20 L55 20 L55 15 Q55 5 40 5 Q25 5 25 15 L25 20 L15 20 Q10 20 10 25"
                          fill="url(#product-bag)"
                        />
                        <circle cx="40" cy="55" r="18" fill="hsl(var(--gold))" opacity="0.4" />
                        <text x="40" y="60" textAnchor="middle" fill="hsl(var(--primary-foreground))" fontSize="8" fontFamily="serif">
                          TOMOCA
                        </text>
                      </svg>
                    </div>
                  </div>
                )}
                
                {product.is_featured && (
                  <div className="absolute top-6 left-6 bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-full">
                    Featured Roast
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {displayImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {displayImages.map((img, index) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index
                          ? "border-primary"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 0.61, 0.36, 1] }}
              className="flex flex-col"
            >
              <div className="flex items-center gap-3 mb-4">
                {product.origin && (
                  <span className="bg-secondary/50 text-sm px-3 py-1 rounded-full flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {product.origin}
                  </span>
                )}
                {product.roast_level && (
                  <span className="bg-secondary/50 text-sm px-3 py-1 rounded-full flex items-center gap-1">
                    <Flame className="w-3 h-3" /> {product.roast_level} Roast
                  </span>
                )}
              </div>

              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-4">
                {product.name}
              </h1>

              <p className="text-2xl text-primary font-semibold mb-6">
                ${currentPrice.toFixed(2)}
                <span className="text-muted-foreground text-base font-normal ml-2">
                  / {selectedVariant?.weight_grams || product.weight_grams || 250}g
                </span>
              </p>

              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                {product.description}
              </p>

              {/* Variant Selector */}
              {variants.length > 0 && (
                <div className="mb-8">
                  <ProductVariantSelector
                    variants={variants}
                    selectedVariant={selectedVariant}
                    onSelect={setSelectedVariant}
                    basePrice={product.price}
                  />
                </div>
              )}

              {/* Features */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-card/30 border border-border rounded-xl p-4 flex items-center gap-3">
                  <Coffee className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-medium capitalize">{product.category || "Coffee"}</p>
                  </div>
                </div>
                <div className="bg-card/30 border border-border rounded-xl p-4 flex items-center gap-3">
                  <Leaf className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Origin</p>
                    <p className="font-medium">{product.origin || "Blend"}</p>
                  </div>
                </div>
              </div>

              {/* Quantity & Actions */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-border rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 flex items-center justify-center text-lg hover:bg-secondary/50 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-12 flex items-center justify-center text-lg hover:bg-secondary/50 transition-colors"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <Button 
                    onClick={handleAddToCart}
                    className="flex-1 h-12 gold-gradient text-primary-foreground font-medium"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12"
                    onClick={toggleWishlist}
                    aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <Heart className={`w-5 h-5 ${isInWishlist ? "fill-primary text-primary" : ""}`} />
                  </Button>
                </div>

                <div className="flex flex-col gap-3">
                  <Button
                    onClick={handleBuyNow}
                    className="w-full h-12"
                  >
                    Buy Now
                  </Button>

                  {/* Optional Telegram ordering */}
                  {TELEGRAM_ORDER_URL ? (
                    <Button
                      variant="outline"
                      className="w-full h-12"
                      onClick={handleOrderViaTelegram}
                    >
                      Order via Telegram
                    </Button>
                  ) : null}
                </div>

                {/* Subscribe Option */}
                <Button
                  variant="outline"
                  className="w-full h-12"
                  onClick={handleSubscribe}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Subscribe & Save 10%
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="border-t border-border pt-6">
                <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                    Free shipping over $50
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                    Freshly roasted to order
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                    Satisfaction guaranteed
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Reviews Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-20 pt-12 border-t border-border"
          >
            <h2 className="font-display text-3xl mb-8">Customer Reviews</h2>
            <ProductReviews
              productId={id!}
              reviews={reviews}
              onReviewAdded={fetchReviews}
            />
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
