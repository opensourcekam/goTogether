// https://github.com/jkbrzt/httpie

module.exports = function (express, app, router, config, Trip) {
  const skyscanner = require('skyscannerjs')

  router.get('/rooms', (req, res, next) => {
    res.json({'rooms': [[], [], [], [], []]})
  })

  app.use('/api/v1/hotels', router)
}
