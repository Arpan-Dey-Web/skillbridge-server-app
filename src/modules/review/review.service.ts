import { prisma } from "../../../lib/prisma";

interface reviewType {
    studentId: string;
    rating: number;
    comment: string;
    bookingId: string
}


const createReview = async (data: reviewType) => {
    return await prisma.$transaction(async (tx) => {
        // 1. CHECK: Does a review already exist for this booking?
        const existingReview = await tx.review.findUnique({
            where: { bookingId: data.bookingId }
        });

        if (existingReview) {
            throw new Error("You have already submitted a review for this session.");
        }

        // 2. CREATE: Use direct IDs for the mapping
        const review = await tx.review.create({
            data: {
                rating: data.rating,
                comment: data.comment,
                bookingId: data.bookingId, // Ensure this field exists in your Schema
                studentId: data.studentId,
            },
            include: { booking: true }
        });

        // 3. UPDATE: Booking Status
        await tx.booking.update({
            where: { id: data.bookingId },
            data: { status: "COMPLETED" }
        });

        // 4. RECALCULATE: Tutor average
        const tutorId = review.booking.tutorProfileId;
        const aggregations = await tx.review.aggregate({
            _avg: { rating: true },
            where: { booking: { tutorProfileId: tutorId } }
        });

        await tx.tutorProfile.update({
            where: { id: tutorId },
            data: { averageRating: aggregations._avg.rating || 0 }
        });

        return review;
    });
};


const getTutorReviews = async (userId: string) => {
    return await prisma.review.findMany({
        where: {
            booking: {
                tutor: {
                   
                    userId: userId
                }
            }
        },
        include: {
            student: {
                select: {
                    name: true,
                    image: true,
                }
            },
            booking: {
                select: {
                    startTime: true,
                    status: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
};

export const reviewService = {
    createReview,
    getTutorReviews
}