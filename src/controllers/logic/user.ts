import { iUser, User } from "../../models/user";
import IUser from "../../types/user";
import { Types } from "mongoose";

export interface IUpdateUser {
    id: Types.ObjectId,
    data: Object
}

export interface ICreateUser {
    email: string,
    passwordHash: string
}

export const createUser = async (data: ICreateUser): Promise<iUser> => {
    try {
        const newUser: iUser = new User({
            email: data.email,
            passwordHash: data.passwordHash
        })

        await newUser.save()
        return newUser
    } catch (error) {
        throw new Error(error)
    }
}

export const readUser = async (id: Types.ObjectId): Promise<iUser> => {
    try {
        const user: iUser = await User.findById(id)
        return user
    } catch (error) {
        throw new Error(error)
    }
}

export const updateUser = async (data: IUpdateUser): Promise<iUser> => {
    try {
        const user: iUser = await User.findByIdAndUpdate(data.id, data.data)
        const updatedUser: iUser = await User.findById(data.data)
        return updatedUser
    } catch (error) {
        throw new Error(error)
    }
}

export const deleteUser = async (id: Types.ObjectId) => {
    try {
        await User.findByIdAndDelete(id)
    } catch (error) {
        throw new Error(error)
    }
}