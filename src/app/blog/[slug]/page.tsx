import {
  fetchBlogPostBySlug,
  fetchBlogPosts,
  BlogPost,
  BlogPostContent,
} from "@/lib/data/blog-api";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, User, Calendar, Eye, Share2, Bookmark } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const post = await fetchBlogPostBySlug(slug);

    return {
      title: `${post.title} | Busify Blog`,
      description: post.excerpt,
      keywords: post.tags.join(", "),
      openGraph: {
        title: post.title,
        description: post.excerpt,
        type: "article",
        url: `https://busify.com/blog/${post.slug}`,
        images: [
          {
            url: post.imageUrl || "https://busify.com/bus-photo.jpg",
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
        publishedTime: post.publishedAt,
        authors: [post.author.name],
        tags: post.tags,
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.excerpt,
        images: [post.imageUrl || "https://busify.com/bus-photo.jpg"],
      },
    };
  } catch (error) {
    console.error(`Error fetching metadata: ${error}`);
    return {
      title: "Blog Post | Busify",
      description: "Busify blog post",
    };
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const t = await getTranslations("Blog");
  const { slug } = await params;
  let post: BlogPostContent;

  try {
    post = await fetchBlogPostBySlug(slug);
  } catch (error) {
    console.error(`Error fetching blog post: ${error}`);
    notFound();
  }

  // Get related posts (same tags, different post)
  const blogData = await fetchBlogPosts({
    published: true,
    tag: post.tags[0] || "",
    size: 3,
  });

  const relatedPosts = blogData.posts.content
    .filter((p) => p.id !== post.id)
    .slice(0, 3);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  // JSON-LD structured data for individual blog post
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.imageUrl || "https://busify.com/bus-photo.jpg",
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      "@type": "Person",
      name: post.author.name,
      image: post.author.imageUrl || "https://busify.com/avatar-holder.png",
    },
    publisher: {
      "@type": "Organization",
      name: "Busify",
      logo: {
        "@type": "ImageObject",
        url: "https://busify.com/busify-icon-white.png",
      },
    },
    keywords: post.tags.join(", "),
    url: `https://busify.com/blog/${post.slug}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://busify.com/blog/${post.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
      <div className="container mx-auto bg-background px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="mb-8 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">
            {t("breadcrumb.home")}
          </Link>
          <span className="mx-2">/</span>
          <Link href="/blog" className="hover:text-primary">
            {t("breadcrumb.blog")}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{post.title}</span>
        </nav>

        <article className="max-w-4xl mx-auto">
          <header className="mb-8">
            <div className="relative w-full h-96 rounded-lg overflow-hidden mb-6">
              <Image
                src={post.imageUrl || "/bus-photo.jpg"}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="mb-4">
              {post.tags.map((tag: string) => (
                <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`}>
                  <Badge
                    variant="secondary"
                    className="mr-2 mb-2 cursor-pointer hover:bg-accent"
                  >
                    {tag}
                  </Badge>
                </Link>
              ))}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                <span>{post.author.name}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{formatDate(post.publishedAt)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>
                  {t("meta.readingTime", { minutes: post.readingTime })}
                </span>
              </div>
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                <span>{t("meta.views", { count: post.viewCount })}</span>
              </div>
            </div>

            {/* Social sharing */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <Button variant="outline" size="sm" className="gap-1">
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">{t("actions.share")}</span>
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <Bookmark className="w-4 h-4" />
                <span className="hidden sm:inline">{t("actions.save")}</span>
              </Button>
            </div>
          </header>

          <Card>
            <CardContent
              className="prose prose-lg dark:prose-invert max-w-none p-6 prose-img:rounded-lg prose-headings:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline blog-content"
              dangerouslySetInnerHTML={{
                __html:
                  post.content ||
                  `<p>${post.excerpt}</p><p>${t("post.contentUpdating")}</p>`,
              }}
            />
          </Card>

          {/* Author Bio */}
          <Card className="mt-8">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Image
                  src={post.author.imageUrl || "/avatar-holder.png"}
                  alt={post.author.name}
                  width={80}
                  height={80}
                  className="rounded-full"
                />
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    {t("author.aboutTitle", { name: post.author.name })}
                  </h3>
                  <p className="text-muted-foreground">
                    {post.author.bio ||
                      `${post.author.name} là người viết bài cho Busify, chuyên chia sẻ các thông tin hữu ích về du lịch và trải nghiệm đi xe khách tại Việt Nam.`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <aside className="mt-12">
              <h2 className="text-2xl font-bold mb-6">
                {t("post.relatedTitle")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost: BlogPost) => (
                  <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                    <Card className="hover:shadow-lg transition-shadow h-full">
                      <CardHeader className="p-0">
                        <div className="relative w-full h-32">
                          <Image
                            src={relatedPost.imageUrl || "/place-holder.png"}
                            alt={relatedPost.title}
                            fill
                            className="object-cover rounded-t-lg"
                          />
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-sm line-clamp-2 mb-2">
                          {relatedPost.title}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {relatedPost.excerpt}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <Eye className="w-3 h-3" />
                          <span>
                            {t("meta.views", { count: relatedPost.viewCount })}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </aside>
          )}

          {/* Call to Action */}
          <div className="mt-12 bg-gradient-to-r from-primary to-secondary rounded-lg p-8 text-center text-primary-foreground">
            <h2 className="text-2xl font-bold mb-4">{t("post.cta.title")}</h2>
            <p className="text-lg mb-6 opacity-90">{t("post.cta.desc")}</p>
            <Button
              asChild
              className="bg-background text-primary hover:bg-accent"
            >
              <Link href="/trips">{t("post.cta.button")}</Link>
            </Button>
          </div>
        </article>
      </div>
    </>
  );
}
