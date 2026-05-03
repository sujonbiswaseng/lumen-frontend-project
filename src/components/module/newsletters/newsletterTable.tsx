"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

import { ReusableTable } from "../table/Table";
import { FilterPanel } from "@/components/Filter";
import { TPagination } from "@/types/event.types";
import { TFilterField } from "@/types/filter.types";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useFilter } from "@/components/ReusableFilter";
import { TResponseBlog } from "@/types/blog.type";
import PaginationPage from "../event/Pagination";
import UpdateBlog from "./Updatenewsletter";
import { deleteBlogAction } from "@/actions/blog.actions";
import ViewHighLightData from "./Viewnewsletter";
import { createNewsLetterColumns } from "./CreateNewslettercolumn";
import { deleteNewsletterAction } from "@/actions/newsletter.actions";

interface MyNewsletterTableProps {
  newsletters: any[]; // Presume same shape as blog
  pagination?: TPagination;
  role: string;
}

export default function NewsletterTable({ newsletters, pagination, role }: MyNewsletterTableProps) {
  const router = useRouter();
  const [tableNewsletters, setTableNewsletters] = useState<any[]>([]);
  const { updateFilters, reset, isPending } = useFilter();

  const [viewMode, setViewMode] = useState(false);
  const [viewData, setViewData] = useState<any | null>(null);

  const [open, setOpen] = useState(false);
  const [selectedNewsletterId, setSelectedNewsletterId] = useState<string | null>(null);
  const [newsletterContent, setNewsletterContent] = useState<string | null>(null);

  const [form, setForm] = useState({
    email: "",
    createdAt: "",
  });

  const handleChange = useCallback((key: keyof typeof form, value: string | number | boolean) => {
    setForm(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleApply = () => {
    updateFilters(form);
  };

  const handleReset = () => {
    const defaultForm = {
      email: "",
      createdAt: "",
    };
    setForm(defaultForm);
    reset();
  };

  useEffect(() => {
    setTableNewsletters(newsletters || []);
  }, [newsletters]);

  const handleDeleteNewsletter = useCallback(async (newsletterId: string) => {
    if (!window.confirm("Are you sure you want to delete this newsletter? This action cannot be undone.")) {
      return;
    }
    const toastId = toast.loading("Deleting newsletter...");
    try {
      const res = await deleteNewsletterAction(newsletterId);
      toast.dismiss(toastId);
      if (res?.success) {
        toast.success(res.message || "Newsletter deleted successfully.");
        setTableNewsletters((prev) => prev.filter((item) => item.id !== newsletterId));
        // Clear content if it was the deleted newsletter
        setNewsletterContent((prevContent) => {
          const justDeleted = tableNewsletters.find((item) => item.id === newsletterId);
          return justDeleted && prevContent === justDeleted.content ? null : prevContent;
        });
      } else {
        toast.error(res?.message || "Failed to delete newsletter.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Server error");
    }
  }, [tableNewsletters]);

  const columns = createNewsLetterColumns();

  const actions = [
    {
      icon: Eye,
      label: "View",
      onClick: (newsletter: any) => {
        setSelectedNewsletterId(newsletter.id);
        setOpen(true);
        setViewData(newsletter)
        setViewMode(true)
      },
      className: "text-green-500",
    },
    {
      icon: Pencil,
      label: "Edit",
      onClick: (newsletter: any) => {
        setSelectedNewsletterId(newsletter.id);
        setOpen(true);
      },
      className: "text-blue-500",
    },
    {
      icon: Trash2,
      label: "Delete",
      onClick: (newsletter: any) => handleDeleteNewsletter(newsletter.id),
      className: "text-red-500",
    },
  ];

  const fields: TFilterField[] = [
    {
      type: "text",
      name: "email",
      value: form.email,
      placeholder: " email...",
      onChange: (val) => handleChange("email", val),
    },
    {
      type: "date",
      name: "createdAt",
      value: form.createdAt,
      label: "Created At",
      onChange: (val) => handleChange("createdAt", val),
    },
  ];

  return (
    <div className="w-full py-6 sm:py-8">
      <section className="mb-8 w-full">
        <FilterPanel
          fields={fields}
          onApply={handleApply}
          onReset={handleReset}
          isPending={isPending}
        />
      </section>

      <div className="relative w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
        {isPending && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/50 dark:bg-black/50 backdrop-blur-sm">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-2"></div>
            <p className="text-sm font-medium">Filtering data...</p>
          </div>
        )}
        <div className="p-4 sm:p-5" style={{ maxHeight: "60vh", overflow: "auto" }}>
          <div className="mb-4 flex w-full justify-center">
            <button
              className="bg-blue-600 px-4 py-2 text-sm font-semibold text-white rounded-lg"
              onClick={() => router.push(
                role === "ADMIN"
                  ? "/admin/dashboard/create-newsletter"
                  : "/manager/dashboard/create-newsletter")}
            >
              + Add Newsletter
            </button>
          </div>
          <ReusableTable columns={columns as any} data={tableNewsletters} actions={actions} emptyMessage="No newsletters found" />
        </div>
      </div>

      <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) setSelectedNewsletterId(null); }}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader />

        {viewData && viewMode && (
          <ViewHighLightData
            viewData={viewData }
          />
        )}

        {selectedNewsletterId && !viewMode && (
           <UpdateBlog id={selectedNewsletterId as string}/>
        )}

        </DialogContent>
      </Dialog>

      <div className="flex justify-center py-4">
        <PaginationPage pagination={pagination as TPagination}/>
      </div>
    </div>
  );
}