import { getSessionAction } from "@/actions/auth.actions";
import { fetchEvents, fetchPaidAndFreeEvents, getFeaturedEvent } from "@/actions/event.actions";
import CallToAction from "@/components/CallToAction";
import HeroSlider from "@/components/hero-slider";
import ErrorBoundary from "@/components/ErrorBoundary";
import ErrorFallback from "@/components/ErrorFallback";
import UpcommingEvent from "@/components/UpcommingEvent";
import NotFoundItem from "@/components/NotFoundItem";
import { IBaseEvent, TResponseEvent } from "@/types/event.types";
import { IBaseUser } from "@/types/user.types";
import { IgetReviewData } from "@/types/review.types";
import { getUserNotificationsAction } from "@/actions/notification";
import Featured from "@/components/module/home/Featured";
import Services from "@/components/module/home/Services";
import { getAllHighlightsAction } from "@/actions/highlight.action";
import HighLightContent from "@/components/module/home/HighLight";
import { TResponseHighlight } from "@/types/highlight.types";
import { getPublicStatsAction } from "@/actions/stats.actions";
import Statics from "@/components/module/home/Statics";
import { PublicStats } from "@/types/stats.types";
import { getAllBlogsAction } from "@/actions/blog.actions";
import BlogsContent from "@/components/module/home/Blogs";
import { TResponseBlog } from "@/types/blog.type";
import NewsLatter from "@/components/module/home/NewsLatter";
import { FAQ } from "@/components/module/home/FAQ";
import React from "react";
import { getCategory } from "@/actions/category.actions";
import FoodCategories from "@/components/module/category/card";
import { TResponseCategoryData } from "@/types/category.type";
import EventCategories from "@/components/module/category/card";


export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  try {
    const search = await searchParams;
    const res = await getUserNotificationsAction();
    const userinfo = await getSessionAction();
    const role = userinfo.data?.role;
    const eventsRes = await fetchEvents();
    const events = eventsRes.data?.UPCOMING.filter(
      (item) => item.visibility == "PUBLIC" && item
    );

    let paidAndFreeEvents = await fetchPaidAndFreeEvents();
    let isfeatured = await getFeaturedEvent();
    if (!isfeatured.success || !isfeatured.data) {
      return (
        <div>
          <NotFoundItem content="Sorry, no featured event available at this time." />
        </div>
      );
    }

    let highlightResponse;
    try {
      highlightResponse = await getAllHighlightsAction(search);
    } catch (err) {
      console.error("Highlights fetch error:", err);
      highlightResponse = {
        data: [],
        pagination: { total: 0, page: 1, limit: 10, totalpage: 1 },
        success: false,
      };
    }
    const getpublicstats = await getPublicStatsAction();
    const blogsResponse = await getAllBlogsAction(search);
    const categories = await getCategory();
    if (!categories?.success) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[40vh]">
          <NotFoundItem
            content="Required data not found! Please try again later."
            emoji="⚠️"
          />
        </div>
      );
    }

    return (
      <div className="flex flex-col">
        {/* Error checked components */}
        {!isfeatured || !isfeatured.success || !isfeatured.data ? (
          <NotFoundItem content="hero section data not found" />
        ) : (
         <div className="pb-10">
           <HeroSlider data={isfeatured.data as IBaseEvent[]} />
         </div>
        )}



        <Featured />
        <Services />

     
        <ErrorBoundary fallback={<NotFoundItem content="Categories could not be loaded!" emoji="📦" filter="category" />} >
   
   
          {!categories?.success || !categories.data ? (
            <NotFoundItem content="categories data not found" />
          ) : (
            <EventCategories
              categories={categories?.data as TResponseCategoryData[]}
            />
          )}
        </ErrorBoundary>
  
      
        <HighLightContent
          highlight={
            highlightResponse.data as TResponseHighlight<{ user: IBaseUser }>[]
          }
        />
        <Statics stats={getpublicstats.data as PublicStats} />

        <BlogsContent
          blogs={
            blogsResponse.data as TResponseBlog<{
              author: IBaseUser;
              event: IBaseEvent;
            }>[]
          }
        />
       <div className="px-4 md:px-8">
       <NewsLatter />
       </div>
        <FAQ />

        {!events || !eventsRes.success || !eventsRes.data ? (
          <NotFoundItem content="Upcoming Event Data Not found" emoji="⁴⁰⁴" />
        ) : (
          <UpcommingEvent
            events={
              events as (
                | TResponseEvent<{
                    reviews: IgetReviewData[];
                    organizer: IBaseUser[];
                  }>
                | null
              )[]
            }
          />
        )}
        <CallToAction role={role as string} />
      </div>
    );
  } catch (error: any) {
    // Error boundary catch block
  return (
    <ErrorBoundary
      fallback={
        <ErrorFallback
          message="Something went wrong while loading the Common Layout page."
          title="Error Loading Page"
          key="common-layout-error"
        />
      }
    >
      <ErrorFallback  />
    </ErrorBoundary>
  );
  }
}
