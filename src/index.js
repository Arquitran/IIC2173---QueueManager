const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const { getPages, getResource, postResource } = require('./request-pages')
const { handleRequestError } = require('./helpers')

const app = express()

const HOST = process.env.HOST || 'localhost'
const PORT = process.env.PORT || 8080

app.use(bodyParser.json())
app.use(cors())
app.use(morgan('dev'))

app.get('/favicon.ico', (req, res) => {
  res.sendStatus(204) // No Content
})

app.get('/:resource/:id', (req, res) => {
  getResource(req.params.resource, req.params.id)
    .then(response => {
      res.json(response)
    })
    .catch(handleRequestError(res))
})

app.get('/:resources', (req, res) => {
  getPages(`${req.params.resources}`)
    .then(resources => {
      res.json(resources)
    })
    .catch(handleRequestError(res))
})

app.post('/:resources', (req, res) => {
  postResource(req.params.resources, req.body)
    .then(apiRes => {
      res.setHeader('location', apiRes.headers.location)
      res.status(apiRes.status)
      res.json(apiRes.data)
    })
    .catch(handleRequestError(res))
})

app.listen(PORT, () => {
  console.log(`Serving at http://${HOST}:${PORT}/`)
})
