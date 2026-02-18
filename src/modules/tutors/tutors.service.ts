import { prisma } from "../../../lib/prisma";
import { Prisma } from "../../../generated/prisma/client";

interface tutorData {
    category?: string,
    search?: string,
    minPrice?: number,
    maxPrice?: number,
    page?: number,
    limit?: number,
    sortBy?: string,
}


const getAllTutors = async (filters: tutorData) => {
    const { page = 1, limit = 10, sortBy = 'averageRating' } = filters;
    const skip = (page - 1) * limit;

    const where: Prisma.TutorProfileWhereInput = {
        user: { status: 'ACTIVE' }
    };

    if (filters.category) where.category = { name: filters.category };
    if (filters.search) {
        where.OR = [
            { bio: { contains: filters.search, mode: 'insensitive' } },
            { user: { name: { contains: filters.search, mode: 'insensitive' } } }
        ];
    }

    where.hourlyRate = {
        gte: filters.minPrice ?? 0,
        lte: filters.maxPrice ?? 999999
    };

    // Total count বের করা (Pagination এর জন্য জরুরি)
    const totalCount = await prisma.tutorProfile.count({ where });

    const tutors = await prisma.tutorProfile.findMany({
        where,
        include: {
            user: { select: { name: true, image: true } },
            category: true
        },
        orderBy: { [sortBy]: 'desc' }, // dynamic sorting
        skip,
        take: limit,
    });

    return { tutors, totalCount };
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

const getFeaturedTutors = async () => {
    return await prisma.tutorProfile.findMany({
        where: {
            user: { status: 'ACTIVE' }
        },
        take: 6,
        include: {
            user: {
                select: {
                    name: true,
                    image: true,
                    createdAt: true // Optional: if you need to show "Joined on..."
                }
            },
            category: true
        },
        orderBy: {
            // Access the createdAt field inside the user relation
            user: {
                createdAt: 'desc'
            }
        }
    });
};

export const tutorsService = {
    getAllTutors,
    getTutorById,
    getFeaturedTutors
}