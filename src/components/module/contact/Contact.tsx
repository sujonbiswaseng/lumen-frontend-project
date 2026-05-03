"use client";

import { useState, type FormEvent } from "react";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MapPin, Phone, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { fadein } from "@/lib/frammer.motion";
import { toast } from "react-toastify";

/** ==== Validation Schema ==== */
const contactSchema = z.object({
  name: z.string().trim().min(2, "Name too short").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  message: z.string().trim().min(10, "Tell us a bit more").max(1000),
});

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.36, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.16,
    },
  },
};

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  /** ==== Form Handlers ==== */
  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const [result, setResult] = useState("");

  const onSubmit = async (event:any) => {
    event.preventDefault();
    const toastid=toast.loading("sending......",{autoClose:2000})
    const formData = new FormData(event.target);
    formData.append("access_key", "a6e254d6-1e3c-4309-9ef9-58f65f27d1d4");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    if(!response.ok){
    toast.update(toastid, {
      render: "Failed to send. Please try again.",
      type: "error",
      isLoading: false,
      autoClose: 3500,
      closeOnClick: true,
      pauseOnHover: true,
    });
    setLoading(false);
    setResult("Error");
    return;

    }

    const data = await response.json();
    if (data.success) {
      toast.update(toastid, {
        render: "Message sent successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3500,
        closeOnClick: true,
        pauseOnHover: true,
      });
      setForm({ name: "", email: "", message: "" }); // Optionally reset form
    }
    setResult(data.success ? "Success!" : "Error");
  };

  /** ==== Layout ==== */
  return (
    <motion.section
      className="relative w-full max-w-[1440px] mx-auto bg-background"
      initial="hidden"
      animate="visible"
      variants={stagger}
    >
      {/* Hero/Heading */}
      <motion.div
        className="border-b border-border bg-gradient-to-br from-background via-accent/10 to-primary/5 py-14 sm:py-20"
        variants={fadein('up',0.12)}
      >
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Get in touch</p>
          <h1 className="font-display text-3xl/none sm:text-4xl/none lg:text-5xl/none font-bold text-foreground mb-3">
            We&apos;d love to hear from you
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg px-0 sm:px-8">
            Whether you&apos;re an attendee, organizer, or just curious—reach out.
          </p>
        </div>
      </motion.div>

      {/* Main content grid */}
      <motion.div
        className="
          grid
          max-w-6xl
          mx-auto
          w-full
          gap-8
          p-4
          md:p-6
          lg:py-16
          lg:px-8
          lg:grid-cols-3
          items-stretch
        "
        variants={stagger}
      >
        {/* Contact Information Card List */}
        <motion.div
          className="space-y-4 flex flex-col"
          variants={fadein("right",0.12)}
        >
          {[
            {
              Icon: Mail,
              label: "Email",
              value: "hello@lumen.app",
            },
            {
              Icon: Phone,
              label: "Phone",
              value: "+1 (415) 555-0142",
            },
            {
              Icon: MapPin,
              label: "Office",
              value: "Level 4, 34 Awal Centre, Banani, Dhaka",
            },
          ].map((item) => (
            <CardInfo
              key={item.label}
              icon={item.Icon}
              label={item.label}
              value={item.value}
            />
          ))}
        </motion.div>

        {/* Contact Form */}
        <motion.form
          onSubmit={onSubmit}
          noValidate
          className="
            rounded-3xl border border-border bg-card shadow-lg
            p-4 md:p-6 lg:p-8 flex flex-col justify-center
            lg:col-span-2
            "
          variants={fadein("left",0.12)}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" error={errors.name}>
              <Input
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Your full name"
                required
                className="bg-input text-foreground"
                autoComplete="name"
                disabled={loading}
              />
            </Field>
            <Field label="Email" error={errors.email}>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="you@email.com"
                required
                className="bg-input text-foreground"
                autoComplete="email"
                disabled={loading}
              />
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Message" error={errors.message}>
              <Textarea
                rows={6}
                value={form.message}
                onChange={(e) => handleChange("message", e.target.value)}
                required
                className="bg-input text-foreground resize-none"
                placeholder="How can we help you?"
                disabled={loading}
              />
            </Field>
          </div>
          <Button
            type="submit"
            size="lg"
            className="
              mt-6 w-full sm:w-fit
              bg-primary text-primary-foreground
              hover:bg-primary/90
              focus-visible:ring-2 focus-visible:ring-primary
              transition-shadow shadow-lg
              disabled:opacity-60 disabled:cursor-not-allowed
            "
            disabled={loading}
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Send message"}
          </Button>
        </motion.form>
      </motion.div>
    </motion.section>
  );
}

/** ===== Contact Card Component ===== */
function CardInfo({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <motion.div
      className="
        rounded-2xl border border-border bg-card
        p-5 flex flex-col gap-1.5 shadow-sm
        items-start
        w-full
      "
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.32, ease: "easeOut" } },
      }}
      whileHover={{ scale: 1.026, boxShadow: "0 8px 32px 0 var(--accent,rgba(0,0,0,0.07))" }}
      transition={{ type: "spring", stiffness: 175, damping: 18 }}
      tabIndex={0}
      aria-label={label + ": " + value}
    >
      <Icon className="mb-2 h-5 w-5 text-primary" />
      <span className="font-display font-semibold text-card-foreground">{label}</span>
      <span className="text-sm text-muted-foreground break-words">{value}</span>
    </motion.div>
  );
}

/** ===== Field Component ===== */
function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-1.5">
      <Label className="block text-sm font-medium text-foreground mb-1">{label}</Label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            className="mt-1 text-xs text-destructive"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.23, ease: "easeOut" } }}
            exit={{ opacity: 0, y: 12, transition: { duration: 0.16, ease: "easeIn" } }}
            role="status"
            aria-live="polite"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
