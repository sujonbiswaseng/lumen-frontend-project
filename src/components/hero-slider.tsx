"use client";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { IBaseEvent } from "@/types/event.types";
import { Button } from "./ui/button";

/** Fields the hero actually renders (API events are mapped into this shape). */
type HeroSlide = {
  id: string;
  image: string;
  title: string;
  description: string;
  venue: string;
  date: string;
};

// Default event fallback data
const DEFAULT_SLIDE: HeroSlide = {
  id: "default-event-id",
  image: "https://images.pexels.com/photos/15448073/pexels-photo-15448073.jpeg", // You can place this image in public/ folder or use a relevant event default image path
  title: "Discover Amazing Events",
  description: "Create, join, and manage events effortlessly",
  venue: "Your City",
  date: new Date().toISOString(),
};

export default function HeroSlider({ data }: { data: IBaseEvent[] }) {
  const [current, setCurrent] = useState(0);
  const router = useRouter();
  console.log(data,'daa')

  // Use the provided data as the slides, or a default slide if none exists
  let slides: HeroSlide[];

  if (!data || !Array.isArray(data) || data.length === 0) {
    slides = [DEFAULT_SLIDE];
  } else {
    // Map API events into the slim shape the hero needs (with safe fallbacks)
    slides = data.map((evt) => ({
      id: evt.id,
      venue: evt.location ?? "",
      date: evt.date ?? "",
      image:data[0].images[0],
      title:
        evt.title && typeof evt.title === "string" && evt.title.trim() !== ""
          ? evt.title
          : "Event related",
      description:
        evt.description && typeof evt.description === "string" && evt.description.trim() !== ""
          ? evt.description
          : "Explore a variety of exciting events happening near you.",
    }));
  }

  useEffect(() => {
    if (slides.length < 2) return; // Don't auto-slide if 0 or 1 item
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative w-full h-[70vh] min-h-[450px] max-h-[620px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 mb-4 transition-opacity duration-1000 ${
            index === current ? "opacity-100 z-20" : "opacity-0 z-10"
          }`}
        >
          {/* Background Image */}
          <Image
            src={slide.image || DEFAULT_SLIDE.image}
            alt={slide.title || DEFAULT_SLIDE.title}
            fill
            className="object-cover"
            priority
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-linear-to-r from-slate-900/80 via-cyan-900/45 to-emerald-900/40"></div>

          {/* Content */}
          <div className="relative w-full max-w-screen-xl mb-4 mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center h-full pb-7" style={{ minHeight: "100%", paddingTop: "5.5rem" }}>
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-cyan-500/20 backdrop-blur-sm border border-cyan-200/40 rounded-full px-4 py-1.5 mb-6 animate-fade-in">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span className="text-sm font-medium text-white/90">Featured Event</span>
              </div>

              <motion.h1
                className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold text-primary-foreground leading-tight mb-4"
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {slide.title || "Event related"}
              </motion.h1>
         

              <p className="text-lg text-cyan-50/90 mb-2 font-medium animate-slide-in" style={{ animationDelay: "0.1s" }}>
                {slide.description || "Explore a variety of exciting events happening near you."}
              </p>

              <p className="text-base text-white/75 mb-8 max-w-lg leading-relaxed animate-slide-in" style={{ animationDelay: "0.15s" }}>
                {slide.venue && slide.date
                  ? `${new Date(slide.date).toLocaleDateString()} · ${slide.venue}`
                  : "Your all-in-one event management platform. Browse events, join communities, and create unforgettable experiences."}
              </p>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4 animate-slide-in" style={{ animationDelay: "0.2s" }}>
                <button
                  onClick={() => router.push('/events')}
                  className="inline-flex items-center gap-2 px-5 sm:px-6 py-2 rounded-full font-semibold text-slate-900 bg-white/90 hover:bg-amber-300 transition-colors shadow-xl shadow-cyan-900/20 border border-white/40 focus:outline-none focus:ring-2 focus:ring-amber-300/60 focus:ring-offset-2 active:scale-95 active:shadow-inner animate-fade-in duration-200"
                  style={{
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    boxShadow: "0 4px 24px 0 rgba(16,185,129,.22), 0 1.5px 4px 0 rgba(0,0,0,.1)"
                  }}
                  aria-label="Browse All Events"
                >
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Browse All Events
                </button>
                <Button
                  style={{
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    boxShadow: "0 4px 24px 0 rgba(99,102,241,.15), 0 1.5px 4px 0 rgba(0,0,0,.05)"
                  }}
                  onClick={() => router.push(`/events/${slide.id ?? ""}`)}
                  className="inline-flex items-center gap-2 px-5 sm:px-6 py-2 rounded-full font-semibold text-white bg-linear-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 transition-colors shadow-xl shadow-cyan-900/20 border border-cyan-200/40 focus:outline-none focus:ring-2 focus:ring-cyan-200/60 focus:ring-offset-2 active:scale-95 active:shadow-inner animate-fade-in duration-200"
                >
                  join
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Dots */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-40">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition ${
              current === index ? "bg-amber-300 scale-125" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}