import { Types } from "mongoose"

interface IUser {
    id: Types.ObjectId,
    email: string,
    role: "user" 
}

export default IUser