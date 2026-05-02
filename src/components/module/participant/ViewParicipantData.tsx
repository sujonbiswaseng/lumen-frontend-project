import { initiatePayment } from '@/actions/payment.actions';
import { IBaseEvent } from '@/types/event.types';
import { TResponseParticipant } from '@/types/participant.types';
import { IBaseUser } from '@/types/user.types';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import React from 'react';

// --- Status Badge Utility
const statusBadgeProps: Record<
  string,
  {
    label: string;
    classNames: string;
  }
> = {
  PENDING: {
    label: 'Pending',
    classNames:
      'bg-muted text-muted-foreground border border-border',
  },
  APPROVED: {
    label: 'Approved',
    classNames:
      'bg-secondary text-secondary-foreground border border-secondary',
  },
  REJECTED: {
    label: 'Rejected',
    classNames:
      'bg-accent text-accent-foreground border border-accent',
  },
  BANNED: {
    label: 'Banned',
    classNames:
      'bg-muted text-foreground border border-border opacity-70',
  },
  DEFAULT: {
    label: '',
    classNames: 'bg-muted text-muted-foreground border border-border',
  },
};

// --- Status Badge Component ---
function StatusBadge({ status }: { status: string }) {
  const badge = statusBadgeProps[status] || {
    ...statusBadgeProps['DEFAULT'],
    label: status,
  };
  return (
    <span
      className={`inline-block ml-2 px-3 py-1 rounded-full font-medium text-xs ${badge.classNames}`}
      aria-label={`Status: ${badge.label}`}
    >
      {badge.label}
    </span>
  );
}

// --- Field Group ---
function FieldGroup({
  label,
  children,
  mono,
}: {
  label: string;
  children: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[15px] text-muted-foreground font-medium">{label}</span>
      <span
        className={`block text-card-foreground ${
          mono
            ? 'font-mono text-sm select-all bg-muted rounded px-2 py-1'
            : 'font-semibold'
        }`}
      >
        {children}
      </span>
    </div>
  );
}

const ViewParticipantData = ({
  viewMode,
  viewData,
  ispay,
}: {
  ispay?: boolean;
  viewMode: boolean;
  viewData?: TResponseParticipant<{ event: IBaseEvent; user: IBaseUser }>;
}) => {
  const router = useRouter();

  // --- Animation variants ---
  const cardVariants = {
    initial: { opacity: 0, y: 24, scale: 0.98 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', duration: 0.5, bounce: 0.08 },
    },
    exit: {
      opacity: 0,
      y: 12,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  };

  const handlePayNow = async (eventId: string) => {
    const toastId = toast.loading('Processing payment...');
    try {
      const res = await initiatePayment(eventId);
      toast.dismiss(toastId);
      if (res.success && res.data?.paymentUrl) {
        router.push(res.data.paymentUrl);
        toast.success(res.message || 'Redirecting to payment.');
        return;
      } else {
        toast.error(res.message || 'Payment could not be initiated.');
      }
    } catch (err) {
      toast.dismiss(toastId);
      toast.error('Payment processing failed.');
      // eslint-disable-next-line no-console
      console.error(err);
    }
  };

  if (!viewMode || !viewData) return null;

  return (
    <section className="w-full flex items-center justify-center">
      <motion.div
        variants={cardVariants as any}
        initial="initial"
        animate="animate"
        exit="exit"
        className="w-full max-w-[1440px] mx-auto px-4 md:px-8 py-6"
      >
        <div className="bg-card border border-border rounded-2xl shadow-lg px-4 sm:px-8 py-8 space-y-8 w-full mx-auto">
          {/* Top: Event Info */}
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="flex-shrink-0 w-28 h-28 flex items-center justify-center border border-input rounded-xl bg-muted shadow-inner overflow-hidden">
              {viewData.event?.images[0] ? (
                <img
                  src={viewData.event.images[0]}
                  alt={viewData.event?.title ?? 'Event'}
                  className="w-full h-full object-cover rounded-xl"
                  loading="lazy"
                />
              ) : (
                <span className="flex items-center justify-center w-full h-full text-4xl text-muted-foreground">
                  <svg
                    width={44}
                    height={44}
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <circle cx="10" cy="10" r="9" className="fill-muted" />
                    <text
                      x="50%"
                      y="55%"
                      textAnchor="middle"
                      className="fill-muted-foreground"
                      fontSize="13"
                      dy=".3em"
                    >
                      🎫
                    </text>
                  </svg>
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0 w-full flex flex-col gap-2">
              <h2 className="font-semibold text-2xl md:text-3xl leading-tight tracking-tight text-foreground mb-1 truncate">
                {viewData.event?.title || '-'}
              </h2>
              <div className="flex flex-wrap items-center gap-4 mt-1">
                {/* Date */}
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    <svg width={18} height={18} fill="none" viewBox="0 0 24 24">
                      <path
                        d="M15 2v2m-6-2v2m-5 4h16M5 6v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6"
                        stroke="currentColor"
                        strokeWidth={1.3}
                      />
                    </svg>
                  </span>
                  <span className="font-medium text-muted-foreground">
                    {viewData.event?.date
                      ? new Date(viewData.event.date).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })
                      : '-'}
                  </span>
                </div>
                {/* Venue */}
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    <svg width={18} height={18} fill="none" viewBox="0 0 24 24">
                      <path
                        d="M21 10.5V6a2 2 0 0 0-2-2h-2M3 6a2 2 0 0 1 2-2h2M3 18v-3M16 18h2a2 2 0 0 0 2-2v-2M3 10.5V18c0 1.1.9 2 2 2h2M12 8v4l3 2"
                        stroke="currentColor"
                        strokeWidth={1.3}
                      />
                    </svg>
                  </span>
                  <span className="font-medium text-muted-foreground">
                    {viewData.event?.location || '-'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-border" />

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
            <FieldGroup label="Participant ID:" mono>
              {viewData.id || '-'}
            </FieldGroup>
            <div>
              <span className="text-[15px] text-muted-foreground font-medium">Status:</span>
              <StatusBadge status={String(viewData.status)} />
            </div>
            <FieldGroup label="Participant:">
              {viewData.user?.name ?? viewData.userId ?? '-'}
            </FieldGroup>
            <FieldGroup label="Payment Status:">
              {viewData.paymentStatus || '-'}
            </FieldGroup>
            <FieldGroup label="Fee:">
              {viewData.event.fee ? `${viewData.event.fee}` : '-'}
            </FieldGroup>
            <FieldGroup label="Email:">
              {viewData.user.email || '-'}
            </FieldGroup>
            <div className="sm:col-span-2">
              <span className="text-[15px] text-muted-foreground font-medium">
                Joined At:
              </span>
              <span className="block text-card-foreground">
                {viewData.joinedAt
                  ? new Date(viewData.joinedAt).toLocaleString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : '-'}
              </span>
            </div>
            {/* Pay Now Button */}
            {ispay ? (
              <div className="flex items-center sm:col-span-2">
                <motion.button
                  whileHover={{ scale: 1.035 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 16 }}
                  onClick={() => handlePayNow(viewData.event.id)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all duration-300 text-base w-full sm:w-auto justify-center"
                  style={{ letterSpacing: '.01rem' }}
                  aria-label="Pay Now"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 9V7a5 5 0 00-10 0v2m2 8h6M12 17v1m-6-3h12a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z"
                    />
                  </svg>
                  Pay Now
                </motion.button>
              </div>
            ) : null}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default ViewParticipantData;