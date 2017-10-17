import { Reader, Writer } from 'nsqjs'
import axios from 'axios'

const requester = axios.create({
  baseURL: 'http://arqss17.ing.puc.cl:3000/'
})

const NSQ_HOST = 'nsqd'
const NSQ_PORT = 4150

const writer = new Writer(NSQ_HOST, NSQ_PORT)
const reader = new Reader('request', 'ch_test', {
  nsqdTCPAddresses: `${NSQ_HOST}:${NSQ_PORT}`
})

writer.connect()
reader.connect()

reader.on(Reader.MESSAGE, msg => {
  const message = JSON.parse(msg.body.toString())
  requester.get(message.url, {
    params: message.query
  })
    .then(response => {
      writer.publish('response', {
        id: message.id,
        data: response.data
      })
      msg.finish()
    })
    .catch()
})
