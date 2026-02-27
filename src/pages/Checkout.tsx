import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

function formatMoney(value: number) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(value);
}

/**
 * This is a simple "checkout" placeholder:
 * - Collects customer details
 * - Confirms order locally (no payment yet)
 * Next step: connect to Stripe / local payment / COD, and save orders to Supabase.
 */
export default function Checkout() {
  const { items, subtotal, clear } = useCart();
  const { toast } = useToast();

  const placeOrder = () => {
    if (items.length === 0) {
      toast({ title: "Cart is empty", description: "Add items before checking out.", variant: "destructive" });
      return;
    }
    clear();
    toast({ title: "Order placed", description: "Checkout is set up. Next step: connect payments + save order to Supabase." });
  };

  return (
    <Layout showGlobalBeans={false}>
      <section className="pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-card/30 border border-border rounded-2xl p-6">
            <h1 className="font-display text-3xl mb-4">Checkout</h1>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Full name</label>
                <Input placeholder="Your name" className="mt-1" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Phone</label>
                <Input placeholder="+251 ..." className="mt-1" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Delivery address</label>
                <Textarea placeholder="Address or type 'pickup'" className="mt-1" />
              </div>

              <Button className="w-full" onClick={placeOrder}>
                Place order
              </Button>

              <Button variant="outline" className="w-full" asChild>
                <Link to="/cart">Back to cart</Link>
              </Button>
            </div>
          </div>

          <div className="bg-card/30 border border-border rounded-2xl p-6 h-fit">
            <h2 className="font-display text-2xl mb-4">Order Summary</h2>
            <div className="space-y-3">
              {items.map((x) => (
                <div key={`${x.productId}-${x.variantId ?? "base"}`} className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{x.name}</p>
                    {x.variantName ? <p className="text-sm text-muted-foreground">{x.variantName}</p> : null}
                    <p className="text-sm text-muted-foreground">Qty: {x.quantity}</p>
                  </div>
                  <p className="font-medium">{formatMoney(x.unitPrice * x.quantity)}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-border my-4" />
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">{formatMoney(subtotal)}</span>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
