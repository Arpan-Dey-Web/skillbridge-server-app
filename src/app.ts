import express, { Application, Request, Response } from "express"
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "../lib/auth";
import { CategoryRoutes } from "./modules/categorie/categorie.routes";
import { TutorRoutes } from "./modules/tutor/tutor.routes";
import { ReviewRouter } from "./modules/review/review.routes";
import { BookingRoutes } from "./modules/booking/booking.routes";
import { tutorsRoutes } from "./modules/tutors/tutors.routes";
import { AdminRoutes } from "./modules/admin/admin.routes";
import { UserRoutes } from "./modules/users/users.routes";
const app: Application = express()
const port = process.env.PORT || 8000;

// Configure CORS to allow both production and Vercel preview deployments
const allowedOrigins = [
    process.env.APP_URL || "http://localhost:3000",
    process.env.PROD_APP_URL, // Production frontend URL
].filter(Boolean); 


app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (mobile apps, Postman, etc.)
            if (!origin) return callback(null, true);

            // Check if origin is in allowedOrigins or matches Vercel preview pattern
            const isAllowed =
                allowedOrigins.includes(origin) ||
                /^https:\/\/skillbridge-client-app.*\.vercel\.app$/.test(origin) ||
                /^https:\/\/.*\.vercel\.app$/.test(origin); // Any Vercel deployment

            if (isAllowed) {
                callback(null, true);
            } else {
                callback(new Error(`Origin ${origin} not allowed by CORS`));
            }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
        exposedHeaders: ["Set-Cookie"],
    }),
);


app.use(express.json())


// register user route 
app.all('/api/auth/*splat', toNodeHandler(auth));

// post categorie
app.use("/api/categories", CategoryRoutes);

// private tutor routes
app.use("/api/tutor", TutorRoutes);

// public tutors routes
app.use("/api/tutors", tutorsRoutes);

// tutor review
app.use("/api/reviews", ReviewRouter)

// booking routes
app.use("/api/bookings", BookingRoutes);

// admin routes
app.use("/api/admin", AdminRoutes);

// admin routes  GET all users
app.use("/api/users", UserRoutes);

app.get("/", (req: Request, res: Response) => {
    res.send(`Learnhub App Running on PORT: ${port}`)
})
export default app