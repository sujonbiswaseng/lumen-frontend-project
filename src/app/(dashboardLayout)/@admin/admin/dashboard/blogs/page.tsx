import { getSessionAction } from '@/actions/auth.actions';
import ErrorBoundary from '@/components/ErrorBoundary'
import ErrorFallback from '@/components/ErrorFallback'
import { getAllBlogsAction } from '@/actions/blog.actions';
import { TPagination } from '@/types/event.types';
import { TResponseBlog } from '@/types/blog.type';
import BlogTable from '@/components/module/blog/BlogTable';
import BlogsTable from '@/components/module/blog/BlogTable';

const BlogsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const userinfo = await getSessionAction();
  const role = userinfo.data?.role;
  if (!userinfo || !userinfo.data) {
    return (
      <ErrorBoundary fallback={
        <ErrorFallback
          title="Not Authorized"
          message="You must be logged in to view this page."
        />
      }>
        <div className="flex flex-col items-center justify-center min-h-[200px]">
          <div className="p-8 rounded-lg shadow bg-white flex flex-col items-center max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Not Authorized</h2>
            <p className="text-gray-500 text-center">
              You must be logged in to view this page.
            </p>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  let blogsResponse;
  try {
    const search = await searchParams;
    blogsResponse = await getAllBlogsAction(search);
  } catch (err) {
    console.error("Blogs fetch error:", err);
    blogsResponse = { data: [], pagination: { total: 0, page: 1, limit: 10, totalpage: 1 }, success: false };
  }
  return (
    <ErrorBoundary fallback={<ErrorFallback title="Blogs Error" message="Something went wrong while loading the blogs page." />}>
      <div>
        {/* Blogs content goes here */}
        {(!blogsResponse || !blogsResponse.data || !blogsResponse.success) ? (
          <ErrorFallback
            title="No Blogs Found"
            message="We couldn't find any blogs to display."
          />
        ) : (
          <BlogsTable
            blogs={blogsResponse.data as TResponseBlog[]}
            pagination={blogsResponse.pagination as TPagination}
            role={role as string}
          />
        )}
      </div>
    </ErrorBoundary>
  )
}

export default BlogsPage