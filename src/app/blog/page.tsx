import {
  fetchBlogPosts,
  fetchBlogTags,
  BlogPost,
  BlogPostPageDTO,
} from "@/lib/data/blog-api";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Clock, Calendar, ChevronRight, Search, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Busify Blog - Travel Guides, Bus Tips & Vietnam Tourism",
  description:
    "Explore Vietnam through our travel blog featuring scenic bus routes, transportation tips, operator reviews, and sustainable travel guides.",
  keywords:
    "Vietnam bus travel, scenic bus routes, transportation tips, bus operators, travel guides",
  openGraph: {
    title: "Busify Blog - Travel Guides, Bus Tips & Vietnam Tourism",
    description:
      "Explore Vietnam through our travel blog featuring scenic bus routes, transportation tips, operator reviews, and sustainable travel guides.",
    type: "website",
    url: "https://busify.com/blog",
    images: [
      {
        url: "https://busify.com/bus-photo.jpg",
        width: 1200,
        height: 630,
        alt: "Busify Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Busify Blog - Travel Guides, Bus Tips & Vietnam Tourism",
    description:
      "Explore Vietnam through our travel blog featuring scenic bus routes, transportation tips, operator reviews, and sustainable travel guides.",
    images: ["https://busify.com/bus-photo.jpg"],
  },
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const t = await getTranslations("Blog");
  // Note: this page is a server component; translations are applied via next-intl on the rendering layer.
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search : "";
  const tag = typeof params.tag === "string" ? params.tag : "";
  const page = typeof params.page === "string" ? parseInt(params.page) : 0;

  // Fetch all blog data
  const blogData: BlogPostPageDTO = await fetchBlogPosts({
    search,
    published: true,
    tag,
    page,
    size: 10,
    sortBy: "publishedAt",
    sortDirection: "DESC",
  });

  // Get featured posts (prioritize featured ones)
  const featuredPosts = blogData.posts.content
    .filter((post) => post.featured)
    .slice(0, 1);

  // Get remaining posts
  const regularPosts = blogData.posts.content.filter(
    (post) => !featuredPosts.some((fp) => fp.id === post.id)
  );

  // Get unique tags
  const allTags = await fetchBlogTags();

  // JSON-LD structured data for blog collection
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    headline: "Busify Travel Blog",
    description:
      "Explore Vietnam through our travel blog featuring scenic bus routes, transportation tips, operator reviews, and sustainable travel guides.",
    author: {
      "@type": "Organization",
      name: "Busify",
      url: "https://busify.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Busify",
      logo: {
        "@type": "ImageObject",
        url: "https://busify.com/busify-icon-white.png",
      },
    },
    blogPost: blogData.posts.content.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      author: {
        "@type": "Person",
        name: post.author.name,
      },
      datePublished: post.publishedAt,
      image: post.imageUrl,
      url: `https://busify.com/blog/${post.slug}`,
    })),
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
      <div className="container mx-auto px-4 py-8 bg-background">
        {/* Page Header with Search */}
        <div className="mb-12 text-center">
          <form className="flex items-center max-w-md mx-auto">
            <div className="relative flex-grow">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                size={18}
              />
              <Input
                name="search"
                defaultValue={search}
                className="pl-10 pr-4 py-2 rounded-l-md border-r-0 focus-visible:ring-primary"
                placeholder={t("search.placeholder")}
                type="search"
              />
            </div>
            <Button
              type="submit"
              className="rounded-l-none bg-primary hover:bg-primary/90"
            >
              {t("search.button")}
            </Button>
          </form>
        </div>

        {/* Featured Post */}
        {featuredPosts.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <span className="h-5 w-1 bg-primary rounded mr-2"></span>
              {t("featured.title")}
            </h2>
            <Link href={`/blog/${featuredPosts[0].slug}`}>
              <div className="group relative overflow-hidden rounded-2xl hover:shadow-xl transition-shadow duration-300">
                <div className="relative w-full h-96 md:h-[500px]">
                  <Image
                    src={featuredPosts[0].imageUrl || "/bus-photo.jpg"}
                    alt={featuredPosts[0].title}
                    fill
                    className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {featuredPosts[0].tags.slice(0, 3).map((tag: string) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="bg-white/20 text-white border-none"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {featuredPosts[0].title}
                  </h3>
                  <p className="text-primary-foreground/90 mb-4 max-w-3xl line-clamp-2">
                    {featuredPosts[0].excerpt}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-primary-foreground/80">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{formatDate(featuredPosts[0].publishedAt)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{featuredPosts[0].readingTime} phút đọc</span>
                    </div>
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      <span>{featuredPosts[0].viewCount} lượt xem</span>
                    </div>
                    <div> Tác giả: {featuredPosts[0].author.name}</div>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Popular Tags */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <span className="h-5 w-1 bg-primary rounded mr-2"></span>
            {t("tags.title")}
          </h2>
          <div className="flex flex-wrap gap-2">
            <Link href="/blog">
              <Button
                variant="outline"
                className={`rounded-full ${
                  !tag
                    ? "bg-accent border-primary"
                    : "bg-transparent border"
                } hover:bg-accent`}
              >
                {t("tags.all")}
              </Button>
            </Link>
            {allTags.slice(0, 10).map((tagName) => (
              <Link
                key={tagName}
                href={`/blog?tag=${encodeURIComponent(tagName)}`}
              >
                <Button
                  variant="outline"
                  className={`rounded-full ${
                    tag === tagName
                      ? "bg-accent border-primary"
                      : "bg-transparent border"
                  } hover:bg-accent`}
                >
                  {tagName}
                </Button>
              </Link>
            ))}
          </div>
        </section>

        {/* Latest Posts Grid */}
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <span className="h-5 w-1 bg-primary rounded mr-2"></span>
            {t("latest.title")}
          </h2>
          {regularPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularPosts.map((post: BlogPost) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="block h-full"
                >
                  <Card className="h-full group hover:shadow-lg transition-all duration-300 overflow-hidden">
                    <CardHeader className="p-0">
                      <div className="relative w-full h-48 overflow-hidden">
                        <Image
                          src={post.imageUrl || "/place-holder.png"}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-primary hover:bg-primary/90 text-primary-foreground">
                            {post.tags[0] || "Busify"}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                    </CardContent>
                    <CardFooter className="text-sm text-muted-foreground pt-0 flex justify-between items-center">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center mr-2">
                          <Clock className="w-3 h-3 mr-1" />
                          <span>{post.readingTime} phút</span>
                        </div>
                        <div className="flex items-center mr-2">
                          <Eye className="w-3 h-3 mr-1" />
                          <span>{post.viewCount} lượt xem</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          <span>{formatDate(post.publishedAt)}</span>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-primary" />
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                {t("empty.noResults")}
              </p>
            </div>
          )}

          {/* Pagination */}
          {blogData.posts.totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <div className="flex space-x-2">
                {page > 0 && (
                  <Link
                    href={`/blog?page=${page - 1}${
                      search ? `&search=${search}` : ""
                    }${tag ? `&tag=${tag}` : ""}`}
                  >
                    <Button variant="outline">{t("pagination.prev")}</Button>
                  </Link>
                )}

                <div className="flex items-center px-4 py-2 bg-muted rounded-md">
                  <span>
                    {t("pagination.info", {
                      page: page + 1,
                      total: blogData.posts.totalPages,
                    })}
                  </span>
                </div>

                {!blogData.posts.last && (
                  <Link
                    href={`/blog?page=${page + 1}${
                      search ? `&search=${search}` : ""
                    }${tag ? `&tag=${tag}` : ""}`}
                  >
                    <Button variant="outline">{t("pagination.next")}</Button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </section>

        {/* Newsletter Subscription */}
        <section className="mt-16 bg-primary rounded-xl p-8 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              {t("newsletter.title")}
            </h2>
            <p className="mb-6">{t("newsletter.desc")}</p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <Input
                className="bg-background text-foreground placeholder:text-muted-foreground border"
                placeholder={t("newsletter.emailPlaceholder")}
                type="email"
              />
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                {t("newsletter.subscribeButton")}
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
