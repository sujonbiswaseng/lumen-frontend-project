"use client";

import React from "react";
import { toast } from "react-toastify";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { updateEvent } from "@/actions/event.actions";
import { EventArr, IEventCategory, IEventPricing, IEventStatusEnum, IEventTypeEnum } from "@/types/event.types";
import { UpdateEventSchema } from "@/validations/event.validation";



type IUpdateEventData = z.infer<typeof UpdateEventSchema>;

const UpdateEvent = ({
  id,
  role,
  onSuccess,
}: {
  id: string;
  role: string;
  onSuccess: (updated: any) => void;
}) => {
  const [eventData, setEventData] = React.useState<IUpdateEventData>({});

  // zod validation
  const parsedata = UpdateEventSchema.safeParse(eventData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = await updateEvent(id, parsedata.data!);
    if (!data?.success) {
      toast.error(data?.message || "Failed to update event");
      return
      
    } else {
      toast.success(data?.message || "Event updated successfully");
      setEventData({});
      onSuccess(data.data);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-50 to-orange-50 p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl shadow-2xl rounded-3xl p-8 md:p-12 space-y-6 bg-white"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">Update Event</h2>
        {/* Title & Fee */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="title" className="font-medium ml-2 ">
              Event Title
            </Label>
            <input
              id="title"
              type="text"
              placeholder="Event Title"
              value={eventData.title ?? ""}
              onChange={e => setEventData({ ...eventData, title: e.target.value })}
              className="w-full border-2 border-gray-300 p-3 rounded-xl focus:outline-none"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <Label htmlFor="fee" className="font-medium ml-2 ">
              Fee ($)
            </Label>
            <input
              id="fee"
              type={eventData.fee === 0 ? "text" : "number"}
              min={0}
              placeholder="Event Fee"
              value={eventData.fee ?? ""}
              onChange={e =>
                setEventData({
                  ...eventData,
                  fee: e.target.value === "" ? 0 : Math.max(0, Number(e.target.value)),
                })
              }
              className="w-full border-2 border-gray-300 p-3 rounded-xl focus:outline-none"
            />
            <p
              className={`${
                parsedata.success ||
                !parsedata.error?.issues.some(issue => issue.path[0] === "fee")
                  ? "hidden"
                  : "error"
              }`}
            >
              {
                parsedata.error?.issues.find((i) => i.path[0] === "fee")?.message ||
                null
              }
            </p>
          </div>
        </div>
        {/* Description */}
        <div className="flex flex-col space-y-2">
          <Label htmlFor="description" className="font-medium ml-2 ">
            Description
          </Label>
          <textarea
            id="description"
            placeholder="Event Description"
            value={eventData.description ?? ""}
            onChange={e => setEventData({ ...eventData, description: e.target.value })}
            className="w-full border-2 border-gray-300 p-3 rounded-xl focus:outline-none"
            rows={3}
          />
        </div>
        {/* Date & Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="date" className="font-medium ml-2 ">
              Date
            </Label>
            <input
              id="date"
              type="date"
              value={eventData.date ?? ""}
              onChange={e => setEventData({ ...eventData, date: e.target.value })}
              className="w-full border-2 border-gray-300 p-3 rounded-xl focus:outline-none"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <Label htmlFor="time" className="font-medium ml-2 ">
              Time
            </Label>
            <input
              id="time"
              type="time"
              value={eventData.time ?? ""}
              onChange={e => setEventData({ ...eventData, time: e.target.value })}
              className="w-full border-2 border-gray-300 p-3 rounded-xl focus:outline-none"
            />
          </div>
        </div>
        {/* Venue */}
        <div className="flex flex-col space-y-2">
          <Label htmlFor="venue" className="font-medium ml-2 ">
            Venue
          </Label>
          <input
            id="location"
            type="text"
            placeholder="location"
            value={eventData.location ?? ""}
            onChange={e => setEventData({ ...eventData, location: e.target.value })}
            className="w-full border-2 border-gray-300 p-3 rounded-xl focus:outline-none"
          />
        </div>
        {/* Visibility, Status, Price Type */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="visibility" className="font-medium ml-2 ">
              Visibility
            </Label>
            <select
              id="visibility"
              className="border-2 border-gray-300 p-3 rounded-xl"
              value={eventData.visibility ?? ""}
              onChange={e =>
                setEventData({
                  ...eventData,
                  visibility: e.target.value as IEventTypeEnum,
                })
              }
            >
              <option value="">Select Visibility</option>
              {EventArr.eventVisibility.map((vis) => (
                <option key={vis} value={vis}>
                  {vis}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col space-y-2">
            <Label htmlFor="status" className="font-medium ml-2 ">
              Status
            </Label>
            <select
              id="status"
              className="border-2 border-gray-300 p-3 rounded-xl"
              value={eventData.status ?? ""}
              onChange={e =>
                setEventData({
                  ...eventData,
                  status: e.target.value as IEventStatusEnum,
                })
              }
            >
              <option value="">Select Status</option>
              {EventArr.EVENT_Status_ARR.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col space-y-2">
            <Label htmlFor="priceType" className="font-medium ml-2 ">
              Price Type
            </Label>
            <select
              id="priceType"
              className="border-2 border-gray-300 p-3 rounded-xl"
              value={eventData.priceType ?? ""}
              onChange={e =>
                setEventData({
                  ...eventData,
                  priceType: e.target.value as IEventPricing,
                })
              }
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
        <div className="flex flex-col space-y-2">
          <Label htmlFor="categories" className="font-medium ml-2 ">
            Categories
          </Label>
          <select
            id="categories"
            value={eventData.categories ?? ""}
            onChange={e =>
              setEventData({ ...eventData, categories: e.target.value as IEventCategory })
            }
            className="w-full border-2 border-gray-300 p-3 rounded-xl focus:outline-none"
          >
            <option value="">Select Category</option>
            {EventArr.EVENT_CATEGORY_ARR.map((category: string) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        {/* is_featured */}
        <div className="flex items-center space-x-2">
          <Label htmlFor="is_featured" className="font-medium ml-2 ">
            {role === "ADMIN" ? "Feature this Event?" : "Featured Event"}
          </Label>
          {role === "ADMIN" ? (
            <select
              id="is_featured"
              value={eventData.is_featured ? "true" : "false"}
              className="border-2 border-gray-300 p-3 rounded-xl"
              onChange={e =>
                setEventData({
                  ...eventData,
                  is_featured: e.target.value === "true",
                })
              }
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
            />
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => setEventData({})}>
            Reset
          </Button>
          <Button type="submit" className="bg-black text-white">
            Update
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UpdateEvent;