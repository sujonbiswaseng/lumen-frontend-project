
import z from "zod";
import { allowedDomains } from "./auth.validation";

export const CreateCategory = z.object({
  name: z.string().min(1, "Name is required"),
  image: z.any()
});
export const UpdateCategory = z.object({
  name: z.string().optional(),
  image: z.string().url("Invalid image URL").refine((url) => {
    try {
      const parsed = new URL(url as any);
      return allowedDomains.includes(parsed.hostname);
    } catch {
      return false;
    }
  }, {
    message: "Only Cloudinary and Pexels images allowed",
  }).optional(),
})