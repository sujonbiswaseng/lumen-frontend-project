"use client";

import { Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type FeaturedItem = {
  title: string;
  description: string;
  icon: string;
};

const defaultFeaturedData: FeaturedItem[] = [
  {
    icon: "⚡",
    title: "Fast Performance",
    description: "Optimized page rendering and smooth interactions across all devices.",
  },
  {
    icon: "🔒",
    title: "Secure Platform",
    description: "Role-based access and protected event workflows for trusted operations.",
  },
  {
    icon: "🤖",
    title: "AI Integration",
    description: "Automate reminders, support flows, and attendee communication at scale.",
  },
  {
    icon: "📈",
    title: "Live Analytics",
    description: "Track registrations, conversions, and engagement with actionable metrics.",
  },
  {
    icon: "🎟️",
    title: "Smart Ticketing",
    description: "Manage paid and free tickets with capacity limits and automated confirmation.",
  },
  {
    icon: "🌍",
    title: "Multi-Channel Reach",
    description: "Promote events across web, email, and social channels from one workflow.",
  },
];

// Animation variants
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.33, ease: "easeOut" },
  },
};

const iconVariants = {
  hover: {
    scale: 1.11,
    rotate: [-8, 12, -4, 0],
    transition: { type: "spring", stiffness: 340, damping: 14 },
  },
};

const Featured = ({ data = defaultFeaturedData }: { data?: FeaturedItem[] }) => {
  return (
    <section id="featured" className="w-full bg-background">
      <div className="mx-auto w-full max-w-[1440px] p-4 md:p-8 flex flex-col items-center justify-center">
        <div className="mb-6 flex items-center gap-2">
          <Sparkles
            className="size-6 text-primary"
            aria-hidden="true"
            strokeWidth={2.2}
          />
          <h2 className="text-2xl font-bold md:text-3xl text-foreground tracking-tight">
            Featured Highlights
          </h2>
        </div>
        <p className="mb-8 max-w-2xl text-center text-sm md:text-base text-muted-foreground">
          Everything your event platform needs to deliver a premium booking and attendee experience.
        </p>

        <motion.div
          className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          <AnimatePresence>
            {data.map((item) => (
              <motion.article
                key={item.title}
           
                className="group rounded-2xl border border-border bg-card p-6 flex flex-col items-start shadow-sm hover:bg-accent/70 transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-primary"
                tabIndex={0}
                whileHover="hover"
                whileFocus="hover"
                layout
              >
                <motion.p
                  className="text-2xl md:text-3xl mb-2 transition-transform select-none"
                  aria-label={`${item.icon} icon`}
                >
                  {item.icon}
                </motion.p>
                <h3 className="mt-1 text-lg md:text-xl font-semibold text-card-foreground leading-tight">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm md:text-base text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default Featured;