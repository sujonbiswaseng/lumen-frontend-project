"use client";

import React, { useEffect, useState } from "react";
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
import { fetchEvents } from "@/actions/event.actions";
import BlogCardSkeleton from "@/components/Skeleton/BlogCardSkeleton";
import ImageSkeleton from "@/components/ImageSkeleton";

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
  console.log(eventData,'eventda')
  const [relatedItems,setrelatedItems]=useState<TResponseEvent<{organizer:any}>[]>()
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const router = useRouter();
  const images = eventData.images?.length ? eventData.images : ["/logo.png"];
  const [activeImage, setActiveImage] = useState(images[0]);
  const [isloading,setisloading]=useState(true)


  useEffect(()=>{

    const featchdata=async()=>{
      try {
        const eventsRes = await fetchEvents();
      const events = eventsRes.data?.UPCOMING.filter(
        (item) => item.category_name == eventData.category_name && item
      );
      if(!events){
        setisloading(true)
      }
      setisloading(false)
      setrelatedItems(events)
      } catch (error) {
        setisloading(true)
        
      }
      
  

    }
    featchdata()


  },[])
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
                  {eventData.category_name}
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

       {/* Blog list content */}
       <div className="w-full flex flex-wrap justify-center gap-6">
        {isloading ? (
          <div className="w-full max-w-[1440px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:
              grid-cols-4 xl:grid-cols-5 gap-8">
            {Array.from({ length: 5 }).map((_, idx) => (
              <BlogCardSkeleton
                key={idx}
                className="max-w-[400px] min-w-[320px] w-full"
                contentLines={4}
                minHeight="min-h-[370px]"
                showActions
                showAvatar
              />
            ))}
          </div>
        ) : (
          <AnimatePresence>

{relatedItems && relatedItems.length > 0 ? (
            <motion.div
              className="w-full max-w-[1440px] px-4 md:px-8 mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:
              grid-cols-4 xl:grid-cols-5 gap-8"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.10,
                  },
                },
              }}
            >
              {relatedItems.map((event) => (
                <motion.article
                  key={event.id}
                  className="
                    group relative flex flex-col bg-card border border-border rounded-2xl shadow transition-shadow
                    hover:shadow-lg focus-within:ring-2 focus-within:ring-primary/25
                    overflow-hidden max-w-[420px] min-w-[320px] w-full mx-auto
                  "
                  initial={{ opacity: 0, y: 36, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 24, scale: 0.97 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  whileHover={{ scale: 1.018 }}
                  tabIndex={0}
                  aria-label={`${event.title} - View blog`}
                >
                  {/* Blog image as a decorative top section */}
                  <div className="aspect-[16/9] w-full bg-muted border-b border-border overflow-hidden">
                    <motion.div
                      initial={{ opacity: 0, scale: 1.03 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.45, ease: "easeOut" }}
                      className="w-full h-full"
                    >
                      {event.images && event.images.length > 0 ? (
                        <ImageSkeleton
                          src={event.images[0]}
                          alt={event.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03] bg-muted"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full w-full bg-muted text-muted-foreground font-semibold text-lg select-none">
                          No Image
                        </div>
                      )}
                    </motion.div>
                    {/* Accent shadow/top underline effect */}
                    <span className="absolute top-0 left-0 w-full h-[3px] bg-accent block z-10 opacity-80" aria-hidden="true" />
                  </div>
                  {/* Card Content */}
                  <div className="flex flex-col flex-1 px-6 py-6 gap-4 bg-card">
                    {/* Title */}
                    <h3 className="font-bold text-lg md:text-xl text-card-foreground tracking-tight leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-300">
                      {event.title}
                    </h3>
                    {/* Excerpt */}
                    <p className="text-muted-foreground text-sm md:text-base line-clamp-3 min-h-[54px]">
                      {event.description}
                    </p>
                    {/* Author, Meta, Event */}
                    <div className="flex items-center justify-between gap-2 mt-2">
                      {/* Author */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center overflow-hidden shadow-sm">
                          {event.organizer?.image ? (
                           <Link href={`/profile/${event.organizer.id}`}>
                            <img
                              src={event.organizer.image}
                              alt={event.organizer.name}
                              className="w-full h-full object-cover"
                              width={40}
                              height={40}
                              loading="lazy"
                            />
                           </Link>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-base font-semibold text-muted-foreground select-none">
                              {event.organizer?.name?.[0] || "U"}
                            </div>
                          )}
                        </div>
                        <span className="truncate text-sm font-medium text-card-foreground">
                          {event.organizer?.name || "Unknown"}
                        </span>
                      </div>
                      {/* Meta -> date + event tag */}
                      <div className="flex flex-col items-end gap-1">
                        {/* Created At */}
                        {event.createdAt ? (
                          <span className="text-xs text-muted-foreground">
                            {new Date(event.createdAt).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        ) : null}
                        {event?.title && (
                          <span className="mt-1 inline-block bg-secondary text-secondary-foreground px-2 py-0.5 rounded font-semibold text-xs shadow-sm">
                            {event.title}
                          </span>
                        )}
                      </div>
                    </div>
                    {/* CTA Button */}
                    <div className="mt-6 flex">
                      <motion.button
                        className="
                          inline-flex items-center justify-center gap-1 px-5 py-2.5 rounded-lg
                          text-sm font-semibold
                          bg-primary text-primary-foreground ring-0 outline-none transition
                          shadow-sm hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary/50
                        "
                        onClick={() => { window.location.href = `/events/${event.id}`; }}
                        whileTap={{ scale: 0.97 }}
                        whileHover={{ scale: 1.04 }}
                        transition={{ type: "spring", stiffness: 280, damping: 22 }}
                        aria-label={`Read more about ${event.title}`}
                      >
                        View Details
                        <svg
                          className="ml-1 w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7l7 7-7 7" />
                        </svg>
                      </motion.button>
                    </div>
                  </div>
                  {/* Card outline/focus effect for accessibility */}
                  <span className="pointer-events-none absolute inset-0 ring-0 group-focus-visible:ring-2 group-focus-visible:ring-primary/40 rounded-2xl" />
                </motion.article>
              ))}
            </motion.div>
          ) : (
            <div className="w-full max-w-[1440px] mx-auto flex items-center justify-center py-16 bg-background">
              <span className="text-muted-foreground text-lg">No blogs found.</span>
            </div>
          )}
            
           
          </AnimatePresence>
        )}
      </div>
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
