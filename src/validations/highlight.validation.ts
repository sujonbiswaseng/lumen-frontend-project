import { z } from "zod";

export const createHighlightSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  description: z.string().min(1, { message: "Description is required." }),
  image: z.any()
});

export const updateHighlightSchema = z
  .object({
    title: z.string().min(1, { message: "Title cannot be empty." }).optional(),
    description: z.string().min(1, { message: "Description cannot be empty." }).optional(),
    image: z.any()
  })