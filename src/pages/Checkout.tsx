import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { useCurrency } from "@/contexts/CurrencyContext";

export default function Checkout() {
  const { items, subtotal, clear } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { formatPrice, currency } = useCurrency();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");

  const placeOrder = () => {
    if (items.length === 0) {
      toast({ title: "Cart is empty", description: "Add items before checking out.", variant: "destructive" });
      return;
    }
    if (!name.trim() || !phone.trim() || !address.trim()) {
      toast({ title: "Missing fields", description: "Please fill in all fields.", variant: "destructive" });
      return;
    }
    clear();
    toast({ title: "Order placed", description: "Checkout complete! Next step: connect payments + save order to Supabase." });
    navigate("/");
  };

  const submitInquiry = () => {
    if (items.length === 0) {
      toast({ title: "Cart is empty", description: "Add items before submitting an inquiry.", variant: "destructive" });
      return;
    }
    if (!name.trim() || !phone.trim() || !email.trim() || !country.trim()) {
      toast({ title: "Missing fields", description: "Name, Phone, Email, and Country are required.", variant: "destructive" });
      return;
    }
    clear();
    toast({ title: "Inquiry Submitted", description: "Thank you! We will review your inquiry and email you shortly." });
    navigate("/");
  };

  return (
    <Layout showGlobalBeans={false}>
      <section className="pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-card/30 border border-border rounded-2xl p-6">
            {currency === "ETB" ? (
              <>
                <h1 className="font-display text-3xl mb-4">Checkout</h1>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Full name</label>
                    <Input 
                      placeholder="Your name" 
                      className="mt-1" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Phone</label>
                    <Input 
                      placeholder="+251 ..." 
                      className="mt-1" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Delivery address</label>
                    <Textarea 
                      placeholder="Address or type 'pickup'" 
                      className="mt-1" 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>

                  <Button className="w-full" onClick={placeOrder}>
                    Place order
                  </Button>
                </div>
              </>
            ) : (
              <>
                <h1 className="font-display text-3xl mb-2">Order Inquiry</h1>
                <p className="text-sm text-muted-foreground mb-4">
                  International orders are inquiry-only. Please submit your details below and our team will contact you to coordinate shipping and payment.
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Full name</label>
                    <Input 
                      placeholder="Your name" 
                      className="mt-1" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Email</label>
                    <Input 
                      type="email"
                      placeholder="email@example.com" 
                      className="mt-1" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Phone</label>
                    <Input 
                      placeholder="+1 ..." 
                      className="mt-1" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Shipping Country</label>
                    <Input 
                      placeholder="e.g. United States" 
                      className="mt-1" 
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Additional Inquiry / Shipping Notes</label>
                    <Textarea 
                      placeholder="Provide details about your desired shipping speed or custom requests here." 
                      className="mt-1" 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>

                  <Button className="w-full gold-gradient text-primary-foreground font-semibold" onClick={submitInquiry}>
                    Submit Inquiry
                  </Button>
                </div>
              </>
            )}

            <Button variant="outline" className="w-full mt-4" asChild>
              <Link to="/cart">Back to cart</Link>
            </Button>
          </div>

          <div className="bg-card/30 border border-border rounded-2xl p-6 h-fit text-left">
            <h2 className="font-display text-2xl mb-4">Order Summary</h2>
            <div className="space-y-3">
              {items.map((x) => (
                <div key={`${x.productId}-${x.variantId ?? "base"}`} className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{x.name}</p>
                    {x.variantName ? <p className="text-sm text-muted-foreground">{x.variantName}</p> : null}
                    <p className="text-sm text-muted-foreground">Qty: {x.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatPrice(x.unitPrice * x.quantity)}</p>
                    {currency !== "ETB" && (
                      <p className="text-xs text-muted-foreground">
                        {formatPrice(x.unitPrice * x.quantity, "ETB")}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border my-4" />
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <div className="text-right">
                <span className="font-medium block text-lg">{formatPrice(subtotal)}</span>
                {currency !== "ETB" && (
                  <span className="text-xs text-muted-foreground block">
                    {formatPrice(subtotal, "ETB")}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
