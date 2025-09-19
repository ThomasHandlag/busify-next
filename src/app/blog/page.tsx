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
      <div className="container mx-auto px-4 py-8">
        {/* Page Header with Search */}
        <div className="mb-12 text-center">
          <form className="flex items-center max-w-md mx-auto">
            <div className="relative flex-grow">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                name="search"
                defaultValue={search}
                className="pl-10 pr-4 py-2 rounded-l-md border-r-0 focus-visible:ring-green-500"
                placeholder="Tìm kiếm bài viết..."
                type="search"
              />
            </div>
            <Button
              type="submit"
              className="rounded-l-none bg-green-600 hover:bg-green-700"
            >
              Tìm kiếm
            </Button>
          </form>
        </div>

        {/* Featured Post */}
        {featuredPosts.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <span className="h-5 w-1 bg-green-600 rounded mr-2"></span>
              Bài viết nổi bật
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
                  <h3 className="text-2xl md:text-3xl font-bold mb-2 group-hover:text-green-400 transition-colors">
                    {featuredPosts[0].title}
                  </h3>
                  <p className="text-white/90 mb-4 max-w-3xl line-clamp-2">
                    {featuredPosts[0].excerpt}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
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
                    <div>Tác giả: {featuredPosts[0].author.name}</div>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Popular Tags */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <span className="h-5 w-1 bg-green-600 rounded mr-2"></span>
            Chủ đề phổ biến
          </h2>
          <div className="flex flex-wrap gap-2">
            <Link href="/blog">
              <Button
                variant="outline"
                className={`rounded-full ${
                  !tag
                    ? "bg-green-50 dark:bg-gray-800 border-green-500"
                    : "bg-transparent border"
                } hover:bg-green-50 dark:hover:bg-gray-800`}
              >
                Tất cả
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
                      ? "bg-green-50 dark:bg-gray-800 border-green-500"
                      : "bg-transparent border"
                  } hover:bg-green-50 dark:hover:bg-gray-800`}
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
            <span className="h-5 w-1 bg-green-600 rounded mr-2"></span>
            Bài viết mới nhất
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
                          <Badge className="bg-green-600 hover:bg-green-700 text-white">
                            {post.tags[0] || "Busify"}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <h3 className="font-bold text-xl mb-2 group-hover:text-green-600 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                    </CardContent>
                    <CardFooter className="text-sm text-gray-500 pt-0 flex justify-between items-center">
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
                      <ChevronRight size={16} className="text-green-600" />
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Không tìm thấy bài viết nào. Vui lòng thử lại với tìm kiếm khác.
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
                    <Button variant="outline">Trang trước</Button>
                  </Link>
                )}

                <div className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-md">
                  <span>
                    Trang {page + 1} / {blogData.posts.totalPages}
                  </span>
                </div>

                {!blogData.posts.last && (
                  <Link
                    href={`/blog?page=${page + 1}${
                      search ? `&search=${search}` : ""
                    }${tag ? `&tag=${tag}` : ""}`}
                  >
                    <Button variant="outline">Trang tiếp</Button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </section>

        {/* Newsletter Subscription */}
        <section className="mt-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-8 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Đăng ký nhận tin mới
            </h2>
            <p className="mb-6">
              Nhận thông tin mới nhất về các tuyến xe, khuyến mãi và bài viết
              trực tiếp vào hộp thư của bạn.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <Input
                className="bg-white text-gray-900 placeholder:text-gray-500 border-0"
                placeholder="Email của bạn"
                type="email"
              />
              <Button className="bg-white text-green-600 hover:bg-gray-100">
                Đăng ký
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
