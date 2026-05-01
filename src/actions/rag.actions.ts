'use server'

import { RagService } from "@/services/rag.service";

export const IngestEvent = async () => {
  const response = await RagService.IngestEvent();
  return response;
};

export const QueryEvent = async (query: string) => {
  const response = await RagService.Query(query);
  return response;
};