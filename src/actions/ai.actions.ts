"use server"
import { aiService } from "@/services/ai.service";

// Action to get AI suggestions
export async function getAiSuggestAction(query: string,signal?:AbortSignal) {
  return await aiService.suggest(query,signal);
}

// Action to get AI recommendations
export async function getAiRecommendAction(query: string,signal?:AbortSignal) {
  return await aiService.recommend(query,signal);
}

// Action to get AI trending items
export async function getAiTrendingAction(query?: string,signal?:AbortSignal) {
  return await aiService.trending(query,signal);
}