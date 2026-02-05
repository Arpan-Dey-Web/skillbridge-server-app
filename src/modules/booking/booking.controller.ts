import { Request, Response } from 'express';
import { bookingService } from './booking.service';

const createBooking = async (req: Request, res: Response) => {
    try {
        const { startTime, endTime, tutorProfileId } = req.body;
        const studentId = (req as any).user?.id;

        const result = await bookingService.createBooking({
            startTime,
            endTime,
            studentId,
            tutorProfileId
        });

        res.status(201).json({ success: true, data: result });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const getMyBookings = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        const role = (req as any).user?.role; // Ensure your auth middleware provides the role

        const result = await bookingService.getUserBookings(userId, role);
        res.status(200).json({ success: true, data: result });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const bookingController = {
    createBooking,
    getMyBookings
};