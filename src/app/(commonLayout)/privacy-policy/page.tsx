"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { fadein } from "@/lib/frammer.motion";

const sections = [
  { id: "intro", title: "Introduction" },
  { id: "data", title: "Information We Collect" },
  { id: "usage", title: "How We Use Information" },
  { id: "sharing", title: "Data Sharing" },
  { id: "cookies", title: "Cookies & Tracking" },
  { id: "security", title: "Data Security" },
  { id: "rights", title: "User Rights" },
  { id: "retention", title: "Data Retention" },
  { id: "changes", title: "Changes to Policy" },
  { id: "contact", title: "Contact Us" },
];

const containerStagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.16,
    },
  },
};

const PrivacyPolicy = () => {
  return (
    <div className="bg-background min-h-screen w-full">
      <motion.section
        className="w-full mx-auto max-w-[1440px] flex flex-col items-center"
        initial="hidden"
        animate="visible"
        variants={containerStagger}
      >
        {/* Hero Section */}
        <motion.div
          className="w-full max-w-[1440px] mx-auto flex flex-col items-center border-b border-border bg-background px-4 md:px-8 py-12 md:py-20"
          variants={fadein("up", 0.6)}
        >
          <div className="w-full max-w-2xl text-center flex flex-col items-center">
            <motion.h1
              className="font-display font-bold text-3xl leading-tight sm:text-4xl md:text-5xl text-foreground mb-3 md:mb-4 transition-colors"
              variants={fadein("up", 0.7)}
            >
              Privacy Policy
            </motion.h1>
       
       
            <p className="text-base md:text-lg text-muted-foreground mb-2">
              Your privacy matters to us. This policy explains how lumen collects, uses, and protects your data.
            </p>
            <p className="text-xs text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </motion.div>
   

        {/* Main Content & Sidebar Layout */}
        <motion.div
          className={cn(
            "w-full max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 px-4 md:px-8 py-10 md:py-16"
          )}
          variants={containerStagger}
        >
          {/* Sidebar */}
          <motion.aside
            className="hidden lg:block sticky top-24 h-fit"
            variants={fadein("left", 0.5)}
            aria-label="Section Navigation"
          >
            <Card className="bg-card border border-border rounded-xl p-6 shadow-none">
              <h3 className="font-semibold text-card-foreground mb-4 text-base">
                Contents
              </h3>
              <ul className="space-y-1 text-muted-foreground text-sm">
                {sections.map((sec) => (
                  <li key={sec.id}>
                    <a
                      href={`#${sec.id}`}
                      className={cn(
                        "block rounded-md px-2 py-1 transition-colors duration-300 text-muted-foreground hover:text-primary hover:bg-accent/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      )}
                    >
                      {sec.title}
                    </a>
                  </li>
                ))}
              </ul>
            </Card>
          </motion.aside>
          {/* Main Policy Content */}
          <motion.main
            className="lg:col-span-3"
            variants={fadein("right", 0.5)}
          >
            <Card className="bg-card border border-border rounded-xl shadow-sm p-4 md:p-8">
              <div className="space-y-8 md:space-y-10 text-card-foreground text-base leading-relaxed">
                <motion.section id="intro" variants={fadein("up", 0.4)}>
                  <h2 className="text-xl md:text-2xl font-semibold mb-2 text-foreground">
                    Introduction
                  </h2>
                  <p className="text-muted-foreground">
                    We value your privacy and are committed to protecting your personal information. This Privacy Policy explains how lumen handles your data when you use our platform.
                  </p>
                </motion.section>
                <motion.section id="data" variants={fadein("down", 0.4)}>
                  <h2 className="text-xl md:text-2xl font-semibold mb-2 text-foreground">
                    Information We Collect
                  </h2>
                  <p className="text-muted-foreground">
                    We may collect personal information such as your name, email, payment details, and usage data when you interact with our services.
                  </p>
                </motion.section>
                <motion.section id="usage" variants={fadein("up", 0.4)}>
                  <h2 className="text-xl md:text-2xl font-semibold mb-2 text-foreground">
                    How We Use Information
                  </h2>
                  <p className="text-muted-foreground">
                    Your data is used to provide and improve our services, process transactions, personalize your experience, and communicate important updates.
                  </p>
                </motion.section>
                <motion.section id="sharing" variants={fadein("down", 0.4)}>
                  <h2 className="text-xl md:text-2xl font-semibold mb-2 text-foreground">
                    Data Sharing
                  </h2>
                  <p className="text-muted-foreground">
                    We do not sell your personal data. Information may be shared with trusted third parties such as payment providers and analytics services.
                  </p>
                </motion.section>
                <motion.section id="cookies" variants={fadein("left", 0.4)}>
                  <h2 className="text-xl md:text-2xl font-semibold mb-2 text-foreground">
                    Cookies &amp; Tracking
                  </h2>
                  <p className="text-muted-foreground">
                    We use cookies and similar technologies to enhance user experience, track usage, and improve platform performance.
                  </p>
                </motion.section>
                <motion.section id="security" variants={fadein("right", 0.4)}>
                  <h2 className="text-xl md:text-2xl font-semibold mb-2 text-foreground">
                    Data Security
                  </h2>
                  <p className="text-muted-foreground">
                    We implement appropriate security measures to protect your data from unauthorized access, disclosure, or loss.
                  </p>
                </motion.section>
                <motion.section id="rights" variants={fadein("up", 0.4)}>
                  <h2 className="text-xl md:text-2xl font-semibold mb-2 text-foreground">
                    User Rights
                  </h2>
                  <p className="text-muted-foreground">
                    You have the right to access, update, or delete your personal data. You may also opt out of certain communications.
                  </p>
                </motion.section>
                <motion.section id="retention" variants={fadein("down", 0.4)}>
                  <h2 className="text-xl md:text-2xl font-semibold mb-2 text-foreground">
                    Data Retention
                  </h2>
                  <p className="text-muted-foreground">
                    We retain your data only as long as necessary to provide our services and comply with legal obligations.
                  </p>
                </motion.section>
                <motion.section id="changes" variants={fadein("left", 0.4)}>
                  <h2 className="text-xl md:text-2xl font-semibold mb-2 text-foreground">
                    Changes to Policy
                  </h2>
                  <p className="text-muted-foreground">
                    We may update this policy from time to time. Continued use of the platform indicates acceptance of the updated policy.
                  </p>
                </motion.section>
                <motion.section id="contact" variants={fadein("right", 0.4)}>
                  <h2 className="text-xl md:text-2xl font-semibold mb-2 text-foreground">
                    Contact Us
                  </h2>
                  <p className="text-muted-foreground">
                    If you have any questions, contact us at:
                    <span className="block mt-1 font-medium text-primary">
                      support@lumen.com
                    </span>
                  </p>
                </motion.section>
              </div>
            </Card>
          </motion.main>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default PrivacyPolicy;