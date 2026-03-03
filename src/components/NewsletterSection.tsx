import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CoffeeSplash } from "./CoffeeSplash";
import { SectionBeans } from "./SectionBeans";
import { Mail, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function NewsletterSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email });

    if (error) {
      if (error.code === "23505") {
        toast({
          title: "Already subscribed",
          description: "This email is already on our list!",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to subscribe. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      setIsSubmitted(true);
      toast({
        title: "Welcome to the family!",
        description: "You've been added to our newsletter.",
      });
      setTimeout(() => {
        setEmail("");
        setIsSubmitted(false);
      }, 3000);
    }
    
    setIsLoading(false);
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-card overflow-hidden"
      aria-labelledby="newsletter-heading"
    >
      {/* 3D Coffee splash background */}
      <CoffeeSplash variant="left" intensity="subtle" />
      <CoffeeSplash variant="right" intensity="subtle" />

      {/* Decorative beans */}
      <SectionBeans pattern="scattered" count={8} />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/80 to-card pointer-events-none" />

      <div className="container max-w-4xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
          className="text-center"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={isInView ? { scale: 1, rotate: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-8"
          >
            <Mail className="w-8 h-8" />
          </motion.div>

          <span className="text-sm uppercase tracking-[0.2em] text-primary mb-4 block">
            Stay Connected
          </span>
          <h2
            id="newsletter-heading"
            className="text-3xl md:text-5xl font-display font-medium text-foreground mb-6"
          >
            Join the <span className="text-gradient-gold">TOMOCA</span> Family
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-10">
            Be the first to know about new roasts, exclusive offers, and the stories
            behind our coffee. No spam, just pure coffee culture.
          </p>

          {/* Newsletter form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
          >
            <div className="relative flex-1">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 bg-background border-border focus:border-primary pl-4 pr-4"
                disabled={isSubmitted || isLoading}
              />
            </div>
            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="min-w-[140px]"
              disabled={isSubmitted || isLoading}
            >
              {isSubmitted ? (
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Subscribed!
                </motion.span>
              ) : isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Subscribing...
                </span>
              ) : (
                "Subscribe"
              )}
            </Button>
          </motion.form>

          {/* Trust text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-xs text-muted-foreground mt-6"
          >
            Join 10,000+ coffee lovers. Unsubscribe anytime.
          </motion.p>
        </motion.div>
      </div>

      {/* Bottom decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  );
}
