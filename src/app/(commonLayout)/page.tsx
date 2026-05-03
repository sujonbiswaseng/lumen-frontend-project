import { getSessionAction } from "@/actions/auth.actions";
import { fetchEvents, fetchPaidAndFreeEvents, getFeaturedEvent } from "@/actions/event.actions";
import CallToAction from "@/components/CallToAction";
import HeroSlider from "@/components/hero-slider";
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

function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div>
      <NotFoundItem content="Sorry, there was an error loading this page. Please try again later." emoji="💥" />
      {process.env.NODE_ENV === "development" && (
        <pre className="bg-destructive/20 text-xs text-red-700 p-4 rounded mt-4 whitespace-pre-wrap">{error.message}</pre>
      )}
    </div>
  );
}

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

    return (
      <div className="flex flex-col">
        {/* Error checked components */}
        {!isfeatured || !isfeatured.success || !isfeatured.data ? (
          <NotFoundItem content="hero section data not found" />
        ) : (
          <HeroSlider data={isfeatured.data as IBaseEvent[]} />
        )}

        <Featured />
        <Services />
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
        <NewsLatter />
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
    return <ErrorBoundary error={error instanceof Error ? error : new Error("Unknown error")} />;
  }
}
