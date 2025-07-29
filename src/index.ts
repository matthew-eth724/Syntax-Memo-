import express from "express"
import config from "./utils/config"
import connectDB from "./db/connect"
import router from "./routes/index"
import cors from "cors"

const PORT = config.PORT || 3000
const app = express()
connectDB()

app.use(cors())
app.use(express.json())
app.use("/api", router)


app.listen(PORT, () => console.log(`Server up and running on ${PORT} 💪`))