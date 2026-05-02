"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Calendar, MapPin, Star } from "lucide-react";
import { toast } from "react-toastify";

import { TResponseEvent } from "@/types/event.types";
import { IBaseUser } from "@/types/user.types";
import { IgetReviewData } from "@/types/review.types";

import { createParticipant } from "@/actions/participant.actions";
import ReviewForm from "../reviews/CreateReview";
import ReviewItem from "../reviews/ReviewItem";
import { useRouter } from "next/navigation";
import { initiatePayLater } from "@/actions/payment.actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const gradientBg =
  "bg-gradient-to-br from-cyan-50 via-emerald-50 to-amber-50";
const sidebarCard =
  "shadow-xl border border-cyan-100 bg-white/95 backdrop-blur-sm";
const infoCard =
  "rounded-xl border border-cyan-100 shadow-sm bg-white";
const statLabel =
  "bg-linear-to-r from-cyan-700 to-teal-600 text-white px-2 py-1 rounded text-[11px] font-bold uppercase tracking-widest";

const EventDetailsPage = ({
  user,
  eventData,
}: {
  user:IBaseUser,
  eventData: TResponseEvent<{
    reviews: IgetReviewData[];
    organizer: IBaseUser;
  }>;
}) => {
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const router = useRouter();

  const handleAddParticipant = async (eventId: string) => {
    const toastId = toast.loading("Registering attendance...");
    try {
      const res = await createParticipant(eventId);
      toast.dismiss(toastId);
      if (res.success) {
        toast.success("You have been added as a participant!");
        if (res.data && res.data.paymentUrl) {
          router.push(res.data.paymentUrl);
        }
      } else {
        toast.error(res.message || "Failed to add participant.");
      }
    } catch (err) {
      toast.dismiss(toastId);
      toast.error("Failed to add participant.");
      console.error(err);
    }
  };

  const handlePayLater = async (eventId: string) => {
    const toastId = toast.loading("Processing Pay Later request...");
    try {
      const res = await initiatePayLater(eventId);
      toast.dismiss(toastId);
      if (res.success) {
        toast.success(res.message || "Redirecting to your payment page.");
        return
      } else {
        toast.error(res.message || "Pay Later could not be initiated.");
        return
      }
    } catch (err) {
      toast.dismiss(toastId);
      toast.error("Request failed for Pay Later.");
      console.error(err);
    }
  };

  const renderJoinButton = () => {
    if (eventData.visibility === "PUBLIC" && eventData.priceType === "FREE") {
      return (
        <Button
          className="bg-linear-to-r from-emerald-500 to-cyan-500 text-white shadow-lg hover:from-emerald-600 hover:to-cyan-600 px-6 py-2"
          onClick={() => handleAddParticipant(eventData.id)}
        >
          Join
        </Button>
      );
    } else if (
      eventData.visibility === "PUBLIC" &&
      eventData.priceType === "PAID"
    ) {
      return (
        <Button
          className="bg-linear-to-r from-amber-500 to-orange-500 text-white shadow-lg hover:from-amber-600 hover:to-orange-600 px-6 py-2"
          onClick={() => handleAddParticipant(eventData.id)}
        >
          Pay &amp; Join
        </Button>
      );
    } else if (
      eventData.visibility === "PRIVATE" &&
      eventData.priceType === "FREE"
    ) {
      return (
        <Button
          className="bg-linear-to-r from-cyan-500 to-sky-500 text-white shadow-lg hover:from-cyan-600 hover:to-sky-600 px-6 py-2"
          onClick={() => handleAddParticipant(eventData.id)}
        >
          Request to Join
        </Button>
      );
    } else {
     
      return (
        <Button
          className="bg-linear-to-r from-teal-600 to-emerald-600 text-white shadow-lg hover:from-teal-700 hover:to-emerald-700 px-6 py-2"
          onClick={() => handleAddParticipant(eventData.id)}
        >
          Pay &amp; Request
        </Button>
      );
    }
  };

  return (
    <div className={`min-h-screen mt-11 ${gradientBg}`}>
      {/* Decorative header */}
      <div className="absolute left-0 top-0 z-0 opacity-40 pointer-events-none w-full h-[260px] max-h-[28vh] bg-linear-to-b from-cyan-200/70 via-emerald-100/50 to-transparent"></div>
      <main className="relative z-10 max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* LEFT */}
          <div className="lg:col-span-8">
            {/* IMAGE */}
            <div className="relative rounded-2xl overflow-hidden mb-8 border border-slate-200 shadow-lg">
              {/* {eventData?.images ? (
                <Image
                  src={eventData.images}
                  alt={eventData.title}
                  width={1200}
                  priority
                  height={700}
                  className="w-full h-[260px] sm:h-[340px] md:h-[420px] object-cover transition-transform duration-500 hover:scale-[1.03]"
                />
              ) : (
                <div className="w-full h-[380px] flex items-center justify-center bg-linear-to-tr from-cyan-50 to-emerald-50 text-slate-500 font-bold text-xl">
                  No Image Available
                </div>
              )} */}
              <div className="absolute top-2 left-2">
                <span className="px-3 py-1 rounded-full bg-linear-to-r from-cyan-700 to-teal-600 text-white text-xs font-bold shadow">
                  {eventData.status}
                </span>
              </div>
            </div>
            {/* TITLE & DESCRIPTION */}
            {eventData?.organizer?.image && (
              <div className="flex items-center gap-3 mb-4">
                <Link href={`/profile/${eventData.organizer.id}`}>
                <Image
                  src={eventData.organizer.image}
                  alt={eventData.organizer.name || "Organizer Profile"}
                  width={46}
                  height={46}
                  className="rounded-full object-cover border shadow"
                /></Link>
                <div>
                  <span className="font-semibold text-slate-800">
                    {eventData.organizer.name || "Event Organizer"}
                  </span>
                  {eventData.organizer.email && (
                    <p className="text-xs text-slate-500">
                      {eventData.organizer.email}
                    </p>
                  )}
                </div>
              </div>
            )}
      
            <div className="mb-6 bg-white rounded-xl px-5 sm:px-7 py-6 sm:py-8 shadow-sm border border-slate-200">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-slate-900">
                {eventData.title}
              </h1>
              <p className="text-sm sm:text-base text-slate-700 max-w-2xl mt-3">
                {eventData.description}
              </p>
            </div>
            {/* RATING */}
            <div className="flex items-center gap-4 mb-7">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={
                      i < eventData.avgRating
                        ? "text-yellow-400 drop-shadow-md"
                        : "text-gray-200"
                    }
                    fill={i < eventData.avgRating ? "currentColor" : "none"}
                  />
                ))}
              </div>
              <span className="text-xs px-3 py-1 rounded bg-slate-100 text-slate-700 shadow-sm">
                ({eventData.totalReviews} Reviews)
              </span>
            </div>
            {/* INFO */}
            <div className="grid md:grid-cols-2 gap-5">
              <div className={`${infoCard} p-5 flex gap-5 items-center`}>
                <span className="rounded-full bg-linear-to-br from-cyan-500 to-teal-500 p-3 shadow text-white">
                  <Calendar size={28} />
                </span>
                <div>
                  <p className={statLabel}>Date</p>
                  <p className="text-base font-medium text-slate-700 mt-2">
                    {eventData.time}
                  </p>
                </div>
              </div>
              <div className={`${infoCard} p-5 flex gap-5 items-center`}>
                <span className="rounded-full bg-linear-to-br from-emerald-500 to-cyan-500 p-3 shadow text-white">
                  <MapPin size={28} />
                </span>
                <div>
                  <p className={statLabel}>Location</p>
                  <p className="text-base font-medium text-slate-700 mt-2">
                    {/* {eventData.venue} */}
                  </p>
                </div>
              </div>
            </div>
            {/* REVIEWS */}
            <div className="mt-10 space-y-6">
              <h2 className="text-xl font-semibold mb-3 text-slate-900">
                Reviews
              </h2>
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-3 sm:p-4 max-h-[70vh] overflow-auto overscroll-contain [scrollbar-width:thin]">
                {eventData.reviews?.length > 0 ? (
                  <div className="space-y-3 min-w-max">
                    {eventData.reviews.map((review: IgetReviewData) => (
                      <div
                        key={review.id}
                        className="rounded-xl border border-slate-200 bg-white px-3 sm:px-5 py-4 min-w-[640px] max-h-[420px] overflow-auto"
                      >
                        <ReviewItem
                          user={user}
                          review={{
                            ...review,
                            user: (review as any).user ?? eventData.organizer,
                            event: eventData,
                          }}
                          event={eventData}
                          activeReplyId={activeReplyId}
                          setActiveReplyId={setActiveReplyId}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-600 bg-cyan-50 px-5 py-3 rounded">
                    No reviews yet. Be the first to review!
                  </p>
                )}
              </div>
              {/* Add new review */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 shadow-sm px-4 sm:px-5 py-3">
                <ReviewForm eventId={eventData.id} />
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <div className={`${sidebarCard} rounded-2xl p-5 sm:p-7`}>
                <div className="mb-6 flex justify-between flex-wrap items-center gap-4">
                  <div>
                    <p className={statLabel}>Price</p>
                    <h3 className="text-3xl font-extrabold text-slate-900">
                      {eventData.fee === 0 ? "Free" : `$${eventData.fee}`}
                    </h3>
                  </div>
                  <div>
                    <p className={statLabel}>Visibility</p>
                    <span
                      className={`text-base sm:text-lg font-bold px-4 py-1 rounded-full shadow-sm ${
                        eventData.visibility === "PUBLIC"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {eventData.visibility}
                    </span>
                  </div>
                </div>
                <div className="space-y-3 text-sm text-slate-700 mb-5">
                  <span className="inline-block mr-1 bg-amber-100 text-amber-800 rounded-full px-3 py-1 font-semibold text-xs shadow">
                    Category
                  </span>{" "}
                  {eventData.categories}
                  <br />
                  <span className="inline-block mr-1 bg-cyan-100 text-cyan-800 rounded-full px-3 py-1 font-semibold text-xs shadow">
                    Status
                  </span>{" "}
                  {eventData.status}
                  <br />
                  <span className="inline-block mr-1 bg-emerald-100 text-emerald-800 rounded-full px-3 py-1 font-semibold text-xs shadow">
                    Price Type
                  </span>{" "}
                  {eventData.priceType}
                </div>
                <div className="flex justify-between flex-wrap gap-3 mt-7">
                  <div>{renderJoinButton()}</div>
                  <div>
                    {eventData.priceType === "PAID" && (
                      <Button
                        className="bg-linear-to-r from-amber-500 to-cyan-600 text-white shadow-lg hover:from-amber-600 hover:to-cyan-700 px-4 py-2"
                        onClick={() => handlePayLater(eventData.id)}
                      >
                        Pay Later &amp; {eventData.visibility === "PRIVATE" ? "Request" : "Join"}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="max-w-[1480px] mx-auto px-7 py-8 border-t mt-10 text-center text-xs text-slate-500 bg-white">
        Event Created:{" "}
        <span className="text-slate-800 font-bold">
          {new Date(eventData.createdAt).toLocaleDateString()}
        </span>
      </footer>
    </div>
  );
};

export default EventDetailsPage;