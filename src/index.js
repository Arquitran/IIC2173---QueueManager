/* eslint-disable no-console, no-undef */
import express from 'express'
import bodyParser from 'body-parser'
import consumer from './consumer'
import producer from './producer'

const app = express()
const router = express.Router()

const HOST = 'localhost'
const PORT = 8080

app.use(bodyParser.json())

router.get('/:endpoint', (req, res) => {
  res.writeHead(200, {
    contentType: 'text/json'
  })

  const id = Math.floor(Math.random() * 1000000)

  producer.publish('request', {
    id,
    url: req.params.endpoint,
    query: req.query,
    point: req.params.endpoint
  })

  consumer.on('message', msg => {
    let message = JSON.parse(msg.body.toString())

    if (message.id != id) return
    msg.finish()
    res.end(JSON.stringify({
      data: message.data
    }))
  })
})

app.use('/', router)

app.listen(PORT, () => {
  console.log(`Serving at http://${HOST}:${PORT}/`)
})
