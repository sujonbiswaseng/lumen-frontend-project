import { motion } from "framer-motion";
import CopyableId from "@/components/shared/CopyId";

// FIELDS FROM @file_context_0:
// id, title, description, image, userId, createdAt

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
        {row.title?.slice(0, 18)}{row.title?.length > 18 ? "..." : ""}
      </motion.span>
    ),
  },
  // Description Column
  {
    key: "description",
    label: "Description",
    render: (row: any) => (
      <motion.span
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="text-sm md:text-xs text-[var(--muted-foreground)] line-clamp-2 max-w-[18rem] md:max-w-sm"
        title={row.description}
      >
        {row.description?.slice(0, 25)}{row.description?.length > 25 ? "..." : ""}
      </motion.span>
    ),
  },
  // Image Column
  {
    key: "image",
    label: "Image",
    render: (row: any) =>
      row.image ? (
        <motion.img
          initial={{ opacity: 0, scale: 0.93 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          src={row.image}
          alt="Highlight Image"
          className="w-12 h-12 object-cover rounded-md border border-muted"
        />
      ) : (
        <span className="text-xs text-[var(--muted-foreground)]">No image</span>
      ),
  },
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
];