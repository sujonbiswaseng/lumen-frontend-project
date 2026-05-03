import React from "react";
import { motion } from "framer-motion";

interface Category {
  id: string;
  adminId: string;
  name: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  meals: any[];
  user?: { name?: string; email?: string };
}

function formatDate(date: string | undefined): string {
  if (!date) return "-";
  try {
    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "-";
  }
}

const CategoryAvatar: React.FC<{ image?: string; name?: string }> = ({
  image,
  name,
}) => (
  <div
    className="
      flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 
      flex items-center justify-center 
      border border-input rounded-xl
      bg-background shadow-inner overflow-hidden
    "
    aria-label={image ? `Category image: ${name ?? "Category"}` : "No category image"}
  >
    {image ? (
      <img
        src={image}
        alt={name || "Category"}
        className="w-full h-full object-cover rounded-lg"
        loading="lazy"
        draggable={false}
      />
    ) : (
      <span className="flex items-center justify-center w-full h-full select-none">
        {/* Accessible fallback, strictly using system colors */}
        <svg
          viewBox="0 0 40 40"
          width={48}
          height={48}
          aria-hidden="true"
          className="w-12 h-12"
        >
          <rect
            x="2"
            y="2"
            width="36"
            height="36"
            rx="10"
            fill="var(--muted)"
          />
          <text
            x="50%"
            y="60%"
            dominantBaseline="middle"
            textAnchor="middle"
            fill="var(--muted-foreground)"
            fontSize="20"
            fontFamily="sans-serif"
          >
            🍕
          </text>
        </svg>
      </span>
    )}
  </div>
);

const DetailRow: React.FC<{
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}> = ({ label, value, mono }) => (
  <div className="space-y-1">
    <span className="text-muted-foreground font-medium">{label}</span>
    <span
      className={`block mt-0.5 ${
        mono
          ? "font-mono text-sm select-all bg-muted rounded px-2 py-1"
          : "font-semibold"
      } text-card-foreground break-all`}
    >
      {value ?? <span className="text-muted-foreground">-</span>}
    </span>
  </div>
);

const ViewCategoryData: React.FC<{
  viewMode: boolean;
  viewData?: Category;
}> = ({ viewMode, viewData }) => {
  if (!viewMode || !viewData) return null;

  return (
    <div className="w-full max-w-[1440px] mx-auto flex justify-center items-start px-4 sm:px-6">
      <motion.section
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.3,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="
          w-full max-w-2xl
          rounded-2xl
          shadow-lg
          bg-card
          text-card-foreground
          border border-border
          flex flex-col gap-8
          px-4 py-6
          sm:px-8 sm:py-8
        "
        aria-label="View Category Details"
      >
        <div className="flex flex-col sm:flex-row gap-6 items-center">
          <CategoryAvatar image={viewData.image} name={viewData.name} />
          <div className="flex-1 min-w-0 w-full">
            <h2 className="font-bold text-2xl sm:text-3xl text-foreground truncate mb-1">
              {viewData.name ?? (
                <span className="text-muted-foreground">-</span>
              )}
            </h2>
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <div className="flex items-center gap-2">
                <span className="font-medium text-muted-foreground">
                  Created:
                </span>
                <span className="text-foreground font-medium">
                  {formatDate(viewData.createdAt)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-muted-foreground">
                  Updated:
                </span>
                <span className="text-foreground font-medium">
                  {formatDate(viewData.updatedAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
        <motion.div
          key={viewData.id}
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.3,
            ease: "easeOut",
          }}
          className="
            rounded-2xl
            border border-border
            bg-card
            shadow
            px-4 py-6
            sm:px-6
            flex flex-col gap-8
          "
        >
          <div
            className="
              grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4
              text-[15px]
            "
          >
            <DetailRow label="Category ID:" value={viewData.id} mono />
            <DetailRow label="Admin ID:" value={viewData.adminId} />
            <DetailRow
              label="Meals Count:"
              value={Array.isArray(viewData.meals) ? viewData.meals.length : 0}
            />
            <DetailRow
              label="Admin Name:"
              value={viewData.user?.name ?? "-"}
            />
            <div className="sm:col-span-2">
              <DetailRow
                label="Admin Email:"
                value={viewData.user?.email ?? "-"}
              />
            </div>
          </div>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default ViewCategoryData;