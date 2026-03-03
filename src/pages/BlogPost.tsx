import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowLeft, Coffee } from "lucide-react";

interface BlogPostRow {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image_url: string | null;
  is_published: boolean | null;
  published_at: string | null;
  created_at: string;
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPostRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("blog_posts")
        .select(
          "id,title,slug,excerpt,content,cover_image_url,is_published,published_at,created_at"
        )
        .eq("slug", slug)
        .eq("is_published", true)
        .single();

      if (!error && data) setPost(data as BlogPostRow);
      setLoading(false);
    };

    run();
  }, [slug]);

  return (
    <Layout showGlobalBeans={true} beanCount={12}>
      <section className="pt-28 pb-16 px-4">
        <div className="container mx-auto">
          <div className="mb-6">
            <Button asChild variant="outline" className="gap-2">
              <Link to="/blog">
                <ArrowLeft className="w-4 h-4" /> Back to Journal
              </Link>
            </Button>
          </div>

          {loading ? (
            <div className="bg-card/30 border border-border rounded-3xl p-10 animate-pulse">
              <div className="h-8 w-2/3 bg-muted/20 rounded" />
              <div className="h-4 w-1/3 bg-muted/20 rounded mt-4" />
              <div className="h-64 bg-muted/20 rounded-2xl mt-8" />
              <div className="space-y-3 mt-8">
                <div className="h-4 bg-muted/20 rounded" />
                <div className="h-4 bg-muted/20 rounded" />
                <div className="h-4 bg-muted/20 rounded w-5/6" />
              </div>
            </div>
          ) : !post ? (
            <div className="text-center py-24">
              <Coffee className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h1 className="font-display text-3xl mb-2">Post not found</h1>
              <p className="text-muted-foreground">This article may be unpublished or the link is incorrect.</p>
            </div>
          ) : (
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto"
            >
              <div className="text-center mb-10">
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(post.published_at || post.created_at)}</span>
                </div>
                <h1 className="font-display text-4xl md:text-5xl mb-4">{post.title}</h1>
                {post.excerpt && (
                  <p className="text-muted-foreground text-lg">{post.excerpt}</p>
                )}
              </div>

              {post.cover_image_url && (
                <div className="rounded-3xl overflow-hidden border border-border bg-card/30 mb-10">
                  <img
                    src={post.cover_image_url}
                    alt={post.title}
                    className="w-full h-[260px] md:h-[420px] object-cover"
                    loading="lazy"
                  />
                </div>
              )}

              <div className="bg-card/20 backdrop-blur-sm border border-border rounded-3xl p-8 md:p-10">
                {/* Simple rendering: preserve line breaks. If you later add rich text/MDX, we can upgrade here. */}
                <div className="prose prose-invert max-w-none">
                  {(post.content || "").split("\n").map((line, idx) => (
                    <p key={idx}>{line}</p>
                  ))}
                </div>
              </div>
            </motion.article>
          )}
        </div>
      </section>
    </Layout>
  );
}
