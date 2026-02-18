import { Request, Response } from 'express';
import { categorieService } from './categorie.service';


const createCategory = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, message: "Name is required" });
        }

        const category = await categorieService.createCategory(name);
        return res.status(201).json({ success: true, data: category });
    } catch (error: any) {
        if (error.code === 'P2002') {
            return res.status(400).json({ success: false, message: "Category already exists" });
        }
        return res.status(500).json({ success: false, message: error.message });
    }
};

const updateCategory = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name } = req.body;
    const result = await categorieService.updateCategory(id as string, name);
    res.status(200).json({ success: true, data: result });
};

const deleteCategory = async (req: Request, res: Response) => {
    const { id } = req.params;
    await categorieService.deleteCategory(id as string);
    res.status(200).json({ success: true, message: "Category deleted" });
};

const getAllCategories = async (req: Request, res: Response) => {
    const result = await categorieService.getAllCategories();
    res.status(200).json({ success: true, data: result });
};


const getTutorsByCategory = async (req: Request, res: Response) => {
    try {
        const { categoryName } = req.params;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        // সার্ভিস কল করা
        const result = await categorieService.getTutorsByCategory(categoryName as string, page, limit);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        const totalCount = result._count.tutors;

        res.status(200).json({
            success: true,
            category: result.name,
            pagination: {
                totalCount,
                page,
                limit,
                totalPages: Math.ceil(totalCount / limit),
            },
            data: result.tutors,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};



export const categorieController = {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory,
    getTutorsByCategory
}