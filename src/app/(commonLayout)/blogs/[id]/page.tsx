import React from 'react';
import NotFoundItem from '@/components/NotFoundItem';
import { getSessionAction } from '@/actions/auth.actions';
import { getSingleBlogAction } from '@/actions/blog.actions';
import { BlogDetailsCard } from '@/components/module/blog/BlogDetailsCard';


// Simple ErrorBoundary for async server components
function ErrorBoundary({ error }: { error: Error }) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-neutral-100 px-6">
      <section className="w-full max-w-xl">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 px-8 py-12 flex flex-col items-center">
          <span className="rounded-full bg-red-50 p-3 mb-1 shadow-sm">
            <svg className="text-red-500" height={44} width={44} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 8l8 8M16 8l-8 8" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </span>
          <h1 className="text-2xl font-bold text-red-600 mb-1">
            Unable to load blog
          </h1>
          <p className="text-sm text-gray-500 text-center mb-4">
            Sorry, an error occurred while loading this blog post. It may not exist or is temporarily unavailable.
          </p>
          <div className="text-xs text-gray-400 w-full text-center pt-3">
            {error.message}
          </div>
        </div>
      </section>
    </main>
  );
}

// -- MAIN BLOG PAGE COMPONENT --
const BlogDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  try {
    const { id } = await params;
    if (!id || typeof id !== "string") {
      throw new Error("Invalid blog id.");
    }

    // fetch blog data using id
    const blogRes = await getSingleBlogAction(id);
    if (!blogRes || !blogRes.data) {
      return (
        <div>
          <NotFoundItem content="Sorry, this blog post could not be found or does not exist." />
        </div>
      );
    }
    const userinfo = await getSessionAction();
    const blog = blogRes.data;

    return (
      <div className="w-full">
        <BlogDetailsCard blog={blog} />
      </div>
    );
  } catch (error: any) {
    return <ErrorBoundary error={error} />;
  }
};

export default BlogDetailsPage;