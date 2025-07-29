import { Request } from "express";
import IUser from "./user"
import { JwtPayload } from "jsonwebtoken";

interface Req extends Request {
    user: IUser | JwtPayload | any
}

export default Req 