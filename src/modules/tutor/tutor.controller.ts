import { Request, Response } from "express";
import { tutorService } from "./tutor.service";

const setupTutorProfile = async (req: Request, res: Response) => {
    try {
        const tutorData = req.body;

        // In a real app, get userId from req.user (from your auth middleware)
        // For now, ensure your frontend is sending the userId or handle it here
        const result = await tutorService.upsertTutorProfile(tutorData);

        res.status(200).json({
            success: true,
            message: 'Tutor profile updated successfully!',
            data: result,
        });
    } catch (error: any) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message || 'Something went wrong',
        });
    }
};


export const tutorController = {
    setupTutorProfile,
}