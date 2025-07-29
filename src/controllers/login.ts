import { logInUser, registerUser } from "./logics/signin";
import { Request, Response, NextFunction } from "express";
import { userSignin, userLogin } from "./logics/signin";

export const logIn = async (req: Request, res: Response, next: NextFunction) => {
    console.log("POST /login")
    try {
        const {email, password} = req.body
        
        const userData: userSignin = {
            email: email,
            password: password
        }
        
        const user: userLogin = await logInUser(userData)
        res.json(user)
        next()
    } catch (error) {
        const E = new Error(error)
        if (E.message == "Error: Error: Email not assigned to an account") {
            try {
                const {email, password} = req.body
        
                const userData: userSignin = {
                    email: email,
                    password: password
                }

                await registerUser(userData)
                const response: userLogin = await logInUser(userData)
                res.status(201).json(response)
                next()
            } catch (error) {
                throw new Error(error)
            }
        }
        res.status(500).json({
            error: E.message
        })
        next()
    }
}