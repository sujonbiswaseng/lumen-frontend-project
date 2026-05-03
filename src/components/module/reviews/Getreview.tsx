"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { ReusableTable } from "../table/Table";
import { FilterPanel } from "@/components/Filter";
import { TPagination } from "@/types/event.types";
import { TFilterField } from "@/types/filter.types";
import { useFilter } from "@/components/ReusableFilter";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import PaginationPage from "../event/Pagination";
import { TResponseReviewData } from "@/types/review.types";
import { deleteReview } from "@/actions/review.actions";
import UpdateReviewContent from "./UpdateReviewContent";
import ModerateUpdateForm from "./ModerateUpdateForm";
import CopyableId from "@/components/shared/CopyId";
import ViewReviewData from "./ViewReview";
import { motion, AnimatePresence } from "framer-motion";

// Design Token Map for statuses
const STATUS_TOKEN_MAP: Record<string, string> = {
  APPROVED: "bg-secondary text-secondary-foreground",
  REJECTED: "bg-accent text-accent-foreground",
  PENDING: "bg-muted text-muted-foreground",
};

// Action Color Map using only tokens
const ACTION_TOKEN_MAP = {
  view: "text-primary hover:bg-accent",
  edit: "text-secondary hover:bg-muted",
  delete: "text-accent hover:bg-accent/80"
};

interface MyReviewsTableProps {
  reviews: TResponseReviewData<any>[];
  pagination?: TPagination;
  role: string;
}

