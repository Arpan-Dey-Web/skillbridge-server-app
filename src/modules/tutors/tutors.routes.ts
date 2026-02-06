import { Router } from "express";
import { tutorsController } from "./tutors.controller";


const router = Router();

// Public Routes (No Auth required)

// GET /api/tutors
router.get('/', tutorsController.getTutors);      

// GET /api/tutors/:id
router.get('/:id', tutorsController.getTutorById); 




export const tutorsRoutes = router;