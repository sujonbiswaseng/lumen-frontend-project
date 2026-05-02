import { ICreateBlog } from "@/types/blog.type";
import { ApiErrorResponse } from "@/types/response.type";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
if (!API_BASE_URL) {
  throw new Error("API_BASE_URL is not defined. Please set NEXT_PUBLIC_API_BASE_URL in your environment variables.");
}

export const BlogService = {
  // Create a new blog
  createBlog: async (value: ICreateBlog) => {
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
      const response = await fetch(`${API_BASE_URL}/blog`, {
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
        message: body.message || "Blog created successfully",
        data: body.data,
      };
    } catch (error) {
      return { success: false, message: "Something went wrong. Please try again." };
    }
  },

  // Get all blogs
  getAllBlogs: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/blogs`, {
        next: { tags: ["getAllBlogs"] },
        method: "GET",
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
        message: body.message || "Fetched blogs successfully",
        data: body.data,
      };
    } catch (error) {
      return { success: false, message: "Something went wrong. Please try again." };
    }
  },

  // Get single blog
  getSingleBlog: async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blog/${id}`, {
        method: "GET",
        next: { tags: [`getSingleBlog-${id}`] }
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
        message: body.message || "Fetched blog successfully",
        data: body.data,
      };
    } catch (error) {
      return { success: false, message: "Something went wrong. Please try again." };
    }
  },

  // Update blog
  updateBlog: async (id: string, data: any) => {
    const storeCookies = await cookies();
    try {
      const response = await fetch(`${API_BASE_URL}/blog/${id}`, {
        credentials: "include",
        method: "PUT",
        headers: {
          Cookie: storeCookies.toString(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
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
        message: body.message || "Updated blog successfully",
        data: body.data,
      };
    } catch (error) {
      return { success: false, message: "Something went wrong. Please try again." };
    }
  },

  // Delete blog
  deleteBlog: async (id: string) => {
    const storeCookies = await cookies();
    try {
      const response = await fetch(`${API_BASE_URL}/blog/${id}`, {
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
        message: body.message || "Deleted blog successfully",
      };
    } catch (error) {
      return { success: false, message: "Something went wrong. Please try again." };
    }
  },
};