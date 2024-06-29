import mongoose, {Document, Schema, Types} from 'mongoose'

export interface IUser extends Document {
  name: string
  email: string
  password: string
  admin: boolean
  confirmed: boolean
}

const userSchema : Schema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  admin: {
    type: Boolean,
    default: false
  },
  confirmed: {
    type: Boolean,
    default: false
  }
})

const User = mongoose.model<IUser>('User', userSchema)

export default User