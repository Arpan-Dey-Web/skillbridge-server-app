import { Router } from 'express';
import { tutorController } from './tutor.controller';

const router = Router();

// --- Profile Management-- -
router.put('/profile', tutorController.setupTutorProfile);


// --- Availability Management ---
router.put('/availability', tutorController.updateAvailability);


// Get specific tutor availability
router.get('/availability/:userId', tutorController.getTutorAvailability);

// --- Analytics/Dashboard ---
router.get('/stats/:userId', tutorController.getTutorStats);






export const TutorRoutes = router;