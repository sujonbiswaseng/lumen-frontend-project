"use client";

import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadein } from "@/lib/frammer.motion";

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const CallToAction = ({ role }: { role: string }) => {
  return (
    <section
      className="relative overflow-hidden"
      aria-label="Get started with event management"
    >
      {/* Ambient background shapes, use bg-accent for effect */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-8 left-[-6%] w-80 h-80 rounded-full bg-accent opacity-20 blur-3xl -z-10" />
        <div className="absolute bottom-[-3%] right-[-5%] w-80 h-80 rounded-full bg-primary opacity-20 blur-2xl -z-10" />
      </div>
      <div className="mx-auto w-full max-w-[1440px] flex justify-center items-center px-4 md:px-8">
        <div className="w-full max-w-2xl relative z-10 py-12 md:py-20">
          <motion.div
           variants={fadein('up',0.14)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className="bg-card border border-border shadow-xl backdrop-blur-xl rounded-2xl flex flex-col gap-6 md:gap-8 items-center text-center px-6 md:px-12 py-10 md:py-16"
          >
            <motion.h2
              variants={fadein('right',0.14)}
              className="text-2xl md:text-4xl font-extrabold text-foreground tracking-tight leading-snug md:leading-tight mb-2"
            >
              Your Next Event Starts Here.
              <br className="hidden md:inline" />
              <span className="block text-transparent bg-clip-text bg-gradient-to-l from-primary to-accent mt-2 md:mt-3">
                Host. Create. Inspire.
              </span>
            </motion.h2>
            <motion.p
               variants={fadein('left',0.14)}
              className="text-muted-foreground max-w-lg mx-auto text-base md:text-lg leading-relaxed"
            >
              Easily manage, promote, and bring your events to life.
              <br />
              <span className="block mt-1 text-muted-foreground text-sm md:text-base">
                No complex setup, secure payments, beautiful invites, &amp; actionable analytics.
              </span>
            </motion.p>
            <motion.div
              variants={fadein('left',0.14)}
              className="flex flex-col sm:flex-row gap-4 md:gap-6 w-full justify-center mt-3 md:mt-5"
            >
              <Link
                href={
                  role === "ADMIN"
                    ? "/admin/dashboard/events/create-event"
                    : "/user/dashboard/create-events"
                }
                className="w-full sm:w-auto"
              >
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-primary text-primary-foreground font-semibold text-base md:text-lg px-7 py-3 rounded-xl focus-visible:ring-2 ring-primary ring-offset-2 shadow hover:bg-accent hover:text-accent-foreground transition-all duration-300"
                  
                >
                  <span className="flex items-center justify-center gap-2">
                    <span aria-hidden>🚀</span>
                    Create Event
                  </span>
                </Button>
              </Link>
              <Link href="/events" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto border border-border text-foreground hover:bg-accent hover:text-accent-foreground px-7 py-3 rounded-xl font-semibold transition-colors duration-300"
                 
                >
                  <span className="flex items-center justify-center gap-2">
                    <span aria-hidden>🔑</span>
                    Join Events
                  </span>
                </Button>
              </Link>
            </motion.div>
            <motion.div
               variants={fadein('left',0.14)}
              className="mt-5 md:mt-7 w-full flex items-center justify-center gap-2 text-xs md:text-sm text-muted-foreground font-semibold tracking-tight"
            >
              <svg
                className="w-4 h-4 text-accent inline-block mr-1"
                fill="currentColor"
                aria-label="check mark"
                viewBox="0 0 20 20"
                focusable="false"
              >
                <path d="M16.707 7.293a1 1 0 10-1.414 1.414l1.793 1.793a1 1 0 010 1.414l-7 7a1 1 0 01-1.414-1.414l7-7zm-2.829 2.12l-7 7a1 1 0 01-1.415-1.415l7-7a1 1 0 011.415 1.415z" />
              </svg>
              No credit card required <span aria-hidden className="mx-1">|</span> Cancel anytime
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;