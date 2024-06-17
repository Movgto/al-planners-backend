import mongoose, {Document, Schema} from 'mongoose'

interface IEventType extends Document {
    name: string
    duration: number
}

const eventTypeSchema : Schema = new Schema({
    name: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    }
})

const EventType = mongoose.model<IEventType>('EventType', eventTypeSchema)

export default EventType