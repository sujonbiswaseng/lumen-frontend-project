"use client";

import { useCallback, useEffect, useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { ReusableTable } from "../table/Table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FilterPanel } from "@/components/Filter";
import { useFilter } from "@/components/ReusableFilter";
import ViewUserData from "./viewUserData";
import { IBaseEvent, TPagination } from "@/types/event.types";
import { IgetReviewData } from "@/types/review.types";
import { TResponseUserData } from "@/types/user.types";
import { createUserColumns } from "./createUserColums";
import { TFilterField } from "@/types/filter.types";
import { UpdateUserForm } from "./UpdateUser";
import { deleteUserByAdminAction } from "@/actions/user.actions";
import PaginationPage from "../event/Pagination";

/**
 * Modern production-grade, responsive, color-system-compliant User Table UI.
 */
export default function UserContentPage({
  users,
  pagination,
}: {
  users: TResponseUserData<{ reviews: IgetReviewData[]; events: IBaseEvent[]; accounts: { password: string }[] }>[];
  pagination?: TPagination;
}) {
  const [tableData, setTableData] = useState(users);
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [viewData, setViewData] = useState<any>(null);
  const router = useRouter();
  const { updateFilters, reset, isPending } = useFilter();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    status: "",
    phone: "",
    image: "",
    isActive: false,
    emailVerified: false,
  });

  // Responsive: update data if users prop changes
  useEffect(() => {
    setTableData(users ?? []);
  }, [users]);

  // Input handler for form
  const handleChange = useCallback(
    (key: keyof typeof form, value: string | number | boolean) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  // Trigger filter
  const handleApply = () => {
    updateFilters(form);
  };

  // Reset filter form and UI
  const handleReset = () => {
    setForm({
      name: "",
      email: "",
      role: "",
      status: "",
      phone: "",
      image: "",
      isActive: false,
      emailVerified: false,
    });
    reset();
  };

  // Filter Panel Field Config
  const fields: TFilterField[] = [
    {
      type: "text",
      name: "name",
      label: "Name",
      value: form.name,
      onChange: (val: string) => handleChange("name", val),
    },
    {
      type: "text",
      name: "email",
      label: "Email",
      value: form.email,
      onChange: (val: string) => handleChange("email", val),
    },
    {
      type: "text",
      name: "phone",
      label: "Phone",
      value: form.phone,
      onChange: (val: string) => handleChange("phone", val),
    },
    {
      type: "select",
      name: "role",
      label: "Role",
      value: form.role,
      onChange: (val: string) => handleChange("role", val),
      options: [
        { label: "Admin", value: "ADMIN" },
        { label: "User", value: "USER" },
      ],
    },
    {
      type: "select",
      name: "status",
      label: "Status",
      value: form.status,
      onChange: (val: string) => handleChange("status", val),
      options: [
        { label: "Active", value: "ACTIVE" },
        { label: "Inactive", value: "INACTIVE" },
        { label: "Blocked", value: "BLOCKED" },
        { label: "Deleted", value: "DELETED" },
      ],
    },
    {
      type: "select",
      name: "emailVerified",
      label: "Email Verified",
      value: String(form.emailVerified),
      onChange: (val: string) => handleChange("emailVerified", val),
      options: [
        { label: "No", value: "false" },
        { label: "Yes", value: "true" },
      ],
    },
  ];

  // Delete user logic
  const handleDeleteUser = useCallback(
    async (id: string) => {
      try {
        if (
          !window.confirm(
            "Are you sure you want to delete this user? This action cannot be undone."
          )
        )
          return;
        const toastId = toast.loading("Deleting user. Please wait...");
        const resp = await deleteUserByAdminAction(id);
        toast.dismiss(toastId);

        if (resp.success) {
          setTableData((prev) => prev.filter((item) => item.id !== id));
          router.refresh();
          toast.success(resp.message || "Deleted successfully");
        } else {
          toast.error(resp.message || "Failed to delete. Please contact support.");
        }
      } catch (error: any) {
        toast.dismiss();
        toast.error("Something went wrong. " + (error?.message || ""));
      }
    },
    [router]
  );
  const actions = [
    {
      icon: Eye,
      label: "View",
      onClick: (item: any) => {
        setViewData(item);
        setViewMode(true);
        setOpen(true);
      },
      className:
        "hover:bg-[var(--accent)] transition-colors duration-150 rounded p-2",
      style: { color: "var(--primary)" }, // Primary link color
    },
    {
      icon: Pencil,
      label: "Edit",
      onClick: (item: any) => {
        setSelectedUserId(item.id);
        setViewMode(false);
        setOpen(true);
      },
      className:
        "hover:bg-[var(--accent)] transition-colors duration-150 rounded p-2",
      style: { color: "var(--secondary)" }, // Secondary color
    },
    {
      icon: Trash2,
      label: "Delete",
      onClick: (item: any) => handleDeleteUser(item.id),
      className:
        "hover:bg-[var(--accent)] transition-colors duration-150 rounded p-2",
      style: { color: "var(--accent)" }, // Accent color for dangerous/actionable
    },
  ];

  const columns = createUserColumns();

  return (
    <div className="w-full flex justify-center px-2 sm:px-4">
      <div
        className="
          w-full max-w-[1440px] mx-auto
          flex flex-col
          min-h-[60vh]
        "
      >
        {/* Filter Panel Section */}
        <section
          className="
            mb-8
            w-full
            bg-[var(--card)]
            border border-[var(--border)]
            rounded-2xl
            shadow-sm
            px-4 py-3 sm:px-6 sm:py-5
            flex flex-col gap-2
            "
        >
          <FilterPanel
            fields={fields}
            onApply={handleApply}
            onReset={handleReset}
            isPending={isPending}
          />
        </section>

        {/* Table container */}
        <div
          className="
            relative w-full
            overflow-x-auto
            rounded-2xl
            border border-[var(--border)]
            bg-[var(--card)]
            shadow-sm
            transition-all
            "
        >
          {/* Filter loading overlay */}
          {isPending && (
            <div className="
              absolute inset-0 z-20 flex flex-col items-center justify-center
              bg-[color:var(--background)]/60 backdrop-blur-sm
            ">
              <div
                className="animate-spin rounded-full border-b-2 h-10 w-10 mb-3"
                style={{
                  borderColor: "var(--primary)",
                  borderBottomColor: "var(--primary)",
                }}
              />
              <p
                className="text-base font-medium"
                style={{
                  color: "var(--muted-foreground)",
                }}
              >
                Filtering data...
              </p>
            </div>
          )}

          {/* Actual Data Table */}
          <div
            className="
              w-full
              py-0
              min-h-[300px]
              "
          >
            {tableData && Array.isArray(tableData) && tableData.length > 0 ? (
              <ReusableTable
                columns={columns as any}
                data={tableData}
                actions={actions}
                className="text-[var(--card-foreground)]"
                // Pass color system/class for a11y
              />
            ) : (
              <div className="py-16 px-6 text-center text-base select-none" style={{ color: "var(--muted-foreground)" }}>
                No users data found.
              </div>
            )}
          </div>
        </div>

        {/* Modal for Viewing/Editing */}
        <Dialog
          open={open}
          onOpenChange={(val) => {
            setOpen(val);
            if (!val) setViewData(null);
          }}
        >
          <DialogContent
            className="
              w-full max-w-md
              rounded-xl
              p-0
              shadow-lg
              bg-[var(--card)]
              border border-[var(--border)]
              "
          >
            <DialogHeader
              className="
                flex flex-col items-center justify-center
                px-4 pt-8 pb-4
                border-b border-[var(--border)]
                bg-[var(--card)]
                rounded-t-xl
                shadow-none
              "
            >
              <DialogTitle
                className="
                  text-2xl font-bold mb-2 text-center tracking-tight
                  text-[var(--card-foreground)]
                "
              >
                {viewMode ? "User Details" : "Edit User"}
              </DialogTitle>
              <p
                className="text-base text-center"
                style={{
                  color: "var(--muted-foreground)",
                  marginBottom: 0,
                }}
              >
                {viewMode
                  ? "Review participant information below."
                  : "Update status or details as needed."}
              </p>
            </DialogHeader>

            {/* Edit form (only if !viewMode) */}
            {!viewMode && !viewData && selectedUserId && (
              <div className="px-4 py-6">
                <UpdateUserForm
                  id={selectedUserId}
                  onSuccess={(updated: any) => {
                    setOpen(updated);
                    setSelectedUserId(null);
                  }}
                />
              </div>
            )}

            {/* User View */}
            <div
              className="
                py-6 px-4 sm:px-8
                max-h-[70vh]
                overflow-y-auto
              "
            >
              {viewData && viewMode === true ? (
                <ViewUserData viewData={viewData} viewMode={viewMode} />
              ) : null}
            </div>
          </DialogContent>
        </Dialog>

        {/* Pagination Component */}
        <div className="flex justify-center py-6">
          <PaginationPage pagination={pagination as TPagination} />
        </div>
      </div>
    </div>
  );
}