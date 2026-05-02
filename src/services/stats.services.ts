import { ApiErrorResponse } from '@/types/response.type';

import { DashboardData } from "@/types/stats.types";
import { cookies } from "next/headers";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
if (!API_BASE_URL) {
  throw new Error("API_BASE_URL is not defined. Please set NEXT_PUBLIC_API_BASE_URL in your environment variables.");
}

export const StatsServices = {
  getStats: async () => {
    try {
      const cookieStore = await cookies();
      const response = await fetch(`${API_BASE_URL}/stats`, {
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });
      const body = await response.json();

      if (!response.ok) {
        const error =body as ApiErrorResponse
        return {
          success:error.success || false,
          message: error?.message || "Failed to fetch stats",
          data: null,
        };
      }
      return { 
        success: true, 
        EventVisivillity:body.data.eventVisivillity,
        data: body.data as DashboardData,
        message: body.message ?? "Stats fetched successfully.",
      };
    } catch (error: any) {
      return { success: false, message: error.message || "Server error", data: null };
    }
  },
  publicStats: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/publicstats`, {
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });
      const body = await response.json();

      if (!response.ok) {
        const error = body as ApiErrorResponse;
        return {
          success: error.success || false,
          message: error?.message || "Failed to fetch public stats",
          data: null,
        };
      }
      return { 
        success: true, 
        data: body.data,
        message: body.message ?? "Public stats fetched successfully.",
      };
    } catch (error: any) {
      return { success: false, message: error.message || "Server error", data: null };
    }
  },
};
