import express from 'express'
import consumer from '../consumer'
import producer from '../producer'

const router = express.Router()

router.post('/', (req, res) => {
  res.writeHead(200, {
    contentType: 'text/json'
  })

  const id = Math.floor(Math.random() * 1000000)

  const endpoint = req.body.action === 'category' ? 'categorias' : 'productos'

  producer.publish('request', {
    id,
    query: {},
    url: endpoint
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

    res.end(JSON.stringify({
      data: message.data,
      user: req.body.user
    }))
  })
})

export default router
