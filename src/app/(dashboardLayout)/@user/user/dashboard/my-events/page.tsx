import { getSessionAction } from "@/actions/auth.actions";
import { getCategory } from "@/actions/category.actions";
import { getMyEvents } from "@/actions/event.actions";
import ErrorBoundary from "@/components/ErrorBoundary";
import ErrorFallback from "@/components/ErrorFallback";
import EventsTable from "@/components/module/event/Myevent"
import { TResponseCategoryData } from "@/types/category.type";
import { TGroupedEvents, TPagination } from "@/types/event.types";

const EventsPage =async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const params = await searchParams;
  const userinfo = await getSessionAction();
  const res=await getCategory()
  const role = userinfo.data?.role;
  
  const myEvents = await getMyEvents(params);
  if (!myEvents || !myEvents.data) {
  return myEvents?.message || "Unknown error";
  }
  return (
    <div>
      <ErrorBoundary fallback={<ErrorFallback title="your events load failed" message="Something went wrong while loading your events." />}>
        <EventsTable
        categories={res?.data as TResponseCategoryData[]}
          Events={myEvents.data as TGroupedEvents}
          pagination={myEvents.pagination as TPagination}
          role={role as string}
        />
      </ErrorBoundary>
    </div>
  )
}

export default EventsPage