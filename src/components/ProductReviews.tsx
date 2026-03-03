import { useState } from "react";
import { motion } from "framer-motion";
import { Star, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface Review {
  id: string;
  rating: number;
  title: string | null;
  content: string | null;
  helpful_count: number;
  created_at: string;
  is_verified_purchase: boolean;
  user_id: string;
}

interface ProductReviewsProps {
  productId: string;
  reviews: Review[];
  onReviewAdded: () => void;
}

export function ProductReviews({ productId, reviews, onReviewAdded }: ProductReviewsProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const averageRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to leave a review",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("product_reviews").insert({
      product_id: productId,
      user_id: user.id,
      rating,
      title: title || null,
      content: content || null,
    });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Review submitted",
        description: "Your review is pending approval",
      });
      setShowForm(false);
      setTitle("");
      setContent("");
      onReviewAdded();
    }
    setSubmitting(false);
  };

  const handleHelpful = async (reviewId: string, currentCount: number) => {
    // Simple increment - in production you'd track user votes to prevent duplicates
    await supabase
      .from("product_reviews")
      .update({ helpful_count: currentCount + 1 })
      .eq("id", reviewId);
    onReviewAdded();
  };

  return (
    <div className="space-y-8">
      {/* Summary */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="text-4xl font-display">{averageRating.toFixed(1)}</div>
          <div>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= averageRating
                      ? "fill-primary text-primary"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
            </p>
          </div>
        </div>
        
        {user && !showForm && (
          <Button variant="outline" onClick={() => setShowForm(true)}>
            Write a Review
          </Button>
        )}
      </div>

      {/* Review Form */}
      {showForm && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-card/30 border border-border rounded-xl p-6 space-y-4"
          onSubmit={handleSubmit}
        >
          <div>
            <label className="block text-sm font-medium mb-2">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1"
                >
                  <Star
                    className={`w-6 h-6 transition-colors ${
                      star <= rating
                        ? "fill-primary text-primary"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="review-title" className="block text-sm font-medium mb-2">
              Title (optional)
            </label>
            <Input
              id="review-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience"
            />
          </div>

          <div>
            <label htmlFor="review-content" className="block text-sm font-medium mb-2">
              Review
            </label>
            <Textarea
              id="review-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts about this coffee..."
              rows={4}
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </motion.form>
      )}

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border-b border-border pb-6 last:border-0"
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <div className="flex gap-0.5 mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= review.rating
                            ? "fill-primary text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  {review.title && (
                    <h4 className="font-medium">{review.title}</h4>
                  )}
                </div>
                {review.is_verified_purchase && (
                  <span className="text-xs bg-secondary px-2 py-1 rounded">
                    Verified Purchase
                  </span>
                )}
              </div>

              {review.content && (
                <p className="text-muted-foreground mb-3">{review.content}</p>
              )}

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>
                  {new Date(review.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <button
                  onClick={() => handleHelpful(review.id, review.helpful_count)}
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  <ThumbsUp className="w-4 h-4" />
                  Helpful ({review.helpful_count})
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-8">
          No reviews yet. Be the first to share your experience!
        </p>
      )}
    </div>
  );
}
