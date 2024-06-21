import mongoose, { Document, Schema } from "mongoose";

interface IEvent extends Document {
    summary: string,
    start: {
        dateTime: string
    }
    end: {
        dateTime: string        
    },
    sentToCalendar: boolean
}

const rangeSchema : Schema = new Schema({
    dateTime: String
})

export const eventSchema : Schema = new Schema({
    summary: {
        type: String,
        required: true
    },
    start: {        
        type: rangeSchema,
        required: true
    },
    end: {
        type: rangeSchema,
        required: true
    },
    sentToCalendar: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

const Event = mongoose.model<IEvent>('Event', eventSchema)

export default Event