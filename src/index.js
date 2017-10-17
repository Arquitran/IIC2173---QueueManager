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

app.get('/favicon.ico', (req, res) => {
  res.sendStatus(204)
})

router.get('/:endpoint', (req, res) => {
  res.writeHead(200, {
    contentType: 'text/json'
  })

  const id = Math.floor(Math.random() * 1000000)

  producer.publish('request', {
    id,
    url: req.params.endpoint,
    query: {
      page: req.query.page
    },
    point: req.params.endpoint
  })

  console.log(id)

  consumer.on('message', msg => {
    let message = JSON.parse(msg.body.toString())
    console.log(message.id)
    if (message.id != id) return
    msg.finish()

    if (message.data === null) {
      res.end(JSON.stringify({
        message: 'FAIL'
      }))
      return
    }

    res.end(JSON.stringify({
      data: message.data
    }))
  })
})

app.use('/', router)

app.listen(PORT, () => {
  console.log(`Serving at http://${HOST}:${PORT}/`)
})
