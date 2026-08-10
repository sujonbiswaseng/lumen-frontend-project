"use client";

import ImageSkeleton from "@/components/ImageSkeleton";
import { Calendar, Clock1, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import { TResponseEvent } from "@/types/event.types";

export type EventCategoryCardProps = TResponseEvent;

export default function EventCategoryCard({
  id,
  title,
  description,
  priceType,
  visibility,
  date,
  time,
  location,
  images,
  fee,
  category_name,
  is_featured,
}: EventCategoryCardProps) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  // API থেকে যদি [url](url) format আসে তাহলে শুধু actual URL নেওয়া হবে
  const getImageUrl = (image: string) => {
    const match = image.match(/^\[(.*?)\]\((.*?)\)$/);

    return match ? match[2] : image;
  };

  const eventImage = images?.[0] ? getImageUrl(images[0]) : null;

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
      {eventImage ? (
        <div className="relative w-full h-56 sm:h-auto md:h-56 overflow-hidden">
          <Image
            src={eventImage}
            alt={title || "Event image"}
            fill
            loading="lazy"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          />


          <div className="absolute bottom-3 left-3 bg-background/90 backdrop-blur-sm text-foreground text-xs font-semibold px-2 py-1 rounded-md">
            {formattedDate}
          </div>

          {is_featured && (
            <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded-md">
              Featured
            </div>
          )}
        </div>
      ) : (
        <div className="relative w-full h-56 sm:h-auto md:h-56 flex items-center justify-center bg-muted text-muted-foreground">
          No Image

          <div className="absolute bottom-3 left-3 bg-background/90 backdrop-blur-sm text-foreground text-xs font-semibold px-2 py-1 rounded-md">
            {formattedDate}
          </div>

          {is_featured && (
            <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded-md">
              Featured
            </div>
          )}
        </div>
      )}

      {/* CONTENT */}
      <div className="flex flex-col flex-1 p-4 md:px-6 md:py-6 gap-4">
        {/* Title and Description */}
        <div>
          <h3 className="text-lg md:text-xl font-extrabold text-card-foreground tracking-tight leading-snug break-words line-clamp-2 mb-1">
            {title.length > 56 ? title.slice(0, 56) + "…" : title}
          </h3>

          <p className="text-sm md:text-base text-muted-foreground font-normal leading-snug mb-0 line-clamp-2 md:line-clamp-3">
            {description.length > 74
              ? description.slice(0, 74) + "…"
              : description}
          </p>
        </div>

        {/* Categories */}
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
            <span className="truncate max-w-[10ch] sm:max-w-[19ch] md:max-w-[32ch]">
              {location}
            </span>
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

