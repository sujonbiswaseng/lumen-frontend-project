import { getSessionAction } from '@/actions/auth.actions';
import ErrorBoundary from '@/components/ErrorBoundary';
import ErrorFallback from '@/components/ErrorFallback';
import { TPagination } from '@/types/event.types';
import { getAllHighlightsAction } from '@/actions/highlight.action';
import HighlightTable from '@/components/module/highlight/HighlightTable';

const HighlightPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const userinfo = await getSessionAction();
  const role = userinfo.data?.role;

  if (!userinfo || !userinfo.data) {
    return (
      <ErrorBoundary
        fallback={
          <ErrorFallback
            title="Not Authorized"
            message="You must be logged in to view this page."
          />
        }
      >
        <div className="flex flex-col items-center justify-center min-h-[200px]">
          <div className="p-8 rounded-lg shadow bg-white flex flex-col items-center max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              Not Authorized
            </h2>
            <p className="text-gray-500 text-center">
              You must be logged in to view this page.
            </p>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  let highlightResponse;
  try {
    const search = await searchParams;
    highlightResponse = await getAllHighlightsAction(search);
  } catch (err) {
    console.error("Highlights fetch error:", err);
    highlightResponse = {
      data: [],
      pagination: { total: 0, page: 1, limit: 10, totalpage: 1 },
      success: false,
    };
  }
console.log(highlightResponse,'gh')
  return (
    <ErrorBoundary
      fallback={
        <ErrorFallback
          title="Highlights Error"
          message="Something went wrong while loading the highlights page."
        />
      }
    >
      <div>
        {(!highlightResponse ||
          !highlightResponse.data ||
          !highlightResponse.success) ? (
          <ErrorFallback
            title="No Highlights Found"
            message="We couldn't find any highlights to display."
          />
        ) : (
          <div>
            <HighlightTable
              highlights={highlightResponse.data as any[]}
              pagination={highlightResponse.pagination as TPagination}
              role={role as string}
            />
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default HighlightPage;