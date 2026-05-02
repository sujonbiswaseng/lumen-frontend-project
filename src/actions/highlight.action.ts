"use server"
import { HighlightService } from "@/services/highlight.service";
import { ICreateHighlightInput } from "@/types/highlight.types";

export async function createHighlightAction(data: ICreateHighlightInput) {
  return await HighlightService.createHighlight(data);
}

export async function getAllHighlightsAction(params?: any, options?: { cache?: RequestCache; revalidate?: number }) {
  return await HighlightService.getAllHighlights(params, options);
}

export async function getSingleHighlightAction(id: string) {
  return await HighlightService.getSingleHighlight(id);
}


export async function updateHighlightAction(id: string, data: any) {
  return await HighlightService.updateHighlight(id, data);
}

export async function deleteHighlightAction(id: string) {
  return await HighlightService.deleteHighlight(id);
}