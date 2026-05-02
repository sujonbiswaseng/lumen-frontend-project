import {
  IBaseEvent,
  ICreateEvent,
  IUpdateEventInput,
  TGroupedEventsResponse,
  TResponseEvent,
} from "@/types/event.types";
import { ApiErrorResponse, ApiResponse } from "@/types/response.type";
import { IgetReviewData } from "@/types/review.types";
import { IBaseUser } from "@/types/user.types";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface ServiceOptionds {
  cache?: RequestCache;
  revalidate?: number;
}

const EventService = {
  getEvents: async (params?: any, options?: ServiceOptionds) => {
    try {
      const url = new URL(`${API_BASE_URL}/events`);
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            url.searchParams.append(key, String(value));
          }
        });
      }
      const config: RequestInit = {};
      if (options?.cache) {
        config.cache = options.cache;
      }
      if (options?.revalidate) {
        config.next = { revalidate: options.revalidate };
      }
      config.next = { ...config.next, tags: ["events", "event"] };

      const res = await fetch(url.toString(), config);
      const data = await res.json();
      const result = data as TGroupedEventsResponse<{
        reviews: IgetReviewData[];
        organizer: IBaseUser[];
      }>;
      if (!res.ok) {
        const error = data as ApiErrorResponse;
        return {
          success: error.success,
          message: error.message || "retrieve all events failed",
        };
      }
      return {
        success: result.success,
        message: result.message || "retrieve all events successfully",
        data: result.data.data,
        pagination: result.data.pagination,
      };
    } catch (error) {
      return { message: "something went wrong please try again" };
    }
  },
  createEvent: async (value: ICreateEvent) => {
    const storeCookies = await cookies();
    const formData = new FormData();

    const { images, ...rest } = value;

    formData.append("data", JSON.stringify(rest));

    if (images && images.length > 0) {
      images.forEach((image) => {
        formData.append("files", image);
      });
    }
    try {
      const response = await fetch(`${API_BASE_URL}/event`, {
        credentials: "include",
        method: "POST",
        headers: { Cookie: storeCookies.toString() },
        body: formData,
      });
      revalidateTag("event", "max");
      const body = await response.json();
      const result = body as ApiResponse<TResponseEvent>;
      if (!response.ok) {
        const error = body as ApiErrorResponse;
        return {
          success: false,
          message: error.message,
        };
      }
      return {
        success: true,
        message: result.message || "Event created successfully",
        data: result.data,
      };
    } catch (error) {
      return {
        success: false,
        message: "Something went wrong. Please try again.",
      };
    }
  },
  getPaidAndFreeEvent: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/events/paidandfree`, {
        credentials: "include",
        method: "GET",
        headers: { "Content-Type": "application/json" },
        next: {
          tags: ["event", "events"],
        },
      });
      const data = await res.json();
      if (!res.ok) {
        const error = data as ApiErrorResponse;
        return {
          success: false,
          message: error.message || "Failed to fetch Paid & Free Events",
        };
      }
      return {
        success: data.success,
        message: data.message || "Fetched Paid & Free Events successfully",
        data: data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: "Something went wrong. Please try again.",
      };
    }
  },
  getSingleEventByType: async (eventId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/event/${eventId}`, {
        credentials: "include",
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      const result = data as ApiResponse<
        TResponseEvent<{ reviews: IgetReviewData[]; organizer: IBaseUser }>
      >;
      if (!res.ok) {
        const error = data as ApiErrorResponse;
        return {
          success: false,
          message: error.message || "Failed to fetch event details",
        };
      }
      return {
        success: result.success,
        message: result.message || "Fetched event successfully",
        data: result.data,
      };
    } catch (error) {
      return {
        success: false,
        message: "Something went wrong. Please try again.",
      };
    }
  },

  getMyEvents: async (params?: any, options?: ServiceOptionds) => {
    try {
      const cookieStore = await cookies();
      const url = new URL(`${API_BASE_URL}/my-events`);
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            url.searchParams.append(key, String(value));
          }
        });
      }
      const config: RequestInit = {};
      if (options?.cache) {
        config.cache = options.cache;
      }
      if (options?.revalidate) {
        config.next = { revalidate: options.revalidate };
      }
      config.next = { ...config.next, tags: ["events", "event"] };

      config.headers = {
        Cookie: cookieStore.toString(),
      };

      const res = await fetch(url.toString(), config);
      const data = await res.json();
      const result = data as TGroupedEventsResponse<{
        reviews: any[];
        organizer: { image: string; name: string; email: string };
      }>;
      if (!res.ok) {
        const error = data as ApiErrorResponse;
        return {
          success: error.success,
          message: error.message || "Failed to retrieve my events",
        };
      }

      return {
        success: result.success,
        message: result.message,
        data: result.data.data,
        pagination: result.data.pagination,
      };
    } catch (error: any) {
      return {
        message: "something went wrong please try again",
      };
    }
  },
  updateEvent: async (
    id: string,
    payload: Partial<IUpdateEventInput>,
    options?: ServiceOptionds,
  ) => {
    try {
      const cookieStore = await cookies();
      const config: RequestInit = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify(payload),
      };
      // Add cache option if provided
      if (options?.cache) {
        config.cache = options.cache;
      }
      if (options?.revalidate) {
        config.next = { revalidate: options.revalidate };
      }
      config.next = { ...config.next, tags: ["event", "events"] };

      const res = await fetch(`${API_BASE_URL}/event/${id}`, config);
      const data = await res.json();
      if (!res.ok) {
        const error = data as ApiErrorResponse;
        return {
          success: error.success,
          message: error.message || "Failed to update event",
        };
      }

      return {
        success: data.success,
        message: data.message || "Event updated successfully",
        data: data.data, // expected to be the updated event object
      };
    } catch (error: any) {
      return {
        success: false,
        message: error?.message || "Something went wrong. Please try again.",
      };
    }
  },
  deleteEvent: async (id: string, options?: ServiceOptionds) => {
    try {
      const cookieStore = await cookies();
      const config: RequestInit = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
      };
      // Add cache option if provided
      if (options?.cache) {
        config.cache = options.cache;
      }
      if (options?.revalidate) {
        config.next = { revalidate: options.revalidate };
      }
      config.next = { ...config.next, tags: ["event", "events"] };

      const res = await fetch(`${API_BASE_URL}/event/${id}`, config);
      const data = await res.json();
      if (!res.ok) {
        const error = data as ApiErrorResponse;
        return {
          success: error.success,
          message: error.message || "Failed to delete event",
        };
      }

      return {
        success: data.success,
        message: data.message || "Event deleted successfully",
        data: data.data, // expected to be the deleted event object
      };
    } catch (error: any) {
      return {
        success: false,
        message: error?.message || "Something went wrong. Please try again.",
      };
    }
  },
  getFeaturedEvent: async (options?: ServiceOptionds) => {
    try {
      const url = new URL(`${API_BASE_URL}/event/isfeatured`);
      const config: RequestInit = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };
      if (options?.cache) {
        config.cache = options.cache;
      }
      if (options?.revalidate) {
        config.next = { revalidate: options.revalidate };
      }
      config.next = { ...config.next, tags: ["event", "featured"] };

      const res = await fetch(url.toString(), config);
      const data = await res.json();
      if (!res.ok) {
        const error = data as ApiErrorResponse;
        return {
          success: false,
          message: error.message || "Failed to fetch featured event",
        };
      }

      return {
        success: true,
        message: data.message || "Featured event fetched successfully",
        data: data.data as IBaseEvent[],
      };
    } catch (error: any) {
      return {
        success: false,
        message: error?.message || "Something went wrong. Please try again.",
      };
    }
  },
};

export default EventService;
