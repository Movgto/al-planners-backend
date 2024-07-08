import transport from "../config/nodemailer"
import { dateFormater, formatHour } from "../helpers"
import {HtmlForEventNotification} from '../helpers/Mailing'
import {render} from '@react-email/components'

type MailingParams = {
  name: string
  email: string
  date: Date
}

class Mailing {
  static sendAppointmentNotification = async (params : Pick<MailingParams, 'name'|'email'|'date'>) => {

    const hour = params.date.getHours()
    const dateString = dateFormater(params.date.toISOString())
    
    const html = render(
      <HtmlForEventNotification
        name={params.name}
        hour={formatHour(hour)}
        date={dateString}
      />
    )

    await transport.sendMail({
      from: 'AL PLANNERS <alplanners@gmail.com>',
      to: params.email,
      subject: 'AL PLANNERS Notificación de Cita',
      text: `Se ha programado una cita con nosotros para ${params.date}`,
      attachments: [{
        cid: 'alplannerslogo',
        filename: 'al_planners_logo.png',
        path: `${process.env.FRONTEND_URL}/al_planners_logo.png`
      }],
      html: html   
    })
  }
}

export default Mailing