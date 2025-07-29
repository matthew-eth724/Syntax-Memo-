import { Router } from "express";
import { signUp } from "../../controllers/signup";

const app = Router()

app.post("/", signUp)

export default app 