import express, { Application, Request, Response } from "express"
import cors from "cors";
const app: Application = express()
const port = process.env.PORT || 8000;

app.use(cors())
app.use(express.json())





app.get("/", (req: Request, res: Response) => {
    res.send(`SkillBridge App Running on PORT: ${port}`)
})
export default app