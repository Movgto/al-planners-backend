import { configDotenv } from 'dotenv'
import n from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

configDotenv()

console.log(process.env)

const config : () => SMTPTransport.Options = () => ({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})


const transport = n.createTransport(config())

export default transport