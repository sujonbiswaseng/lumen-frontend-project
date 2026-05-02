import React from 'react';
import { motion } from 'framer-motion';
import CopyableId from '@/components/shared/CopyId';
import { IBaseEvent } from '@/types/event.types';
import { IgetReviewData } from '@/types/review.types';
import { TResponseUserData } from '@/types/user.types';

// Map status to design tokens via Tailwind using ONLY global CSS vars
const USER_STATUS: Record<
  string,
  { label: string; badgeClass: string }
> = {
  ACTIVE: {
    label: 'Active',
    badgeClass:
      'bg-secondary text-secondary-foreground border border-border'
  },
  INACTIVE: {
    label: 'Inactive',
    badgeClass:
      'bg-muted text-muted-foreground border border-border'
  },
  BLOCKED: {
    label: 'Blocked',
    badgeClass:
      'bg-accent text-accent-foreground border border-accent'
  },
  DELETED: {
    label: 'Deleted',
    badgeClass:
      'bg-muted text-muted-foreground border border-border opacity-70'
  }
};

type ViewUserDataProps = {
  viewMode: boolean;
  viewData?: TResponseUserData<{
    reviews: IgetReviewData[];
    event: IBaseEvent[];
    accounts: { password: string }[];
  }>;
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } }
};

// Simple reusable badge
function InfoBadge({
  children,
  className = ''
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full font-medium text-xs border select-none whitespace-nowrap ${className}`}
    >
      {children}
    </span>
  );
}

const ViewUserData: React.FC<ViewUserDataProps> = ({ viewMode, viewData }) => {
  if (!viewMode || !viewData) return null;

  const statusDef =
    USER_STATUS[viewData.status as keyof typeof USER_STATUS] ?? {
      label: viewData.status ?? 'Unknown',
      badgeClass: 'bg-muted text-muted-foreground border border-border'
    };

  return (
    <motion.section
      className="w-full max-w-[1440px] mx-auto py-8 px-2 flex items-center justify-center min-h-[60vh] bg-background"
      initial="hidden"
      animate="visible"
      variants={fadeUp as any}
    >
      <div className="w-full max-w-xl bg-card border border-border shadow-[0_4px_32px_-8px_var(--accent)] rounded-3xl overflow-hidden flex flex-col">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row items-center md:items-start gap-8 px-6 py-8 bg-gradient-to-r from-[var(--background)] via-[var(--card)] to-[var(--background)]"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.33, ease: 'easeOut' }}
        >
          {/* Avatar */}
          <div className="flex-shrink-0 flex items-center justify-center w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-card border-4 border-border">
            {viewData.image ? (
              <img
                src={viewData.image}
                alt={viewData.name || 'User'}
                className="object-cover w-full h-full rounded-full ring-2 ring-accent"
                draggable={false}
              />
            ) : (
              <span className="text-[2.5rem] sm:text-[3.5rem] select-none text-muted-foreground">👤</span>
            )}
          </div>
          {/* Basic Info */}
          <div className="flex-1 w-full min-w-0 flex flex-col gap-3">
            <span className="font-extrabold text-xl sm:text-2xl md:text-3xl text-primary truncate break-words">
              {viewData.name || '-'}
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {/* Email */}
              <span className="inline-flex items-center gap-1 font-medium text-base text-muted-foreground">
                <svg width={18} height={18} fill="none" viewBox="0 0 24 24" aria-hidden>
                  <path
                    d="M15 2v2m-6-2v2m-5 4h16M5 6v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6"
                    stroke="currentColor"
                    strokeWidth={1.3}
                  />
                </svg>
                <span className="truncate max-w-[130px] sm:max-w-[200px]">
                  {viewData.email || '-'}
                </span>
              </span>
              {/* Status */}
              <InfoBadge className={statusDef.badgeClass}>
                {statusDef.label}
              </InfoBadge>
              {/* Role */}
              <InfoBadge className="bg-secondary text-secondary-foreground border border-secondary">
                {viewData.role}
              </InfoBadge>
              {/* Email Verified */}
              <InfoBadge className={
                viewData.emailVerified
                  ? 'bg-primary text-primary-foreground border border-primary'
                  : 'bg-muted text-muted-foreground border border-border'
              }>
                {viewData.emailVerified ? "Email Verified" : "Email Not Verified"}
              </InfoBadge>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="inline-block text-muted-foreground text-sm">
                Joined:{' '}
                <span className="text-primary font-medium">
                  {viewData.createdAt
                    ? new Date(viewData.createdAt).toLocaleString()
                    : "N/A"}
                </span>
              </span>
            </div>
          </div>
        </motion.div>
        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" aria-hidden />
        {/* Details Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 py-8 bg-card"
          variants={fadeUp as any}
          transition={{ delay: 0.07, duration: 0.35, ease: 'easeOut' }}
        >
          {/* Phone */}
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground text-sm font-medium mb-1">Phone</span>
            <span className="font-mono text-base text-card-foreground bg-input rounded-lg px-3 py-2 block border border-input">
              {viewData.phone || '—'}
            </span>
          </div>
          {/* Average Rating */}
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground text-sm font-medium mb-1">Average Rating</span>
            <span className="flex items-center font-mono text-base text-accent-foreground bg-accent rounded-lg px-3 py-2 border border-accent gap-2">
              {typeof viewData.averageRating === 'number'
                ? viewData.averageRating.toFixed(2)
                : '0.00'}
              <svg className="inline align-text-bottom" width={16} height={16} fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                <path d="M10 15.27L16.18 19l-1.64-7.03L19 7.24l-7.19-.61L10 0 8.19 6.63 1 7.24l5.46 4.73L4.82 19z" />
              </svg>
            </span>
          </div>
          {/* Events Count */}
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground text-sm font-medium mb-1">Events</span>
            <span className="font-mono text-base text-accent-foreground bg-accent rounded-lg px-3 py-2 border border-accent">
              {Array.isArray(viewData.event) ? viewData.event.length : 0}
            </span>
          </div>
          {/* Total Reviews */}
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground text-sm font-medium mb-1">Total Reviews</span>
            <span className="font-mono text-base text-accent-foreground bg-accent rounded-lg px-3 py-2 border border-accent">
              {viewData.totalReview ?? 0}
            </span>
          </div>
          {/* Email Verified */}
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground text-sm font-medium mb-1">Email Verified</span>
            <span className={`font-mono text-base rounded-lg px-3 py-2 border ${viewData.emailVerified
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-muted text-muted-foreground border-border"
              }`}>
              {viewData.emailVerified ? "Yes" : "No"}
            </span>
          </div>
          {/* Created At */}
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground text-sm font-medium mb-1">Created At</span>
            <span className="font-mono text-base text-card-foreground bg-input rounded-lg px-3 py-2 border border-input">
              {viewData.createdAt
                ? new Date(viewData.createdAt).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
          {/* Password(s) */}
          <div className="flex flex-col gap-1 col-span-1 md:col-span-2 lg:col-span-1">
            <span className="text-muted-foreground text-sm font-medium mb-1">Password(s)</span>
            <div className="space-y-1">
              {Array.isArray(viewData.accounts) && viewData.accounts.length > 0 ? (
                viewData.accounts.map((item, idx) => (
                  <div key={idx}>
                    <CopyableId href={item.password} id={viewData.id} />
                  </div>
                ))
              ) : (
                <span className="font-mono text-base text-muted-foreground bg-input rounded-lg px-3 py-2 border border-input block">
                  —
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ViewUserData;