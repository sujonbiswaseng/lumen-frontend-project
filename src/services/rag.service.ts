import { ApiErrorResponse } from "@/types/response.type";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
if (!API_BASE_URL) {
  throw new Error("API_BASE_URL is not defined. Please set NEXT_PUBLIC_API_BASE_URL in your environment variables.");
}

export const RagService = {

    IngestEvent: async () => {
        const storeCookies = await cookies();
        try {
          const response = await fetch(`${API_BASE_URL}/rag/ingest-event`, {
            credentials:"include",
            method: "POST",
            headers: {
              "Content-Type": "application/json",
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
            message: body.message || "ingest event successfully",
            data: body.data,
          };
        } catch (error) {
          return { success: false, message: "Something went wrong. Please try again." };
        }
      },
      Query: async (prompt:string) => {
        const storeCookies = await cookies();
        try {
          const response = await fetch(`${API_BASE_URL}/rag/query`, {
            credentials:"include",
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Cookie: storeCookies.toString(),
            },
            body:JSON.stringify({query:prompt})
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
            message: body.message || "query successfully",
            data: body.data.answer.event,
          };
        } catch (error) {
          return { success: false, message: "Something went wrong. Please try again." };
        }
      },


}