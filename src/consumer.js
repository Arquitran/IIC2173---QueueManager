import { Reader } from 'nsqjs'

const NSQ_HOST = 'nsqd'
const NSQ_PORT = 4150

const reader = new Reader('response', 'ch_test', {
  nsqdTCPAddresses: `${NSQ_HOST}:${NSQ_PORT}`
})

reader.connect()

export default reader
