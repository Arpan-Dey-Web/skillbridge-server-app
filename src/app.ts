import express, { Application, Request, Response } from "express"
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "../lib/auth";
const app: Application = express()
const port = process.env.PORT || 8000;

app.use(cors())
app.use(express.json())



// register user route 
app.all('/api/auth/*splat', toNodeHandler(auth)); 

app.get("/", (req: Request, res: Response) => {
    res.send(`SkillBridge App Running on PORT: ${port}`)
})
export default app