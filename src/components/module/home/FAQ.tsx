"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

const FAQ_ITEMS = [
  {
    id: "1",
    question: "What does this platform do?",
    answer:
      "This is a multi-purpose platform where users can create, manage, and join events, as well as use AI chat support.",
  },
  {
    id: "2",
    question: "How can I create an event?",
    answer:
      "Go to the dashboard, click on 'Create Event', and fill in details like title, date, location, images, and other required information.",
  },
  {
    id: "3",
    question: "Can events be free or paid?",
    answer:
      "Yes, events can be set as either FREE or PAID. If paid, you can define a fee for participation.",
  },
  {
    id: "4",
    question: "How many images can I upload for an event?",
    answer:
      "Multiple images can be uploaded depending on backend validation limits set for the system.",
  },
  {
    id: "5",
    question: "Can I edit or delete my event?",
    answer:
      "Yes, only the event owner or admin can edit or delete an event.",
  },
  {
    id: "6",
    question: "How does the AI chat feature work?",
    answer:
      "The AI chat system uses an LLM backend API to generate smart responses based on user queries.",
  },
  {
    id: "7",
    question: "Can users leave reviews for events?",
    answer:
      "Yes, authenticated users can leave reviews and ratings for events.",
  },
  {
    id: "8",
    question: "Can I search for events?",
    answer:
      "Yes, events can be searched and filtered by category, price, location, and other parameters.",
  },
  {
    id: "9",
    question: "Is the platform mobile friendly?",
    answer:
      "Yes, the system is fully responsive and works smoothly on mobile, tablet, and desktop devices.",
  },
  {
    id: "10",
    question: "Is my data secure?",
    answer:
      "Yes, security is ensured using authentication, cookies, and protected APIs.",
  },
];

export function FAQ() {
  return (
    <section
      className="w-full flex justify-center items-center py-8 px-4 bg-background"
      aria-labelledby="faq-title"
    >
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none select-none -z-10">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 0.27, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full h-44 md:h-60 bg-gradient-to-b from-accent/30 to-background/0 blur-md"
        />
      </div>

      <div className="w-full max-w-[1440px] flex flex-col gap-8 justify-center items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-2xl mx-auto"
        >
          <Card
            className="
              bg-card border border-border shadow-sm
              w-full
            "
          >
            <CardHeader className="pb-4">
              <CardTitle
                id="faq-title"
                className="text-2xl sm:text-3xl font-bold text-card-foreground tracking-tight"
              >
                Frequently Asked Questions
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-2 text-base">
                Find answers to some of the most common questions about our event platform, subscriptions, billing, and more.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Accordion>
                <AnimatePresence initial={false}>
                  {FAQ_ITEMS.map(({ id, question, answer }) => (
                    <AccordionItem
                      key={id}
                      value={id}
                      className="border-b border-border"
                    >
                      <AccordionTrigger className="text-left p-0 font-medium text-card-foreground">
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.25, ease: "easeOut" }}
                          className="block"
                        >
                          {question}
                        </motion.span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <motion.div
                          key={id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.25, ease: "easeOut" }}
                          className="text-muted-foreground text-sm pt-2"
                        >
                          {answer}
                        </motion.div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </AnimatePresence>
              </Accordion>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}