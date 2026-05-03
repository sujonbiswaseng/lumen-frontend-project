'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { TResponseCategoryData } from '@/types/category.type';
import { IBaseUser } from '@/types/user.types';
import { EventArr, IBaseEvent, TPagination, TResponseEvent } from '@/types/event.types';
import { useFilter } from '@/components/ReusableFilter';
import { TFilterField } from '@/types/filter.types';
import { FilterPanel } from '@/components/Filter';
import EventCardSkeleton from '../event/evenCardSkeleton';
import { fetchEvents } from '@/actions/event.actions';
import EventCard from '../event/EventCard';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { fadein } from '@/lib/frammer.motion';
import PaginationPage from '../event/Pagination';

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: 24, transition: { duration: 0.2 } },
};

const Singlecategory = ({
  category,
  events,
  pagination,
}: {
  category: TResponseCategoryData<{ event: IBaseEvent[]; user: IBaseUser }>;
  events: IBaseEvent[];
  pagination: TPagination;
}) => {
  const [eventdata, setEventdata] = useState<IBaseEvent[]>();
  const [isLoading, setIsLoading] = useState(true);
  const [search, setsearch] = useState("");


  useEffect(() => {
    const featchdata = async () => {
      try {
        setIsLoading(true);
        if (!events || !events.length) {
          setIsLoading(true);
          setEventdata([]);
        } else {
          setEventdata(events as IBaseEvent[]);
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(true);
        setEventdata([]);
      }
    };
    featchdata();
  }, []);


  // Filter events based on search input
  const filteredEvents = eventdata?.filter(
    (item) =>
      item.category_name?.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase()) ||
      item.location?.toLowerCase().includes(search.toLowerCase())
  );

  // No events fallback (enterprise grade, centered, design token colors only)
  if (!category.event) {
    return (
      <section className="w-full max-w-[1440px] mx-auto min-h-[400px] flex items-center justify-center px-4 py-16">
        <motion.div
          className="flex flex-col items-center gap-4"
          {...fadeInUp}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <div className="text-2xl md:text-3xl font-semibold text-muted-foreground">
            No events found
          </div>
          <div className="text-muted-foreground text-center">
            Try adjusting your filters or search to find events.
          </div>
        </motion.div>
      </section>
    );
  }

  // Main layout
  return (
    <main className="w-full flex justify-center bg-background">
      <section className="w-full max-w-[1440px] mx-auto flex flex-col gap-8 px-4 md:px-8 py-10">
        {/* Category Card */}
        <motion.div
          initial="initial"
          animate="animate"
          exit="exit"
          className="mx-auto w-full max-w-lg md:max-w-2xl bg-card rounded-2xl shadow-lg border border-border flex flex-col md:flex-row items-center px-6 py-8 gap-6"
        >
          {/* Category Image & Name */}
          <div className="flex flex-col items-center gap-3 w-full">
            {category.image && (
              <motion.img
                src={category.image}
                alt={category.name}
                className="w-20 h-20 rounded-xl object-cover mb-2 border border-input shadow"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1, transition: { duration: 0.3 } }}
                loading="lazy"
              />
            )}
            <h2 className="text-xl font-bold text-card-foreground text-center">{category.name}</h2>
          </div>
          {/* User Section */}
          {category.user && (
            <div className="flex flex-col items-center gap-2 w-full md:w-auto border-t border-border md:border-t-0 md:border-l md:pl-8 pt-6 md:pt-0">
              {category.user.image && (
                <img
                  src={category.user.image}
                  alt="User"
                  className="w-12 h-12 rounded-full object-cover border border-input"
                  loading="lazy"
                />
              )}
              <span className="text-muted-foreground text-sm">{category.user.phone}</span>
              <Link
                href={`/profile/${category.user.id}`}
                className="mt-1 text-primary text-sm font-medium underline-offset-2 hover:underline focus-visible:ring-2 focus-visible:ring-ring rounded"
              >
                View Profile
              </Link>
            </div>
          )}
        </motion.div>

        {/* Headline */}
        <div className="text-center mb-4 space-y-2">
          <motion.h1
            className="text-3xl md:text-4xl font-bold text-foreground"
            initial="initial"
            animate="animate"
            exit="exit"
          >
            Discover Amazing Events
          </motion.h1>
          <motion.p
            className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg"
            variants={fadein("down", 0.5)}
            {...fadein("down", 0.5)}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            Explore curated events, connect with communities, and create unforgettable experiences.
          </motion.p>
        </div>

        {/* Filter Input */}
        <section className="mb-8 w-full flex justify-center">
          <input
            type="text"
            className="w-full max-w-md px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-base bg-background"
            placeholder="Search events by name, description or location..."
            value={search}
            onChange={(e) => setsearch(e.target.value)}
            aria-label="Filter events"
          />
        </section>

        {/* Events Grid */}
        <section className="relative mt-0">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6"
            variants={{
              animate: {
                transition: {
                  staggerChildren: 0.07,
                  delayChildren: 0.1,
                },
              },
            }}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {isLoading
              ? Array.from({ length: eventdata?.length || 8 }).map((_, i) => (
                  <motion.div key={i}>
                    <EventCardSkeleton />
                  </motion.div>
                ))
              : filteredEvents && filteredEvents.length
                ? filteredEvents.map((event) => (
                    <motion.div key={event.id}>
                      <EventCard {...(event as TResponseEvent<{ reviews: any[]; organizer: IBaseUser }>)}/>
                    </motion.div>
                  ))
                : (
                  <div className="col-span-full flex flex-col items-center justify-center py-16">
                    <div className="text-lg font-semibold text-muted-foreground mb-2">
                      No events found{search ? ' for your filter.' : ' in this category.'}
                    </div>
                  </div>
                )}
          </motion.div>
        </section>

        {/* Pagination */}
        <PaginationPage pagination={pagination as TPagination} />
      </section>
    </main>
  );
};

export default Singlecategory;