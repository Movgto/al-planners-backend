import mongoose, { Document, Schema, Types } from "mongoose"

export const eventColors: { [key: number]: string } = {
  1: '#7986CB',
  2: '#33B679',
  3: '#8E24AA',
  4: '#E67C73',
  5: '#F6BF26',
  6: '#F4511E',
  7: '#039BE5',
  8: '#616161',
  9: '#3F51B5',
  10: '#0B8043',
  11: '#D50000'
}

const randomColor = () => {
  const randomColorIndex = Math.ceil(Math.random() * 11)

  return randomColorIndex.toString()
}

interface IAdminPreferences extends Document {
  admin: Types.ObjectId
  eventColorId: string
}

const adminPreferencesSchema: Schema = new Schema({
  admin: {
    type: Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  eventColorId: {
    type: String,
    default: randomColor()
  }
})

const AdminPreferences = mongoose.model<IAdminPreferences>('AdminPreferences', adminPreferencesSchema)

export default AdminPreferences