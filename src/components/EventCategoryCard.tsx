"use client";
import { IBaseEvent } from "@/types/event.types";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Util: cap long words, fallbacks
const truncate = (text: string, n = 80) => {
  if (!text) return "";
  return text.length > n ? text.slice(0, n) + "…" : text;
};

interface EventCategoryCardProps {
  event: IBaseEvent;
}

const badgeColors: Record<string, string> = {
  ONGOING: "bg-green-100 text-green-700",
  UPCOMING: "bg-blue-50 text-blue-700",
  COMPLETED: "bg-gray-100 text-gray-600",
  CANCELLED: "bg-red-100 text-red-700",
};

const EventCategoryCard: React.FC<EventCategoryCardProps> = ({ event }) => {
  const formattedDate = new Date(event.date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const priceTypeLabel =
    event.priceType === "FREE"
      ? "Free"
      : typeof event.fee === "number" && event.fee > 0
      ? `Paid • $${event.fee}`
      : "Paid";

  const eventType =
    event.category_name && typeof event.category_name === "string"
      ? event.category_name
      : event.status;

  // professional backdrop gradient for header
  const headerBg =
    "bg-gradient-to-tr from-blue-500/80 via-sky-400/60 to-indigo-400/70";

  return (
    <article className="relative flex flex-col rounded-3xl shadow-lg border border-gray-200 overflow-hidden bg-white transition-all hover:shadow-blue-300 hover:-translate-y-0.5 group focus-within:shadow-blue-400 focus-within:ring-2 focus-within:ring-blue-300 duration-300 min-h-[335px]">      
      {/* Ribbon/Badge absolute */}
      {event.is_featured && (
        <span className="absolute left-4 top-2 z-20 bg-gradient-to-tr from-blue-700 to-indigo-500 text-white px-3 py-[4px] font-bold rounded-full text-xs shadow-md tracking-wider flex items-center gap-1 uppercase">
          <svg className="w-3 h-3 -ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 20 20"><path strokeLinecap="round" strokeLinejoin="round" d="M5.05 4.05L4 10l4 4 4-4-1.05-5.95M4 10h12" /></svg>
          Featured
        </span>
      )}
      {/* Event Banner Image */}
      <div
        className={`relative w-full h-32 sm:h-40 flex items-center justify-center ${headerBg} overflow-hidden`}
      >
        {event.images ? (
          <img
            src={event.images[0]}
            alt={event.title}
            loading="lazy"
            className="object-cover object-center absolute-inset w-full h-full transition-transform group-hover:scale-103 duration-300"
            style={{
              borderTopLeftRadius: "1.5rem",
              borderTopRightRadius: "1.5rem",
              filter: "brightness(0.94) saturate(1.1)",
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full text-slate-300">
            <svg width={44} height={44} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 48 48">
              <rect x="4" y="10" width="40" height="28" rx="4" fill="currentColor" opacity={0.13} />
              <circle cx="36" cy="18" r="3" fill="#94a3b8" />
              <path d="M4 31l11-11.5a4 4 0 0 1 5.7 0L32 31" stroke="#64748b" strokeWidth={2} />
              <rect x="4" y="10" width="40" height="28" rx="4" stroke="#94a3b8" strokeWidth={2} />
            </svg>
            <span className="text-base font-bold mt-1">No Image</span>
          </div>
        )}
        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/20" />
      </div>

      {/* Card Content */}
      <section className="flex flex-col flex-1 p-3 gap-2 z-10">
        {/* Title and Meta */}
        <header>
          <h3 className="text-lg font-extrabold text-gray-800 mb-0.5 group-hover:text-blue-700 transition-colors truncate">{event.title}</h3>
          <div className="flex flex-wrap gap-x-1 gap-y-0.5 items-center text-[11px] md:text-xs mb-1">
            <span className={`px-2 py-[1px] rounded-full font-bold uppercase tracking-wider ring-1 ring-gray-200 transition ${badgeColors[event.status] || "bg-gray-50 text-gray-600"}`}>
              {event.status}
            </span>
            <span className="flex items-center gap-0.5 bg-white border border-yellow-100 px-1.5 py-[1px] rounded-full font-semibold text-yellow-600 shadow-sm">
              <svg width="13" height="13" className="text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 15.27L16.18 18l-1.64-7.03L19 7.245l-7.19-.61L10 0 8.19 6.635 1 7.245l5.46 3.725L4.82 18z"></path></svg>
              <span>{parseFloat(event.avgRating?.toFixed(1) || "0").toFixed(1)}</span>
              <span className="text-slate-600 ml-1">({event.totalReviews ?? 0})</span>
            </span>
            <span className="inline-block px-1.5 ml-2 py-[1px] rounded font-semibold bg-slate-50 text-slate-400">
              by {truncate(event.organizerId || "", 22)}
            </span>
          </div>
        </header>
        {/* Description */}
        <p className="text-gray-600 text-xs leading-snug max-h-[40px] line-clamp-2 mb-0.5">
          {truncate(event.description || "", 70)}
        </p>

        {/* Info Line: Date, Time, Venue */}
        <div className="flex flex-wrap md:flex-nowrap justify-between items-center gap-1 text-xs font-medium text-gray-500 mt-1">
          <span className="flex items-center gap-1">
            <svg width="13" height="13" fill="none" className="text-blue-500" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="1.6" d="M8 2v2m8-2v2M3.5 8h17M7 12h5m-8.5 8.5V8a2.5 2.5 0 0 1 2.5-2.5h11A2.5 2.5 0 0 1 20.5 8v12a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 3.5 20z"></path></svg>
            {formattedDate}
          </span>
          <span className="flex items-center gap-1">
            <svg width="13" height="13" fill="none" className="text-indigo-500" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6"/><path stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" d="M12 7v5l3 2"></path></svg>
            {event.time}
          </span>
          <span className="flex items-center gap-1">
            <svg width="13" height="13" fill="none" className="text-emerald-500" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="1.6" d="M21 10.5C21 18 12 21 12 21S3 18 3 10.5A9 9 0 0 1 12 3a9 9 0 0 1 9 7.5z"/><circle cx="12" cy="10.5" r="2.5" stroke="currentColor" strokeWidth="1.6"/></svg>
            {truncate(event.location || "TBA", 20)}
          </span>
        </div>

        {/* Category + Pricing Type */}
        <div className="flex flex-wrap gap-1 items-center mt-2">
          <span className="inline-block bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
            {eventType}
          </span>
          <span
            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold shadow-sm ${
              event.priceType === "FREE"
                ? "bg-green-100 text-green-800"
                : "bg-amber-200 text-yellow-900"
            }`}
          >
            {priceTypeLabel}
          </span>
        </div>

        {/* CTA Buttons (professional styling, accent) */}
        <div className="flex flex-1 gap-1 mt-3">
          <Link
            href={`/events/${event.id || ""}`}
            className="flex-1 px-2 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 text-center"
            tabIndex={0}
          >
            View
          </Link>
        </div>

        {/* Card Footer: Created/Updated At */}
        <footer className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100 text-[10px] text-slate-400">
          <div>
            <span className="mr-1">Created:</span>
            <span className="font-medium text-slate-500">{new Date(event.createdAt).toLocaleDateString()}</span>
          </div>
          <div>
            <span className="mr-1">Updated:</span>
            <span className="font-medium text-slate-500">{new Date(event.updatedAt).toLocaleDateString()}</span>
          </div>
        </footer>
      </section>
    </article>
  );
};

export default EventCategoryCard;