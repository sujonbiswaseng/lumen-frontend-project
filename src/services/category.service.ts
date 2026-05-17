
import { ICreateCategory, IUpdateCategory, TGetCategory, TResponseCategoryData } from "@/types/category.type";
import { IBaseEvent, TPagination } from "@/types/event.types";
import { ApiErrorResponse, ApiResponse } from "@/types/response.type";
import { IBaseUser } from "@/types/user.types";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { ServiceOptionds } from "./event.services";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
if (!API_BASE_URL) {
  throw new Error("API_BASE_URL is not defined. Please set NEXT_PUBLIC_API_BASE_URL in your environment variables.");
}
const api_url =API_BASE_URL

export interface Icategory {
  name?: string,
  image?: string
}
export const CategoriesService = {
  getcategory: async (params?: any) => {
    try {
      const url = new URL(`${api_url}/category`);
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            url.searchParams.append(key, String(value));
          }
        });
      }
      const res = await fetch(url.toString(), {
    
        next: {
          tags: ["category","categories"]
        },
      });
      const data = await res.json();
      const result = data.data.result as TResponseCategoryData<{ meals: IBaseEvent; user: IBaseUser; }>[]
      if (!res.ok) {
        const error = data as ApiErrorResponse;
        return {
          success: error.success,
          message: error.message || "categories retrieve failed",
        };
      }
      return {
        success: data.success,
        message: data.message || "categories retrieve successfully",
        data: result,
        pagination: data.data.pagination as TPagination
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.message,
        message: "something went wrong, please try again",
      };
    }
  },
  createCategory: async (value: any) => {

    try {
      const cookieStore = await cookies();
      const formData = new FormData();

      const { image, ...rest } = value;
      const payload = { ...rest } as Record<string, unknown>;
      if (typeof image === "string" && image.trim()) {
        payload.image = image.trim();
      }

      formData.append("data", JSON.stringify(payload));
      if (image && typeof image !== "string") {
        formData.append("file", image);
      }

      const response = await fetch(`${api_url}/category`, {
        headers: {
          Cookie: cookieStore.toString(),
        },
        method: "POST",
        body: formData
      })
      revalidateTag('category', 'max')
      const data = await response.json()
        const result =data as ApiResponse<ICreateCategory> 
          if (!result.data) {
            const error=data as ApiErrorResponse
             return { message: error.message || "category create failed" }
          }
          return { success: true, message: "category created successfully", result };

    } catch (error) {
      return {
        success: false,
        message: "something went wrong please try again"
      }

    }

  },
  updateCategory: async (id: string, updateUser: IUpdateCategory) => {
    try {
      const cookieStore = await cookies()
      const formData = new FormData();

      const { image, ...rest } = updateUser;
      const payload = { ...rest } as Record<string, unknown>;
      if (typeof image === "string" && image.trim()) {
        payload.image = image.trim();
      }

      formData.append("data", JSON.stringify(payload));
      if (image && typeof image !== "string") {
        formData.append("file", image);
      }
      const res = await fetch(`${api_url}/admin/category/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          Cookie: cookieStore.toString(),
        },
        body:formData,
      });
      revalidateTag('category', 'max')
      const data = await res.json();
      const result = data as ApiResponse<TGetCategory>
      if (!res.ok) {
        const error = data as ApiErrorResponse
        return {success:error.success ,message:error.message || "category data update fail" }
      }
      return { success: result.success, message:result.message ||  "category data update successfully", data };
    } catch (error: any) {
  
      return { success: false, error: error.message || "something went wrong please try again" };
    }
  },

  deleteCategory: async (id: string) => {
    try {
      const cookieStore = await cookies()
      const res = await fetch(`${api_url}/admin/category/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          Cookie: cookieStore.toString(),
        },
      });
      revalidateTag("category", 'max')
      const data = await res.json();
      const result = data as ApiResponse<TGetCategory>
      if (!res.ok) {
        const error =data as ApiErrorResponse
        return { success: error.success, message:error.message || "category data delete fail" }
      }
      return {success:result.success,message:result.message || "category deleted sucessfully",data:result};
    } catch (error: any) {
    
      return { success: false, error: error.message || "something went wrong please try again" };
    }
  },
  singlecategory: async (id: string,params?: any,options?: ServiceOptionds) => {
    try {
      const url = new URL(`${api_url}/category/${id}`);
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            url.searchParams.append(key, String(value));
          }
        });
      }

      const cookieStore = await cookies();
      const config: RequestInit = {
        credentials: "include",
        headers: {
          Cookie: cookieStore.toString(),
        }
      };

      if (options?.cache) {
        config.cache = options.cache;
      }
      if (options?.revalidate) {
        config.next = { revalidate: options.revalidate };
      }
      config.next = { ...config.next, tags: ["category"] };

      const res = await fetch(url.toString(), config);
      const data = await res.json();
      const result = data as ApiResponse<any>;
      if (!res.ok) {
        const error = data as ApiErrorResponse;
        return {
          success: error.success ?? false,
          message: error.message || "category data retrieve fail",
        };
      }
      return {
        success: result.success,
        message: result.message || "retrieve category data successfully",
        data: result.data,
      };
    } catch (error: any) {
      return { success: false, error: error.message || "something went wrong please try again" };
    }
  },
}