import app from "./server"
import colors from 'colors'
// import { onRequest } from 'firebase-functions/v2/https'

const port = process.env.PORT || 4000

// const api = onRequest(app)


app.listen(port, () => {
  console.log(colors.bgCyan(`Listening to port ${port}`))
})

// export { api }