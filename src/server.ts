import express from 'express'
import {configDotenv} from 'dotenv'
import connectDB from './config/db'
import cors from 'cors'
import corsConfig from './config/cors'
import morgan from 'morgan'
import googleapiRouter from './routes/googleapiRouter'

configDotenv()

connectDB()

const app = express()

app.use(cors(corsConfig))

app.use(morgan('dev'))

app.get('/', (req, res) => {
  res.send('Requests are working')
})

app.use('/api/googleapi', googleapiRouter)

export default app