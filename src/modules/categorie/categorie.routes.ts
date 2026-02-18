import { Router } from 'express';
import { categorieController } from './categorie.controller';
import { authorize } from '../../middleware/authorize';


const router = Router();
// get all categorie
router.get("/", categorieController.getAllCategories)

// Example: /api/categories/Physics/tutors?page=1&limit=10
router.get("/:categoryName/tutors", categorieController.getTutorsByCategory);

// POST /api/categories
router.post('/', authorize("ADMIN"), categorieController.createCategory);

// Patch /api/categories/:id
router.patch('/:id', authorize("ADMIN"), categorieController.updateCategory);

// DELETE /api/categories/:id 
router.delete('/:id', authorize("ADMIN"), categorieController.deleteCategory);



export const CategoryRoutes = router;