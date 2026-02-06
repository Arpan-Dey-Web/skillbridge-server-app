import { Request, Response } from 'express';
import { reviewService } from './review.service';

const createReview = async (req: Request, res: Response) => {
    try {
        const { tutorId, rating, comment, bookingId } = req.body;

        // Assume studentId comes from your auth middleware (e.g., Better-Auth)
        const studentId = (req as any).user?.id;

        if (!studentId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const review = await reviewService.createReview({
            studentId,
            rating,
            comment,
            bookingId
        });

        res.status(201).json({
            success: true,
            message: "Review created successfully",
            data: review
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || "Failed to create review"
        });
    }
};




export const reviewController = {
    createReview
}