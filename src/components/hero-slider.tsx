"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronRight, Sparkles } from "lucide-react";
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

const DEFAULT_SLIDE: HeroSlide = {
  id: "default-event-id",
  image: "https://images.pexels.com/photos/15448073/pexels-photo-15448073.jpeg",
  title: "Discover Amazing Events",
  description: "Create, join, and manage events effortlessly",
  venue: "Your City",
  date: new Date().toISOString(),
};

export default function HeroSlider({ data }: { data: IBaseEvent[] }) {
  const [current, setCurrent] = useState(0);
  const router = useRouter();

  const slides: HeroSlide[] =
    !data || !Array.isArray(data) || data.length === 0
      ? [DEFAULT_SLIDE]
      : data.map((evt) => ({
          id: evt.id,
          venue: evt.location ?? "",
          date: evt.date ?? "",
          image: evt.images?.[0] ?? DEFAULT_SLIDE.image,
          title:
            evt.title && typeof evt.title === "string" && evt.title.trim() !== ""
              ? evt.title
              : "Event related",
          description:
            evt.description &&
            typeof evt.description === "string" &&
            evt.description.trim() !== ""
              ? evt.description
              : "Explore a variety of exciting events happening near you.",
        }));

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section
      className="relative mx-auto min-h-[70vh] w-full max-w-[1440px] overflow-hidden md:min-h-[80vh]"
      aria-roledescription="carousel"
      aria-label="Featured events"
    >
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-out motion-reduce:transition-none ${
            index === current ? "z-20 opacity-100" : "z-10 opacity-0"
          }`}
          aria-hidden={index !== current}
        >
          <Image
            src={slide.image || DEFAULT_SLIDE.image}
            alt={slide.title || "Featured event"}
            fill
            className="object-cover"
            priority={index === 0}
            sizes="(max-width: 1440px) 100vw, 1440px"
          />

          <div className="absolute inset-0 bg-gradient-hero" aria-hidden />

          {/* Extra scrim so body copy stays readable on bright photos */}
          <div
            className="absolute inset-0 bg-linear-to-r from-background/75 via-background/45 to-background/25"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent"
            aria-hidden
          />

          <div className="relative z-20 flex min-h-[70vh] flex-col justify-center px-4 pt-24 pb-20 md:min-h-[80vh] sm:px-6 sm:pt-28 lg:px-8">
            <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{
                  opacity: index === current ? 1 : 0,
                  y: index === current ? 0 : 16,
                }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card/85 px-4 py-1.5 shadow-sm backdrop-blur-md"
              >
                <Sparkles className="size-4 shrink-0 text-primary" aria-hidden />
                <span className="text-sm font-medium text-card-foreground">
                  Featured Event
                </span>
              </motion.div>

              <div className="max-w-2xl space-y-4">
                <motion.h1
                  className="font-display text-balance text-3xl font-bold leading-[1.15] tracking-tight text-secondary sm:text-4xl lg:text-[2.75rem]"
                  initial={{ opacity: 0, y: 22 }}
                  animate={{
                    opacity: index === current ? 1 : 0,
                    y: index === current ? 0 : 22,
                  }}
                  transition={{ duration: 0.38, ease: "easeOut", delay: 0.03 }}
                >
                  {slide.title || "Event related"}
                </motion.h1>

                <motion.p
                  className="max-w-xl text-lg font-medium leading-relaxed text-foreground sm:text-xl"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{
                    opacity: index === current ? 1 : 0,
                    y: index === current ? 0 : 14,
                  }}
                  transition={{ duration: 0.35, ease: "easeOut", delay: 0.06 }}
                >
                  {slide.description ||
                    "Explore a variety of exciting events happening near you."}
                </motion.p>

                <motion.p
                  className="max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{
                    opacity: index === current ? 1 : 0,
                    y: index === current ? 0 : 12,
                  }}
                  transition={{ duration: 0.35, ease: "easeOut", delay: 0.09 }}
                >
                  {slide.venue && slide.date
                    ? `${new Date(slide.date).toLocaleDateString()} · ${slide.venue}`
                    : "Browse events, join communities, and create unforgettable experiences."}
                </motion.p>

                <motion.div
                  className="flex flex-wrap items-center gap-3 pt-2 sm:gap-4"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{
                    opacity: index === current ? 1 : 0,
                    y: index === current ? 0 : 12,
                  }}
                  transition={{ duration: 0.35, ease: "easeOut", delay: 0.12 }}
                >
                  <Button
                    type="button"
                    size="lg"
                    className="rounded-full px-6 shadow-md transition-smooth hover:shadow-lg"
                    onClick={() => router.push("/events")}
                    aria-label="Browse all events"
                  >
                    <ChevronRight className="size-4" aria-hidden />
                    Browse All Events
                  </Button>
                  <Button
                    type="button"
                    size="lg"
                    variant="secondary"
                    className="rounded-full border border-border px-6 shadow-sm backdrop-blur-sm transition-smooth hover:bg-secondary/90"
                    onClick={() => router.push(`/events/${slide.id}`)}
                    aria-label="View this event"
                  >
                    Join
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div
        className="absolute bottom-6 left-0 right-0 z-40 flex justify-center gap-2 sm:bottom-8 sm:gap-3"
        role="tablist"
        aria-label="Slide indicators"
      >
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            role="tab"
            aria-selected={current === index}
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => setCurrent(index)}
            className={`size-2.5 rounded-full transition-all duration-300 sm:size-3 ${
              current === index
                ? "scale-125 bg-primary ring-2 ring-background"
                : "bg-muted-foreground/45 hover:bg-muted-foreground/75"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
