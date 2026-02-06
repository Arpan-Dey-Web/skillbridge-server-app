// 🛠 Step 3: Booking System(The "Student Journey")

// This is the most complex part.Do this after your database has tutors and categories.

//     POST / api / bookings: The logic to create a record in the Bookings table.

//         GET / api / bookings: Create a unified route that returns bookings for the logged -in user(if student, show who they booked; if tutor, show who booked them).

// PATCH / api / bookings /: id: Logic to change status to COMPLETED or CANCELLED.


import { Router } from 'express';
import { bookingController } from './booking.controller';
import { authorize } from '../../middleware/authorize';

const router = Router();

// Matches: POST /api/bookings
router.post('/', authorize("STUDENT"), bookingController.createBooking);

// Matches: GET /api/bookings
router.get('/', authorize("STUDENT"), bookingController.getMyBookings);

export const BookingRoutes = router;