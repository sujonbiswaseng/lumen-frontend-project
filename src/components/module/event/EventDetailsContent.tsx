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
import { AnimatePresence, motion } from "framer-motion";

// Responsive shadow and border classes strictly using theme variables
const cardClass =
  "bg-card border border-border rounded-2xl shadow-lg";
const sidebarCardClass =
  "bg-card border border-border rounded-2xl shadow-lg";
const infoCardClass =
  "bg-card border border-border rounded-xl shadow-sm";
const badgeLabel =
  "bg-secondary text-secondary-foreground px-2 py-1 rounded text-[11px] font-bold uppercase tracking-widest";

const EventDetailsPage = ({
  user,
  eventData,
}: {
  user: IBaseUser;
  eventData: TResponseEvent<{
    reviews: IgetReviewData[];
    organizer: IBaseUser;
  }>;
}) => {
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const router = useRouter();
  const images = eventData.images?.length ? eventData.images : ["/logo.png"];
  const [activeImage, setActiveImage] = useState(images[0]);

  // Button Handler Logic
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
        return;
      } else {
        toast.error(res.message || "Pay Later could not be initiated.");
        return;
      }
    } catch (err) {
      toast.dismiss(toastId);
      toast.error("Request failed for Pay Later.");
      console.error(err);
    }
  };

  // Scalable join button logic using theme button variants
  const renderJoinButton = () => {
    if (eventData.visibility === "PUBLIC" && eventData.priceType === "FREE") {
      return (
        <Button
          className="min-w-[120px]"
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
          className="min-w-[140px]"
          onClick={() => handleAddParticipant(eventData.id)}
        >
          Pay&nbsp;&amp;&nbsp;Join
        </Button>
      );
    } else if (
      eventData.visibility === "PRIVATE" &&
      eventData.priceType === "FREE"
    ) {
      return (
        <Button
          variant="secondary"
          className="min-w-[140px]"
          onClick={() => handleAddParticipant(eventData.id)}
        >
          Request to Join
        </Button>
      );
    } else {
      return (
        <Button
          variant="secondary"
          className="min-w-[180px]"
          onClick={() => handleAddParticipant(eventData.id)}
        >
          Pay&nbsp;&amp;&nbsp;Request
        </Button>
      );
    }
  };

  // Framer Motion Animations
  const fadeInMotionProps = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 24 },
    transition: { duration: 0.3, ease: "easeOut", type: "spring" as const },
  };

  return (
    <div className="bg-background min-h-screen w-full pt-8">
      <main className="relative z-10 max-w-[1440px] mx-auto w-full px-4 md:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* MAIN IMAGE CARD */}
            <motion.section
              className={`${cardClass} relative overflow-hidden`}
            >
              {/* Image Gallery */}
              <div className="flex flex-col gap-6 border-b border-border bg-card p-4 sm:p-6">
                {/* Main Image */}
                <div className="relative flex items-center min-h-[15rem] overflow-hidden rounded-2xl border border-border bg-muted aspect-[3/2]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeImage}
                      className="w-full h-full relative"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      <Image
                        src={activeImage}
                        alt={eventData.title}
                        width={1200}
                        height={600}
                        priority
                        className="object-cover w-full h-full transition-transform duration-300 hover:scale-[1.025]"
                        sizes="(min-width: 1024px) 800px, 100vw"
                      />
                    </motion.div>
                  </AnimatePresence>
                  {/* Event status badge */}
                  <div className="absolute top-4 left-4 px-4 py-1 rounded-full border border-border bg-background/85 backdrop-blur-sm">
                    <span className="text-xs font-semibold uppercase tracking-wide text-foreground">
                      {eventData.status}
                    </span>
                  </div>
                  {/* Gallery "Featured" badge (optional, can be dynamic) */}
                  <div className="absolute left-4 bottom-4 px-4 py-1 rounded-full border border-border bg-card/80 backdrop-blur-sm">
                    <span className="text-xs font-semibold uppercase tracking-wide text-card-foreground">
                      Featured
                    </span>
                  </div>
                </div>
                {/* Thumbnails */}
                <div className="flex flex-wrap gap-4 mt-2 w-full">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImage(img)}
                      aria-label={`Show image ${idx + 1}`}
                      className={[
                        "group relative h-12 w-16 rounded-xl border flex items-center justify-center overflow-hidden transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary",
                        img === activeImage
                          ? "border-primary ring-2 ring-primary"
                          : "border-border hover:border-primary hover:shadow-md",
                      ].join(" ")}
                      tabIndex={0}
                    >
                      <Image
                        src={img}
                        alt={`Preview ${idx + 1}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="64px"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </motion.section>

            {/* ORGANIZER INFO */}
            {eventData?.organizer?.image && (
              <motion.div
           
                className="flex items-center gap-3"
              >
                <Link
                  href={`/profile/${eventData.organizer.id}`}
                  className="focus-visible:outline-primary"
                >
                  <Image
                    src={eventData.organizer.image}
                    alt={eventData.organizer.name || "Organizer Profile"}
                    width={48}
                    height={48}
                    className="rounded-full object-cover border border-border shadow"
                  />
                </Link>
                <div>
                  <div className="font-semibold text-foreground">
                    {eventData.organizer.name || "Event Organizer"}
                  </div>
                  {eventData.organizer.email && (
                    <p className="text-xs text-muted-foreground break-all">
                      {eventData.organizer.email}
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {/* TITLE & DESCRIPTION */}
            <motion.section
          
              className={`${cardClass} px-5 sm:px-7 py-6 sm:py-8`}
            >
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2 text-foreground leading-snug">
                {eventData.title}
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed mt-3">
                {eventData.description}
              </p>
            </motion.section>

            {/* STAR RATING */}
            <motion.div  className="flex items-center gap-4">
              <div className="flex" aria-label={`Rating: ${eventData.avgRating}`}>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={22}
                    className={
                      i < eventData.avgRating
                        ? "text-primary drop-shadow"
                        : "text-border"
                    }
                    fill={i < eventData.avgRating ? "currentColor" : "none"}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <span className="text-xs px-3 py-1 rounded bg-muted text-muted-foreground font-medium">
                ({eventData.totalReviews} Reviews)
              </span>
            </motion.div>

            {/* INFO CARDS */}
            <motion.div className="grid md:grid-cols-2 gap-6">
              {/* Date */}
              <div className={`${infoCardClass} p-5 flex items-center gap-5`}>
                <span className="rounded-full bg-secondary text-secondary-foreground p-3 shadow">
                  <Calendar size={28} />
                </span>
                <div>
                  <p className={badgeLabel}>Date</p>
                  <p className="text-base font-medium text-foreground mt-2">
                    {eventData.time}
                  </p>
                </div>
              </div>
              {/* Location */}
              <div className={`${infoCardClass} p-5 flex items-center gap-5`}>
                <span className="rounded-full bg-secondary text-secondary-foreground p-3 shadow">
                  <MapPin size={28} />
                </span>
                <div>
                  <p className={badgeLabel}>Location</p>
                  <p className="text-base font-medium text-foreground mt-2">
                    {/* {eventData.venue} */}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* REVIEWS */}
            <motion.section  className="mt-4 md:mt-10 space-y-6">
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Reviews
              </h2>
              <div className="rounded-2xl border border-border bg-card shadow-sm p-3 sm:p-4 max-h-[70vh] overflow-auto overscroll-contain [scrollbar-width:thin]">
                {eventData.reviews?.length > 0 ? (
                  <div className="space-y-4 min-w-[280px]">
                    {eventData.reviews.map((review: IgetReviewData) => (
                      <div
                        key={review.id}
                        className="rounded-xl border border-border bg-card px-3 sm:px-5 py-4 min-w-[320px] max-h-[420px] overflow-auto"
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
                  <p className="text-sm text-muted-foreground bg-muted px-4 py-3 rounded">
                    No reviews yet. Be the first to review!
                  </p>
                )}
              </div>
              {/* Add new review */}
              <div className="rounded-xl border border-border bg-muted shadow-sm px-4 sm:px-5 py-3">
                <ReviewForm eventId={eventData.id} />
              </div>
            </motion.section>
          </div>

          {/* SIDEBAR */}
          <div className="lg:col-span-4">
            <motion.aside  className="sticky top-20">
              <div className={`${sidebarCardClass} p-5 sm:p-7 flex flex-col gap-7`}>
                {/* Price and Visibility */}
                <div className="flex justify-between flex-wrap items-center gap-4">
                  <div>
                    <p className={badgeLabel}>Price</p>
                    <h3 className="text-3xl font-extrabold text-foreground mt-1">
                      {eventData.fee === 0 ? "Free" : `$${eventData.fee}`}
                    </h3>
                  </div>
                  <div>
                    <p className={badgeLabel}>Visibility</p>
                    <span
                      className={`text-sm sm:text-base font-bold px-4 py-1 rounded-full bg-muted text-muted-foreground`}
                    >
                      {eventData.visibility}
                    </span>
                  </div>
                </div>
                {/* Details Section */}
                <div className="space-y-3 text-sm text-muted-foreground mb-1">
                  <span className="inline-block mr-1 bg-secondary text-secondary-foreground rounded-full px-3 py-1 font-semibold text-xs">
                    Category
                  </span>
                  {eventData.categories}
                  <br />
                  <span className="inline-block mr-1 bg-secondary text-secondary-foreground rounded-full px-3 py-1 font-semibold text-xs">
                    Status
                  </span>
                  {eventData.status}
                  <br />
                  <span className="inline-block mr-1 bg-secondary text-secondary-foreground rounded-full px-3 py-1 font-semibold text-xs">
                    Price Type
                  </span>
                  {eventData.priceType}
                </div>
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-2">
                  {renderJoinButton()}
                  {eventData.priceType === "PAID" && (
                    <Button
                      variant="ghost"
                      onClick={() => handlePayLater(eventData.id)}
                      className="w-full sm:w-auto"
                    >
                      Pay Later&nbsp;&amp;&nbsp;
                      {eventData.visibility === "PRIVATE" ? "Request" : "Join"}
                    </Button>
                  )}
                </div>
              </div>
            </motion.aside>
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className="max-w-[1440px] mx-auto w-full px-4 md:px-8 py-6 border-t border-border mt-12 text-center text-xs bg-card text-muted-foreground">
        Event Created:&nbsp;
        <span className="text-foreground font-bold">
          {new Date(eventData.createdAt).toLocaleDateString()}
        </span>
      </footer>
    </div>
  );
};

export default EventDetailsPage;
