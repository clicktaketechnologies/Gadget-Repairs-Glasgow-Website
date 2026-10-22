"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Star, Send, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Section } from "@/components/site/Section";
import { StarRating } from "@/components/site/StarRating";
import { STATIC_REVIEWS } from "../staticData";
import { useNav } from "@/store/nav";
import { avatarColor, initials, fmtDate } from "../lib";
import { cn } from "@/lib/utils";

interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  device?: string | null;
  source: string;
  approved: boolean;
  createdAt: string;
}

export function ReviewsPage() {
  const branding = useNav((s) => s.branding);
  const rating = branding?.rating ?? 4.9;
  const reviewCount = branding?.reviewCount ?? 150;

  const [reviews, setReviews] = useState<Review[]>(
    STATIC_REVIEWS as Review[]
  );
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    author: "",
    rating: 5,
    device: "",
    comment: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/public/reviews", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.reviews) && data.reviews.length) {
          setReviews(data.reviews as Review[]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const avg =
    reviews.length > 0
      ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length
      : rating;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.author || !form.comment) {
      toast.error("Please fill in your name and review.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/public/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Could not submit review.");
        return;
      }
      toast.success(
        "Thank you! Your review will appear once approved by our team."
      );
      setForm({ author: "", rating: 5, device: "", comment: "" });
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero with aggregate rating */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white">
        <Section className="py-10 sm:py-14 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-3xl space-y-4 sm:space-y-5"
          >
            <Badge className="bg-orange-500/20 text-orange-300 border border-orange-400/30">
              Customer Reviews
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              Loved by Glasgow —{" "}
              <span className="text-orange-400">{rating}★ rated</span>
            </h1>
            <p className="text-blue-100 text-sm sm:text-base lg:text-lg">
              Read what {reviewCount}+ happy Glasgow customers say about our
              repair service. From cracked iPhone screens to dead PS5 HDMI
              ports — we fix it all, and they love it.
            </p>
            <div className="inline-flex items-center gap-4 bg-white/5 ring-1 ring-white/15 rounded-xl px-5 py-3 flex-wrap">
              <div className="text-3xl sm:text-4xl font-extrabold text-orange-400">
                {rating.toFixed(1)}
              </div>
              <div>
                <StarRating value={avg} size={18} />
                <p className="text-xs text-blue-200 mt-1">
                  From {reviewCount}+ verified reviews
                </p>
              </div>
            </div>
          </motion.div>
        </Section>
      </section>

      {/* Reviews masonry grid */}
      <Section className="py-10 sm:py-12 lg:py-16">
        <div className="flex items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-900">
              Recent reviews
            </h2>
            <p className="text-zinc-600 mt-1 text-sm">
              Showing {reviews.length} verified customer reviews.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="border-zinc-200">
                <CardContent className="p-5 space-y-3">
                  <div className="h-10 w-10 rounded-full bg-zinc-200 animate-pulse" />
                  <div className="h-4 w-24 bg-zinc-200 rounded animate-pulse" />
                  <div className="h-3 w-full bg-zinc-100 rounded animate-pulse" />
                  <div className="h-3 w-3/4 bg-zinc-100 rounded animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 [column-fill:_balance]">
            {reviews.map((r) => (
              <Card
                key={r.id}
                className="border-zinc-200 mb-5 break-inside-avoid"
              >
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "size-10 rounded-full text-white inline-flex items-center justify-center font-bold text-sm",
                          avatarColor(r.author)
                        )}
                      >
                        {initials(r.author)}
                      </div>
                      <div>
                        <p className="font-semibold text-zinc-900 text-sm">
                          {r.author}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {fmtDate(r.createdAt)}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-[10px] border-zinc-200"
                    >
                      {r.source}
                    </Badge>
                  </div>
                  <StarRating value={r.rating} size={14} />
                  {r.device && (
                    <p className="text-xs text-zinc-500">Device: {r.device}</p>
                  )}
                  <p className="text-sm text-zinc-700 leading-relaxed">
                    {r.comment}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </Section>

      {/* Leave a review form */}
      <section className="bg-blue-950 text-white">
        <Section className="py-10 sm:py-14">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div>
              <Badge className="bg-orange-500/20 text-orange-300 border border-orange-400/30">
                Leave a Review
              </Badge>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mt-3">
                Share your experience
              </h2>
              <p className="text-blue-100 mt-2 text-sm sm:text-base">
                Had a repair with us? Tell Glasgow what you thought. Your review
                will appear on our site once approved by our team (usually
                within 24 hours).
              </p>
              <div className="mt-6 space-y-3">
                {[
                  "Genuine reviews from real customers",
                  "Helps others choose the right repair shop",
                  "Get a 5% discount on your next repair",
                ].map((t) => (
                  <div key={t} className="flex items-center gap-2 text-sm">
                    <Star className="size-4 text-orange-400 fill-orange-400" />
                    <span className="text-blue-100">{t}</span>
                  </div>
                ))}
              </div>
            </div>

            <Card className="bg-white text-zinc-900 border-0 shadow-2xl">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="rv-name">Your name *</Label>
                      <Input
                        id="rv-name"
                        required
                        value={form.author}
                        onChange={(e) =>
                          setForm((s) => ({ ...s, author: e.target.value }))
                        }
                        placeholder="Jane Doe"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="rv-device">Device (optional)</Label>
                      <Input
                        id="rv-device"
                        value={form.device}
                        onChange={(e) =>
                          setForm((s) => ({ ...s, device: e.target.value }))
                        }
                        placeholder="iPhone 14 Pro"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Your rating</Label>
                    <div className="flex items-center gap-2">
                      <StarRating
                        value={form.rating}
                        size={28}
                        interactive
                        onChange={(v) => setForm((s) => ({ ...s, rating: v }))}
                      />
                      <span className="text-sm font-medium text-zinc-700 ml-2">
                        {form.rating} / 5
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="rv-comment">Your review *</Label>
                    <Textarea
                      id="rv-comment"
                      required
                      rows={4}
                      value={form.comment}
                      onChange={(e) =>
                        setForm((s) => ({ ...s, comment: e.target.value }))
                      }
                      placeholder="Tell us about your repair experience…"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    size="lg"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    {submitting ? (
                      "Submitting…"
                    ) : (
                      <>
                        <Send className="size-4" />
                        Submit Review
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-zinc-500 text-center flex items-center justify-center gap-1">
                    <MessageSquare className="size-3" />
                    Reviews are moderated before publishing.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </Section>
      </section>
    </>
  );
}

export { ReviewsPage as default, ReviewsPage };
