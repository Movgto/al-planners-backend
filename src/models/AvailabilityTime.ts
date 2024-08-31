import mongoose, { Document, Schema } from "mongoose"

export interface IAvailabilityTime extends Document {
  startTime: string
  endTime: string
}

const availabilityTimeSchema: Schema = new Schema({
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  }
})

const AvailabilityTime = mongoose.model<IAvailabilityTime>('AvailabilityTime', availabilityTimeSchema)

export default AvailabilityTime