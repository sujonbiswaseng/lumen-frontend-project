"use client";

import { useCallback, useEffect, useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createCategoryColumns } from "./CreateCategoriesColumn";
import { toast } from "react-toastify";
import ViewCategoryData from "./ViewCategory";
import Categoryupdate from "./UpdateCategoryForm";
import { TPagination } from "@/types/event.types";
import { TGetCategory, TResponseCategoryData } from "@/types/category.type";
import { useFilter } from "@/components/ReusableFilter";
import { useRouter } from "next/navigation";
import { TFilterField } from "@/types/filter.types";
import { deleteCategory } from "@/actions/category.actions";
import { FilterPanel } from "@/components/Filter";
import { ReusableTable } from "../table/Table";
import PaginationPage from "../event/Pagination";

const CategoryTable = ({
  pagination,
  category,
}: {
  pagination: TPagination;
  category: TResponseCategoryData[];
}) => {
  const router = useRouter();
  const [tableData, setTableData] = useState<TResponseCategoryData[]>(category);
  const [viewData, setViewData] = useState<TResponseCategoryData | null>(null);
  const { updateFilters, reset, isPending } = useFilter();
  const [open, setOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [viewMode, setViewMode] = useState(false);
  const [form, setForm] = useState({
    name: "",
    image: "",
    createdAt: "",
    adminId: "",
    id: "",
  });

  // Table columns
  const columns = createCategoryColumns();

  useEffect(() => {
    setTableData(category ?? []);
  }, [category]);

  const handleChange = useCallback(
    (key: keyof typeof form, value: string | number | boolean) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const handleApply = () => {
    updateFilters(form);
  };

  const handleReset = () => {
    const defaultForm = {
      name: "",
      image: "",
      createdAt: "",
      adminId: "",
      id: "",
    };
    setForm(defaultForm);
    reset();
  };

  const fields: TFilterField[] = [
    {
      type: "text",
      name: "name",
      label: "Name",
      placeholder: "Search by name",
      value: form.name,
      onChange: (val: string) => handleChange("name", val),
    },
    {
      type: "date",
      name: "createdAt",
      label: "Created At",
      value: form.createdAt,
      onChange: (val: string) => handleChange("createdAt", val),
    },
    {
      type: "text",
      name: "adminId",
      label: "Admin ID",
      placeholder: "Search by admin ID",
      value: form.adminId,
      onChange: (val: string) => handleChange("adminId", val),
    },
    {
      type: "text",
      name: "id",
      label: "Category ID",
      placeholder: "Search by category ID",
      value: form.id,
      onChange: (val: string) => handleChange("id", val),
    },
  ];

  const actions = [
    {
      icon: Eye,
      label: "View",
      onClick: (item: any) => {
        setViewData(item);
        setViewMode(true);
        setOpen(true);
      },
    },
    {
      icon: Pencil,
      label: "Edit",
      onClick: (item: any) => {
        setSelectedCategoryId(item.id);
        setViewMode(false);
        setViewData(item);
        setOpen(true);
      },
    },
    {
      icon: Trash2,
      label: "Delete",
      onClick: (category: TGetCategory) => {
        handleDelete(category.id);
      },
      className: "text-destructive", // Use appropriate destructive color from your system
    },
  ];

  const handleDelete = useCallback(
    async (categoryId: string) => {
      try {
        if (
          !window.confirm(
            "Are you sure you want to delete this category? This action cannot be undone.",
          )
        ) {
          return;
        }
        const toastId = toast.loading("Deleting category. Please wait...");
        const resp = await deleteCategory(categoryId);
        toast.dismiss(toastId);
        if (resp.success) {
          router.refresh();
          setTableData((prev) =>
            prev.filter((category) => category.id !== categoryId),
          );
          toast.success("Category deleted successfully.");
        } else {
          toast.error(
            resp.message ||
              "Failed to delete the category. Please try again. If the issue persists, contact technical support for assistance.",
          );
        }
      } catch (error: any) {
        toast.dismiss();
        toast.error(
          "An unexpected error occurred while deleting the category. Please try again." +
            (error?.message ? ` (${error.message})` : ""),
        );
      }
    },
    [router],
  );

  return (
    <motion.div
      className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: "easeOut" }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.36, ease: "easeOut" }}
          className="flex items-center gap-3"
        >
          <span>
            <svg
              className="w-9 h-9 text-primary"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect
                x="3"
                y="4"
                width="18"
                height="16"
                rx="4"
                className="stroke-primary"
              />
              <path
                d="M7 8h10M7 12h10M7 16h4"
                className="stroke-primary"
              />
            </svg>
          </span>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-foreground leading-tight select-none">
            Category Management
          </h1>
        </motion.div>
        <Button
          size="lg"
          className="mt-3 sm:mt-0 font-semibold"
          variant="default"
          onClick={() => router.push("/admin/dashboard/create-category")}
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v8M8 12h8" />
          </svg>
          Add Category
        </Button>
      </div>

      {/* Filter panel card */}
      <motion.section
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.32, ease: "easeOut" }}
        className="mb-8"
      >
        <div className="bg-card border border-border rounded-2xl shadow-sm p-4 md:p-6 transition-all">
          <FilterPanel
            fields={fields}
            onApply={handleApply}
            onReset={handleReset}
            isPending={isPending}
          />
        </div>
      </motion.section>

      {/* Table Section */}
      <div className="relative w-full">
        {/* Overlay for pending state */}
        <AnimatePresence>
          {isPending && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/70 backdrop-blur-[2px] rounded-2xl"
            >
              <motion.div
                className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-2"
                aria-label="Loading"
              />
              <p className="text-sm font-medium text-muted-foreground">
                Filtering data...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28 }}
          className="overflow-x-auto rounded-2xl shadow-sm border border-border bg-card"
        >
          {tableData && Array.isArray(tableData) && tableData.length > 0 ? (
            <ReusableTable
              columns={columns as any}
              data={tableData}
              actions={actions}
            />
          ) : (
            <div className="p-10 text-center text-muted-foreground text-base select-none">
              No category data found.
            </div>
          )}
        </motion.div>
      </div>

      {/* Modal Dialog for View/Edit Category */}
      <Dialog
        open={open}
        onOpenChange={(val) => {
          setOpen(val);
          if (!val) {
            setSelectedCategoryId(null);
            setViewData(null);
          }
        }}
      >
        <DialogContent className="bg-card border border-border p-0 max-w-md w-full rounded-2xl shadow-lg">
          <DialogHeader className="flex flex-col items-center justify-center px-6 pt-10 pb-4 border-b border-border bg-card rounded-t-2xl shadow-none">
            <DialogTitle className="text-[1.45rem] sm:text-2xl font-bold text-card-foreground mb-1 sm:mb-2 tracking-tight text-center">
              {viewMode ? "Category Details" : "Edit Category"}
            </DialogTitle>
            <p
              id="dialog-description"
              className="text-sm sm:text-base text-muted-foreground mb-0 text-center"
            >
              {viewMode
                ? "Please review all the details of your selected category below."
                : "You can update the details of your selected category in the form below."}
            </p>
          </DialogHeader>
          {/* Make ONLY the modal content scrollable */}
          <div
            className="py-6 px-4 sm:px-8"
            style={{
              maxHeight: "70vh",
              overflowY: "auto",
            }}
          >
            <ViewCategoryData
              viewData={
                Array.isArray(viewData) ? viewData[0] : viewData ?? undefined
              }
              viewMode={viewMode}
            />
            {!viewMode && selectedCategoryId && (
              <div className="mt-6 overflow-hidden">
                <Categoryupdate categoryid={selectedCategoryId} />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Pagination */}
      <div className="mt-8 flex justify-center">
        <PaginationPage pagination={pagination} />
      </div>
    </motion.div>
  );
};

export default CategoryTable;
