module.exports.handleRequestError = (res) => {
  return (error) => {
    if (error.response) {
      console.log('Legacy API errored: ', error.response)
      res.sendStatus(error.response.status)
    } else if (error.request) {
      console.log('Legacy API didn\'t respond...')
      res.sendStatus(404)
    } else {
      console.log('Queue wasn\'t able to send request...')
      console.log(error)
      res.sendStatus(500)
    }
  }
}
