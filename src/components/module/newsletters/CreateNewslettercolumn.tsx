import { motion } from "framer-motion";
import CopyableId from "@/components/shared/CopyId";


export const createNewsLetterColumns = () => [
  // ID Column
  {
    key: "id",
    label: "ID",
    render: (row: any) => (
      <motion.div
        initial={{ opacity: 0, y: 6, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25, type: "spring", stiffness: 340, damping: 22 }}
        className="flex items-center"
      >
        <CopyableId
          id={row.id}
          showShort={row.id?.slice(0, 8)}
          className="font-mono tracking-tight text-xs md:text-xs text-primary-foreground bg-primary rounded px-2 py-1 hover:bg-primary/80 transition-colors cursor-pointer"
        />
      </motion.div>
    ),
  },
  // Email Column
  {
    key: "email",
    label: "Email",
    render: (row: any) => (
      <motion.span
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="text-sm md:text-xs text-[var(--foreground)] truncate max-w-[16rem] md:max-w-xs"
        title={row.email}
      >
        {row.email?.slice(0, 28)}{row.email?.length > 28 ? "..." : ""}
      </motion.span>
    ),
  },
  // Created At Column
  {
    key: "createdAt",
    label: "Created",
    render: (row: any) =>
      row.createdAt ? (
        <motion.span
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.21, ease: "easeOut" }}
          className="text-[var(--muted-foreground)] font-medium text-xs md:text-xs whitespace-nowrap"
          title={new Date(row.createdAt).toLocaleString()}
        >
          {new Date(row.createdAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </motion.span>
      ) : (
        <span className="text-[var(--muted-foreground)] text-xs">—</span>
      ),
  },
  // User ID Column
  {
    key: "userId",
    label: "User ID",
    render: (row: any) => (
      <motion.div
        initial={{ opacity: 0, y: 6, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25, type: "spring", stiffness: 340, damping: 22 }}
        className="flex items-center"
      >
        <CopyableId
          id={row.userId}
          showShort={row.userId?.slice(0, 8)}
          className="font-mono tracking-tight text-xs md:text-xs text-secondary-foreground bg-secondary rounded px-2 py-1 hover:bg-secondary/80 transition-colors cursor-pointer"
        />
      </motion.div>
    ),
  },
];