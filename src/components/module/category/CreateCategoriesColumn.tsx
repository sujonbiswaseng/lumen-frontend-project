import CopyId from "@/components/shared/CopyId";
import { motion } from "framer-motion";

const thClass = `
  px-4 py-3 
  text-xs font-semibold 
  text-left 
  bg-card text-card-foreground
  border-b border-border 
  select-none
  min-w-[64px]
`;

const tdClass = `
  px-3 py-2
  text-sm
  text-foreground
  whitespace-nowrap
  align-middle
  bg-background
`;

const iconClass = `
  w-4 h-4 
  mr-1 
  text-primary
  flex-shrink-0
`;

const fadeVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.24, ease: "easeOut" } }
};

export const createCategoryColumns = () => [
  {
    key: "id",
    label: (
      <span className={thClass}>
        <span className="inline-flex items-center gap-2">
          <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
            <rect x="4" y="4" width="16" height="16" rx="3" />
            <path d="M9 9h6v6H9z" />
          </svg>
          <span>ID</span>
        </span>
      </span>
    ),
    render: (row: any) => (
      <motion.div
        className={tdClass}
        initial="hidden"
        animate="visible"
      >
        <CopyId
          id={row.id}
          href={`/category/${row.id}`}
          className="
            rounded 
            px-2 py-1 
            font-mono 
            text-primary hover:bg-accent 
            hover:text-accent-foreground transition
            border border-border bg-input
            focus-visible:ring-2 focus-visible:ring-ring
            cursor-pointer
          "
          showShort={!!row.id}
          key={row.id}
     
        />
      </motion.div>
    ),
  },
  {
    key: "adminId",
    label: (
      <span className={thClass}>
        <span className="inline-flex items-center gap-2">
          <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="8" r="4" />
            <path d="M6.2 19.2A8 8 0 1 1 17.8 19.2" />
          </svg>
          <span>Admin</span>
        </span>
      </span>
    ),
    render: (row: any) => (
      <motion.div
        className={tdClass}
        initial="hidden"
        animate="visible"
      >
        <CopyId
          id={row.adminId}
          href={`/profile/user/${row.adminId}`}
          className="
            rounded 
            px-2 py-1 
            font-mono 
            text-secondary hover:bg-accent 
            hover:text-accent-foreground transition
            border border-border bg-input
            focus-visible:ring-2 focus-visible:ring-ring
            cursor-pointer
          "
          showShort={!!row.adminId}
          key={row.adminId}
     
        />
      </motion.div>
    ),
  },
  {
    key: "name",
    label: (
      <span className={thClass}>
        <span className="inline-flex items-center gap-2">
          <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 20v-7.586l7.293-7.293a1 1 0 0 1 1.414 0l7.293 7.293V20H4z" />
            <path d="M8 20v-5h8v5" />
          </svg>
          <span>Name</span>
        </span>
      </span>
    ),
    render: (row: any) => (
      <motion.span
        className="
          font-medium 
          text-card-foreground
          px-2
          truncate block max-w-[136px]"
        initial="hidden"
        animate="visible"
      >
        {row.name}
      </motion.span>
    ),
  },
  {
    key: "image",
    label: (
      <span className={thClass}>
        <span className="inline-flex items-center gap-2">
          <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <circle cx="8.5" cy="12.5" r="2.5" />
            <path d="M21 15.5l-5-4-3 3.5-2-2-5 5" />
          </svg>
          <span>Img</span>
        </span>
      </span>
    ),
    render: (row: any) => (
      <motion.span
        className="flex items-center gap-2 px-2 min-h-[2.5rem]"
        initial="hidden"
        animate="visible"
      >
        {row.image ? (
          <img
            src={row.image}
            alt={row.name || "Category"}
            className="
              rounded 
              w-9 h-9 object-cover 
              border border-border 
              bg-muted
              shadow-sm"
          />
        ) : (
          <span className="italic text-muted-foreground">—</span>
        )}
      </motion.span>
    ),
  },
  {
    key: "createdAt",
    label: (
      <span className={thClass}>
        <span className="inline-flex items-center gap-2">
          <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          <span>Created</span>
        </span>
      </span>
    ),
    render: (row: any) => {
      const date = new Date(row.createdAt);
      return (
        <motion.span
          className="
            rounded 
            px-3 py-1
            text-xs 
            bg-card 
            text-muted-foreground 
            border border-border"
          initial="hidden"
          animate="visible"
        >
          {isNaN(date.getTime())
            ? <span className="text-destructive">-</span>
            : date.toLocaleDateString(undefined, { year: "2-digit", month: "short", day: "numeric" })}
        </motion.span>
      );
    },
  },
];