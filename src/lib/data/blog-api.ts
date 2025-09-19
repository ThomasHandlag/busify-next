import api from "./axios-instance";

export interface BlogAuthor {
  id: number;
  name: string;
  email: string;
  imageUrl: string | null;
  bio: string | null;
  role: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  imageUrl: string;
  author: BlogAuthor;
  tags: string[];
  readingTime: number;
  featured: boolean;
  publishedAt: string;
  viewCount: number;
}

export interface BlogPostContent extends BlogPost {
  content: string;
}

export interface BlogPostsResponse {
  content: BlogPost[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

export interface BlogPostPageDTO {
  posts: BlogPostsResponse;
}

/**
 * Fetch blog posts with filters
 */
export const fetchBlogPosts = async ({
  search = "",
  published = true,
  featured = undefined,
  tag = "",
  myPosts = false,
  page = 0,
  size = 10,
  sortBy = "publishedAt",
  sortDirection = "DESC",
}: {
  search?: string;
  published?: boolean;
  featured?: boolean;
  tag?: string;
  myPosts?: boolean;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: string;
} = {}) => {
  try {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (published !== undefined)
      params.append("published", published.toString());
    if (featured !== undefined) params.append("featured", featured.toString());
    if (tag) params.append("tag", tag);
    if (myPosts !== undefined) params.append("myPosts", myPosts.toString());

    params.append("page", page.toString());
    params.append("size", size.toString());
    params.append("sortBy", sortBy);
    params.append("sortDirection", sortDirection);

    const response = await api.get<ApiResponse<BlogPostPageDTO>>(
      `api/blogs/posts/filter?${params.toString()}`
    );
    return response.data.result;
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    throw error;
  }
};

/**
 * Fetch a single blog post by slug
 */
export const fetchBlogPostBySlug = async (
  slug: string
): Promise<BlogPostContent> => {
  try {
    const response = await api.get<ApiResponse<BlogPostContent>>(
      `api/blogs/posts/${slug}/slug`
    );
    return response.data.result;
  } catch (error) {
    console.error(`Error fetching blog post with slug ${slug}:`, error);
    throw error;
  }
};

/**
 * Fetch all blog tags
 */
export const fetchBlogTags = async (): Promise<string[]> => {
  try {
    const response = await api.get<ApiResponse<string[]>>("api/blogs/tags");
    return response.data.result;
  } catch (error) {
    console.error("Error fetching blog tags:", error);
    throw error;
  }
};

/**
 * Increment view count for a blog post
 */
export const incrementBlogViewCount = async (postId: number): Promise<void> => {
  try {
    await api.post<ApiResponse<void>>(`api/blogs/posts/${postId}/view`);
  } catch (error) {
    console.error(`Error incrementing view count for post ${postId}:`, error);
    // Don't throw error to avoid breaking page rendering if this fails
  }
};
