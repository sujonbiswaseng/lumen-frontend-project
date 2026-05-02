import { getSessionAction } from "@/actions/auth.actions";
import ErrorBoundary from "@/components/ErrorBoundary";
import ErrorFallback from "@/components/ErrorFallback";
import { getAllBlogsAction } from "@/actions/blog.actions";
import { IBaseEvent, TPagination } from "@/types/event.types";
import { TResponseBlog } from "@/types/blog.type";
import BlogTable from "@/components/module/blog/BlogTable";
import BlogsTable from "@/components/module/blog/BlogTable";
import { IBaseUser } from "@/types/user.types";
import BlogCard from "@/components/module/blog/BlogCard";

const BlogsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  let blogsResponse;
  try {
    const search = await searchParams;
    blogsResponse = await getAllBlogsAction(search);
  } catch (err) {
    console.error("Blogs fetch error:", err);
    blogsResponse = {
      data: [],
      pagination: { total: 0, page: 1, limit: 10, totalpage: 1 },
      success: false,
    };
  }
  return (
    <ErrorBoundary
      fallback={
        <ErrorFallback
          title="Blogs Error"
          message="Something went wrong while loading the blogs page."
        />
      }
    >
      <div>
        {/* Blogs content goes here */}
        {!blogsResponse || !blogsResponse.data || !blogsResponse.success ? (
          <ErrorFallback
            title="No Blogs Found"
            message="We couldn't find any blogs to display."
          />
        ) : (
          <div className="mt-6 sm:mt-10 md:mt-14 lg:mt-20">
            <BlogCard
              blogs={blogsResponse.data as TResponseBlog<{ author: IBaseUser; event: IBaseEvent }>[]}
              pagination={blogsResponse.pagination as TPagination}
            />
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default BlogsPage;
