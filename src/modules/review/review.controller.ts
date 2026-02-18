import { Request, Response } from 'express';
import { reviewService } from './review.service';

const createReview = async (req: Request, res: Response) => {
    try {
        const { rating, comment, bookingId } = req.body;
        const studentId = (req as any).user?.id;

        // 1. Basic Validation
        if (!bookingId || !rating) {
            return res.status(400).json({
                success: false,
                message: "Booking ID and Rating are required"
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5"
            });
        }

        // 2. Call Service
        const review = await reviewService.createReview({
            studentId,
            rating,
            comment,
            bookingId
        });

        // 3. Response
        res.status(201).json({
            success: true,
            message: "Review created successfully",
            data: review
        });
    } catch (error: any) {
        // Handle specific Prisma errors or logic errors
        res.status(400).json({
            success: false,
            message: error.message || "Failed to create review"
        });
    }
};

export const getMyReviews = async (req: Request, res: Response) => {
    try {
        const tutorId = (req as any).user?.id;

        if (!tutorId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Tutor ID not found"
            });
        }

        const reviews = await reviewService.getTutorReviews(tutorId);

        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch your reviews"
        });
    }
};
 


export const reviewController = {
    createReview,
    getMyReviews
}