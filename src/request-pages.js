const Axios = require('axios')

require('dotenv').config()

const APPLICATION_TOKEN = process.env.APPLICATION_TOKEN
const APPLICATION_URL = process.env.APPLICATION_URL
const APPLICATION_GROUP_ID = process.env.APPLICATION_GROUP_ID

const axios = Axios.create({
  baseURL: APPLICATION_URL,
  timeout: 5000
})

const getPage = resource => async page => {
  const { data } = await axios(`/${resource}`, {
    params: {
      page,
      'application_token': APPLICATION_TOKEN
    }
  })
  return data
}

module.exports.getPages = async resource => {
  const pages = []
  let page = 0
  let actualPage = await getPage(resource)(page)

  // eslint-disable-next-line no-constant-condition
  while (true) {
    pages.push(actualPage)
    actualPage = await getPage(resource)(page + 1)

    if (JSON.stringify(actualPage) === JSON.stringify(pages[page])) {
      break
    }
    page++
  }
  return pages.reduce((acc, item) => [
    ...acc,
    ...item[resource]
  ], [])
}

module.exports.getResource = async (resource, resourceID) => {
  const { data } = await axios(`/${resource}/${resourceID}`, {
    params: {
      'application_token': APPLICATION_TOKEN
    }
  })
  return data
}

module.exports.postResource = async (resource, body) => {
  const request = await axios(`/${resource}/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: {
      'application_token': APPLICATION_TOKEN,
      'id': APPLICATION_GROUP_ID,
      ...body
    }
  })
  return request
}
