import { z } from "zod";

export const createBlogSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  content: z.string().min(1, { message: "Content is required." }),
  images: z
    .union([z.array(z.instanceof(File)).min(1, "At least 1 image is required"), z.array(z.string()).min(1, "At least 1 image is required")]),
  eventId: z.string().optional().nullable(),
});

export const updateBlogSchema = z
  .object({
    title: z.string().optional(),
    content: z.string().optional(),
    images: z.array(z.string().url({ message: "Each image must be a valid URL." })).optional(),
    authorId: z.string().min(1, { message: "Author ID cannot be empty." }).optional(),
    eventId: z.string().optional().nullable(),
  })
  .refine(
    data => Object.keys(data).length > 0,
    { message: "At least one field must be provided to update the blog." }
  );