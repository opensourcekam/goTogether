// https://github.com/jkbrzt/httpie
module.exports = (app, hotelsRouter, flightsRouter, topRouter, config, Trip, User, moment) => {
  const skyscanner = require('skyscannerjs')
  const api = new skyscanner.API('prtl6749387986743898559646983194')

  // const getUserDetails = (req, res, next) => {
  //   const { id, displayName, profileUrl, photos }= req.user
  //   console.log(
  //     `
  //     User ${displayName} with the id of ${id} and the profile URL is ${profileUrl}
  //     Find the users photo here ${photos[0].value}
  //     `
  //   )
  //
  //   const promise = User.findOne({'profileID': id})
  //   req.userPromise = promise
  //
  //   next()
  //   // const promise = User.findOne({'profileID': req.params._id})
  // }

  /* TOP ROUTER */
  /* Currencies */
  topRouter.get('/currencies', (req, res, next) => {
    api.reference.currencies().then((response) => {
      const currencies = response.data.Currencies
      res.json(currencies)
    })
  })

  topRouter.get('/locales', (req, res, next) => {
    api.reference.locales().then((response) => {
      const locales = response.data.Locales
      res.json(locales)
    })
  })

  topRouter.get('/countries', (req, res, next) => {
    const { locale } = req.body
    // console.log(locale)
    api.reference.countries(locale).then((response) => {
      const countries = response.data.Countries
      res.json(countries)
    })
  })
  /* TOP ROUTER */

  /* HOTEL ROUTES */
  let getHotelRooms = (session) => {
    console.log('GHR', session)
    api.hotels.livePrices.poll(session).then((response) => {
      console.log(response)
      const hotels = response.data.hotels
      const status = response.data.status
      return ({hotels, status})
    }).catch((err) => {
      console.log(err)
      return err
    })
  }

  hotelsRouter.get('/room/session/:ids', (req, res, next) => {
    const {hotels} = req.params.ids

    api.hotels.livePrices.details.session(session, {HotelIds: hotels}).then((response) => {
      // URL to poll the session.
      const location = response.headers.location

      api.hotels.livePrices.details.poll(location, {HotelIds: hotels}).then((response) => {
        console.log(response)
      }).catch((err) => {
        console.log(err)
      })
    }).catch((err) => {
      console.log(err)
      next()
    })
  })

  hotelsRouter.get('/rooms', (req, res, next) => {
    let {destination, checkIn, checkOut} = req.query
    // console.log(destination, checkIn, checkOut)

    api.hotels.autosuggest({
      market: 'UK', currency: 'GBP', locale: 'en-GB', query: destination.split(/[\s,]/ig)[0]
    }).then((response) => {
      // console.log(response)
      // console.log('autosuggest')
      const { results, places } = response.data
      const entityId = results[0].individual_id // respond with place that closest matches query
      // console.log('entityId', entityId)

      api.hotels.livePrices.session({
        market: 'ES',
        currency: 'EUR',
        locale: 'es-ES',
        entityId: entityId,
        checkindate: checkIn,
        checkoutdate: checkOut,
        guests: 1,
        rooms: 1
      }).then((response) => {
        const location = response.headers.location
        // res.send(response.data)
        let hotelIds = response.data.hotels.map((h) => {
          return h.hotel_id
        })
        return {
          session: location.substring(location.lastIndexOf('/') + 1),
          hotelIds: hotelIds
        }
      }).then((obj) => {
        // console.log(obj)
        var str = ''

        obj.hotelIds.forEach((h, i) => {
          // Dont include comma at end of str
          str += (obj.hotelIds.length != i + 1)
            ? `${h},`
            : `${h}`
        })

        return api.hotels.livePrices.details.session(obj.session, {HotelIds: str}).then((session) => {
          // console.log('foo', session)
          return session
        }).then((session) => {
          // console.log('bar', session)
          // console.log('appse', obj)
          return api.hotels.livePrices.details.poll(obj.session, {HotelIds: str})
          .then((response) => {
            // console.log(response.data)
            res.json(response.data)
          })
        })
      }).catch((err) => {
        console.log(err)
        res.send(err)
      })
    }).catch((err) => {
      console.log(err)
      res.json({err})
    })
  })

  app.use('/api/v1/hotels', hotelsRouter)
    /* HOTEL ROUTES */

    /* FLIGHTS ROUTES */
  flightsRouter.get('/', (req, res, next) => {
    res.json({'APIV1': 'true'})
  })

  flightsRouter.get('/test', (req, res, next) => {
    console.log(req.query)
    res.json(req.query)
  })

  flightsRouter.get('/locationAutosuggest/:location', (req, res, next) => {
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

  flightsRouter.post('/livePrices/poll', (req, res, next) => {
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
      const { originplace, destinationplace, outbounddate, inbounddate, adults } = req.body
      api.flights.livePrices.session({
        country: 'ES',
        currency: 'EUR',
        locale: 'es-ES',
        locationSchema: 'Iata',
        originplace: originplace,
        destinationplace: destinationplace,
        outbounddate: outbounddate,
        inbounddate: inbounddate,
        adults: parseInt(adults)
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

        // console.log(Query) 
        // console.log({'// itineraries': Itineraries})
          // set Itineraries to sliced Itineraries
        let cheapest_10_itineraries = Itineraries.slice(0, 10)
        // console.log({'// data': response.data})
        //
        // Trip.findById({'_id': req.body._id}).then((doc, err) => {
        //   if (doc) {
        //       // pop off last polling session
        //     doc.flights.shift()
        //
        //       // get data necessary to send to user
        //       // add new data to fArr
        //     doc.flights.push(cheapest_10_itineraries)
        //     doc.save((err, doc) => {
        //       console.log(`// Saved trip ${doc}`)
        //     })
        //   } else {
        //     console.log({'// No document error': err})
        //   }
        // }).catch((err) => {
        //   console.log(err)
        // }) // db call 1

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

  app.use('/api/v1/flights', flightsRouter)
  /* FLIGHTS ROUTES */
}
