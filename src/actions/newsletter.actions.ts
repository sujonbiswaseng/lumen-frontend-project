'use server'
import { NewsletterService } from "@/services/newsletter.service";

export async function createNewsletterAction(value: any) {
  return await NewsletterService.createNewsletter(value);
}

export async function getAllNewslettersAction(
  params?: any,
  options?: { cache?: RequestCache; revalidate?: number }
) {
  return await NewsletterService.getAllNewsletters(params, options);
}

export async function getSingleNewsletterAction(id: string) {
  return await NewsletterService.getSingleNewsletter(id);
}

export async function updateNewsletterAction(id: string, data: any) {
  return await NewsletterService.updateNewsletter(id, data);
}

export async function deleteNewsletterAction(id: string) {
  return await NewsletterService.deleteNewsletter(id);
}