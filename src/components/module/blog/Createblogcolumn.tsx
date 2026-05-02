import { motion } from "framer-motion";
import CopyableId from "@/components/shared/CopyId";

export const createBlogColumns = () => [
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
  // Title Column
  {
    key: "title",
    label: "Title",
    render: (row: any) => (
      <motion.span
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="font-semibold text-base md:text-sm text-[var(--foreground)] truncate max-w-[16rem] md:max-w-xs"
        title={row.title}
      >
        {row.title.slice(0,14)} ...
      </motion.span>
    ),
  },
  // Content Column
  {
    key: "content",
    label: "Content",
    render: (row: any) => (
      <motion.span
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="text-sm md:text-xs text-[var(--muted-foreground)] line-clamp-2 max-w-[18rem] md:max-w-sm"
        title={row.content}
      >
        {row.content.slice(0,10)} ...
      </motion.span>
    ),
  },
  // Author Column
  {
    key: "authorId",
    label: "authorId",
    render: (row: any) => (
      <motion.div
        initial={{ opacity: 0, x: -6 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2, type: "spring", stiffness: 290 }}
        className="flex items-center"
      >
         <CopyableId
          id={row.authorId}
          showShort={row.authorId?.slice(0, 8)}
          className="font-mono tracking-tight text-xs md:text-xs text-primary-foreground bg-primary rounded px-2 py-1 hover:bg-primary/80 transition-colors cursor-pointer"
        />
      </motion.div>
    ),
  },
  // Related Event Column
  {
    key: "eventId",
    label: "eventId",
    render: (row: any) =>
      row.eventId ? (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.22, type: "spring", stiffness: 290 }}
          className="flex items-center"
        >
         <CopyableId
          id={row.eventId}
          showShort={row.eventId?.slice(0, 8)}
          className="font-mono tracking-tight text-xs md:text-xs text-primary-foreground bg-primary rounded px-2 py-1 hover:bg-primary/80 transition-colors cursor-pointer"
        />
        </motion.div>
      ) : (
        <span className="text-xs md:text-xs text-[var(--muted-foreground)]">—</span>
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
  // Updated At Column
  {
    key: "updatedAt",
    label: "Updated",
    render: (row: any) =>
      row.updatedAt ? (
        <motion.span
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.21, ease: "easeOut" }}
          className="text-[var(--muted-foreground)] text-xs md:text-xs whitespace-nowrap"
          title={new Date(row.updatedAt).toLocaleString()}
        >
          {new Date(row.updatedAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </motion.span>
      ) : (
        <span className="text-[var(--muted-foreground)] text-xs">—</span>
      ),
  },
];