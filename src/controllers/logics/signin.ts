import { User, iUser } from "../../models/user"
import bcrypt from "bcrypt"
import {generateToken} from "../../middleware/auth"
import IUser from "../../types/user"

export interface userSignin {
    email: string
    password: string,
}

export interface userLogin {
    token: string,
    user: IUser
}
export const registerUser = async (data: userSignin) => {
    try {
        const passwordHash = await bcrypt.hash(data.password, 10)

        const existing = await User.findOne({email: data.email})
        if (existing) {
            throw new Error("Email already in use")
            return false
        }

        const newUser = new User({
            email: data.email,
            passwordHash: passwordHash
        })

        await newUser.save()
        console.log("user registered")
    } catch (error: any) {
        console.log("User registration failed", error.message)
        const x = new Error(error)
        console.log(x.message);
        throw new Error(error)
    }
}

export const logInUser = async (data: userSignin): Promise<userLogin> => {
    try {
        const user = await User.findOne({email: data.email})
        if (!user) {
            throw new Error("Email not assigned to an account")
        }

        const passwordDoesMatch: boolean = await bcrypt.compare(data.password, user.passwordHash)
        if (!passwordDoesMatch) {
            throw new Error("Incorrect Password")
        }

        const userData: IUser = {
            id: user.id,
            email: user.email,
            role: "user"
        }

        const token = generateToken(userData)
        const response: userLogin = {
            token: token,
            user:userData
        }
        return response
    } catch (error) {
        throw new Error(error)
    }
}