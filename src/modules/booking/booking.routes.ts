import { Router } from 'express';
import { bookingController } from './booking.controller';
import { authorize } from '../../middleware/authorize';

const router = Router();

// Matches: POST /api/bookings
router.post('/', authorize("STUDENT"), bookingController.createBooking);

// Matches: GET /api/bookings
router.get('/', bookingController.getMyBookings);

// Matches: GET /api/bookings/pending
router.get('/pending', authorize("TUTOR"), bookingController.getPendingRequests);

// GET All bookings
router.get('/all', authorize("ADMIN"), bookingController.getAllBookings);

// /api/bookings / approve /: id
router.patch("/approve/:id", authorize("TUTOR"), bookingController.approveBooking);

// /api/bookings/:id
router.delete("/:id", authorize("TUTOR"), bookingController.deleteBooking);

export const BookingRoutes = router;