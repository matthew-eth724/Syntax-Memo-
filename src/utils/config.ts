import dotenv from "dotenv"
dotenv.config()

const URI: any = process.env.URI
const Secret: any = process.env.Secret
const PORT: any = process.env.PORT

export default {URI, Secret, PORT}