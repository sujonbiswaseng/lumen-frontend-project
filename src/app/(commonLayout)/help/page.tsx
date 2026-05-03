"use client";

import React, { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";
import { fadein } from "@/lib/frammer.motion";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Helper variants
const variantMap: any = {
  up: (duration = 0.2) => ({
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0, transition: { duration, ease: "easeOut" } },
  }),
  down: (duration = 0.3) => ({
    hidden: { opacity: 0, y: -32 },
    visible: { opacity: 1, y: 0, transition: { duration, ease: "easeOut" } },
  }),
  left: (duration = 0.5) => ({
    hidden: { opacity: 0, x: -48 },
    visible: { opacity: 1, x: 0, transition: { duration, ease: "easeOut" } },
  }),
  right: (duration = 0.8) => ({
    hidden: { opacity: 0, x: 48 },
    visible: { opacity: 1, x: 0, transition: { duration, ease: "easeOut" } },
  }),
};

// FAQ data and categories (would move to separate config in a larger codebase)
const faqs = [
  {
    q: "How do I create an event?",
    a: "Go to dashboard → create event → fill all required fields and publish.",
  },
  {
    q: "How does payment work?",
    a: "For paid events, users must complete payment before joining.",
  },
  {
    q: "Can I cancel my event?",
    a: "Yes, event owners can edit or delete events anytime.",
  },
  {
    q: "How do private events work?",
    a: "Users must request access and wait for approval.",
  },
];

const categories = [
  { title: "Getting Started", desc: "Learn how to use the platform", icon: "🚀" },
  { title: "Event Management", desc: "Create & manage events", icon: "📅" },
  { title: "Payments", desc: "Fees, refunds & payments", icon: "💳" },
  { title: "Account", desc: "Profile & security settings", icon: "👤" },
  { title: "Invitations", desc: "Manage invites & approvals", icon: "📩" },
  { title: "Reviews", desc: "Ratings & feedback system", icon: "⭐" },
];

// Use new variant system
const fadeUp = variantMap["up"](0.2);

const HelpCenter = () => {
  const router = useRouter();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const categoryFilter = categories.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-background min-h-screen w-full mt-6 md:mt-10 lg:mt-14">
      <div className="w-full mx-auto flex flex-col items-center">
        {/* HERO Section */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={variantMap["up"](0.2)}
          className="w-full"
        >
          <div
            className={cn(
              "mx-auto max-w-[1440px] w-full px-4 md:px-8 pt-16 pb-16 flex flex-col items-center justify-center"
            )}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground text-center tracking-tight">
              Help Center
            </h1>
            <p className="mt-4 text-lg text-muted-foreground text-center max-w-xl">
              Find answers, guides, and support for your events
            </p>

            {/* Search Box */}
            <div className="w-full max-w-xl mt-8 relative">
              <Input
                type="text"
                placeholder="Search for help…"
                value={search}
                onChange={(e:any) => setSearch(e.target.value)}
                className={cn(
                  "pl-12 pr-5 py-3 rounded-full bg-input border border-input shadow focus-visible:ring-2 focus-visible:ring-primary",
                  "text-foreground placeholder:text-muted-foreground transition"
                )}
                aria-label="Search help center"
              />
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={20}
                aria-hidden="true"
              />
            </div>
          </div>
        </motion.section>

        {/* CATEGORIES */}
        <section className="w-full">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.07,
                  delayChildren: 0.07,
                },
              },
            }}
            className="mx-auto max-w-[1440px] w-full px-4 md:px-8 py-12 md:py-16"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-foreground text-center">
              Popular Topics
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {categoryFilter.map((cat, i) => (
                <motion.div
                  key={cat.title}
                  variants={
                    i % 4 === 0
                      ? variantMap["up"](0.2)
                      : i % 4 === 1
                      ? variantMap["down"](0.3)
                      : i % 4 === 2
                      ? variantMap["left"](0.5)
                      : variantMap["right"](0.8)
                  }
                  whileHover={{ scale: 1.025 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  tabIndex={0}
                  aria-label={cat.title}
                  className={cn(
                    "outline-none",
                    "focus-visible:ring-2 focus-visible:ring-primary/70"
                  )}
                >
                  <Card
                    className={cn(
                      "transition-all bg-card border border-border shadow-sm rounded-2xl p-6 h-full cursor-pointer hover:border-accent hover:shadow-md"
                    )}
                  >
                    <div className="text-3xl mb-2">{cat.icon}</div>
                    <CardHeader className="p-0">
                      <CardTitle className="font-semibold text-lg text-card-foreground">
                        {cat.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 mt-1">
                      <p className="text-sm text-muted-foreground">
                        {cat.desc}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* FAQ */}
        <section className="w-full">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.09,
                  delayChildren: 0.09,
                },
              },
            }}
            className="mx-auto max-w-[800px] w-full px-4 md:px-8 pb-16"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <AnimatePresence initial={false}>
                {faqs
                  .filter((item) =>
                    item.q.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((faq, i) => (
                    <motion.div
                      key={faq.q}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={
                        i % 4 === 0
                          ? variantMap["up"](0.2)
                          : i % 4 === 1
                          ? variantMap["down"](0.3)
                          : i % 4 === 2
                          ? variantMap["left"](0.5)
                          : variantMap["right"](0.8)
                      }
                    >
                      <Card
                        className="bg-card border border-border rounded-xl shadow-sm px-6 py-5"
                        tabIndex={0}
                        aria-expanded={openIndex === i}
                      >
                        <button
                          type="button"
                          className={cn(
                            "w-full flex justify-between items-center gap-3 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/75 py-1"
                          )}
                          onClick={() => setOpenIndex(openIndex === i ? null : i)}
                          aria-controls={`faq-panel-${i}`}
                        >
                          <span className="font-medium text-card-foreground">
                            {faq.q}
                          </span>
                          <ChevronDown
                            className={cn(
                              "transition-transform ml-2 text-muted-foreground",
                              openIndex === i && "rotate-180 text-primary"
                            )}
                            aria-hidden="true"
                          />
                        </button>
                        <AnimatePresence>
                          {openIndex === i && (
                            <motion.div
                              key={`faq-panel-${i}`}
                              id={`faq-panel-${i}`}
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.28, ease: "easeOut" }}
                            >
                              <p className="mt-3 text-sm text-muted-foreground">
                                {faq.a}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Card>
                    </motion.div>
                  ))}
              </AnimatePresence>
              {/* No FAQ found message */}
              {faqs.filter((item) =>
                item.q.toLowerCase().includes(search.toLowerCase())
              ).length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-muted-foreground text-center py-6"
                >
                  No results found.
                </motion.div>
              )}
            </div>
          </motion.div>
        </section>

        {/* CTA - Contact Support */}
        <section className="w-full">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={variantMap["down"](0.9)}
            className="mx-auto max-w-[720px] w-full px-4 md:px-8 pb-10"
          >
            <Card className="bg-card border-t border-border rounded-2xl px-8 py-12 md:py-14 text-center shadow-md flex flex-col items-center justify-center">
              <h2 className="text-2xl md:text-3xl font-bold text-card-foreground mb-2">
                Still need help?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Our support team is here for you.
              </p>
              <Button
                size="lg"
                className="rounded-full font-semibold px-8 py-3"
                onClick={() =>
                  router.push(
                    "https://api.whatsapp.com/send/?phone=+8801804935939"
                  )
                }
                variant="default"
                aria-label="Contact Support via WhatsApp"
              >
                Contact Support
              </Button>
            </Card>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default HelpCenter;