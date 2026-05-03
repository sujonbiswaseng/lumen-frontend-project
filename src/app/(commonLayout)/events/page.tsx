import { getCategory } from "@/actions/category.actions";
import { fetchEvents } from "@/actions/event.actions";
import ErrorBoundary from "@/components/ErrorBoundary";
import EventContent from "@/components/module/event/EventsContent";
import { TResponseCategoryData } from "@/types/category.type";
import { TPagination, TResponseEvent } from "@/types/event.types";
import { IgetReviewData } from "@/types/review.types";
import { IBaseUser } from "@/types/user.types";
import React from "react";

export const dynamic = "force-dynamic";

const EventsPage = async ({
  searchParams,
}: {
  searchParams:Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  let eventsResponse;
  try {
    const search = await searchParams;
    eventsResponse = await fetchEvents(search);
  } catch (err) {
    console.error("Events fetch error:", err);
    eventsResponse = { data: { UPCOMING: [] }, pagination: { total: 0, page: 1, limit: 10, totalpage: 1 } };
  }

  const categories=await getCategory()
 


  return (
   <div className={"mt-10"}>
     <React.Suspense fallback={<div>Loading events...</div>}>
       <ErrorBoundary fallback={<div>Failed to load events.</div>}>
         <EventContent
         categories={categories?.data as TResponseCategoryData[]}
           events={eventsResponse.data?.UPCOMING as TResponseEvent<{ reviews: any[]; organizer: IBaseUser; }>[]} 
           pagination={eventsResponse.pagination as TPagination}
         />
       </ErrorBoundary>
     </React.Suspense>
   </div>
  );
};

export default EventsPage;