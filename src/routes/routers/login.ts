import { Router } from "express";
import { logIn } from "../../controllers/login";

const app = Router()

app.post("/", logIn)

export default app 