import type { Request, Response } from "express";
import { hotelSchema } from "../validator/schema";
import { ApiError } from "../utils/apiError";
import { prisma } from "../db";
import { ApiResponse } from "../utils/apiResponse";

export const createHotel = async (req: Request, res: Response) => {
  const { success, data } = hotelSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json(new ApiError("INVALID_REQUEST"));
  }
  const ownerId = req.user?.id;
  const { name, description, city, country, amenities } = data;
  const hotel = await prisma.hotel.create({
    data: {
      name,
      description,
      city,
      country,
      amenities,
      owner: {
        connect: {
          id: ownerId,
        },
      },
    },
    select: {
      id: true,
      ownerId: true,
      name: true,
      description: true,
      city: true,
      country: true,
      amenities: true,
      rating: true,
      reviews: true,
    },
  });
  return res.status(201).json(new ApiResponse(data));
};
export const getHotels = (req: Request, res: Response) => {
  
};
export const createRoom = (req: Request, res: Response) => {};
export const getHotel = (req: Request, res: Response) => {};
