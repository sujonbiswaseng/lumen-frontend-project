"use client";

import ImageSkeleton from "@/components/ImageSkeleton";
import { Calendar, Clock1, MapPin, Star } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import { TResponseEvent } from "@/types/event.types";
import { IBaseUser } from "@/types/user.types";

export type EventCardProps = TResponseEvent<{ reviews: any[],organizer:IBaseUser }>;

export default function EventCard({
  id,
  title,
  description,
  priceType,
  visibility,
  organizer,
  date,
  time,
  location,
  images,
  fee,
  avgRating,
  totalReviews,
  category_name,
  images: profile,
  is_featured,
}: EventCardProps) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="whileHover"
      className="group flex flex-col sm:flex-row md:flex-col rounded-2xl overflow-hidden border border-border bg-card shadow transition focus-within:ring-2 ring-primary/40 duration-300 max-w-full"
      style={{
        width: "100%",
        maxWidth: "100%",
      }}
    >
      {/* IMAGE */}
      <div className="relative w-full h-44 sm:w-1/4 sm:h-auto md:w-full md:h-52 flex-shrink-0 bg-muted">
        {images && images[0] ? (
          <ImageSkeleton src={images[0]} alt={title} />
        ) : (
          <div className="flex items-center justify-center h-full w-full bg-muted">
            <span className="text-sm text-muted-foreground">No Image</span>
          </div>
        )}
        <div className="absolute top-3 left-3 rounded px-2 py-1 bg-card/80 text-xs font-semibold text-card-foreground shadow backdrop-blur border border-border">
          {formattedDate}
        </div>
        {is_featured && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded px-2 py-1 bg-secondary font-bold text-secondary-foreground text-xs shadow border border-border">
            <Star className="w-3.5 h-3.5 fill-accent text-accent" />
            <span>Featured</span>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="flex flex-col flex-1 p-4 md:px-6 md:py-6 gap-4">
        {/* Organizer profiles */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 min-h-7">
            <Link
              href={`/profile/${organizer.id}`}
              className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full"
            >
              <Image
                height={28}
                width={28}
                src={organizer.image|| ""}
                loading="lazy"
                alt={organizer.name || "Organizer"}
                className="w-7 h-7 rounded-full object-cover border-2 border-background shadow-sm"
              />
            </Link>
            {Array.isArray(profile) && profile.length > 5 && (
              <span className="text-xs font-semibold whitespace-nowrap bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded border border-border">
                +{profile.length - 5}
              </span>
            )}
            
          </div>
          {organizer?.name && (
            <span className="text-xs text-muted-foreground leading-tight max-w-[85%] truncate">
              {organizer.name.length > 22 ? `${organizer.name.slice(0, 19)}...` : organizer.name}
            </span>
          )}
        </div>

        {/* Title and Description */}
        <div>
          <h3 className="text-lg md:text-xl font-extrabold text-card-foreground tracking-tight leading-snug break-words line-clamp-2 mb-1">
            {title.length > 56 ? title.slice(0, 56) + "…" : title}
          </h3>
          <p className="text-sm md:text-base text-muted-foreground font-normal leading-snug mb-0 line-clamp-2 md:line-clamp-3">
            {description.length > 74 ? description.slice(0, 74) + "…" : description}
          </p>
        </div>

        {/* Categories, Ratings, Meta */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center justify-between gap-y-1 gap-x-4 mt-1">
          <div className="flex flex-wrap gap-2">
            {category_name &&
              category_name.split(",").map((cat: string) => (
                <span
                  key={cat.trim()}
                  className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded font-medium border border-border"
                >
                  {cat.trim()}
                </span>
              ))}
          </div>
          <div className="flex items-center gap-1 text-accent font-semibold mt-0.5">
            <Star size={15} className="fill-accent text-accent" />
            <span>{typeof avgRating === "number" ? avgRating.toFixed(1) : "0.0"}</span>
            <span className="text-muted-foreground">({totalReviews ?? 0})</span>
          </div>
        </div>

        {/* Event details */}
        <div className="flex flex-wrap gap-3 items-center text-xs text-muted-foreground mt-1">
          <div className="flex items-center gap-1 shrink-0">
            <Calendar size={14} className="text-muted-foreground" />
            <span>{date.slice(0, 7)}</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Clock1 size={14} className="text-muted-foreground" />
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <MapPin size={14} className="text-muted-foreground" />
            <span className="truncate max-w-[10ch] sm:max-w-[19ch] md:max-w-[32ch]">{location}</span>
          </div>
        </div>

        {/* Meta details */}
        <div className="flex flex-wrap gap-4 items-center text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <span className="font-semibold">Price:</span>
            <span>{priceType}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-semibold">Visibility:</span>
            <span>{visibility}</span>
          </div>
        </div>

        {/* Footer: Fee and Button */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-border mt-2">
          <span className="text-lg md:text-xl font-bold text-primary tracking-tight">
            {fee === 0 ? "Free" : fee != null ? `$${fee}` : "-"}
          </span>
          <Link
            href={`/events/${id}`}
            className="inline-block text-center px-5 py-1.5 rounded-md font-semibold text-sm bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 transition duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary w-full sm:w-auto"
            tabIndex={0}
            aria-label="View event details"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
}