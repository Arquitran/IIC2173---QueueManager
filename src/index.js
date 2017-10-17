import express from 'express'
import bodyParser from 'body-parser'

const app = express()
const port = 3000

app.use(bodyParser)

app.get('/', (req, res) => {
  res.writeHead(200, {
    contentType: 'text/html'
  })
  res.write('<h1>Hello World!</h1>')
  res.end()
})

app.listen(port, () => {
  console.log(`Serving at http://localhost:${port}/`)
})
