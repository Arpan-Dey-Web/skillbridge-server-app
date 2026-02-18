import { Request, Response } from "express";
import { tutorsService } from "./tutors.service";

interface tutorData {
    category?: string,
    search?: string,
    minPrice?: number,
    maxPrice?: number,
    page?: number,
    limit?: number,
    sortBy?: string,
}

// Handle GET /api/tutors (Public Search)
const getTutors = async (req: Request, res: Response) => {
    try {
        const { category, search, minPrice, maxPrice, page, limit, sortBy } = req.query;

        const filters = {
            category: category as string,
            search: search as string,
            minPrice: minPrice ? Number(minPrice) : undefined,
            maxPrice: maxPrice ? Number(maxPrice) : undefined,
            page: page ? Number(page) : 1,
            limit: limit ? Number(limit) : 10,
            sortBy: (sortBy as string) || 'averageRating'
        };

        const { tutors, totalCount } = await tutorsService.getAllTutors(filters as any)

        res.status(200).json({
            success: true,
            totalCount,
            page: filters.page,
            totalPages: Math.ceil(totalCount / filters.limit),
            data: tutors
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getFirstSixTutors = async (req: Request, res: Response) => {
    try {
        // No filters needed here as per your requirement
        const tutors = await tutorsService.getFeaturedTutors();

        res.status(200).json({
            success: true,
            message: "First 6 tutors fetched successfully",
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
    getTutorById,
    getFirstSixTutors
};