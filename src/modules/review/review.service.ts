import { prisma } from "../../../lib/prisma";


interface reviewType {
    studentId: string;
    rating: number;
    comment: string;
    bookingId: string
}


// review.service.ts
const createReview = async (data: reviewType) => {
    return await prisma.$transaction(async (tx) => {
        // 1. Create the review
        const review = await tx.review.create({
            data: {
                rating: data.rating,
                comment: data.comment,
                student: { connect: { id: data.studentId } },
                booking: { connect: { id: data.bookingId } }
            },
            include: {
                booking: true // We need this to find the tutorProfileId
            }
        });

        // 2. Recalculate the Tutor's average rating
        const tutorId = review.booking.tutorProfileId;
        const aggregations = await tx.review.aggregate({
            _avg: { rating: true },
            where: { booking: { tutorProfileId: tutorId } }
        });

        // 3. Update the TutorProfile
        await tx.tutorProfile.update({
            where: { id: tutorId },
            data: { averageRating: aggregations._avg.rating || 0 }
        });

        return review;
    });
};



export const reviewService = {
    createReview
}