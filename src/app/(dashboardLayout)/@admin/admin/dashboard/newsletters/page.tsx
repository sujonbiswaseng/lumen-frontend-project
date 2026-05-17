import { getSessionAction } from '@/actions/auth.actions';
import ErrorBoundary from '@/components/ErrorBoundary';
import ErrorFallback from '@/components/ErrorFallback';
import { TPagination } from '@/types/event.types';
import NewsletterTable from '@/components/module/newsletters/newsletterTable';
import { getAllNewslettersAction } from '@/actions/newsletter.actions';

const NewsletterPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const userinfo = await getSessionAction();
  if(!userinfo || !userinfo.success){
  return (
    <ErrorFallback
      title="Not Found"
      message="You must be logged in to view newsletters."
    />
  );
  }
 
  let newsletterResponse;
  try {
    const search = await searchParams;
    newsletterResponse = await getAllNewslettersAction(search);
  } catch (err) {
    console.error("Newsletters fetch error:", err);
    newsletterResponse = {
      data: [],
      pagination: { total: 0, page: 1, limit: 10, totalpage: 1 },
      success: false,
    };
  }


  return (
    <ErrorBoundary
      fallback={
        <ErrorFallback
          title="Newsletters Error"
          message="Something went wrong while loading the newsletters page."
        />
      }
    >
      <div>
        {(!newsletterResponse ||
          !newsletterResponse.data ||
          !newsletterResponse.success) ? (
          <ErrorFallback
            title="No Newsletters Found"
            message="We couldn't find any newsletters to display."
          />
        ) : (
          <div>
            <NewsletterTable
              newsletters={newsletterResponse.data as any[]}
              pagination={newsletterResponse.pagination as TPagination}
              role={userinfo.data?.role as string}
            />
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default NewsletterPage;