import { prisma } from "../../../lib/prisma";
import { Prisma } from "../../../generated/prisma/client";

const getAllTutors = async (filters: {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
}) => {
    // 1. Initialize an empty where object with the correct Prisma type
    const where: Prisma.TutorProfileWhereInput = {
        user: { status: 'ACTIVE' } // Always filter for active users
    };

    // 2. Only add category if it's provided
    if (filters.category) {
        where.category = { name: filters.category };
    }

    // 3. Only add search (OR) if it's provided
    if (filters.search) {
        where.OR = [
            { bio: { contains: filters.search, mode: 'insensitive' } },
            { user: { name: { contains: filters.search, mode: 'insensitive' } } }
        ];
    }

    // 4. Handle hourly rate range
    where.hourlyRate = {
        gte: filters.minPrice ?? 0,
        lte: filters.maxPrice ?? 999999
    };

    // 5. Execute query
    return await prisma.tutorProfile.findMany({
        where,
        include: {
            user: {
                select: { name: true, image: true }
            },
            category: true
        },
        orderBy: { averageRating: 'desc' }
    });
};



const getTutorById = async (id: string) => {
    return await prisma.tutorProfile.findUnique({
        where: { id },
        include: {
            // 1. Get basic user info (Name, Image)
            user: {
                select: {
                    name: true,
                    image: true,
                    email: true,
                },
            },
            // 2. Get the category details
            category: true,
            // 3. Get the availability slots for the tutor
            availability: true,
            // 4. Get reviews through the bookings relationship
            bookings: {
                where: {
                    status: "COMPLETED", // Usually, we only show reviews for completed sessions
                    review: { isNot: null } // Only get bookings that actually have a review
                },
                include: {
                    review: {
                        include: {
                            student: {
                                select: {
                                    name: true,
                                    image: true
                                }
                            }
                        }
                    }
                }
            }
        },
    });
};



export const tutorsService = {
    getAllTutors,
    getTutorById
}