"use client";
import { useCallback, useEffect, useState } from "react";
import { Eye, Pen, Pencil, Trash2, X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

const CategoryTable = ({pagination, category }: {pagination:TPagination, category: TResponseCategoryData[] }) => {
  const router = useRouter();
  const [orders, setOrders] = useState(category);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setstatus] = useState("");

  const [tableData, setTableData] = useState<TResponseCategoryData[]>(category);
  const [viewData, setViewData] = useState<TResponseCategoryData | null>(null);
  const { updateFilters, reset, isPending } = useFilter();
  const [open, setOpen] = useState(false);

  const [selectedcategoryid, setselectedcategoryid] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState(false);
  const [form, setForm] = useState({
    name: "",
    image: "",
    createdAt: "",
    adminId: "",
    id: "",
  });

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
        setselectedcategoryid(item.id);
        setViewMode(false);
        setViewData(item);
        setstatus(item.status);
        setOpen(true);
      },
    },

    {
      icon: Trash2,
      label: "Delete",
      onClick: (category: TGetCategory) => {
        handleDelete(category.id);
      },
      className: "text-red-500",
    },
  ];

  const handleDelete = useCallback(async (categoryId: string) => {
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
  }, []);

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-8">
     <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
       <h1 className="flex items-center gap-3 text-2xl md:text-4xl font-extrabold text-indigo-950 dark:text-indigo-100 tracking-tight">
         <span>
           <svg
             className="w-8 h-8 text-indigo-500 dark:text-indigo-300"
             viewBox="0 0 24 24"
             fill="none"
             stroke="currentColor"
             strokeWidth={2.2}
             strokeLinecap="round"
             strokeLinejoin="round"
             aria-hidden="true"
           >
             <rect x="3" y="4" width="18" height="16" rx="4" />
             <path d="M7 8h10M7 12h10M7 16h4" />
           </svg>
         </span>
         <span>Category Management</span>
       </h1>
       <div>
         <button
         onClick={()=>router.push('/admin/dashboard/create-category')}
           className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-semibold shadow hover:from-blue-700 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-base md:text-lg"
           type="button"
         >
           <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
             <circle cx="12" cy="12" r="10" />
             <path d="M12 8v8M8 12h8" />
           </svg>
           <span>Add Category</span>
         </button>
       </div>
     </div>


      <div className="mb-6 bg-white dark:bg-gray-950 p-3 sm:p-4 md:p-6 rounded-xl shadow border border-gray-100 dark:border-gray-800 transition-all">
        <section className="mb-8 w-full">
          <FilterPanel
            fields={fields}
            onApply={handleApply}
            onReset={handleReset}
            isPending={isPending}
          />
        </section>
      </div>

      {/* Table */}
      <div className="relative w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
        {isPending && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/50 dark:bg-black/50 backdrop-blur-sm">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-2"></div>
            <p className="text-sm font-medium">Filtering data...</p>
          </div>
        )}
        <div className="mb-6 overflow-x-auto rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
          {tableData && Array.isArray(tableData) && tableData.length > 0 ? (
            <div>
              <ReusableTable
                columns={columns as any}
                data={tableData}
                actions={actions}
              />
            </div>
          ) : (
            <div className="p-8 text-center text-gray-400 dark:text-gray-500 text-base select-none">
              No category data found.
            </div>
          )}
        </div>
      </div>

      <Dialog
        open={open}
        onOpenChange={(val) => {
          setOpen(val);
          if (!val) {
            setselectedcategoryid(null);
            setViewData(null);
          }
        }}
      >
        <DialogContent className="max-w-md w-full rounded-xl p-0 sm:p-0 bg-white dark:bg-gray-950">
          <DialogHeader className="flex flex-col items-center justify-center px-6 pt-8 pb-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 rounded-t-xl shadow-none">
            <DialogTitle className="text-[1.45rem] sm:text-2xl font-bold text-indigo-900 dark:text-indigo-100 mb-1 sm:mb-2 tracking-tight text-center">
              {viewMode ? "Category Details" : "Edit Category"}
         
            </DialogTitle>
            <p
              id="dialog-description"
              className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-0 text-center"
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
              viewData={Array.isArray(viewData) ? viewData[0] : viewData ?? undefined}
              viewMode={viewMode}
            />

            {!viewMode && selectedcategoryid && (
              <div className="mt-6">
                <Categoryupdate categoryid={selectedcategoryid}/>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <div className="mt-6">
        <PaginationPage pagination={pagination}/>
      </div>
    </div>
  );
};

export default CategoryTable;
