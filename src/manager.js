import { Reader, Writer } from 'nsqjs'
import axios from 'axios'
import mcache from 'memory-cache'

const MAX_TIMEOUT = 300
const MAX_ATTEMPTS = 3
const NSQ_HOST = 'nsqd'
const NSQ_PORT = 4150
const SEC_CACHE = 60

const requester = axios.create({
  baseURL: 'http://arqss17.ing.puc.cl:3000/',
  timeout: MAX_TIMEOUT
})

const writer = new Writer(NSQ_HOST, NSQ_PORT)
const reader = new Reader('request', 'ch_test', {
  nsqdTCPAddresses: `${NSQ_HOST}:${NSQ_PORT}`
})

writer.connect()
reader.connect()

reader.on(Reader.MESSAGE, msg => {
  const message = JSON.parse(msg.body.toString())
  if (msg.attempts > MAX_ATTEMPTS) {
    // TO-DO: Es posible cachear valores anteriores en caso
    // de superar el máximo de intentos.
    console.log(`[ERROR] Max attempts exceeded for ${message.id}`)
    msg.finish()
    writer.publish('response', {
      id: message.id,
      data: mcache.get(`${message.url}_old`)
    })
    return
  }

  console.log(`[REQUEST] /${message.url} from ${message.id}`)
  const cachedData = mcache.get(message.url)
  if (cachedData !== null) {
    msg.finish()
    writer.publish('response', {
      id: message.id,
      data: cachedData
    })
  } else {
    requester.get(message.url, {params: message.query})
      .then(response => {
        mcache.put(message.url, response.data, SEC_CACHE * 1000)
        mcache.put(`${message.url}_old`, response.data)
        writer.publish('response', {
          id: message.id,
          data: response.data
        })
        msg.finish()
      })
      .catch(err => {
        console.log(`[ERROR] ${err.message}`)
        msg.requeue()
      })
  }
})
