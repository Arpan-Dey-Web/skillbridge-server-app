import { Router } from "express";
import { tutorsController } from "./tutors.controller";


const router = Router();

// GET first 6 tutors only  /api/tutors
router.get('/', tutorsController.getTutors);      


// GET all /api/tutors
router.get('/all', tutorsController.getTutors); 


// GET /api/tutors/:id
router.get('/:id', tutorsController.getTutorById); 



export const tutorsRoutes = router;