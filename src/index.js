const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { getPages, getResource } = require('./request-pages')
const { handleRequestError } = require('./helpers')

const app = express()

const HOST = process.env.HOST || 'localhost'
const PORT = process.env.PORT || 8080

app.use(bodyParser.json())
app.use(cors())

app.get('/favicon.ico', (req, res) => {
  res.sendStatus(204) // No Content
})

app.get('/:resource/:id', (req, res) => {
  getResource(req.params.resource, req.params.id)
    .then(response => {
      res.write(JSON.stringify(response))
      res.end()
    })
    .catch(handleRequestError(res))
})

app.get('/:resources', (req, res) => {
  getPages(`${req.params.resources}`)
    .then(resources => {
      res.write(JSON.stringify(resources))
      res.end()
    })
    .catch(handleRequestError(res))
})

app.listen(PORT, () => {
  console.log(`Serving at http://${HOST}:${PORT}/`)
})
