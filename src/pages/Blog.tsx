import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, ArrowRight, Search, Coffee } from "lucide-react";
import { SectionBeans } from "@/components/SectionBeans";
import { useToast } from "@/hooks/use-toast";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  created_at: string;
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, cover_image_url, published_at, created_at")
      .eq("is_published", true)
      .order("published_at", { ascending: false });

    if (!error && data) {
      setPosts(data);
    }
    setLoading(false);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribing(true);

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
      toast({
        title: "Welcome to the family!",
        description: "You've been added to our newsletter.",
      });
      setEmail("");
    }
    setSubscribing(false);
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Layout showGlobalBeans={true} beanCount={12}>
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-50" />
        <SectionBeans pattern="wave" count={10} className="opacity-30" />
        
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-4">
              The TOMOCA <span className="text-gradient-gold">Journal</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Stories from the world of coffee — origins, techniques, recipes, and the people behind your cup.
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-10 max-w-md mx-auto"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-card/50 border-border"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-card/30 rounded-2xl h-96 animate-pulse" />
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <Coffee className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-display text-2xl mb-2">No articles yet</h3>
              <p className="text-muted-foreground">Check back soon for stories from the world of coffee.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link to={`/blog/${post.slug}`}>
                    <div className="group bg-card/30 backdrop-blur-sm border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-500 hover:shadow-glow h-full flex flex-col">
                      {/* Cover Image */}
                      <div className="aspect-video bg-gradient-to-br from-bean-light/20 to-bean-dark/40 relative overflow-hidden">
                        {post.cover_image_url ? (
                          <img 
                            src={post.cover_image_url} 
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Coffee className="w-12 h-12 text-muted-foreground/30" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(post.published_at || post.created_at)}</span>
                        </div>

                        <h2 className="font-display text-xl mb-3 group-hover:text-primary transition-colors">
                          {post.title}
                        </h2>

                        <p className="text-muted-foreground text-sm line-clamp-3 flex-1">
                          {post.excerpt}
                        </p>

                        <div className="mt-4 flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
                          Read more <ArrowRight className="w-4 h-4 ml-1" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center bg-card/30 backdrop-blur-sm border border-border rounded-3xl p-10"
          >
            <h2 className="font-display text-3xl mb-4">Stay in the Loop</h2>
            <p className="text-muted-foreground mb-8">
              Get the latest articles, brewing tips, and exclusive offers delivered to your inbox.
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 bg-background/50 flex-1"
              />
              <Button 
                type="submit"
                disabled={subscribing}
                className="h-12 gold-gradient text-primary-foreground px-6"
              >
                {subscribing ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
