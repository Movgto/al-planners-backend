import { configDotenv } from 'dotenv'
import {google} from 'googleapis'

configDotenv()

const {CLIENT_ID, CLIENT_SECRET, REDIRECT_URL} = process.env

console.log(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL)

export const auth2client = new google.auth.OAuth2(
  CLIENT_ID!,
  CLIENT_SECRET!,
  REDIRECT_URL!
)