import { createBlogSchema } from "@/validations/blog.validation";
import z from "zod";

export type ICreateBlog = z.infer<typeof createBlogSchema>;

export interface IBlog {
  id: string;
  title: string;
  content: string;
  images: string[];
  authorId: string;
  eventId: string | null;
  createdAt: string;
  updatedAt: string;
}
export type TResponseBlog<T = unknown> = IBlog & T;

export interface IUpdateBlogInput {
  title?: string;
  content?: string;
  images?: string[];
  authorId?: string;
  eventId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}