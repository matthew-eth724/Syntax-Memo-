import mongoose from "mongoose";
import config from "../utils/config"

const connectDB = async () => {
    await mongoose.connect(config.URI).then(r => {
        console.log("DB Connected")
    }).catch(err => {
        const e = new Error(err)
        console.log(e.message)
    })
}

export default connectDB 