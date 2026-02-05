import express, { Application, Request, Response } from "express"
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "../lib/auth";
import { CategoryRoutes } from "./modules/categorie/categorie.routes";
import { TutorRoutes } from "./modules/tutor/tutor.routes";
import { ReviewRouter } from "./modules/review/review.routes";
import { BookingRoutes } from "./modules/booking/booking.routes";


const app: Application = express()
const port = process.env.PORT || 8000;

app.use(cors({
    origin: process.env.APP_URL || "http://localhost:3000",
    credentials: true
}))

app.use(express.json())

// register user route 
app.all('/api/auth/*splat', toNodeHandler(auth));


// post categorie
app.use("/api/categories", CategoryRoutes);

// update tutor data
app.use("/api/tutors", TutorRoutes);


// tutor review
app.use("/api/reviews", ReviewRouter)

// booking routes
app.use("/api/bookings", BookingRoutes);

app.get("/", (req: Request, res: Response) => {
    res.send(`SkillBridge App Running on PORT: ${port}`)
})
export default app