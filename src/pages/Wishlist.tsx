import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Heart, Trash2, ShoppingCart, Package } from "lucide-react";
import { Navigate } from "react-router-dom";

interface WishlistItem {
  id: string;
  product_id: string;
  created_at: string;
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string | null;
    origin: string | null;
  };
}

export default function Wishlist() {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (user) fetchWishlist();
  }, [user]);

  const fetchWishlist = async () => {
    const { data, error } = await supabase
      .from("wishlists")
      .select(`
        id,
        product_id,
        created_at,
        product:products(id, name, price, image_url, origin)
      `)
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      // Transform the data to handle the nested product object
      const transformed = data.map((item: any) => ({
        ...item,
        product: item.product,
      }));
      setItems(transformed);
    }
    setLoading(false);
  };

  const removeFromWishlist = async (id: string) => {
    const { error } = await supabase
      .from("wishlists")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      });
    } else {
      setItems(items.filter((item) => item.id !== id));
      toast({
        title: "Removed",
        description: "Item removed from wishlist",
      });
    }
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout>
      <section className="pt-28 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <Heart className="w-6 h-6 text-primary" />
              <h1 className="font-display text-3xl md:text-4xl">My Wishlist</h1>
            </div>
            <p className="text-muted-foreground">
              {items.length} {items.length === 1 ? "item" : "items"} saved
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-card/30 rounded-3xl border border-border"
            >
              <Heart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-display text-xl mb-2">Your wishlist is empty</h3>
              <p className="text-muted-foreground mb-6">
                Save items you love for later
              </p>
              <Link to="/shop">
                <Button className="gold-gradient text-primary-foreground">
                  Browse Collection
                </Button>
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex gap-4 p-4 bg-card/30 border border-border rounded-xl"
                >
                  <Link to={`/product/${item.product_id}`} className="shrink-0">
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-secondary rounded-lg overflow-hidden">
                      {item.product?.image_url ? (
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.product_id}`}>
                      <h3 className="font-display text-lg hover:text-primary transition-colors">
                        {item.product?.name}
                      </h3>
                    </Link>
                    {item.product?.origin && (
                      <p className="text-sm text-muted-foreground">
                        {item.product.origin}
                      </p>
                    )}
                    <p className="text-primary font-semibold mt-1">
                      ${item.product?.price.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button size="sm" className="gold-gradient text-primary-foreground">
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive"
                      onClick={() => removeFromWishlist(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
