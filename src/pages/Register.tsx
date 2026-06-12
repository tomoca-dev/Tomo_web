import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { Coffee, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Register() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ title: "Password too short", description: "Use at least 6 characters.", variant: "destructive" });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: "Passwords do not match", description: "Please confirm your password again.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { error } = await signUp(email, password, displayName);
      if (error) {
        toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Account created", description: "Check your email to confirm your account, then sign in." });
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout showGlobalBeans={true} beanCount={10}>
      <section className="min-h-screen flex items-center justify-center py-20 px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <Coffee className="w-8 h-8 text-primary" />
              <span className="font-display text-2xl tracking-tight">TOMOCA</span>
            </Link>
            <h1 className="font-display text-3xl md:text-4xl mb-2">Create Account</h1>
            <p className="text-muted-foreground">Join TOMOCA for orders, wishlist, and member updates.</p>
          </div>

          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 shadow-elevated">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your name" className="h-12 bg-background/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="h-12 bg-background/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? "text" : "password"} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className="h-12 bg-background/50 pr-12" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" type={showPassword ? "text" : "password"} autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" required className="h-12 bg-background/50" />
              </div>
              <Button type="submit" disabled={loading} className="w-full h-12 gold-gradient text-primary-foreground font-medium group">
                {loading ? "Creating account..." : <span className="flex items-center gap-2">Create Account <ArrowRight className="w-4 h-4" /></span>}
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
            </p>
          </div>
        </motion.div>
      </section>
    </Layout>
  );
}
