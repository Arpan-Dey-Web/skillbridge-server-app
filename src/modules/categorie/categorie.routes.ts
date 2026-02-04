import { Router } from 'express';
import { categorieController } from './categorie.controller';


const router = Router();
// get all categorie
router.get("/", categorieController.getAllCategories)

// POST /api/categories
router.post('/', categorieController.createCategory);

export const CategoryRoutes = router;