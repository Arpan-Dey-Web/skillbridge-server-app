import express, { Application, Request, Response } from "express"
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "../lib/auth";
import { CategoryRoutes } from "./modules/categorie/categorie.routes";
import { tutorRoutes } from "./modules/tutor/tutor.routes";
const app: Application = express()
const port = process.env.PORT || 8000;

app.use(cors({
    origin: process.env.APP_URL || "http://localhost:3000",
    credentials: true
}))

app.use(express.json())

// post categorie
app.use("/categorie", CategoryRoutes)

// update tutor data
app.use("/tutors", tutorRoutes)

// register user route 
app.all('/api/auth/*splat', toNodeHandler(auth));

app.get("/", (req: Request, res: Response) => {
    res.send(`SkillBridge App Running on PORT: ${port}`)
})
export default app