import express from 'express'
import consumer from '../consumer'
import producer from '../producer'

const router = express.Router()

router.all('/:endpoint', (req, res) => {
  res.writeHead(200, {
    contentType: 'text/json'
  })

  const id = Math.floor(Math.random() * 1000000)

  producer.publish('request', {
    id,
    url: req.params.endpoint,
    method: req.method,
    query: {
      page: req.query.page
    },
    point: req.params.endpoint
  })

  consumer.on('message', msg => {
    let message = JSON.parse(msg.body.toString())
    if (message.id != id) return
    msg.finish()

    if (message.data === null) {
      res.end(JSON.stringify({
        message: 'FAIL'
      }))
      return
    }

    res.end(JSON.stringify(message.data))
  })
})

export default router
