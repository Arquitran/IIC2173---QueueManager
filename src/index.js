import express from 'express'
import bodyParser from 'body-parser'
import webRouter from './routers/webRouter'
import mailRouter from './routers/mailRouter'
import cors from 'cors'

const app = express()

const HOST = 'localhost'
const PORT = 8080

app.use(bodyParser.json())
app.use(cors())

app.get('/favicon.ico', (req, res) => {
  res.sendStatus(204)
})

app.use('/web', webRouter)
app.use('/mail', mailRouter)

app.listen(PORT, () => {
  console.log(`Serving at http://${HOST}:${PORT}/`)
})
