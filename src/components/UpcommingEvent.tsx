'use client';
import React, { useEffect, useState, useRef } from 'react';
import { Button } from './ui/button';
import { fetchEvents } from '@/actions/event.actions';
import EventCard from './module/event/EventCard';
import EventCardSkeleton from './module/event/evenCardSkeleton';
import { IBaseEvent, TResponseEvent } from '@/types/event.types';
import { IBaseUser } from '@/types/user.types';
import { IgetReviewData } from '@/types/review.types';

const CARDS_PER_SLIDE = 4;

import { motion, AnimatePresence } from "framer-motion";

const UpcommingEvent = ({
  events,
}: {
  events: (TResponseEvent<{ reviews: IgetReviewData[]; organizer: IBaseUser[] }> | null)[];
}) => {
  const [upcomingEvent] = useState<any[]>(events);
  const [loading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (upcomingEvent.length > CARDS_PER_SLIDE) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) =>
          prev + CARDS_PER_SLIDE >= upcomingEvent.length
            ? 0
            : prev + CARDS_PER_SLIDE,
        );
      }, 6000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [upcomingEvent.length]);

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev + CARDS_PER_SLIDE >= upcomingEvent.length
        ? 0
        : prev + CARDS_PER_SLIDE,
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev - CARDS_PER_SLIDE < 0
        ? Math.max(upcomingEvent.length - CARDS_PER_SLIDE, 0)
        : prev - CARDS_PER_SLIDE,
    );
  };

  const visibleEvents = upcomingEvent
    .slice(currentIndex, currentIndex + CARDS_PER_SLIDE)
    .slice(0, 9);
  const emptySlots = CARDS_PER_SLIDE - visibleEvents.length;

  // Framer Motion variants for subtle enter/exit
  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.36,
        type: "spring",
        stiffness: 62,
      },
    },
    exit: {
      opacity: 0,
      y: 18,
      transition: { duration: 0.25, ease: "easeOut" },
    },
  };

  return (
    <section
      id="events"
      className="bg-background w-full py-8 md:py-12"
      aria-labelledby="upcoming-events-header"
    >
      <div className="max-w-[1440px] mx-auto w-full px-4 md:px-8 flex flex-col items-center">
        <motion.header
          className="w-full flex flex-col items-center text-center mb-6 md:mb-8"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.36, ease: "easeOut" }}
        >
          <h2
            id="upcoming-events-header"
            className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground mb-2"
          >
            Upcoming Events
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground font-medium max-w-xl">
            Browse {upcomingEvent.length || 9} upcoming public events and join in seconds.
          </p>
        </motion.header>
        <div className="flex justify-between items-center mb-6 md:mb-8 gap-2 w-full max-w-xl">
          <Button
            onClick={handlePrev}
            disabled={upcomingEvent.length <= CARDS_PER_SLIDE}
            className="transition px-5 py-1.5 text-base md:text-lg bg-secondary text-secondary-foreground border-border"
            variant="secondary"
            aria-label="Previous Events"
          >
            Prev
          </Button>
          <Button
            onClick={handleNext}
            disabled={upcomingEvent.length <= CARDS_PER_SLIDE}
            className="transition px-5 py-1.5 text-base md:text-lg bg-secondary text-secondary-foreground border-border"
            variant="secondary"
            aria-label="Next Events"
          >
            Next
          </Button>
        </div>
        <motion.div
          className="
            grid grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
            gap-4 md:gap-6
            w-full
            min-h-[340px]
            px-0"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={{
            visible: {
              transition: { staggerChildren: 0.06 },
            },
          }}
        >
          {loading ? (
            Array.from({ length: CARDS_PER_SLIDE }).map((_, i) => (
              <motion.div key={i} >
                <EventCardSkeleton />
              </motion.div>
            ))
          ) : events == null || events === undefined || events.length === 0 ? (
            <motion.div
              className="col-span-full text-center text-muted-foreground py-10 text-lg"
             
            >
              No Upcoming events found.
            </motion.div>
          ) : (
            <AnimatePresence>
              {visibleEvents.map((event) =>
                event ? (
                  <motion.div
                    key={event.id}
                  
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                  >
                    <EventCard {...event} />
                  </motion.div>
                ) : null,
              )}
              {/* fill for grid alignment */}
              {!loading &&
                emptySlots > 0 &&
                Array.from({ length: emptySlots }).map((_, idx) => (
                  <div
                    key={`empty-${idx}`}
                    className="invisible"
                    aria-hidden="true"
                  ></div>
                ))}
            </AnimatePresence>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default UpcommingEvent;