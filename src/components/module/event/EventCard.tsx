"use client";

import ImageSkeleton from "@/components/ImageSkeleton";
import { Calendar, Clock1, MapPin, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
export default function EventCard({
  id,
  title,
  description,
  priceType,
  status,
  visibility,
  organizer,
  date,
  time,
  venue,
  images,
  fee,
  avgRating,
  totalReviews,
  categories,
  image: profile,
  name,
  is_featured,
}: any) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="group rounded-xl overflow-hidden border bg-white dark:bg-gray-900 shadow-sm hover:shadow-lg transition duration-200 flex flex-col sm:flex-row md:flex-col">

      {/* IMAGE */}
      <div className="relative w-full h-40 sm:w-1/4 sm:h-auto md:w-full md:h-44 flex-shrink-0">
        {images ? (
          <ImageSkeleton src={images[0]} alt={title} />
        ) : (
          <div className="flex items-center justify-center h-full w-full bg-gray-200 dark:bg-gray-800">
            <span className="text-sm text-gray-500">No Image</span>
          </div>
        )}

        <div className="absolute top-2 left-2 bg-white/95 text-xs px-2 py-1 rounded font-semibold shadow backdrop-blur">
          {formattedDate}
        </div>

        {is_featured && (
          <div className="absolute bottom-2 right-2 bg-yellow-400 text-xs px-2 py-1 rounded font-bold flex items-center gap-1 shadow">
            <Star className="w-3.5 h-3.5 fill-yellow-700" />
            <span>Featured</span>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="flex flex-col flex-1 p-3 md:px-4 md:py-4 space-y-2 md:space-y-3">

        {/* Organizer profiles */}
        <div className="flex flex-col gap-2">
          <div className="flex -space-x-3 items-center mb-1">
             <Link href={`/profile/${organizer.id}`}>
             <Image
                height={24}
                width={24}
                src={organizer.image}
                loading="lazy"
                alt="Organizer"
                className="w-6 h-6 rounded-full object-cover border border-white dark:border-gray-800 shadow"
                
              />
             </Link>
            {Array.isArray(profile) && profile.length > 5 && (
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-300 font-semibold whitespace-nowrap bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded">
                +{profile.length - 5}
              </span>
            )}
            {name && (
              <span className="ml-2 text-xs font-semibold text-gray-700 dark:text-gray-300">{name}</span>
            )}
          </div>
          {organizer?.name && (
            <span className="text-xs leading-tight text-gray-600 dark:text-gray-400">
              {organizer.name.slice(0,18)}...
            </span>
          )}
        </div>

        {/* Title and Description */}
        <div>
          <h3 className="text-base md:text-lg font-extrabold text-gray-900 dark:text-white mb-0.5 tracking-tight leading-snug break-words line-clamp-2">
            {title.slice(0, 36)}...
          </h3>
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 leading-snug mb-1 md:mb-1 line-clamp-2 md:line-clamp-3">
            {description.slice(0, 46)}...
          </p>
        </div>

        {/* Categories, Ratings, Meta */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-y-1 gap-x-4 items-start sm:items-center justify-between mt-1">
          <div className="flex flex-wrap gap-1">
            {categories && categories.split(",").map((cat: string) => (
              <span
                key={cat.trim()}
                className="text-xs bg-blue-100 dark:bg-gray-800 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded font-medium"
              >
                {cat.trim()}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-1 text-yellow-500 font-semibold mt-0.5">
            <Star size={14} className="fill-yellow-500" />
            <span>{avgRating?.toFixed(1) ?? "0.0"}</span>
            <span className="text-gray-400 dark:text-gray-400">({totalReviews ?? 0})</span>
          </div>
        </div>

        {/* Event details */}
        <div className="flex flex-wrap gap-2 items-center text-xs text-gray-500 dark:text-gray-300 mt-1">
          <div className="flex items-center gap-1 shrink-0">
            <Calendar size={13} />
            <span className="">{date.slice(0, 7)}</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Clock1 size={13} />
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <MapPin size={13} />
            <span className="truncate max-w-[9ch] sm:max-w-[13ch] md:max-w-[20ch]">{venue}</span>
          </div>
        </div>

        {/* Meta details */}
        <div className="flex flex-wrap gap-2 items-center text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-0.5">
            <span className="font-semibold">Price:</span>
            <span>{priceType}</span>
          </div>
          <div className="flex items-center gap-0.5">
            <span className="font-semibold">Visibility:</span>
            <span>{visibility}</span>
          </div>
        </div>

        {/* Footer: Fee and Button */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-1 border-t border-gray-100 dark:border-gray-800 mt-1">
          <span className="text-base md:text-lg font-bold text-blue-600 dark:text-blue-400 tracking-tight">
            {fee === 0 ? "Free" : fee != null ? `$${fee}` : "-"}
          </span>
          <Link
            href={`/events/${id}`}
            className="inline-block text-center text-sm font-semibold bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700 focus:outline-none transition shadow-sm w-full sm:w-auto"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}