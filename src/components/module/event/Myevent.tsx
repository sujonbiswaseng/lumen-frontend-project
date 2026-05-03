"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

import { ReusableTable } from "../table/Table";
import { FilterPanel } from "@/components/Filter";
import { EventArr, IBaseEvent, TGroupedEvents, TPagination } from "@/types/event.types";
import { TFilterField } from "@/types/filter.types";
import PaginationPage from "./Pagination";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import UpdateEvent from "./UpdateEvent";
import { deleteEvent } from "@/actions/event.actions";
import CopyableId from "@/components/shared/CopyId";
import { useFilter } from "@/components/ReusableFilter";

interface MyEventsTableProps {
  Events: TGroupedEvents;
  pagination?: TPagination;
  role: string;
}

export default function EventsTable({ Events, pagination, role }: MyEventsTableProps) {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<keyof TGroupedEvents>("UPCOMING");
  const [tableEvents, setTableEvents] = useState<IBaseEvent[]>([]);
  
  const { updateFilters, reset, isPending } = useFilter();

  const [open, setOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const [form, setForm] = useState({
    is_featured: false,
    date: "",
    category_name: "",
    priceType: "",
    status: "",
    visibility: "",
    fee: null,
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
      is_featured: false, date: "", category_name: "", priceType: "",
      status: "", visibility: "", fee: null, search: "", createdAt: "",
    };
    setForm(defaultForm);
    reset();
  };

  useEffect(() => {
    setTableEvents(Events[selectedStatus] ?? []);
  }, [selectedStatus, Events]);
  const columns = [
    { key: "id", label: "ID", render: (e: IBaseEvent) => <CopyableId id={e.id} href={`/events/${e.id}`} /> },
    { key: "title", label: "Title" },
    { key: "description", label: "Description", render: (e: IBaseEvent) => e.description.slice(0, 40) + "..." },
    { key: "date", label: "Date", render: (e: IBaseEvent) => new Date(e.date).toLocaleDateString() },
    { key: "fee", label: "Fee" },
    { key: "visibility", label: "Visibility" },
    { key: "status", label: "Status" },
  ];

  const actions = [
    { icon: Eye, label: "View", onClick: (event: IBaseEvent) => router.push(`/events/${event.id}`), className: "text-green-500" },
    { icon: Pencil, label: "Edit", onClick: (event: IBaseEvent) => { setSelectedEventId(event.id); setOpen(true); }, className: "text-blue-500" },
    { icon: Trash2, label: "Delete", onClick: (event: IBaseEvent) => handleDeleteEvent(event.id), className: "text-red-500" },
  ];

  const handleDeleteEvent = useCallback(async (eventId: string) => {
    if (!window.confirm("Are you sure?")) return;
    const toastId = toast.loading("Deleting...");
    const resp = await deleteEvent(eventId);
    toast.dismiss(toastId);
    if (resp.success) {
      setTableEvents(prev => prev.filter(e => e.id !== eventId));
      toast.success("Deleted!");
    }
  }, []);

  const fields: TFilterField[] = [
    { type: "text", name: "search", value: form.search, placeholder: "Search...", onChange: (val) => handleChange("search", val) },
    { type: "date", name: "date", value: form.date, label: "Date", onChange: (val) => handleChange("date", val) },
    { type: "select", name: "category_name", label: "category_name", value: form.category_name, onChange: (val) => handleChange("category_name", val), options: EventArr.EVENT_CATEGORY_ARR.map(v => ({ label: v, value: v })) },
    { type: "select", name: "priceType", label: "Price Type", value: form.priceType, onChange: (val) => handleChange("priceType", val), options: [{ label: "Free", value: "FREE" }, { label: "Paid", value: "PAID" }] },
    { type: "range", name: "fee", label: "Price", value: form.fee as any, min: 0, max: 6000, onChange: (val) => handleChange("fee", Number(val)) },
    { type: "select", name: "status", label: "Status", value: form.status, onChange: (val) => handleChange("status", val), options: EventArr.EVENT_Status_ARR.map(v => ({ label: v, value: v })) },
    { type: "select", name: "visibility", label: "Visibility", value: form.visibility, onChange: (val) => handleChange("visibility", val), options: [{ label: "Public", value: "PUBLIC" }, { label: "Private", value: "PRIVATE" }] },
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
              onClick={() => router.push(role === "ADMIN" ? "/admin/dashboard/events/create" : "/user/dashboard/create-event")}
            >
              + Add Event
            </button>
          </div>
          <ReusableTable columns={columns as any} data={tableEvents} actions={actions} emptyMessage="No events found" />
        </div>
      </div>

      {/* Pagination & Dialog - আগের মতোই */}
      <div className="flex justify-center py-4">
        <PaginationPage pagination={pagination as any} />
      </div>

      <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) setSelectedEventId(null); }}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader />
          {selectedEventId && (
            <UpdateEvent
              id={selectedEventId}
              role={role}
              onSuccess={(updated) => {
                setTableEvents(prev => prev.map(item => item.id === updated.id ? updated : item));
                setOpen(false);
                toast.success("Updated!");
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}