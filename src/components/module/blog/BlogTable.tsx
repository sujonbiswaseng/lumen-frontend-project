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
// Blog actions - update/delete if available
import CopyableId from "@/components/shared/CopyId";
import { useFilter } from "@/components/ReusableFilter";
import { TResponseBlog } from "@/types/blog.type";
import { createBlogColumns } from "./Createblogcolumn";
import PaginationPage from "../event/Pagination";

interface MyBlogsTableProps {
  blogs: TResponseBlog[];
  pagination?: TPagination;
  role: string;
}

export default function BlogsTable({ blogs, pagination, role }: MyBlogsTableProps) {
  const router = useRouter();
  const [tableBlogs, setTableBlogs] = useState<TResponseBlog[]>([]);
  
  const { updateFilters, reset, isPending } = useFilter();

  const [open, setOpen] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);

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
    setTableBlogs(blogs || []);
  }, [blogs]);

  const columns = createBlogColumns();

  const actions = [
    {
      icon: Eye,
      label: "View",
      onClick: (blog: TResponseBlog) => router.push(`/blogs/${blog.id}`),
      className: "text-green-500",
    },
    {
      icon: Pencil,
      label: "Edit",
      onClick: (blog: TResponseBlog) => {
        setSelectedBlogId(blog.id);
        setOpen(true);
      },
      className: "text-blue-500",
    },
    {
      icon: Trash2,
      label: "Delete",
      // Placeholder function, implement your delete logic for blogs
      onClick: (blog: TResponseBlog) => handleDeleteBlog(blog.id),
      className: "text-red-500",
    },
  ];

  // Blog delete handler (implement your action)
  const handleDeleteBlog = useCallback(async (blogId: string) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    // Implement your blog delete API/action call here!
    // Show toast or update local state
    toast.success("Blog deleted (mock).");
    setTableBlogs(prev => prev.filter(b => b.id !== blogId));
  }, []);

  // Blog filters (update as your needs)
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
                  ? "/admin/dashboard/blogs/create"
                  : "/manager/dashboard/create-blog")}
            >
              + Add Blog
            </button>
          </div>
          <ReusableTable columns={columns as any} data={tableBlogs} actions={actions} emptyMessage="No blogs found" />
        </div>
      </div>

     

      <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) setSelectedBlogId(null); }}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader />
          {/* Implement your update blog component here */}
        </DialogContent>
      </Dialog>

      <div className="flex justify-center py-4">
       <PaginationPage pagination={pagination as TPagination}/>
       </div>
    </div>
  );
}