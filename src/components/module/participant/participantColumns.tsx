import CopyableId from "@/components/shared/CopyId";
import { motion } from "framer-motion";

/**
 * Reusable Badge component with production-grade, system-enforced color design.
 */
function StatusBadge({
  label,
  color = "muted",
  foreground = "muted-foreground",
  border = "border",
  className = "",
  children,
}: {
  label?: string;
  color?: string;
  foreground?: string;
  border?: string;
  className?: string;
  children: React.ReactNode;
}) {
  // Compose color classes strictly from CSS vars (no hardcoded/hex/rgb colors).
  return (
    <motion.span
      className={`
        inline-flex items-center gap-1
        px-2 py-0.5 rounded text-xs font-medium border
        bg-[var(--${color})] text-[var(--${foreground})] border-[var(--${border})]
        transition-colors duration-300
        ${className}
      `}
      initial={{ opacity: 0, y: 4, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, type: "spring", stiffness: 360, damping: 28 }}
      aria-label={label}
    >
      {children}
    </motion.span>
  );
}

const statusStyles = {
  PENDING:   { color: "secondary", foreground: "secondary-foreground", border: "border", label: "Pending" },
  APPROVED:  { color: "primary",   foreground: "primary-foreground",   border: "primary", label: "Approved" },
  REJECTED:  { color: "muted",     foreground: "muted-foreground",     border: "border", label: "Rejected" },
  BANNED:    { color: "input",     foreground: "foreground",           border: "border", label: "Banned"  },
  DEFAULT:   { color: "muted",     foreground: "muted-foreground",     border: "border", label: undefined }
};

const paymentStyles = {
  PAID:    { color: "primary",   foreground: "primary-foreground",   border: "primary", label: "Paid"    },
  UNPAID:  { color: "accent",    foreground: "accent-foreground",    border: "accent",  label: "Unpaid"  },
  FREE:    { color: "secondary", foreground: "secondary-foreground", border: "secondary", label: "Free" },
  DEFAULT: { color: "input",     foreground: "muted-foreground",     border: "border",  label: "N/A"     }
};

/**
 * Columns config for reusable, system-grade table.
 * Always fully responsive, premium, and scalable.
 */
export const createParticipantColumns = () => [
  {
    key: "id",
    label: "ID",
    render: (row: any) => (
      <CopyableId
        id={row.id}
        showShort={row.id.slice(0, 8)}
        className="font-mono tracking-tight text-sm md:text-xs"
      />
    ),
  },
  {
    key: "eventId",
    label: "Event",
    render: (row: any) => (
      <CopyableId
        id={row.eventId}
        href={row.eventId ? `/events/${row.eventId}` : undefined}
        showShort={row.eventId?.slice(0, 8)}
        className="font-mono tracking-tight text-sm md:text-xs"
      />
    ),
  },
  {
    key: "userId",
    label: "User",
    render: (row: any) => (
      <CopyableId
        id={row.userId}
        href={row.userId ? `/profile/${row.userId}` : undefined}
        showShort={row.userId?.slice(0, 8)}
        className="font-mono tracking-tight text-sm md:text-xs"
      />
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (row: any) => {
      const style = statusStyles[row.status as keyof typeof statusStyles] ?? statusStyles.DEFAULT;
      return (
        <StatusBadge
          color={style.color}
          foreground={style.foreground}
          border={style.border}
          label={style.label ?? row.status}
        >
          {style.label ?? row.status}
        </StatusBadge>
      );
    },
  },
  {
    key: "paymentStatus",
    label: "Payment",
    render: (row: any) => {
      const style = paymentStyles[row.paymentStatus as keyof typeof paymentStyles] ?? paymentStyles.DEFAULT;
      return (
        <StatusBadge
          color={style.color}
          foreground={style.foreground}
          border={style.border}
          label={style.label}
        >
          {style.label}
        </StatusBadge>
      );
    },
  },
  {
    key: "joinedAt",
    label: "Joined At",
    render: (row: any) =>
      row.joinedAt ? (
        <span
          className="
            text-[var(--muted-foreground)]
            font-medium
            text-xs md:text-sm
            whitespace-nowrap
            transition-colors
          "
          title={new Date(row.joinedAt).toLocaleString()}
        >
          {new Date(row.joinedAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      ) : (
        <span className="text-[var(--muted-foreground)] text-xs">--</span>
      ),
  },
];