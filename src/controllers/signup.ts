import { registerUser, logInUser } from "./logics/signin";
import { Request, Response, NextFunction } from "express";
import { userSignin, userLogin } from "./logics/signin";

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
    console.log("POST /signup")
    try{
        if (!req.body) {
            res.status(400).json({
                error: "empty data"
            })
            next()
        }

        const {email, password} = req.body
        const userData: userSignin = {
            email: email,
            password: password
        }

        await registerUser(userData)
        const response: userLogin = await logInUser(userData)
        res.status(201).json(response)
        next()
    }
    catch(err) {
        const E = new Error(err)
        console.log(E.message);
        
        if (E.message == "Error: Error: Email already in use") {
            try {
                const userData: userSignin = {
                    email: req.body.email,
                    password: req.body.password
                }
                const data: userLogin = await logInUser(userData)
                res.json(data)
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