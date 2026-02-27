import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

function formatMoney(value: number) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(value);
}

export default function Cart() {
  const { items, subtotal, itemCount, setQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  return (
    <Layout showGlobalBeans={false}>
      <section className="pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h1 className="font-display text-4xl mb-2">Your Cart</h1>
            <p className="text-muted-foreground">{itemCount} item(s)</p>
          </motion.div>

          {items.length === 0 ? (
            <div className="mt-10 text-center py-16 bg-card/30 border border-border rounded-2xl">
              <ShoppingBag className="w-14 h-14 mx-auto text-muted-foreground mb-4" />
              <h2 className="font-display text-2xl mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">Browse the shop and add something you love.</p>
              <Button asChild>
                <Link to="/shop">Go to Shop</Link>
              </Button>
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.variantId ?? "base"}`} className="bg-card/30 border border-border rounded-2xl p-4 flex gap-4">
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-muted/30 flex-shrink-0">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      ) : null}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          {item.variantName ? <p className="text-sm text-muted-foreground">{item.variantName}</p> : null}
                          <p className="text-sm mt-1">{formatMoney(item.unitPrice)}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          aria-label="Remove item"
                          onClick={() => removeItem({ productId: item.productId, variantId: item.variantId })}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setQuantity({ productId: item.productId, variantId: item.variantId }, item.quantity - 1)}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <Input
                            value={String(item.quantity)}
                            onChange={(e) => {
                              const v = Number(e.target.value.replace(/[^0-9]/g, "")) || 1;
                              setQuantity({ productId: item.productId, variantId: item.variantId }, v);
                            }}
                            className="w-16 text-center"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setQuantity({ productId: item.productId, variantId: item.variantId }, item.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>

                        <p className="font-medium">{formatMoney(item.unitPrice * item.quantity)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-card/30 border border-border rounded-2xl p-6 h-fit">
                <h2 className="font-display text-2xl mb-4">Summary</h2>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatMoney(subtotal)}</span>
                </div>
                <div className="text-xs text-muted-foreground mb-6">
                  Taxes and shipping are calculated at checkout.
                </div>
                <Button className="w-full" onClick={() => navigate("/checkout")}>
                  Checkout
                </Button>
                <Button variant="outline" className="w-full mt-3" asChild>
                  <Link to="/shop">Continue Shopping</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
