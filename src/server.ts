import express from 'express'
import {configDotenv} from 'dotenv'
import connectDB from './config/db'
import cors from 'cors'
import corsConfig from './config/cors'
import morgan from 'morgan'
import googleapiRouter from './routes/googleapiRouter'
import eventsRouter from './routes/eventsRouter'
import eventTypesRouter from './routes/eventTypesRouter'
import availabilityRouter from './routes/availabilityRoutes'

configDotenv()

connectDB()

const app = express()

app.use(express.json())

app.use(cors(corsConfig))

app.use(morgan('dev'))

app.get('/', (req, res) => {
  res.send('Requests are working')
})

app.use('/api/googleapi', googleapiRouter)
app.use('/api/events', eventsRouter)
app.use('/api/eventTypes', eventTypesRouter)
app.use('/api/availability', availabilityRouter)

export default app