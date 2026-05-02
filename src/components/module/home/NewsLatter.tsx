'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createNewsletterAction } from '@/actions/newsletter.actions';
import { toast } from 'react-toastify';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.36, ease: 'easeOut' } }
};

const NEWSLETTER_DEFAULT_IMAGE =
  '/event-newsletter-default.svg'; // Default event-related illustration

const NewsLatter = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    const toastId = toast.loading('Subscribing to newsletter...');
    try {
      const response = await createNewsletterAction({ email });
      toast.dismiss(toastId);

      if (response?.success) {
        toast.success(response.message || 'Subscribed successfully!');
        setSubmitted(true);
      } else {
        setError(response?.message || 'Something went wrong.');
        toast.error(response?.message || 'Failed to subscribe.');
      }
    } catch (err: any) {
      toast.dismiss(toastId);
      setError('An unexpected error occurred.');
      toast.error('An unexpected error occurred.');
    }
  };

  return (
    <section
      className="
        relative flex justify-center items-center
        w-full max-w-[1440px] mx-auto
        px-4 md:px-8
        py-10 md:py-20
        rounded-2xl md:rounded-3xl overflow-hidden
        bg-card border border-border
        shadow-xl md:shadow-2xl
      "
      aria-labelledby="newsletter-heading"
    >
      {/* Background image & overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <Image
          src="/newsletter-bg.jpg"
          alt=""
          fill
          priority={false}
          sizes="100vw"
          className="object-cover opacity-60"
          style={{ filter: 'brightness(0.88) blur(2px)' }}
        />
        {/* Strict gradient overlay using only color tokens */}
        <div className="absolute inset-0 bg-gradient-to-br from-[rgba(var(--background),0.93)] via-[rgba(var(--accent),0.33)] to-[rgba(var(--primary),0.23)] pointer-events-none" />
      </div>
      <motion.div
        className="
          relative z-10 flex flex-col md:flex-row
          w-full gap-8 md:gap-12
          items-center justify-center
        "
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.7 }}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.14,
            },
          },
        }}
      >
        {/* Illustration / Left side */}
        <motion.div
          className="hidden md:flex flex-1 items-center justify-center pr-0 md:pr-8"
        
        >
          <div className="relative w-[240px] h-[280px] rounded-xl bg-muted shadow-lg flex items-center justify-center">
            <Image
              src={'https://images.pexels.com/photos/3944460/pexels-photo-3944460.jpeg'}
              alt="Event newsletter illustration"
              fill
              style={{ objectFit: 'contain' }}
              className="rounded-xl"
              sizes="(min-width: 768px) 240px, 100vw"
              priority={false}
              loading="lazy"
            />
          </div>
        </motion.div>
        {/* Content / Right side */}
        <motion.div
          className="flex-1 w-full max-w-lg"
          
        >
          <div className="text-center md:text-left mb-6">
            <h2
              id="newsletter-heading"
              className="
                text-3xl md:text-4xl lg:text-5xl font-bold md:font-extrabold
                text-card-foreground
                tracking-tight mb-2
              "
            >
              Join our Professional Newsletter
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-7 font-medium">
              Get handpicked industry insights, strategies, and exclusive event updates—straight to your inbox.
            </p>
          </div>
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form
                key="newsletter-form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.3, ease: 'easeOut' },
                }}
                exit={{
                  opacity: 0,
                  y: -8,
                  transition: { duration: 0.17, ease: 'easeIn' },
                }}
                className="flex flex-col sm:flex-row items-center gap-4 md:gap-6"
                autoComplete="off"
                aria-label="Subscribe to newsletter"
              >
                <Input
                  type="email"
                  className="
                    flex-1 min-w-[220px] max-w-xs
                    border-input bg-input
                    text-foreground
                    placeholder:text-muted-foreground
                    ring-0 focus:ring-2 focus:ring-primary
                    rounded-lg
                  "
                  placeholder="Enter your business email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  aria-label="Email address"
                  autoCapitalize="off"
                  autoCorrect="off"
                  autoComplete="off"
                />
                <Button
                  type="submit"
                  variant="default"
                  className="w-full sm:w-auto bg-primary text-primary-foreground font-semibold shadow-sm hover:bg-primary/90 transition-colors duration-300"
                >
                  Subscribe
                </Button>
              </motion.form>
            ) : (
              <motion.div
                key="thank-you"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.25, ease: 'easeOut' },
                }}
                exit={{
                  opacity: 0,
                  scale: 0.98,
                  transition: { duration: 0.13, ease: 'easeIn' },
                }}
                className="flex items-center gap-2 mt-4 md:mt-7 text-lg md:text-xl font-semibold text-accent-foreground bg-accent/50 rounded-lg px-4 py-3 animate-in fade-in"
                role="status"
                aria-live="polite"
              >
                <span className="text-2xl">🎉</span>
                Thank you for subscribing!
              </motion.div>
            )}
          </AnimatePresence>
          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.p
                key="newsletter-error"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.18 } }}
                exit={{ opacity: 0, y: 6, transition: { duration: 0.1 } }}
                className="mt-2 text-sm text-accent font-semibold"
                role="alert"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <div className="mt-6 text-xs text-muted-foreground text-center md:text-left">
            <span>We respect your privacy. Unsubscribe anytime.</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default NewsLatter;