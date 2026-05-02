import { getSessionAction } from '@/actions/auth.actions';
import { fetchEvents, getMyEvents } from '@/actions/event.actions';
import ErrorBoundary from '@/components/ErrorBoundary'
import ErrorFallback from '@/components/ErrorFallback'
import EventsTable from '@/components/module/event/Myevent';
import { TGroupedEvents, TPagination } from '@/types/event.types';
import React from 'react'
const EventsPage = async({
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
  
  let eventsResponse;
  try {
    const search = await searchParams;
    eventsResponse = await fetchEvents(search,{revalidate:60});
  } catch (err) {
    console.error("Events fetch error:", err);
    eventsResponse = { data: { UPCOMING: [] }, pagination: { total: 0, page: 1, limit: 10, totalpage: 1 } };
  }
  return (
    <ErrorBoundary fallback={<ErrorFallback title="Events Error" message="Something went wrong while loading the events page." />}>
      <div>
        {/* Events content goes here */}
        {(!eventsResponse || !eventsResponse.data || !eventsResponse.success) ? (
          <ErrorFallback
            title="No Events Found"
            message="We couldn't find any events to display."
          />
        ) : (
          <EventsTable
          Events={eventsResponse.data as TGroupedEvents}
          pagination={eventsResponse.pagination as TPagination}
          role={role as string}
        />
        )}
      </div>
    </ErrorBoundary>
  )
}

export default EventsPage