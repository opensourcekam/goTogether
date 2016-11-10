// https://github.com/jkbrzt/httpie

module.exports = function (express, app, router, config) {
  const SkyScanner = require('../api/skyScanner/Sky')
  const skyScan = new SkyScanner(config)

  const params = {
    'market': 'UK',
    'currency': 'GBP',
    'locale': 'en-GB',
    'originPlace': '200',
    'destinationPlace': 'MRS-sky',
    'outboundPartialDate': '2016-10',
    'inboundPartialDate': '2016-11',
    'q': 'Mars',
    callback: (json) => json
  }

  router.get('/', (req, res, next) => {
    console.log(req)
    res.json({'APIV1': 'true'})
  })

  router.get(`/locales`, (req, res, next) => {
    skyScan.getLocals().then((response) => {
      res.json(response.data)
    }).catch((err) => {
      console.log(err)
      res.json({})
    })
  })

  router.get(`/testCheap`, (req, res, next) => {
    skyScan.getCheapFlights(params).then((response) => {
      res.json(response.data)
    }).catch((err) => {
      console.log(err)
      res.json({})
    })
  })

  router.get(`/testAuto`, (req, res, next) => {
    skyScan.getLocationAutoSuggest(params).then((response) => {
      res.json(response.data)
    }).catch((err) => {
      console.log(err)
      res.json({})
    })
  })

  app.use('/api/v1', router)
}
