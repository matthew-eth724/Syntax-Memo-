import {model, Schema, Document, Types} from "mongoose"

export interface IEntry extends Document {
    id: Types.ObjectId,
    date: Date,
    owner: Types.ObjectId,
    content: String
}

const entry = new Schema<IEntry>({
    date: {
        type: Date,
        default: Date.now()
    },
    owner: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    content: {
        type: String,
        required: true
    }
})

entry.set("toJSON", {
    transform(doc, returnedObj) {
        returnedObj.id = returnedObj._id.toString()
        delete returnedObj._id
    }
})

export const Entry = model<IEntry>("Entry", entry)