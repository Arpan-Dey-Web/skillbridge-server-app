import { Router } from 'express';
import { tutorController } from './tutor.controller';

const router = Router();




// --- Profile Management-- -
// Matches documentation: PUT /api/tutor/profile
router.put('/profile', tutorController.setupTutorProfile);


// --- Availability Management ---
// Matches documentation: PUT /api/tutor/availability
router.put('/availability', tutorController.updateAvailability);


// Get specific tutor availability
router.get('/availability/:userId', tutorController.getTutorAvailability);

// --- Analytics/Dashboard ---
router.get('/stats/:userId', tutorController.getTutorStats);

// public routes for public routes
// router.get("/tutors",)




export const TutorRoutes = router;