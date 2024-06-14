import mongoose from 'mongoose'
import colors from 'colors'
import {exit} from 'node:process'

const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.DATABASE_URL!)

    console.log(colors.bgCyan(`Connection to database succeeded!`), `Host: ${connection.host} Port: ${connection.port}`)
  } catch (error) {
    console.log(colors.bgRed('Could not connect to the server, exiting the application...'))
    exit(1)
  }
}

export default connectDB