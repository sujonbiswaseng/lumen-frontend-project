"use client";

import { BriefcaseBusiness } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import * as React from "react";

type ServiceItem = {
  title: string;
  description: string;
  icon: string;
};

const defaultServicesData: ServiceItem[] = [
  {
    icon: "🧩",
    title: "Event Platform Development",
    description: "Build modern event booking portals with scalable architecture and polished UX.",
  },
  {
    icon: "📊",
    title: "Admin Dashboard Systems",
    description: "Create data-driven dashboards for organizer operations, finance, and reporting.",
  },
  {
    icon: "🤖",
    title: "AI Automation Services",
    description: "Implement AI flows for attendee support, notifications, and smart follow-ups.",
  },
  {
    icon: "🔐",
    title: "Security & Access Control",
    description: "Set up role-based access, protected workflows, and secure session management.",
  },
  {
    icon: "⚙️",
    title: "API & Integration Services",
    description: "Connect payment gateways, CRM tools, analytics, and third-party platforms.",
  },
  {
    icon: "🚀",
    title: "Performance Optimization",
    description: "Improve speed, stability, and responsiveness for production-grade experiences.",
  },
  {
    icon: "🎨",
    title: "UI/UX Design Systems",
    description: "Deliver cohesive design systems for consistent, reusable enterprise interfaces.",
  },
  {
    icon: "🛠️",
    title: "Maintenance & Support",
    description: "Provide continuous updates, bug fixes, and feature enhancements after launch.",
  },
  {
    icon: "📣",
    title: "Growth & Engagement Setup",
    description: "Configure newsletters, campaign funnels, and retention workflows for users.",
  },
];

// Animation variants for premium, minimal motion
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.11,
      delayChildren: 0.05,
    },
  },
};

export const cardVariants: Variants = {
    hover: {
      scale: 1.05,
      rotate: 5,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
      },
    },
  };
const Services = ({ data = defaultServicesData }: { data?: ServiceItem[] }) => {
  return (
    <section
      id="services"
      className="w-full bg-card border-t border-border"
      aria-labelledby="saas-services-heading"
    >
      <div className="mx-auto w-full max-w-[1440px] p-4 md:p-8 flex flex-col items-center justify-center">
        <div className="mb-6 flex items-center gap-2">
          <BriefcaseBusiness
            className="size-6 text-primary"
            aria-hidden="true"
            strokeWidth={2.1}
          />
          <h2
            id="saas-services-heading"
            className="text-2xl md:text-3xl font-bold text-foreground tracking-tight"
          >
            Services We Provide
          </h2>
        </div>
        <p className="mb-8 max-w-2xl text-center text-sm md:text-base text-muted-foreground">
          End-to-end services designed to launch, scale, and optimize modern event and SaaS products.
        </p>

        <motion.div
          className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <AnimatePresence>
            {data.map((service) => (
              <motion.article
                key={service.title}
                className="group rounded-2xl border border-border bg-background p-6 flex flex-col items-start shadow-sm hover:bg-accent/70 transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-primary"
                
                tabIndex={0}
                whileHover="hover"
                whileFocus="hover"
                layout
                aria-labelledby={`service-title-${service.title.replace(/\s/g, "").toLowerCase()}`}
              >
                <motion.span
                  className="text-2xl md:text-3xl mb-2 select-none transition-transform"
                  aria-label={`${service.icon} icon`}
                  variants={cardVariants}
                >
                  {service.icon}
                </motion.span>
                <h3
                  id={`service-title-${service.title.replace(/\s/g, "").toLowerCase()}`}
                  className="mt-1 text-lg md:text-xl font-semibold text-card-foreground leading-tight"
                >
                  {service.title}
                </h3>
                <p className="mt-2 text-sm md:text-base text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;