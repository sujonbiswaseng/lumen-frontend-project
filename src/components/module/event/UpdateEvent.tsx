"use client";

import React, { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { updateEvent } from "@/actions/event.actions";
import {
  EventArr,
  IEventCategory,
  IEventPricing,
  IEventStatusEnum,
  IEventTypeEnum,
} from "@/types/event.types";
import { UpdateEventSchema } from "@/validations/event.validation";
import { getCategory } from "@/actions/category.actions";
import { TResponseCategoryData } from "@/types/category.type";

type IUpdateEventData = z.infer<typeof UpdateEventSchema>;

const fadeInVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

const gridCol =
  "grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6";

const UpdateEvent = ({
  id,
  role,
  onSuccess,
}: {
  id: string;
  role: string;
  onSuccess: (updated: any) => void;
}) => {
  const [categories, setCategories] = useState<TResponseCategoryData[]>();
  const [eventData, setEventData] = useState<IUpdateEventData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getCategory();
      setCategories(res?.data as TResponseCategoryData[]);
    };
    fetchData();
  }, []);

  const parsedata = UpdateEventSchema.safeParse(eventData);

  const handleInput =
    (field: keyof IUpdateEventData, type: "string" | "number" | "boolean" = "string") =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      let value: any = e.target.value;
      if (type === "number") value = value === "" ? "" : Math.max(0, Number(value));
      if (type === "boolean") value = value === "true";
      setEventData({ ...eventData, [field]: value });
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parsedata.success) {
      toast.error("Please fix validation errors.");
      return;
    }
    setIsSubmitting(true);

    try {
      const data = await updateEvent(id, parsedata.data!);
      if (!data?.success) {
        toast.error(data?.message || "Failed to update event");
        return;
      }
      toast.success(data?.message || "Event updated successfully");
      setEventData({});
      onSuccess(data.data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-[1440px] mx-auto flex justify-center items-center p-4 md:p-8">
        <AnimatePresence mode="wait">
          <motion.form
            initial="hidden"
            animate="visible"
            exit="hidden"
            key="update-event-form"
            onSubmit={handleSubmit}
            className="
              w-full max-w-xl
              bg-card border border-border shadow-xl rounded-2xl
              px-4 md:px-8 py-6 md:py-10
              flex flex-col gap-6
            "
            style={{ minWidth: 0 }}
            aria-label="Update Event"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-center text-card-foreground mb-2">
              Update Event
            </h2>

            {/* Title & Fee */}
            <div className={gridCol}>
              <div className="flex flex-col gap-2">
                <Label htmlFor="title" className="font-medium text-foreground">
                  Event Title
                </Label>
                <input
                  id="title"
                  type="text"
                  placeholder="Event title"
                  value={eventData.title ?? ""}
                  onChange={handleInput("title")}
                  className="
                    w-full bg-input border border-border 
                    rounded-lg px-3 py-2 transition focus:outline-none focus:ring-2 focus:ring-primary
                    text-foreground placeholder:text-muted-foreground
                  "
                  autoComplete="off"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="fee" className="font-medium text-foreground">
                  Fee ($)
                </Label>
                <input
                  id="fee"
                  type="number"
                  min={0}
                  step="any"
                  placeholder="Event fee"
                  value={eventData.fee ?? ""}
                  onChange={handleInput("fee", "number")}
                  className="
                    w-full bg-input border border-border 
                    rounded-lg px-3 py-2 transition focus:outline-none focus:ring-2 focus:ring-primary
                    text-foreground placeholder:text-muted-foreground
                  "
                  autoComplete="off"
                />
                <AnimatePresence>
                  {!parsedata.success &&
                    parsedata.error?.issues.some((issue) => issue.path[0] === "fee") && (
                      <motion.p
                        className="text-sm text-accent mt-1"
                        key="fee-error"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0, transition: { duration: 0.2 } }}
                        exit={{ opacity: 0, y: 4, transition: { duration: 0.18 } }}
                      >
                        {parsedata.error.issues.find((i) => i.path[0] === "fee")?.message}
                      </motion.p>
                    )}
                </AnimatePresence>
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="description" className="font-medium text-foreground">
                Description
              </Label>
              <textarea
                id="description"
                placeholder="Event Description"
                value={eventData.description ?? ""}
                onChange={handleInput("description")}
                className="
                  w-full bg-input border border-border 
                  rounded-lg px-3 py-2 transition focus:outline-none focus:ring-2 focus:ring-primary
                  text-foreground placeholder:text-muted-foreground
                  min-h-[96px]
                "
                rows={3}
                maxLength={500}
              />
            </div>

            {/* Date & Time */}
            <div className={gridCol}>
              <div className="flex flex-col gap-2">
                <Label htmlFor="date" className="font-medium text-foreground">
                  Date
                </Label>
                <input
                  id="date"
                  type="date"
                  value={eventData.date ?? ""}
                  onChange={handleInput("date")}
                  className="
                    w-full bg-input border border-border 
                    rounded-lg px-3 py-2 transition focus:outline-none focus:ring-2 focus:ring-primary
                    text-foreground placeholder:text-muted-foreground
                  "
                  autoComplete="off"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="time" className="font-medium text-foreground">
                  Time
                </Label>
                <input
                  id="time"
                  type="time"
                  value={eventData.time ?? ""}
                  onChange={handleInput("time")}
                  className="
                    w-full bg-input border border-border 
                    rounded-lg px-3 py-2 transition focus:outline-none focus:ring-2 focus:ring-primary
                    text-foreground placeholder:text-muted-foreground
                  "
                  autoComplete="off"
                />
              </div>
            </div>

            {/* Location */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="location" className="font-medium text-foreground">
                Location
              </Label>
              <input
                id="location"
                type="text"
                placeholder="Location"
                value={eventData.location ?? ""}
                onChange={handleInput("location")}
                className="
                  w-full bg-input border border-border 
                  rounded-lg px-3 py-2 transition focus:outline-none focus:ring-2 focus:ring-primary
                  text-foreground placeholder:text-muted-foreground
                "
                autoComplete="off"
              />
            </div>

            {/* Visibility, Status, Price Type */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="visibility" className="font-medium text-foreground">
                  Visibility
                </Label>
                <select
                  id="visibility"
                  className="
                    bg-input border border-border rounded-lg px-3 py-2 
                    text-foreground placeholder:text-muted-foreground
                    focus:outline-none focus:ring-2 focus:ring-primary
                  "
                  value={eventData.visibility ?? ""}
                  onChange={handleInput("visibility")}
                >
                  <option value="">Select Visibility</option>
                  {EventArr.eventVisibility.map((vis) => (
                    <option key={vis} value={vis}>
                      {vis}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="status" className="font-medium text-foreground">
                  Status
                </Label>
                <select
                  id="status"
                  className="
                    bg-input border border-border rounded-lg px-3 py-2 
                    text-foreground placeholder:text-muted-foreground
                    focus:outline-none focus:ring-2 focus:ring-primary
                  "
                  value={eventData.status ?? ""}
                  onChange={handleInput("status")}
                >
                  <option value="">Select Status</option>
                  {EventArr.EVENT_Status_ARR.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="priceType" className="font-medium text-foreground">
                  Price Type
                </Label>
                <select
                  id="priceType"
                  className="
                    bg-input border border-border rounded-lg px-3 py-2 
                    text-foreground placeholder:text-muted-foreground
                    focus:outline-none focus:ring-2 focus:ring-primary
                  "
                  value={eventData.priceType ?? ""}
                  onChange={handleInput("priceType")}
                >
                  <option value="">Select Price Type</option>
                  {EventArr.EVENT_Pricing_ARR.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Categories */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="category_name" className="font-medium text-foreground">
                Category
              </Label>
              <select
                id="category_name"
                value={eventData.category_name ?? ""}
                onChange={handleInput("category_name")}
                className="
                  w-full bg-input border border-border rounded-lg px-3 py-2 
                  text-foreground placeholder:text-muted-foreground
                  focus:outline-none focus:ring-2 focus:ring-primary
                "
              >
                <option value="">Select Category</option>
                {categories?.map((category: TResponseCategoryData) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* is_featured */}
            <div className="flex items-center gap-3">
              <Label htmlFor="is_featured" className="font-medium text-foreground">
                {role === "ADMIN" ? "Feature this Event?" : "Featured Event"}
              </Label>
              {role === "ADMIN" ? (
                <select
                  id="is_featured"
                  value={!!eventData.is_featured ? "true" : "false"}
                  className="
                    bg-input border border-border rounded-lg px-3 py-2 
                    text-foreground placeholder:text-muted-foreground
                    focus:outline-none focus:ring-2 focus:ring-primary
                  "
                  onChange={handleInput("is_featured", "boolean")}
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              ) : (
                <input
                  id="is_featured"
                  type="checkbox"
                  checked={!!eventData.is_featured}
                  readOnly
                  disabled
                  className="accent-primary bg-input border border-border rounded"
                />
              )}
            </div>
            {/* Actions */}
            <div className="flex w-full justify-end items-center gap-2 mt-1">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setEventData({})}
                className="min-w-[88px]"
              >
                Reset
              </Button>
              <Button
                type="submit"
                className="min-w-[88px] bg-primary text-primary-foreground"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update"}
              </Button>
            </div>
          </motion.form>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UpdateEvent;