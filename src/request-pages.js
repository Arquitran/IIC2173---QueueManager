const Axios = require('axios')

require('dotenv').config()

const APPLICATION_TOKEN = process.env.APPLICATION_TOKEN
const APPLICATION_URL = process.env.APPLICATION_URL
const axios = Axios.create({
  baseURL: APPLICATION_URL,
  params: {
    'application_token': APPLICATION_TOKEN
  }
})

const getPage = resource => async page => {
  const { data } = await axios(`/${resource}`, {
    params: {
      page
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
  const { data } = await axios(`/${resource}/${resourceID}`)
  return data
}
