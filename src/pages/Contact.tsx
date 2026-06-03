import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Phone, Mail, MapPin, Clock, Send, Coffee } from "lucide-react";
import { SectionBeans } from "@/components/SectionBeans";

export default function Contact() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate sending email
    await new Promise((resolve) => setTimeout(resolve, 1200));

    toast({
      title: "Message Sent Successfully",
      description: "Thank you for contacting TOMOCA! We will get back to you shortly.",
    });

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
    setLoading(false);
  };

  return (
    <Layout showGlobalBeans={true} beanCount={10} pageIntensity="default">
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-40" />
        <SectionBeans pattern="scattered" count={6} className="opacity-25" />

        <div className="container max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-4">
              Get in <span className="text-gradient-gold">Touch</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Have questions about our premium coffee, subscriptions, or cafes? We would love to hear from you.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-5 space-y-6"
            >
              <div className="bg-card/30 backdrop-blur-md border border-border/60 rounded-3xl p-8 space-y-8 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                
                <div className="space-y-2">
                  <h2 className="font-display text-2xl text-foreground">Flagship Store</h2>
                  <p className="text-sm text-muted-foreground">Visit the heart of TOMOCA Coffee in Addis Ababa.</p>
                </div>

                <div className="space-y-6">
                  {/* Location */}
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Location</p>
                      <p className="text-sm text-muted-foreground mt-1">Wavel Street, Piazza, Addis Ababa, Ethiopia</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Phone Number</p>
                      <p className="text-sm text-muted-foreground mt-1">+251 11 111 2345</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Email Address</p>
                      <p className="text-sm text-muted-foreground mt-1">info@tomocacoffee.com</p>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Opening Hours</p>
                      <p className="text-sm text-muted-foreground mt-1">Mon - Sat: 6:00 AM - 9:00 PM</p>
                      <p className="text-sm text-muted-foreground">Sun: 7:00 AM - 8:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Card */}
              <div className="bg-card/20 border border-border/50 rounded-3xl p-6 flex items-center gap-4">
                <Coffee className="w-10 h-10 text-primary animate-pulse shrink-0" />
                <p className="text-sm text-muted-foreground">
                  Our customer support team is available Monday through Saturday to assist you with order inquiries, shipping details, or feedback.
                </p>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-7"
            >
              <form 
                onSubmit={handleSubmit} 
                className="bg-card/30 backdrop-blur-md border border-border/60 rounded-3xl p-8 space-y-6 relative"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-foreground">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="bg-background/50 border-border/80 focus:border-primary/80 h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="e.g. john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="bg-background/50 border-border/80 focus:border-primary/80 h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-foreground">Subject *</Label>
                  <Input
                    id="subject"
                    placeholder="How can we help you?"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    className="bg-background/50 border-border/80 focus:border-primary/80 h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-foreground">Message *</Label>
                  <Textarea
                    id="message"
                    rows={5}
                    placeholder="Write your message here..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    className="bg-background/50 border-border/80 focus:border-primary/80"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 gold-gradient text-primary-foreground font-semibold text-base transition-all duration-300 hover:scale-[1.01]"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
