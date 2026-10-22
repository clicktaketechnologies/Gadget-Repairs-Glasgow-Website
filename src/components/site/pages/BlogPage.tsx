"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Section } from "@/components/site/Section";
import { NavLink } from "@/components/site/NavLink";
import { STATIC_POSTS } from "../staticData";
import { fmtDate } from "../lib";
import { cn } from "@/lib/utils";

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

export function BlogPage() {
  const [posts, setPosts] = useState<Post[]>(
    STATIC_POSTS as Post[]
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/public/blog", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.posts) && data.posts.length) {
          setPosts(data.posts as Post[]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = Array.from(new Set(posts.map((p) => p.category)));
  const [activeCat, setActiveCat] = useState<string>("All");

  const filtered =
    activeCat === "All" ? posts : posts.filter((p) => p.category === activeCat);

  const featured = posts.find((p) => p.featured) ?? posts[0];
  const rest = filtered.filter((p) => p.id !== featured?.id);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-800 text-white">
        <Section className="py-10 sm:py-14 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-2xl space-y-4"
          >
            <Badge className="bg-orange-500/20 text-orange-300 border border-orange-400/30">
              Repair Blog
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-bold">
              Repair Tips &amp; Guides
            </h1>
            <p className="text-blue-100 text-sm sm:text-base">
              Expert repair guides, common-fault tips and Glasgow-specific
              advice from our technicians. Everything you need to know before
              getting your device fixed.
            </p>
          </motion.div>
        </Section>
      </section>

      {/* Featured post */}
      {featured && (
        <Section className="py-10 sm:py-12">
          <NavLink href={`/blog/${featured.slug}`}>
            <Card className="overflow-hidden border-zinc-200 hover:shadow-xl transition-shadow group">
              <div className="grid lg:grid-cols-2">
                <div className="aspect-[16/10] lg:aspect-auto overflow-hidden bg-zinc-100">
                  <img
                    src={featured.coverImage}
                    alt={featured.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <CardContent className="p-5 sm:p-6 lg:p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <Badge className="bg-orange-500 text-white border-0">
                      Featured
                    </Badge>
                    <Badge variant="outline" className="border-blue-200 text-blue-700">
                      {featured.category}
                    </Badge>
                  </div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-900 leading-tight">
                    {featured.title}
                  </h2>
                  <p className="text-zinc-600 mt-3 text-sm sm:text-base">{featured.excerpt}</p>
                  <div className="flex items-center gap-3 mt-5 text-sm flex-wrap">
                    <span className="text-zinc-700 font-medium">
                      {featured.author}
                    </span>
                    <span className="text-zinc-400">•</span>
                    <span className="text-zinc-500">
                      {fmtDate(featured.createdAt)}
                    </span>
                  </div>
                  <Button
                    className="self-start mt-5 bg-blue-700 hover:bg-blue-800 text-white h-11"
                    variant="default"
                  >
                    Read article
                    <ArrowRight className="size-4" />
                  </Button>
                </CardContent>
              </div>
            </Card>
          </NavLink>
        </Section>
      )}

      {/* Category filter */}
      <Section className="pb-4">
        <div className="flex flex-wrap gap-2">
          {["All", ...categories].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setActiveCat(c)}
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-full transition-colors min-h-9",
                activeCat === c
                  ? "bg-blue-700 text-white"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </Section>

      {/* Post grid */}
      <Section className="pb-12 sm:pb-16">
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="border-zinc-200">
                <div className="aspect-[16/10] bg-zinc-100 animate-pulse" />
                <CardContent className="p-4 space-y-2">
                  <div className="h-4 w-20 bg-zinc-200 rounded animate-pulse" />
                  <div className="h-5 w-full bg-zinc-200 rounded animate-pulse" />
                  <div className="h-3 w-2/3 bg-zinc-100 rounded animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : rest.length === 0 ? (
          <p className="text-zinc-500 text-center py-8">
            No more posts in this category.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {rest.map((p) => (
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
                    <div className="flex items-center justify-between mb-2">
                      <Badge
                        variant="outline"
                        className="border-blue-200 text-blue-700 text-[10px]"
                      >
                        {p.category}
                      </Badge>
                      <span className="text-xs text-zinc-500">
                        {fmtDate(p.createdAt)}
                      </span>
                    </div>
                    <h3 className="font-semibold text-blue-900 text-base leading-snug line-clamp-3">
                      {p.title}
                    </h3>
                    <p className="text-sm text-zinc-600 mt-2 line-clamp-2">
                      {p.excerpt}
                    </p>
                    <p className="text-xs text-blue-700 font-medium mt-3 inline-flex items-center gap-1">
                      Read more
                      <ChevronRight className="size-3" />
                    </p>
                  </CardContent>
                </Card>
              </NavLink>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}

export { BlogPage as default, BlogPage };
