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
    attendees: {
        name: string
        email: string
    }[]
}

const rangeSchema : Schema = new Schema({
    dateTime: String
})

const attendeeSchema : Schema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
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
    },
    attendees: {
        type: [
            attendeeSchema
        ],
        required: true
    }
}, {timestamps: true})

const Event = mongoose.model<IEvent>('Event', eventSchema)

export default Event