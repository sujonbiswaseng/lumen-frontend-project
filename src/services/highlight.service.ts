import { ICreateHighlightInput } from "@/types/highlight.types";
import { ApiErrorResponse } from "@/types/response.type";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
if (!API_BASE_URL) {
  throw new Error("API_BASE_URL is not defined. Please set NEXT_PUBLIC_API_BASE_URL in your environment variables.");
}

export const HighlightService = {
  // Create a new highlight
  createHighlight: async (value: ICreateHighlightInput) => {
    const storeCookies = await cookies();
    const formData = new FormData();
    const { image, ...rest } = value as ICreateHighlightInput;

    formData.append("data", JSON.stringify(rest));

    if (image) {
      formData.append("file", image);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/highlight`, {
        credentials: "include",
        method: "POST",
        headers: { Cookie: storeCookies.toString() },
        body: formData,
      });
      const body = await response.json();
      if (!response.ok) {
        const error = body as ApiErrorResponse;
        return {
          success: false,
          message: error.message,
        };
      }
      return {
        success: true,
        message: body.message || "Highlight created successfully",
        data: body.data,
      };
    } catch (error) {
      return { success: false, message: "Something went wrong. Please try again." };
    }
  },

  // Get all highlights
  getAllHighlights: async (params?: any, options?: { cache?: RequestCache; revalidate?: number }) => {
    try {
      const url = new URL(`${API_BASE_URL}/highlights`);
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
      config.next = { ...config.next, tags: ["highlights", "highlight"] };

      const response = await fetch(url.toString(), config);
      const body = await response.json();
      if (!response.ok) {
        const error = body as ApiErrorResponse;
        return {
          success: false,
          message: error.message || "Failed to fetch highlights",
        };
      }
      return {
        success: body.success ?? true,
        message: body.message || "Fetched highlights successfully",
        data: body.data?.data || body.data, // support for paginated & non-paginated API shape
        pagination: body.data?.pagination,
      };
    } catch (error) {
      return { success: false, message: "Something went wrong. Please try again." };
    }
  },

  // Get single highlight
  getSingleHighlight: async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/highlight/${id}`, {
        method: "GET",
        next: { tags: [`getSingleHighlight-${id}`] }
      });
      const body = await response.json();
      if (!response.ok) {
        const error = body as ApiErrorResponse;
        return {
          success: false,
          message: error.message,
        };
      }
      return {
        success: true,
        message: body.message || "Fetched highlight successfully",
        data: body.data,
      };
    } catch (error) {
      return { success: false, message: "Something went wrong. Please try again." };
    }
  },

  // Update highlight
  updateHighlight: async (id: string, data: any) => {

    const storeCookies = await cookies();
    const formData = new FormData();
    const { image, ...rest } = data ;

    formData.append("data", JSON.stringify(rest));

    if (image) {
      formData.append("file", image);
    }
    try {
      const response = await fetch(`${API_BASE_URL}/highlight/${id}`, {
        credentials: "include",
        method: "PUT",
        headers: { Cookie: storeCookies.toString() },
        body: formData,
      });
      const body = await response.json();
      if (!response.ok) {
        const error = body as ApiErrorResponse;
        return {
          success: false,
          message: error.message,
        };
      }
      return {
        success: true,
        message: body.message || "Updated highlight successfully",
        data: body.data,
      };
    } catch (error) {
      return { success: false, message: "Something went wrong. Please try again." };
    }
  },

  // Delete highlight
  deleteHighlight: async (id: string) => {
    const storeCookies = await cookies();
    try {
      const response = await fetch(`${API_BASE_URL}/highlight/${id}`, {
        credentials: "include",
        method: "DELETE",
        headers: {
          Cookie: storeCookies.toString(),
        },
      });
      const body = await response.json();
      if (!response.ok) {
        const error = body as ApiErrorResponse;
        return {
          success: false,
          message: error.message,
        };
      }
      return {
        success: true,
        message: body.message || "Deleted highlight successfully",
      };
    } catch (error) {
      return { success: false, message: "Something went wrong. Please try again." };
    }
  },
};