export default function MyReviewsTable({ reviews, pagination, role }: MyReviewsTableProps) {
  const router = useRouter();
  const [tableReviews, setTableReviews] = useState<TResponseReviewData<any>[]>(reviews);
  const [loading] = useState(false);
  const [open, setOpen] = useState(false);
  const [viewData, setViewData] = useState<any>(null);
  const [viewMode, setViewMode] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [editReviewDefaultValues, setEditReviewDefaultValues] = useState<{ rating?: number, comment?: string } | undefined>();
  const [form, setForm] = useState({ rating: 0, search: "", status: "" });
  const originalReviewsRef = useRef<TResponseReviewData<any>[]>(reviews);

  // Keep a clean reference for filtering
  useEffect(() => {
    originalReviewsRef.current = reviews;
    setTableReviews(reviews);
  }, [reviews]);

  // Action Handlers
  const handleDeleteReview = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this review? This action cannot be undone.")) return;
    try {
      const toastId = toast.loading("Deleting review...");
      const result = await deleteReview(id);
      toast.dismiss(toastId);
      if (result && result.success) {
        toast.success(result.message || "Review deleted successfully!");
        setTableReviews(prev => prev.filter((review) => review.id !== id));
        originalReviewsRef.current = originalReviewsRef.current.filter((review) => review.id !== id);
      } else {
        toast.error(result?.message || "Failed to delete review");
      }
    } catch (e: any) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  // Filter system logic
  const { updateFilters, reset , isPending } = useFilter();

  const handleChange = useCallback(
    (key: keyof typeof form, value: string | number) => {
      setForm(prev => ({ ...prev, [key]: value }));
    },
    []
  );
  const handleApply = () => updateFilters(form);

  const handleReset = () => {
    const defaultForm = { rating: 0, search: "", status: "" };
    setForm(defaultForm);
    reset();
  };

  // Client-side filtering for an optimal search experience
  useEffect(() => {
    let filtered = [...originalReviewsRef.current];
    if (form.search) {
      const s = form.search.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          (r.comment?.toLowerCase().includes(s) ?? false) ||
          (r.event?.title?.toLowerCase().includes(s) ?? false)
      );
    }
    if (form.rating > 0) {
      filtered = filtered.filter((r) => r.rating >= form.rating);
    }
    if (form.status) {
      filtered = filtered.filter((r) => r.status === form.status);
    }
    setTableReviews(filtered);
  }, [form, reviews]);


  // ========================
  // TABLE COLUMN DEFINITIONS
  // ========================
  const columns = [
    {
      key: "id",
      label: "ID",
      render: (r: any) => (
        <span className="font-mono text-muted-foreground text-xs">{r.id?.slice(0, 6)}</span>
      )
    },
    {
      key: "event",
      label: "Event",
      render: (r: any) => (
        <CopyableId id={r.event.id} href={`/events/${r.event.id}`} showShort={r.event?.id} />
      )
    },
    {
      key: "user",
      label: "User",
      render: (r: any) => (
        <span className="text-card-foreground text-xs">
          {r.user?.name}
          <br />
          <span className="text-muted-foreground text-xs font-light">{r.user?.email}</span>
        </span>
      )
    },
    {
      key: "comment",
      label: "Comment",
      render: (r: any) => (
        <span className="italic text-muted-foreground text-xs">
          {r.comment
            ? r.comment.slice(0, 48) + (r.comment.length > 48 ? "..." : "")
            : ""}
        </span>
      )
    },
    {
      key: "rating",
      label: "Rating",
      render: (r: any) => (
        <span className="inline-block rounded-md px-2 py-1 font-semibold text-[11px] bg-secondary text-secondary-foreground">{r.rating}</span>
      )
    },
    {
      key: "status",
      label: "Status",
      render: (r: any) => (
        <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest shadow-sm transition-colors duration-300 ${STATUS_TOKEN_MAP[r.status] || "bg-muted text-muted-foreground"} text-[11px]`}>
          {r.status}
        </span>
      )
    },
    {
      key: "createdAt",
      label: "Created At",
      render: (r: any) => (
        <span className="text-muted-foreground text-[11px]">{r.createdAt?.slice(0, 10)}</span>
      )
    },
  ];

  // Action buttons for table rows
  const actions = [
    {
      icon: Eye,
      label: "View",
      onClick: (review: any) => {
        setViewData(review);
        setViewMode(true);
        setOpen(true);
      },
      className: ACTION_TOKEN_MAP.view + " text-[13px]"
    },
    {
      icon: Pencil,
      label: "Edit",
      onClick: (review: any) => {
        setSelectedReviewId(review.id);
        setEditReviewDefaultValues({
          rating: review.rating,
          comment: review.comment,
        });
        setViewMode(false);
        setOpen(true);
      },
      className: ACTION_TOKEN_MAP.edit + " text-[13px]"
    },
    {
      icon: Trash2,
      label: "Delete",
      onClick: async (review: any) => {
        await handleDeleteReview(review.id);
      },
      className: ACTION_TOKEN_MAP.delete + " text-[13px]"
    },
  ];

  // FILTER PANEL FIELDS
  const fields: TFilterField[] = [
    {
      type: "text",
      name: "search",
      value: form.search || "",
      placeholder: "Search by comment or event title",
      onChange: (val) => handleChange("search", val)
    },
    {
      type: "range",
      name: "rating",
      label: "Minimum Rating",
      min: 0,
      max: 5,
      value: form.rating,
      onChange: (val) => handleChange("rating", Number(val))
    },
    {
      type: "select",
      name: "status",
      label: "Status",
      value: form.status,
      onChange: (val) => handleChange("status", val),
      options: [
        { label: "Approved", value: "APPROVED" },
        { label: "Rejected", value: "REJECTED" },
      ]
    }
  ];

  // ==================
  // MAIN RETURN BLOCK
  // ==================
  return (
    <section className="max-w-[1440px] mx-auto w-full px-2 md:px-6 py-6 sm:py-8">
      {/* ===== Filter Panel ===== */}
      <motion.section
        className="mb-8 w-full"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }}
      >
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-card border border-border rounded-2xl shadow-md p-4 md:p-6 lg:p-8 transition-all">
          <div className="flex-1 w-full">
            <FilterPanel
              fields={fields}
              onApply={handleApply}
              onReset={handleReset}
              isPending={isPending}
            />
          </div>
        </div>
      </motion.section>

      {/* ===== Table ===== */}
      <motion.div
        className="w-full"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1, transition: { duration: 0.35, ease: "easeOut" } }}
      >
        <div
          className="relative w-full overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
          style={{
            maxHeight: "60vh",
            overflowY: "auto",
            borderRadius: "1rem",
          }}
        >
          {/* Overlay when filtering */}
          <AnimatePresence>
            {isPending && (
              <motion.div
                className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.3 } }}
                exit={{ opacity: 0, transition: { duration: 0.22 } }}
              >
                <motion.div
                  className="rounded-full border-b-2 border-primary size-10 mb-2 animate-spin"
                  style={{ borderBottomWidth: "2px" }}
                  aria-label="Loading"
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                />
                <p className="text-sm font-medium text-muted-foreground">Filtering data...</p>
              </motion.div>
            )}
          </AnimatePresence>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <span className="text-lg font-semibold text-primary">Loading...</span>
            </div>
          ) : (
            <ReusableTable
              columns={columns}
              data={tableReviews}
              actions={actions}
              emptyMessage="No reviews found"
            />
          )}
        </div>
      </motion.div>

      {/* ===== Edit/View Dialog ===== */}
      <Dialog
        open={open}
        onOpenChange={(val) => {
          setOpen(val);
          if (!val) {
            setSelectedReviewId(null);
            setEditReviewDefaultValues(undefined);
            setViewData(null);
          }
        }}
      >
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto bg-card border border-border shadow-lg">
          <DialogHeader />

          <AnimatePresence mode="wait" initial={false}>
            {viewData && viewMode ? (
              <motion.div
                key="view"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.34, ease: "easeOut" } }}
                exit={{ opacity: 0, y: 8, transition: { duration: 0.22, ease: "easeOut" } }}
              >
                <ViewReviewData viewData={viewData} />
              </motion.div>
            ) : selectedReviewId ? (
              <motion.div
                key="edit"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1, transition: { duration: 0.32, ease: "easeOut" } }}
                exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.22, ease: "easeOut" } }}
              >
                {role === "ADMIN" ? (
                  <ModerateUpdateForm
                    id={selectedReviewId}
                    onSuccess={(updated) => {
                      setTableReviews((prev) =>
                        prev.map((r) =>
                          r.id === updated.id ? { ...r, ...updated } : r
                        )
                      );
                      originalReviewsRef.current = originalReviewsRef.current.map((r) =>
                        r.id === updated.id ? { ...r, ...updated } : r
                      );
                      setOpen(false);
                      setSelectedReviewId(null);
                      setEditReviewDefaultValues(undefined);
                      setViewData(null);
                    }}
                  />
                ) : (
                  <UpdateReviewContent
                    reviewId={selectedReviewId}
                    defaultValues={editReviewDefaultValues}
                    onSuccess={(updated) => {
                      setTableReviews((prev) =>
                        prev.map((r) =>
                          r.id === updated.id ? { ...r, ...updated } : r
                        )
                      );
                      originalReviewsRef.current = originalReviewsRef.current.map((r) =>
                        r.id === updated.id ? { ...r, ...updated } : r
                      );
                      setOpen(false);
                      setSelectedReviewId(null);
                      setEditReviewDefaultValues(undefined);
                      setViewData(null);
                    }}
                  />
                )}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                className="text-center py-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.22 } }}
                exit={{ opacity: 0, transition: { duration: 0.20 } }}
              >
                <span className="text-sm text-muted-foreground">
                  Please select a review to update.
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>

      {/* ===== Pagination Section ===== */}
      <div className="flex justify-center py-4">
        {pagination && (
          <PaginationPage pagination={pagination as TPagination} />
        )}
      </div>
    </section>
  );
}