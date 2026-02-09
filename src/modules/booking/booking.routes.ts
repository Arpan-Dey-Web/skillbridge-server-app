import { Router } from 'express';
import { bookingController } from './booking.controller';
import { authorize } from '../../middleware/authorize';

const router = Router();

// Matches: POST /api/bookings
router.post('/', authorize("STUDENT"), bookingController.createBooking);

// Matches: GET /api/bookings
router.get('/', authorize("STUDENT", "TUTOR", "ADMIN"), bookingController.getMyBookings);

// GET All bookings
router.get('/all', authorize("ADMIN"), bookingController.getAllBookings);

export const BookingRoutes = router;