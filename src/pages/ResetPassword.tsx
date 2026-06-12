import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Coffee } from "lucide-react";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ title: "Password too short", description: "Use at least 6 characters.", variant: "destructive" });
      return;
    }
    if (password !== confirm) {
      toast({ title: "Passwords do not match", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) toast({ title: "Reset failed", description: error.message, variant: "destructive" });
      else {
        toast({ title: "Password updated", description: "You can now sign in with your new password." });
        navigate("/login");
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
            <h1 className="font-display text-3xl mb-2">Create new password</h1>
          </div>
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 shadow-elevated">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2"><Label htmlFor="password">New password</Label><Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="h-12 bg-background/50" /></div>
              <div className="space-y-2"><Label htmlFor="confirm">Confirm password</Label><Input id="confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required className="h-12 bg-background/50" /></div>
              <Button className="w-full h-12" disabled={loading}>{loading ? "Updating..." : "Update password"}</Button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
}
