// https://github.com/jkbrzt/httpie

module.exports = function (express, app, router, config, Trip) {
  const skyscanner = require('skyscannerjs')
  const api = new skyscanner.API('prtl6749387986743898559646983194')

  router.get('/', (req, res, next) => {
    res.json({'APIV1': 'true'})
  })

  router.get('/locationAutosuggest/:location', (req, res, next) => {
    // GET - locationAutosuggest with this.props.country// or store in database when trip is created
    // RETURNS - [{},{},{}] arr[0] is clostest match to req.body.location
    api.locationAutosuggest({market: 'US', currency: 'USD', locale: 'en-US', query: req.params.location}).then((response) => {
      const places = response.data.Places
      console.log(places)
      res.json(places)
    }).catch((err) => {
      console.log(err)
      res.json({'err': err.status})
    })
  })

  router.post('/livePrices/poll', (req, res, next) => {
    // flow of getting ticket prices for user
    // 1. GET - locationAutosuggest with this.props.country// or store in database when trip is created
    // RETURNS - [{},{},{}] arr[0] is clostest match to req.body.location

    // 2. GET - livePrices with polled session returns [{},{},{}]

    // 3. Render JSON into trips Component but in -price order as table w/
    // | cost | provider | date | link |
    // ---------------------------------
    // |      |          |      |      |
    // ---------------------------------
    // |      |          |      |      |
    // ---------------------------------
    // |      |          |      |      |
    // ---------------------------------
    // 4. handle if user purchases etc...
    // rejoyce
    // repeat for hotels
    // fix more stuff
    if (req.isAuthenticated() || req.body._id === '') {
      console.log(req.body)

      api.flights.livePrices.session({
        country: 'UK',
        currency: 'GBP',
        locale: 'en-GB',
        locationSchema: 'Iata',
        originplace: req.body.originplace,
        destinationplace: req.body.destinationplace,
        outbounddate: req.body.outbounddate,
        adults: parseInt(req.body.adults) || 1
      }).then((response) => {
        const location = response.headers.location
        console.log(`POLL SESSION CREATED ${location}`)
        // POLL THE FLIGHT SESSION
        api.flights.livePrices.poll(location).then((response) => {
          const itineraries = response.data.Itineraries
          const legs = response.data.legs

          // console.log({'itineraries': itineraries})
          Trip.findById({'_id': req.body._id}).then((doc, err) => {
            if (doc) {
              // pop off last polling session
              doc.flights.shift()

              // get data necessary to send to user
              // add new data to fArr
              doc.flights.push(itineraries)
              doc.save((err, doc) => {
                console.log(`Saved trip ${doc}`)
              })
            } else {
              console.log({'No document error': err})
            }
          }).catch((err) => {
            console.log(err)
          })

          res.json({
            'itineraries': itineraries
          })

        }).catch((err) => {
          if (err.status === 304 && err.statusText === 'Not Modified') {
            console.log('GET FLIGHTS FROM DB')
            Trip.findById({'_id': req.body._id}).then((doc, err) => {
              res.json({
                'itineraries': doc.flights
              })
            }).catch((err) => {
              console.log(err)
            })
          } else {
            console.log(err)
            res.json({'err': err.status})
          }
        })
      }).catch((err) => {
        res.json({'err': err.status})
      })
    } else {
      res.json({})
      next()
    }
  }) // router

  app.use('/api/v1/flights', router)
}
