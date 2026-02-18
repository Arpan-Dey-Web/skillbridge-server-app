import { Request, Response } from 'express';
import { bookingService } from './booking.service';

const createBooking = async (req: Request, res: Response) => {
    try {
        const { startTime, endTime, tutorProfileId } = req.body;
        const studentId = (req as any).user?.id;

        const result = await bookingService.createBooking({
            startTime,//
            endTime, //
            studentId,
            tutorProfileId
        });

        res.status(201).json({ success: true, data: result });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const getPendingRequests = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        const result = await bookingService.getPendingTutorBookings(userId);

        res.status(200).json({ success: true, data: result });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
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

const getAllBookings = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        const role = (req as any).user?.role;

        // Note: We use the new service function we just wrote
        const result = await bookingService.getAllBookings(userId, role);

        res.status(200).json({ success: true, data: result });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const approveBooking = async (req: Request, res: Response) => {
    console.log("object");
    try {
        const { id } = req.params;
        const { meetLink } = req.body;
        const user = (req as any).user; // আপনার অ্যাথ মিডলওয়্যার থেকে আসা ইউজার

        // ১. ইনপুট ভ্যালিডেশন (Controller এর দায়িত্ব)
        if (!meetLink || !meetLink.startsWith("https://meet")) {
            return res.status(400).json({
                success: false,
                message: "Invalid Meet Link! Must start with 'https://meet'",
            });
        }

        // ২. সার্ভিস কল করা
        const result = await bookingService.approveBooking(id as string, meetLink, user.id);

        // ৩. রেসপন্স পাঠানো
        res.status(200).json({
            success: true,
            message: "Booking confirmed successfully",
            data: result,
        });
    } catch (error: any) {
        // এরর হ্যান্ডলিং
        const statusCode = error.message.includes("authorized") ? 403 : 400;
        res.status(statusCode).json({
            success: false,
            message: error.message || "Something went wrong",
        });
    }
};

const deleteBooking = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // /api/bookings/:id
        const tutorUserId = (req as any).user?.id; // From your auth middleware

        const result = await bookingService.deleteBooking(id as string, tutorUserId);

        res.status(200).json({
            success: true,
            message: "Booking request rejected and removed",
            data: result
        });
    } catch (error: any) {
        const statusCode = error.message.includes("authorized") ? 403 : 400;
        res.status(statusCode).json({
            success: false,
            message: error.message || "Failed to delete booking"
        });
    }
};

export const bookingController = {
    createBooking,
    getMyBookings,
    getAllBookings,
    approveBooking,
    getPendingRequests,
    deleteBooking
};