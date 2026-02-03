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


const getAllCategories = async (req: Request, res: Response) => {
    const result = await categorieService.getAllCategories();
    res.status(200).json({ success: true, data: result });
};



export const categorieController = {
    createCategory, getAllCategories
}