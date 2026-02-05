import { Router } from "express";
import { reviewController } from "./review.controller";



const router = Router();

router.post("/", reviewController.createReview)


// | Method | Endpoint | Description |
// | ------ | -------------- | ------------- |
// | POST | `/api/reviews` | Create review |

// 🛠 Step 4: Feedback & Analytics
// 
// Now that sessions can be "Completed," you need to allow reviews.
// 
// POST / api / reviews: Use the logic we discussed to link the review to the BookingId.
// 
// GET / api / tutors /: id: Update this endpoint to include all the reviews for that specific tutor.
// 




export const ReviewRouter = router