import { Html, Container, Body, Tailwind, Heading, Text, Img } from '@react-email/components'

type MailingProps = {
  name: string
  date: string
  hour: string
}

export const HtmlForEventNotification = (props: Pick<MailingProps, 'name' | 'hour' | 'date'>) => {
  return (
    <Html>
      <Tailwind>
        <Body className="bg-pink-300 flex flex-col items-center px-5 py-10">
          <Container
            className="flex flex-col gap-4 bg-white rounded-lg p-4"
          >
            <Heading
              className="text-black font-semibold text-xl text-center"
            >
              Gracias por agendar tu{' '}
              <span className='font-bold text-pink-400'>cita</span>{' '}
              con nosotros!{' '}
              <span className='font-bold text-pink-400'>{props.name}</span>
            </Heading>
            <Img
              src="cid:alplannerslogo"
              alt="al planners logo"              
              className="w-full"              
            />
            <Text
              className='text-center text-lg'
            >
              Te estaremos esperando el{' '}
              <span className='font-bold text-rose-400'>{props.date}</span> a las <strong>{props.hour}</strong>!
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}