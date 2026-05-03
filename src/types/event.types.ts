
import { CreateEventSchema, EventCategoryEnum, EventStatusEnum, EventTypeEnum, PricingTypeEnum, UpdateEventSchema } from "@/validations/event.validation";
import z from "zod";

// type 
export type ICreateEvent = z.infer<typeof CreateEventSchema>;
export type IUpdateEvent = z.infer<typeof UpdateEventSchema>;
export type IEventCategory=z.infer<typeof EventCategoryEnum>
export type IEventPricing=z.infer<typeof PricingTypeEnum>
export type IEventStatusEnum=z.infer<typeof EventStatusEnum>
export type IEventTypeEnum=z.infer<typeof EventTypeEnum>

// array
 const EVENT_CATEGORY_ARR =EventCategoryEnum.options ;
 const EVENT_Pricing_ARR =PricingTypeEnum.options ;
 const EVENT_Status_ARR =EventStatusEnum.options ;
 const eventVisibility = ["PUBLIC", "PRIVATE"] as const;
export const EventArr={
  EVENT_CATEGORY_ARR,
  EVENT_Pricing_ARR,
  EVENT_Status_ARR,
  eventVisibility
}




// Pagination type
export type TPagination = {
  total?: number;
  page: number;
  limit: number;
  totalpage?: number;
};


export type IBaseEvent = {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    images: string[];
    visibility?: "PUBLIC" | "PRIVATE";
    priceType?: IEventPricing;
    status: IEventStatusEnum;
    is_featured: boolean;
    category_name: string;
    fee: number;
    organizerId: string;
    createdAt: string;
    updatedAt: string;
    avgRating: number;
    totalReviews: number;
  };

  export interface IUpdateEventInput {
    is_featured?: boolean;
    title?: string;
    description?: string;
    date?: string;
    time?: string;
    location?: string;
    images?: string[];
    category_name?: IEventCategory;
    priceType?: "FREE" | "PAID";
    status?: IEventStatusEnum;
    visibility?: "PUBLIC" | "PRIVATE";
    fee?: number;
    search?:string;
    createdAt?: string;
  }
  
  export type TResponseEvent<T = unknown> = IBaseEvent & T;



  export type TGroupedEvents<T = unknown> = {
    DRAFT: TResponseEvent<T>[];
    UPCOMING: TResponseEvent<T>[];
    ONGOING: TResponseEvent<T>[];
    COMPLETED: TResponseEvent<T>[];
    CANCELLED: TResponseEvent<T>[];
  };

  export type TGroupedEventsResponse<T = unknown> = {
    success: boolean;
    message: string;
    data: {
      data: TGroupedEvents<T>;
      pagination?: {
        total: number;
        page: number;
        limit: number;
        totalpage: number;
      };
    };
  };