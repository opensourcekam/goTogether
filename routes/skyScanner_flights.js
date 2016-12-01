// https://github.com/jkbrzt/httpie
module.exports = (express, app, router, config, Trip) => {
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
      /* Getting weird bugs when polling session 1st time need to restructure
        option 1. Create poll session with livePrices/create/session then store session in DB. If call livePrices/c/session 304, use that poll session to call livePrices/poll otherwise call livePrices/poll with the db session

        option 2. Abstract api.flights.livePrices.poll out of first promise into its own function then call that inside of
      */

      // Set country, currency, and locale from USER object
      api.flights.livePrices.session({
        country: 'ES',
        currency: 'EUR',
        locale: 'es-ES',
        locationSchema: 'Iata',
        originplace: req.body.originplace,
        destinationplace: req.body.destinationplace,
        outbounddate: req.body.outbounddate,
        inbounddate: req.body.inbounddate,
        adults: parseInt(req.body.adults)
      }).then((response) => {
        const location = response.headers.location

        console.log(`// POLL SESSION CREATED ${location}`)
        console.log('// POLL THE FLIGHT SESSION')

        pollSession(location)
      }).catch((err) => {
        console.log(err)
        res.json({'err': err.status})
      })
    } else {
      res.json({})
      next()
    }

    let pollSession = (location) => {
      let livePricesPromise = api.flights.livePrices.poll(location)

      livePricesPromise.then((response) => {
        const {Itineraries, Legs, Query} = response.data

        console.log(Query)
        console.log({'// itineraries': Itineraries})
        // set Itineraries to sliced Itineraries
        let cheapest_10_itineraries = Itineraries.slice(0, 10)
        console.log({'// data': response.data})

        Trip.findById({'_id': req.body._id}).then((doc, err) => {
          if (doc) {
            // pop off last polling session
            doc.flights.shift()

            // get data necessary to send to user
            // add new data to fArr
            doc.flights.push(cheapest_10_itineraries)
            doc.save((err, doc) => {
              console.log(`// Saved trip ${doc}`)
            })
          } else {
            console.log({'// No document error': err})
          }
        }).catch((err) => {
          console.log(err)
        }) // db call 1

        // respond with json
        res.json({'itineraries': cheapest_10_itineraries})
      })

      livePricesPromise.catch((err) => {
        // If an err is caught it will contain the url for the polling location still

        if (err.status === 304 && err.statusText === 'Not Modified') {
          console.log('GET FLIGHTS FROM DB')
          let pricesErrObj = err
          Trip.findById({'_id': req.body._id}).then((doc, err) => {
            console.log('If this is the first time nothing exist...')

            if (doc.flights.length > 0 && doc.flights[0].length !== 0) {
              console.log('// doc has flights')
              res.json({'itineraries': doc.flights})
            } else {
              console.log('// doc doesnt have flights recurse on pollSession()')
              pollSession(pricesErrObj.config.url)
            }
          }).catch((err) => {
            console.log(err)
          }) // db call 2
        } else {
          console.log(err)
          res.json({'err': err.status})
        }
      }) // session poll catch
    } // end pollSession function
  }) // router

  app.use('/api/v1/flights', router)
}
