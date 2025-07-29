import { Router } from "express";
import SignupRouter from "./routers/signup"
import LoginRouter from "./routers/login"

const app = Router()
app.use("/signup", SignupRouter)
app.use("/login", LoginRouter)

export default app