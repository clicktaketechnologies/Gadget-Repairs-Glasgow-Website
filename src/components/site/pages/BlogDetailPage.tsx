"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  ChevronRight,
  Calendar,
  User,
  Tag,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Link2,
  ArrowRight,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Section } from "@/components/site/Section";
import { NavLink } from "@/components/site/NavLink";
import { STATIC_POSTS } from "../staticData";
import { useNav } from "@/store/nav";
import { fmtDate } from "../lib";
import { toast } from "sonner";

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags?: string | null;
  author: string;
  published: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BlogDetailPageProps {
  slug: string;
}

export function BlogDetailPage({ slug }: BlogDetailPageProps) {
  const goContact = useNav((s) => s.goContact);
  const goBlog = useNav((s) => s.goBlog);

  const [post, setPost] = useState<Post | undefined>(() =>
    (STATIC_POSTS as Post[]).find((p) => p.slug === slug)
  );
  const [related, setRelated] = useState<Post[]>([]);
  const [loading, setLoading] = useState(!post);

  useEffect(() => {
    fetch(`/api/public/blog/${slug}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && data.post) {
          setPost(data.post as Post);
          setRelated((data.related ?? []) as Post[]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (!post && loading) {
    return (
      <Section className="py-20">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="h-6 w-1/3 bg-zinc-200 rounded animate-pulse" />
          <div className="h-12 w-2/3 bg-zinc-200 rounded animate-pulse" />
          <div className="aspect-[16/9] bg-zinc-100 rounded animate-pulse" />
          <div className="h-4 w-full bg-zinc-100 rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-zinc-100 rounded animate-pulse" />
        </div>
      </Section>
    );
  }

  if (!post) {
    return (
      <Section className="py-20 text-center">
        <h1 className="text-2xl font-bold text-blue-900">Post not found</h1>
        <p className="text-zinc-600 mt-2">
          We couldn't find that blog post.
        </p>
        <Button
          variant="outline"
          className="mt-4 border-blue-200 text-blue-700"
          onClick={() => goBlog()}
        >
          Back to blog
        </Button>
      </Section>
    );
  }

  const tags = (post.tags ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/blog/${post.slug}`
      : `https://www.gadgetrepairsglasgow.co.uk/blog/${post.slug}`;

  const shareLinks = [
    {
      label: "Facebook",
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl
      )}`,
    },
    {
      label: "Twitter",
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        shareUrl
      )}&text=${encodeURIComponent(post.title)}`,
    },
    {
      label: "LinkedIn",
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        shareUrl
      )}`,
    },
  ];

  const copyLink = () => {
    if (typeof navigator === "undefined") return;
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => toast.success("Link copied to clipboard."))
      .catch(() => toast.error("Could not copy link."));
  };

  const fallbackRelated = (STATIC_POSTS as Post[]).filter(
    (p) => p.slug !== post.slug && p.category === post.category
  );
  const relatedFinal = related.length ? related : fallbackRelated;

  return (
    <>
      {/* Cover image hero */}
      <section className="relative">
        <div className="aspect-[16/9] sm:aspect-[21/9] lg:aspect-[21/8] w-full overflow-hidden bg-blue-900">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-950/95 via-blue-950/40 to-blue-950/20" />
        </div>
        <div className="absolute inset-0 flex items-end">
          <Section className="pb-8 sm:pb-10 lg:pb-12">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-3xl text-white"
            >
              <nav className="flex items-center gap-1.5 text-xs text-blue-200 mb-3 flex-wrap">
                <NavLink href="/" className="hover:text-orange-300">
                  Home
                </NavLink>
                <ChevronRight className="size-3" />
                <NavLink href="/blog" className="hover:text-orange-300">
                  Blog
                </NavLink>
                <ChevronRight className="size-3" />
                <span className="text-white truncate">{post.category}</span>
              </nav>
              <Badge className="bg-orange-500 text-white border-0 mb-3">
                {post.category}
              </Badge>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-sm text-blue-100">
                <span className="inline-flex items-center gap-1">
                  <User className="size-4" />
                  {post.author}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Calendar className="size-4" />
                  {fmtDate(post.createdAt)}
                </span>
              </div>
            </motion.div>
          </Section>
        </div>
      </section>

      {/* Body */}
      <Section className="py-10 sm:py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <article className="lg:col-span-2 min-w-0">
            <div className="prose prose-zinc max-w-none prose-headings:text-blue-900 prose-headings:font-bold prose-a:text-blue-700 prose-strong:text-zinc-900 prose-li:text-zinc-700 prose-sm sm:prose-base">
              <ReactMarkdown
                components={{
                  img: ({ src, alt, ...props }) => (
                    <img
                      src={typeof src === "string" ? src : ""}
                      alt={alt || "Blog image"}
                      className="rounded-xl my-4 max-w-full h-auto"
                      loading="lazy"
                      {...props}
                    />
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>

            {tags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="text-xs px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-600 inline-flex items-center gap-1"
                  >
                    <Tag className="size-3" />
                    {t}
                  </span>
                ))}
              </div>
            )}

            {/* Share buttons */}
            <div className="mt-8 flex items-center gap-2 flex-wrap border-t border-zinc-100 pt-6">
              <span className="text-sm font-medium text-zinc-700 inline-flex items-center gap-1.5">
                <Share2 className="size-4 text-orange-500" />
                Share:
              </span>
              {shareLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Share on ${s.label}`}
                  className="size-10 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white inline-flex items-center justify-center transition-colors"
                >
                  <s.icon className="size-4" />
                </a>
              ))}
              <button
                type="button"
                onClick={copyLink}
                aria-label="Copy link"
                className="size-10 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white inline-flex items-center justify-center transition-colors"
              >
                <Link2 className="size-4" />
              </button>
            </div>

            {/* Author box */}
            <Card className="border-zinc-200 mt-8 bg-gradient-to-br from-blue-50 to-white">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="size-12 rounded-full bg-blue-600 text-white inline-flex items-center justify-center font-bold shrink-0">
                  GRG
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-blue-900">{post.author}</p>
                  <p className="text-sm text-zinc-600">
                    Glasgow's trusted repair technicians — 10+ years of
                    experience fixing phones, MacBooks, laptops, tablets,
                    consoles, computers, smart watches and GHDs at 172 Trongate.
                  </p>
                </div>
              </CardContent>
            </Card>
          </article>

          {/* Sidebar CTA */}
          <aside className="lg:col-span-1 space-y-5">
            <Card className="border-zinc-200 bg-gradient-to-br from-blue-900 to-blue-800 text-white">
              <CardContent className="p-5 sm:p-6 space-y-3">
                <h3 className="font-bold text-lg">
                  Need a repair in Glasgow?
                </h3>
                <p className="text-blue-100 text-sm">
                  Fast service, 30-day warranty, free doorstep collection.
                  Walk in to 172 Trongate or book online.
                </p>
                <Button
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white h-11"
                  onClick={() => goContact()}
                >
                  <Wrench className="size-4" />
                  Book a Repair
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </Section>

      {/* Related posts */}
      {relatedFinal.length > 0 && (
        <Section className="py-10 sm:py-12">
          <h2 className="text-lg sm:text-xl font-bold text-blue-900 mb-5">
            Related articles
          </h2>
          <div className="grid sm:grid-cols-3 gap-4 sm:gap-5">
            {relatedFinal.slice(0, 3).map((p) => (
              <NavLink key={p.id} href={`/blog/${p.slug}`}>
                <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow border-zinc-200 group">
                  <div className="aspect-[16/10] overflow-hidden bg-zinc-100">
                    <img
                      src={p.coverImage}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <CardContent className="p-4">
                    <Badge
                      variant="outline"
                      className="border-blue-200 text-blue-700 text-[10px] mb-2"
                    >
                      {p.category}
                    </Badge>
                    <h3 className="font-semibold text-blue-900 text-sm leading-snug line-clamp-3">
                      {p.title}
                    </h3>
                    <p className="text-xs text-blue-700 mt-2 inline-flex items-center gap-1">
                      Read more
                      <ArrowRight className="size-3" />
                    </p>
                  </CardContent>
                </Card>
              </NavLink>
            ))}
          </div>
        </Section>
      )}

      {/* Final CTA */}
      <section className="bg-orange-500 text-white">
        <Section className="py-8 sm:py-10 text-center">
          <h2 className="text-xl sm:text-2xl font-bold">
            Got a broken device? Let's fix it today.
          </h2>
          <div className="mt-4">
            <Button
              className="bg-blue-900 hover:bg-blue-950 text-white h-11"
              onClick={() => goContact()}
            >
              <Wrench className="size-4" />
              Book a Repair
            </Button>
          </div>
        </Section>
      </section>
    </>
  );
}

export { BlogDetailPage as default, BlogDetailPage };
