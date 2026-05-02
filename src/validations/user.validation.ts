import z from "zod";

const allowedDomains = ["res.cloudinary.com", "images.pexels.com"];
export const updateUserSchema = z.object({
  name: z.string().optional(),
  image: z
    .string()
    .url("Invalid image URL")
    .refine(
      (url) => {
        try {
          const parsed = new URL(url);
          return allowedDomains.includes(parsed.hostname);
        } catch {
          return false;
        }
      },
      {
        message: "Only Cloudinary and Pexels images allowed",
      },
    )
    .optional(),
  bgimage: z
    .string()
    .url("Invalid image URL")
    .refine(
      (url) => {
        try {
          const parsed = new URL(url);
          return allowedDomains.includes(parsed.hostname);
        } catch {
          return false;
        }
      },
      {
        message: "Only Cloudinary and Pexels images allowed",
      },
    )
    .optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  phone: z.string().min(10).max(15).optional(),
  isActive: z.boolean().optional(),
});


export const UpdateUserCommonData = z
  .object({
    role: z.enum(["ADMIN", "USER","MANAGER"]).optional(),

    status: z
      .enum(["ACTIVE", "INACTIVE", "BLOCKED", "DELETED"])
      .optional(),

    email: z
      .string()
      .trim()
      .optional()
      .refine(
        (val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
        "Invalid email format"
      ),
      isRegister:z.boolean().optional()
  })
  .strict();