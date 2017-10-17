import { Writer } from 'nsqjs'

const NSQ_HOST = 'nsqd'
const NSQ_PORT = 4150

const writer = new Writer(NSQ_HOST, NSQ_PORT)

writer.connect()

writer.on(Writer.CLOSED, () => {
  console.log('Closing writer')
})

export default writer
