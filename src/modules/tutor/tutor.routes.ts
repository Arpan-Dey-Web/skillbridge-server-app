import { Router } from 'express';
import { tutorController } from './tutor.controller';



const router = Router();
// get all categorie
// router.get("/", )

// POST /api/categories
// router.post('/', );




// patch route
router.patch("/setup", tutorController.setupTutorProfile)

export const tutorRoutes = router;