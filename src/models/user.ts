import {Schema, model, Document, Types} from "mongoose"

export interface iUser extends Document {
    name: string,
    email: string,
    passwordHash: string,
    dateCreated: Date,
    id: Types.ObjectId,
    entries: Types.ObjectId[]
}

const user = new Schema<iUser>({
    name: String,
    email: {
        type: String,
        unique: true,
        required: true
    },
    passwordHash: {
        type: String,
        unique: true,
        required: true
    },
    dateCreated: {
        type: Date,
        default: Date.now()
    },
    entries: [{
        type: Types.ObjectId,
        ref: "Entry"
    }]
}) 

user.set("toJSON", {
    transform(doc, returnedObj) {
        returnedObj.id = returnedObj._id.toString()
        delete returnedObj.passwordHash
        delete returnedObj._id
    }
})

export const User = model<iUser>("User", user)