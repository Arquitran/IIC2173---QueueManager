import { Reader, Writer } from 'nsqjs'
import axios from 'axios'
import mcache from 'memory-cache'

const MAX_TIMEOUT = 100
const MAX_ATTEMPTS = 3
const NSQ_HOST = 'nsqd'
const NSQ_PORT = 4150
const SEC_CACHE = 10
const APPLICATION_TOKEN = "6d876925-a71d-4379-93aa-6144138dc8fc";

const requester = axios.create({
  baseURL: 'http://arqss16.ing.puc.cl/',
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
    console.log(`[ERROR] Max attempts exceeded for ${message.id}`)
    msg.finish()
    writer.publish('response', {
      id: message.id,
      data: mcache.get(`${message.url}_old`)
    })
    return
  }

  const keyCache = message.url + (message.query.page !== undefined ? `_page_${message.query.page}` : `_page_1`)

  console.log(`[REQUEST] /${message.url} from ${message.id}`)
  const cachedData = mcache.get(keyCache)
  if (cachedData !== null) {
    msg.finish()
    writer.publish('response', {
      id: message.id,
      data: cachedData
    })
  } else {
    const method = message.method || "get";
    requester.request({
      method,
      url: message.url,
      params: {
        "application_token": APPLICATION_TOKEN,
        ...message.query
      }
    })
      .then(response => {
        mcache.put(keyCache, response.data, SEC_CACHE * 1000)
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
