import { Reader } from 'nsqjs'

const reader = new Reader('test', 'ch_test', {
  nsqdTCPAddresses: 'localhost:4150'
})

reader.connect()

reader.on('message', msg => {
  console.log(msg.body.toString())
  msg.finish()
})
