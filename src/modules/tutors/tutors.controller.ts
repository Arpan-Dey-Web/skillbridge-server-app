import { Request, Response } from "express";
import { tutorsService } from "./tutors.service";



// Handle GET /api/tutors (Public Search)
const getTutors = async (req: Request, res: Response) => {
    try {
        const { category, search, minPrice, maxPrice } = req.query;

        // 1. Create a dynamic filters object
        // We define the type to match exactly what your service expects
        const filters: {
            category?: string;
            search?: string;
            minPrice?: number;
            maxPrice?: number
        } = {};

        // 2. Only assign if they exist. 
        if (category) filters.category = category as string;
        if (search) filters.search = search as string;
        if (minPrice) filters.minPrice = Number(minPrice);
        if (maxPrice) filters.maxPrice = Number(maxPrice);

        // 3. Pass the clean object to the service
        const tutors = await tutorsService.getAllTutors(filters);

        res.status(200).json({
            success: true,
            count: tutors.length,
            data: tutors
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch tutors"
        });
    }
};



// Handle GET /api/tutors/:id (Public Profile)
const getTutorById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const tutor = await tutorsService.getTutorById(id as string);

        if (!tutor) {
            return res.status(404).json({
                success: false,
                message: "Tutor not found"
            });
        }

        res.status(200).json({
            success: true,
            data: tutor
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch tutor details"
        });
    }
};


export const tutorsController = {
    getTutors,
    getTutorById
};