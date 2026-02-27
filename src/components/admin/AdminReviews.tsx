import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Star, Check, X, Trash2 } from "lucide-react";

interface Review {
  id: string;
  product_id: string;
  rating: number;
  title: string | null;
  content: string | null;
  is_approved: boolean;
  is_featured: boolean;
  created_at: string;
  product?: {
    name: string;
  };
}

export function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"pending" | "approved" | "all">("pending");
  const { toast } = useToast();

  useEffect(() => {
    fetchReviews();
  }, [filter]);

  const fetchReviews = async () => {
    let query = supabase
      .from("product_reviews")
      .select(`*, product:products(name)`)
      .order("created_at", { ascending: false });

    if (filter === "pending") {
      query = query.eq("is_approved", false);
    } else if (filter === "approved") {
      query = query.eq("is_approved", true);
    }

    const { data, error } = await query;

    if (!error && data) {
      setReviews(data as Review[]);
    }
    setLoading(false);
  };

  const handleApprove = async (id: string, approved: boolean) => {
    const { error } = await supabase
      .from("product_reviews")
      .update({ is_approved: approved })
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: approved ? "Review approved" : "Review rejected" });
      fetchReviews();
    }
  };

  const handleFeature = async (id: string, featured: boolean) => {
    const { error } = await supabase
      .from("product_reviews")
      .update({ is_featured: featured })
      .eq("id", id);

    if (!error) {
      toast({ title: featured ? "Review featured" : "Review unfeatured" });
      fetchReviews();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this review permanently?")) return;

    const { error } = await supabase.from("product_reviews").delete().eq("id", id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Review deleted" });
      fetchReviews();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl">Review Moderation</h2>
          <p className="text-sm text-muted-foreground">
            Approve, feature, or remove customer reviews
          </p>
        </div>

        <div className="flex gap-2">
          {(["pending", "approved", "all"] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f)}
              className="capitalize"
            >
              {f}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 bg-card/30 rounded-xl border border-border">
          <Star className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            {filter === "pending" ? "No pending reviews" : "No reviews found"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="p-4 bg-card/30 border border-border rounded-xl space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium">{review.product?.name || "Unknown Product"}</p>
                  <div className="flex gap-0.5 mt-1">
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
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>

              {review.title && <p className="font-medium">{review.title}</p>}
              {review.content && (
                <p className="text-sm text-muted-foreground">{review.content}</p>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="flex items-center gap-4">
                  {review.is_approved && (
                    <div className="flex items-center gap-2">
                      <Switch
                        id={`featured-${review.id}`}
                        checked={review.is_featured}
                        onCheckedChange={(checked) => handleFeature(review.id, checked)}
                      />
                      <Label htmlFor={`featured-${review.id}`} className="text-sm">
                        Featured
                      </Label>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {!review.is_approved && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive"
                        onClick={() => handleApprove(review.id, false)}
                      >
                        <X className="w-4 h-4 mr-1" /> Reject
                      </Button>
                      <Button size="sm" onClick={() => handleApprove(review.id, true)}>
                        <Check className="w-4 h-4 mr-1" /> Approve
                      </Button>
                    </>
                  )}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => handleDelete(review.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
