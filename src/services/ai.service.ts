import type { AiSuggestResult } from "@/types/ai.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
if (!API_BASE_URL) {
  throw new Error(
    "API_BASE_URL is not defined. Please set NEXT_PUBLIC_API_BASE_URL in your environment variables."
  );
}

export const aiService = {
  suggest: async (query: string, signal?: AbortSignal): Promise<AiSuggestResult> => {
    try {
      const response = await fetch(`${API_BASE_URL}/rag/suggest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: query }),
        signal,
      });
      const body = await response.json();
      if (!response.ok) {
        return {
          success: false,
          message: body?.message || "Failed to fetch suggestions",
        };
      }

      return {
        success: true,
        message: body?.message,
        data:body.data.suggestions
      };
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return { success: false, message: "Request cancelled" };
      }
      return {
        success: false,
        message: "Something went wrong. Please try again.",
      };
    }
  },

  recommend: async (query: string, signal?: AbortSignal): Promise<AiSuggestResult> => {
    try {
      const response = await fetch(`${API_BASE_URL}/rag/recommendations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ prompt: query }),
        signal,
      });
      const body = await response.json();
      if (!response.ok) {
        return {
          success: false,
          message: body?.message || "Failed to get recommendations",
        };
      }
      return {
        success: true,
        data: body.data.recommendations,
      };
    } catch {
      return { success: false, message: "Something went wrong. Please try again." };
    }
  },

  trending: async (query?: string, signal?: AbortSignal): Promise<AiSuggestResult> => {
    try {
      console.log(query,'query')
      const response = await fetch(`${API_BASE_URL}/rag/trending-items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: query }),
        signal,
      });
      const body = await response.json();
      console.log(body,'text')
      if (!response.ok) {
        return {
          success: false,
          message: body?.message || "Failed to get trending data",
        };
      }
      return {
        success: true,
        data: body.data.trending,
      };
    } catch {
      return { success: false, message: "Something went wrong. Please try again." };
    }
  },
};
