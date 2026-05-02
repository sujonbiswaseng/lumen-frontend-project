import { z } from "zod";

export const EventCategoryEnum = z.enum([
  "BIRTHDAY",
  "WEDDING",
  "ANNIVERSARY",
  "REUNION",

  "SEMINAR",
  "WORKSHOP",
  "CONFERENCE",
  "CAREER_FAIR",

  "MEETING",
  "NETWORKING",
  "PRODUCT_LAUNCH",
  "STARTUP_EVENT",

  "CONCERT",
  "PARTY",
  "FESTIVAL",
  "MOVIE_NIGHT",

  "TOURNAMENT",
  "FITNESS",
  "YOGA",

  "CHARITY",
  "COMMUNITY",
  "RELIGIOUS",

  "ART",
  "PHOTOGRAPHY",
  "FASHION_SHOW",

  "GAMING",
  "FOOD_EVENT",
  "TRAVEL_MEETUP",
]);

export const EventStatusEnum =z.enum([
  "DRAFT",
  "UPCOMING",
  "ONGOING",
  "COMPLETED",
  "CANCELLED",
]);

export const EventTypeEnum = z.enum([
  "PUBLIC",
  "PRIVATE",
]);

export const PricingTypeEnum = z.enum([
  "FREE",
  "PAID",
]);

export const CreateEventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  categories: EventCategoryEnum,
  date: z
  .string()
  .refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  })
  .transform((val) => new Date(val).toISOString()),
  time: z.string().min(1, "Time is required"),
  location: z.string().min(3, "location is required"),
  images: z
    .union([z.array(z.instanceof(File)).min(1, "At least 1 image is required"), z.array(z.string()).min(1, "At least 1 image is required")]),
  visibility: EventTypeEnum.default("PUBLIC"),
  priceType: PricingTypeEnum.default('FREE'),
  fee: z
  .preprocess((val) => {
    if (val === "" || val === null) return undefined;
    return Number(val);
  }, z
    .number()
    .min(60, { message: "Fee must be at least 60 Taka." })
    .max(6000, { message: "Fee cannot exceed 6000 Taka." })
    .optional()
  ),
  status: EventStatusEnum.default("UPCOMING"),
  is_featured: z.boolean().optional().default(false),
})
export const UpdateEventSchema = CreateEventSchema.partial();

