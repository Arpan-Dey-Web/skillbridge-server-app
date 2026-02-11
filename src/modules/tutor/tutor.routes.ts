import { Router } from 'express';
import { tutorController } from './tutor.controller';
import { authorize } from '../../middleware/authorize';

const router = Router();

// --- Profile Management-- -
router.put('/profile', authorize("TUTOR") ,tutorController.setupTutorProfile);

// --- Availability Management ---
router.put('/availability', authorize("TUTOR"), tutorController.updateAvailability);

// Get specific tutor availability
router.get('/availability/:tutorId', tutorController.getTutorAvailability);

// --- Analytics/Dashboard ---
router.get('/stats/:userId', tutorController.getTutorStats);

// --- get tutor profile details ---
router.get('/profile/:userId', authorize("TUTOR"), tutorController.getTutorProfile);

export const TutorRoutes = router;