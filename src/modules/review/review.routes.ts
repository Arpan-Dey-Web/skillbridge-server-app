import { Router } from "express";
import { reviewController } from "./review.controller";
import { authorize } from "../../middleware/authorize";



const router = Router();

router.post("/", authorize("STUDENT"), reviewController.createReview)

router.get("/", authorize("TUTOR"), reviewController.getMyReviews)



export const ReviewRouter = router