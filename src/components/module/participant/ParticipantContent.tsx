"use client";

import { useCallback, useEffect, useState, Fragment } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import { ReusableTable } from "../table/Table";
import { createParticipantColumns } from "./participantColumns";
import { UpdateParticipantForm } from "./UpdateParticipant";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TResponseParticipant } from "@/types/participant.types";
import { IBaseEvent, TPagination } from "@/types/event.types";
import { IBaseUser } from "@/types/user.types";
import ViewParticipantData from "./ViewParicipantData";
import { useFilter } from "@/components/ReusableFilter";
import { FilterPanel } from "@/components/Filter";
import PaginationPage from "../event/Pagination";
import { toast } from "react-toastify";
import { deleteParticipantAction } from "@/actions/participant.actions";
import { TFilterField } from "@/types/filter.types";

/**
 * Modern, premium, production-grade Participants UI module.
 */
export default function ParticipantContent({
  participants,
  role,
  pagination,
}: {
  participants: TResponseParticipant<{ user: IBaseUser[]; event: IBaseEvent[] }>[],
  role: string,
  pagination: TPagination,
}) {
  const router = useRouter();
  const [tableData, setTableData] = useState(participants);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedParticipantId, setSelectedParticipantId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState(false);
  const [viewData, setViewData] = useState<TResponseParticipant<{ event: IBaseEvent, user: IBaseUser }> | null>(null);

  const [form, setForm] = useState({
    status: "",
    paymentStatus: "",
    joinedAt: "",
  });

  // Table columns
  const columns = createParticipantColumns();
  const { updateFilters, reset, isPending } = useFilter();

  useEffect(() => {
    setTableData(participants ?? []);
  }, [participants]);

  const handleChange = useCallback(
    (key: keyof typeof form, value: string | number | boolean) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleApply = () => updateFilters(form);

  const handleReset = () => {
    setForm({ status: "", paymentStatus: "", joinedAt: "" });
    reset();
  };

  const fields: TFilterField[] = [
    {
      type: "select",
      name: "status",
      label: "Status",
      value: form.status,
      onChange: (val: string) => handleChange("status", val),
      options: [
        { label: "PENDING", value: "PENDING" },
        { label: "APPROVED", value: "APPROVED" },
        { label: "REJECTED", value: "REJECTED" },
        { label: "BANNED", value: "BANNED" },
      ],
    },
    {
      type: "select",
      name: "paymentStatus",
      label: "Payment Status",
      value: form.paymentStatus,
      onChange: (val: string) => handleChange("paymentStatus", val),
      options: [
        { label: "Paid", value: "PAID" },
        { label: "Free", value: "FREE" },
        { label: "Unpaid", value: "UNPAID" },
      ],
    },
    {
      type: "date",
      label: "Joined Date",
      name: "joinedAt",
      value: form.joinedAt || "",
      onChange: (val: string) => handleChange("joinedAt", val),
    },
  ];

  const handleDelete = async (id: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this participant? This action cannot be undone."
      )
    ) {
      return;
    }
    const toastId = toast.loading("Deleting participant...");
    try {
      const res = await deleteParticipantAction(id);
      toast.dismiss(toastId);
      if (res?.success) {
        toast.update(toastId, {
          render: res.message || "Participant deleted successfully.",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        setTableData((prev) => prev.filter((item) => item.id !== id));
      } else {
        toast.update(toastId, {
          render: res?.message || "Failed to delete participant.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch (err: any) {
      toast.update(toastId, {
        render: err?.message || "Server error",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const actions = [
    {
      icon: Eye,
      label: "View",
      onClick: (item: any) => {
        setViewData(item);
        setViewMode(true);
        setDialogOpen(true);
      },
    },
    {
      icon: Pencil,
      label: "Edit",
      onClick: (item: any) => {
        setSelectedParticipantId(item.id);
        setViewMode(false);
        setDialogOpen(true);
      },
    },
    ...(role === "ADMIN"
      ? [
          {
            icon: Trash2,
            label: "Delete",
            onClick: (item: any) => {
              handleDelete(item.id);
            },
          },
        ]
      : []),
  ];

  const fadeUpCard = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.32, ease: "linear" } },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.32 } }
  };

  return (
    <main className="w-full min-h-screen bg-background flex justify-center px-2">
      <div className="w-full max-w-[1440px] mx-auto flex flex-col items-center gap-4 xl:gap-6 px-0 sm:px-4 xl:px-8 py-4">
        {/* CTA Button */}
        <div className="w-full flex items-center justify-between flex-wrap gap-2 mt-2 mb-4 sm:mt-6 sm:mb-8 max-w-4xl mx-auto">
          <span className="flex-1" aria-hidden="true" />
          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.025 }}
            transition={{ type: "spring", stiffness: 400, damping: 24 }}
            type="button"
            onClick={() => router.push("/user/dashboard/event-request-join")}
            className="
              inline-flex items-center gap-2 rounded-lg
              bg-primary text-primary-foreground
              px-5 py-2.5 font-semibold text-base
              shadow-md
              transition-all duration-300
              hover:bg-accent hover:text-accent-foreground
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
              focus-visible:ring-offset-2
              min-w-[190px]
            "
            aria-label="Event Join Requests"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              focusable="false"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="hidden md:inline">Event Join Requests Data</span>
            <span className="md:hidden">Join Requests</span>
          </motion.button>
        </div>

        {/* Filter - Card */}
        <AnimatePresence>
          <motion.section
            key="participan-filters"
            variants={fadeUpCard as any}
            
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="
              w-full
              max-w-4xl
              rounded-2xl
              shadow
              bg-card
              border border-border
              p-4 md:p-6
              mb-4
              transition-all
            "
          >
            <FilterPanel
              fields={fields}
              onApply={handleApply}
              onReset={handleReset}
              isPending={isPending}
            />
          </motion.section>
        </AnimatePresence>

        {/* Table Section */}
        <section
          className="
            w-full
            max-w-5xl
            relative
            rounded-2xl
            border border-border
            bg-card
            shadow-sm
            overflow-x-auto
            mb-8
            animate-fade-in
          "
          style={{ minHeight: 200 }}
        >
          {/* Loading overlay w/ motion */}
          <AnimatePresence>
            {isPending && (
              <motion.div
                key="table-loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.22 } }}
                exit={{ opacity: 0, transition: { duration: 0.22 } }}
                className="
                  absolute inset-0 z-20 flex flex-col items-center justify-center
                  bg-background/85
                  backdrop-blur-[2px]
                  rounded-2xl
                "
              >
                <div
                  className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"
                />
                <span className="text-sm font-medium text-muted-foreground">
                  Filtering data...
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="p-0 sm:p-2"
          >
            {tableData && Array.isArray(tableData) && tableData.length > 0 ? (
              <ReusableTable
                columns={columns as any}
                data={tableData}
                actions={actions}
                className="bg-card text-card-foreground"
              />
            ) : (
              <div className="
                p-12 text-center text-muted-foreground text-base
                select-none font-medium
              ">
                No participant data found.
              </div>
            )}
          </motion.div>
        </section>

        {/* Dialog Modal for View/Edit */}
        <Dialog
          open={dialogOpen}
          onOpenChange={(val) => {
            setDialogOpen(val);
            if (!val) {
              setSelectedParticipantId(null);
              setViewData(null);
            }
          }}
        >
          <DialogContent
            className="
              max-w-md w-full rounded-xl p-0 sm:p-0
              bg-card text-card-foreground
              border border-border shadow-lg
              mx-auto
            "
            style={{ maxWidth: "448px" }}
          >
            <DialogHeader
              className="
                flex flex-col items-center justify-center
                px-6 pt-8 pb-4
                border-b border-border
                bg-card
                rounded-t-xl shadow-none
              "
            >
              <DialogTitle className="
                text-[1.45rem] sm:text-2xl font-bold
                text-primary mb-1 sm:mb-2
                tracking-tight text-center
              ">
                {viewMode ? "Participant Details" : "Edit Participant"}
              </DialogTitle>
              <p
                id="dialog-description"
                className="
                  text-sm sm:text-base text-muted-foreground
                  mb-0 text-center
                "
              >
                {viewMode
                  ? "Review participant information below."
                  : "Update status or payment details as needed."}
              </p>
            </DialogHeader>
            <div
              className="py-6 px-4 sm:px-8"
              style={{
                maxHeight: "66vh",
                overflowY: "auto",
              }}
            >
              <ViewParticipantData
                viewData={
                  viewData as TResponseParticipant<{
                    event: IBaseEvent;
                    user: IBaseUser;
                  }>
                }
                viewMode={viewMode}
              />
              {/* Edit Form */}
              {!viewMode && selectedParticipantId && (
                <motion.div
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.26, ease: "easeOut" } }}
                  className="mt-6"
                >
                  <UpdateParticipantForm
                    id={selectedParticipantId}
                    role={role}
                    onSuccess={(updated) => {
                      setTableData((prev: any) =>
                        prev.map((item: any) =>
                          item.id === updated.id ? updated : item
                        )
                      );
                      setDialogOpen(false);
                      setSelectedParticipantId(null);
                    }}
                  />
                </motion.div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Pagination */}
        <div className="w-full flex justify-center py-4 max-w-5xl">
          <PaginationPage pagination={pagination} />
        </div>
      </div>
    </main>
  );
}
