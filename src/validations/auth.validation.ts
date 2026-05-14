import { z } from "zod";
export const allowedDomains = [
  "res.cloudinary.com",
  "images.pexels.com",
];

export const passwordSchema =z.object({
  password: z.string()
  .min(8, "Password must be at least 8 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
    "Password must contain uppercase, lowercase, number, and special character"
  )
})


export const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
    "Password must be at least 8 characters long, contain uppercase, lowercase, number and special character"),
  phone: z.string()
    .optional()
    .refine(val => !val || /^\d{11}$/.test(val), {
      message: "Phone number must be exactly 11 digits",
    }),
  image: z.any()
});

export const loginZodSchema = z.object({
  email : z.email("Invalid email address"),
  password : z.string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
        "Password must be at least 8 characters long, contain uppercase, lowercase, number and special character")
})