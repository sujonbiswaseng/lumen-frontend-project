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
import { createBlogColumns } from "./CreateHightlightcolumn";
import PaginationPage from "../event/Pagination";
import UpdateBlog from "./UpdateHighLight";
import { deleteBlogAction } from "@/actions/blog.actions";
import ViewHighLightData from "./ViewHighLightData";
import { deleteHighlightAction } from "@/actions/highlight.action";

interface MyHighlightsTableProps {
  highlights: TResponseBlog[];
  pagination?: TPagination;
  role: string;
}

export default function HighlightTable({ highlights, pagination, role }: MyHighlightsTableProps) {
  const router = useRouter();
  const [tableHighlights, setTableHighlights] = useState<TResponseBlog[]>([]);
  const { updateFilters, reset, isPending } = useFilter();

  const [viewMode, setViewMode] = useState(false);
  const [viewData, setViewData] = useState<any | null>(null);

  const [open, setOpen] = useState(false);
  const [selectedHighlightId, setSelectedHighlightId] = useState<string | null>(null);
  const [highlightContent, setHighlightContent] = useState<string | null>(null);

  const [form, setForm] = useState({
    search: "",
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
      search: "",
      createdAt: "",
    };
    setForm(defaultForm);
    reset();
  };

  useEffect(() => {
    setTableHighlights(highlights || []);
  }, [highlights]);

  const handleDeleteHighlight = useCallback(async (highlightId: string) => {
    if (!window.confirm("Are you sure you want to delete this highlight? This action cannot be undone.")) {
      return;
    }
    const toastId = toast.loading("Deleting highlight...");
    try {
      const res = await deleteHighlightAction(highlightId);
      toast.dismiss(toastId);
      if (res?.success) {
        toast.success(res.message || "Highlight deleted successfully.");
        setTableHighlights((prev) => prev.filter((item) => item.id !== highlightId));
        // Clear content if it was the deleted highlight
        setHighlightContent((prevContent) => {
          const justDeleted = tableHighlights.find((item) => item.id === highlightId);
          return justDeleted && prevContent === justDeleted.content ? null : prevContent;
        });
      } else {
        toast.error(res?.message || "Failed to delete highlight.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Server error");
    }
  }, [tableHighlights]);

  const columns = createBlogColumns();

  const actions = [
    {
      icon: Eye,
      label: "View",
      onClick: (highlight: any) => {
        setSelectedHighlightId(highlight.id);
        setOpen(true);
        setViewData(highlight)
        setViewMode(true)
        
      },
      className: "text-green-500",
    },
    {
      icon: Pencil,
      label: "Edit",
      onClick: (highlight: any) => {
        setSelectedHighlightId(highlight.id);
        setOpen(true);
      },
      className: "text-blue-500",
    },
    {
      icon: Trash2,
      label: "Delete",
      onClick: (highlight: any) => handleDeleteHighlight(highlight.id),
      className: "text-red-500",
    },
  ];

  const fields: TFilterField[] = [
    {
      type: "text",
      name: "search",
      value: form.search,
      placeholder: "Search...",
      onChange: (val) => handleChange("search", val),
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
                  ? "/admin/dashboard/create-highlight"
                  : "/manager/dashboard/create-highlight")}
            >
              + Add Highlight
            </button>
          </div>
          <ReusableTable columns={columns as any} data={tableHighlights} actions={actions} emptyMessage="No highlights found" />
        </div>
      </div>

      <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) setSelectedHighlightId(null); }}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader />

        {viewData && viewMode && (  <ViewHighLightData
                viewData={viewData }
                
              />)}

          {selectedHighlightId && !viewMode && (
             <UpdateBlog id={selectedHighlightId as string}/>
          )}

         
        </DialogContent>
      </Dialog>

      <div className="flex justify-center py-4">
        <PaginationPage pagination={pagination as TPagination}/>
      </div>
    </div>
  );
}