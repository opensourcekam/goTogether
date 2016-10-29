// https://github.com/jkbrzt/httpie

module.exports = function(express, app, config) {
  const apiV1Router = express.Router()
  const apiV1Root = '/api/v1'
  const SkyScanner = require('../api/skyScanner/Sky')
  const skyScan = new SkyScanner(config)

  const params = {
    "market": "UK",
    "currency": "GBP",
    "locale": "en-GB",
    "originPlace": "200",
    "destinationPlace": "MRS-sky",
    "outboundPartialDate": "2016-10",
    "inboundPartialDate": "2016-11",
    "q": "Mars",
    callback: (json) => json
  }

  apiV1Router.get('/', (req, res, next) => {
      res.json({"APIV1": "true"})
  })

  apiV1Router.get(`/locales`, (req, res, next) => {
    skyScan.getLocals().then((response) => {
      res.json(response.data)
    }).catch((err) => {
      console.log(err)
      res.json({})
    })
  })

  apiV1Router.get(`/testCheap`, (req, res, next) => {
    skyScan.getCheapFlights(params).then((response) => {
      res.json(response.data)
    }).catch((err) => {
      console.log(err)
      res.json({})
    })
  })

  apiV1Router.get(`/testAuto`, (req, res, next) => {
    skyScan.getLocationAutoSuggest(params).then((response) => {
      res.json(response.data)
    }).catch((err) => {
      console.log(err)
      res.json({})
    })
  })

  app.use('/api/v1', apiV1Router)
}
