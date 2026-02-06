import { Router } from 'express';
import { categorieController } from './categorie.controller';
import { authorize } from '../../middleware/authorize';


const router = Router();
// get all categorie
router.get("/", authorize("TUTOR"), categorieController.getAllCategories)

// POST /api/categories
router.post('/', authorize("ADMIN"), categorieController.createCategory);

export const CategoryRoutes = router;