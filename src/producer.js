import { Writer } from 'nsqjs'

const writer = new Writer('127.0.0.1', 4150)

writer.connect()

writer.on('ready', () => {
  writer.publish('test', 'Hello World!!')
  writer.close()
})

writer.on('closed', () => {
  console.log('Closing writer')
})
