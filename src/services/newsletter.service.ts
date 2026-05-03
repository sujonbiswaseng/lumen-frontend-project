import { ApiErrorResponse } from "@/types/response.type";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
if (!API_BASE_URL) {
  throw new Error(
    "API_BASE_URL is not defined. Please set NEXT_PUBLIC_API_BASE_URL in your environment variables."
  );
}

export const NewsletterService = {
  // Create a new newsletter
  createNewsletter: async (value: any) => {
    const storeCookies = await cookies();
    console.log(value,'value')
   
    try {
      const response = await fetch(`${API_BASE_URL}/newsletter`, {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: storeCookies.toString(),
        },
        body: JSON.stringify(value),
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
        message: body.message || "Newsletter created successfully",
        data: body.data,
      };
    } catch (error) {
      return {
        success: false,
        message: "Something went wrong. Please try again.",
      };
    }
  },

  // Get all newsletters
  getAllNewsletters: async (
    params?: any,
    options?: { cache?: RequestCache; revalidate?: number }
  ) => {
    try {
      const url = new URL(`${API_BASE_URL}/newsletters`);
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            url.searchParams.append(key, String(value));
          }
        });
      }
      const config: RequestInit = {};
      const storeCookies = await cookies();
      config.credentials = "include";
      config.headers = {
        ...(config.headers || {}),
        Cookie: storeCookies.toString(),
      };
 
      if (options?.cache) {
        config.cache = options.cache;
      }
      if (options?.revalidate) {
        config.next = { revalidate: options.revalidate };
      }
      config.next = { ...config.next, tags: ["newsletters", "newsletter"] };

      const response = await fetch(url.toString(), config);
      const body = await response.json();
      if (!response.ok) {
        const error = body as ApiErrorResponse;
        return {
          success: false,
          message: error.message || "Failed to fetch newsletters",
        };
      }
      return {
        success: body.success ?? true,
        message: body.message || "Fetched newsletters successfully",
        data: body.data?.data || body.data,
        pagination: body.data?.pagination,
      };
    } catch (error) {
      return {
        success: false,
        message: "Something went wrong. Please try again.",
      };
    }
  },

  // Get single newsletter
  getSingleNewsletter: async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/newsletter/${id}`, {
        method: "GET",
        next: { tags: [`getSingleNewsletter-${id}`] },
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
        message: body.message || "Fetched newsletter successfully",
        data: body.data,
      };
    } catch (error) {
      return {
        success: false,
        message: "Something went wrong. Please try again.",
      };
    }
  },

  // Update newsletter
  updateNewsletter: async (id: string, data: any) => {
    const storeCookies = await cookies();
    const formData = new FormData();
    const { file, ...rest } = data;

    formData.append("data", JSON.stringify(rest));

    if (file) {
      formData.append("file", file);
    }
    try {
      const response = await fetch(`${API_BASE_URL}/newsletter/${id}`, {
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
        message: body.message || "Updated newsletter successfully",
        data: body.data,
      };
    } catch (error) {
      return {
        success: false,
        message: "Something went wrong. Please try again.",
      };
    }
  },

  // Delete newsletter
  deleteNewsletter: async (id: string) => {
    const storeCookies = await cookies();
    try {
      const response = await fetch(`${API_BASE_URL}/newsletter/${id}`, {
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
        message: body.message || "Deleted newsletter successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: "Something went wrong. Please try again.",
      };
    }
  },
};