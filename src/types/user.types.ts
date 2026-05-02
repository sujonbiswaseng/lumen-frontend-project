import { updateUserSchema } from "@/validations/user.validation";
import z from "zod";

export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
  MANAGER = "MANAGER",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
  DELETED = "DELETED",
}



export interface IBaseUser {
    id: string;
    name: string;
    email: string;
    phone:string;
    isActive:boolean;
    bgimage:string;
    role: Role;
    status: UserStatus;
    image: string | null;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
    totalReview: number;
    averageRating: number;
}



export type TResponseUserData<T = unknown> = IBaseUser & T;

export type TUpdateUserInput = z.infer<typeof updateUserSchema>;