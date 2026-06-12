import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Coffee, Mail } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) {
        toast({ title: "Reset failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Check your email", description: "We sent a password reset link if that email exists." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout showGlobalBeans={true} beanCount={8}>
      <section className="min-h-screen flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6"><Coffee className="w-8 h-8 text-primary" /><span className="font-display text-2xl">TOMOCA</span></Link>
            <h1 className="font-display text-3xl mb-2">Reset password</h1>
            <p className="text-muted-foreground">Enter your email and we’ll send you a reset link.</p>
          </div>
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 shadow-elevated">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-12 pl-10 bg-background/50" placeholder="you@example.com" />
                </div>
              </div>
              <Button className="w-full h-12" disabled={loading}>{loading ? "Sending..." : "Send reset link"}</Button>
            </form>
            <p className="mt-6 text-center text-sm"><Link to="/login" className="text-primary hover:underline">Back to login</Link></p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
