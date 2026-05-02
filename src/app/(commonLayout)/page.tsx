import { getSessionAction } from "@/actions/auth.actions";
import { fetchEvents, fetchPaidAndFreeEvents, getFeaturedEvent } from "@/actions/event.actions";
import CallToAction from "@/components/CallToAction";
import EventsList from "@/components/Category";
import ErrorBoundary from "@/components/ErrorBoundary";
import ErrorFallback from "@/components/ErrorFallback";
import HeroSlider from "@/components/hero-slider";
import UpcommingEvent from "@/components/UpcommingEvent";
import NotFoundItem from "@/components/NotFoundItem";
import { IBaseEvent, TResponseEvent } from "@/types/event.types";
import { IBaseUser } from "@/types/user.types";
import { IgetReviewData } from "@/types/review.types";
import { getUserNotificationsAction } from "@/actions/notification";
import Featured from "@/components/module/home/Featured";
import Services from "@/components/module/home/Services";

export default async function Home() {
  const res = await getUserNotificationsAction();
  const userinfo = await getSessionAction();
  const role = userinfo.data?.role;
  const eventsRes = await fetchEvents();
  const events = eventsRes.data?.UPCOMING.filter((item) => (item.visibility == "PUBLIC") && item);

  let paidAndFreeEvents = await fetchPaidAndFreeEvents();
  let isfeatured = await getFeaturedEvent();
  if (!isfeatured.success || !isfeatured.data) {
    return (
      <div>
        <NotFoundItem content="Sorry, no featured event available at this time." />
      </div>
    );
  }

  console.log(isfeatured.data,'s')
  return (
    <div className="flex flex-col">
      {/* Removed sdfsdf */}
      {!isfeatured || !isfeatured.success || !isfeatured.data ? (
        <NotFoundItem content="hero section data not found" />
      ) : (
        <HeroSlider data={isfeatured.data as IBaseEvent[]} />
      )}
      <Featured/>
      <Services/>
     {!events || !eventsRes.success ||!eventsRes.data?<NotFoundItem content="Upcoming Event Data Not found" emoji="⁴⁰⁴"/>: <UpcommingEvent events={events as (TResponseEvent<{ reviews: IgetReviewData[]; organizer: IBaseUser[]; }> | null)[]} />}
      <CallToAction role={role as string} />
      <ErrorBoundary fallback={<ErrorFallback title="Failed to load events list." />}>
        {!paidAndFreeEvents || !paidAndFreeEvents.data || !paidAndFreeEvents.success ? (
          <ErrorBoundary
            fallback={
              <ErrorFallback title={paidAndFreeEvents?.message || "No events data returned from server."} />
            }
          >
            <NotFoundItem
              content="No Events Available"
              filter="Sorry, we couldn't find any upcoming events right now. Please check back later or explore other sections of our site."
              emoji="😔"
            />
          </ErrorBoundary>
        ) : (
          <EventsList events={paidAndFreeEvents.data} />
        )}
      </ErrorBoundary>
    </div>
  );
}
