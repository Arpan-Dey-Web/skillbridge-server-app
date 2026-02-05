import { Request, Response } from "express";
import { tutorService } from "./tutor.service";

const setupTutorProfile = async (req: Request, res: Response) => {
    try {
        const result = await tutorService.upsertTutorProfile(req.body);
        res.status(200).json({ success: true, data: result });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateAvailability = async (req: Request, res: Response) => {
    try {
        const { userId, schedule } = req.body;
        const result = await tutorService.updateAvailability(userId, schedule);
        res.status(200).json({ success: true, message: "Availability updated", data: result });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const getTutorAvailability = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const result = await tutorService.getTutorAvailability(userId as string);

        res.status(200).json({
            success: true,
            message: "Availability fetched successfully",
            data: result,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Something went wrong",
        });
    }
}

const getTutorStats = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        const stats = await tutorService.getTutorStats(userId as string);

        res.status(200).json({
            success: true,
            message: "Tutor statistics fetched successfully",
            data: stats
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch stats"
        });
    }
};



export const tutorController = {
    setupTutorProfile,
    updateAvailability,
    getTutorAvailability,
    getTutorStats
};