import { createBlogSchema } from "@/validations/blog.validation";
import z from "zod";

export type ICreateBlog = z.infer<typeof createBlogSchema>;