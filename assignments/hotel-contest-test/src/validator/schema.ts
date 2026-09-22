import z from "zod";
import { Role } from "../../generated/prisma/enums";

export const signupSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  name: z.string(),
  role: z.enum(Role).default("customer"),
  phone: z.string().optional(),
});

export const signinSchema = signupSchema.pick({
  email: true,
  password: true,
});

export const hotelSchema = z.object({
  name: z.string(),
  description: z.string().default(""),
  city: z.string(),
  country: z.string(),
  amenities: z.array(z.string()).default([]),
});

export const getHotelSchema = z.object({
  city: z.string().optional(),
  country: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  minRating: z.number().min(0).max(5).optional(),
});
