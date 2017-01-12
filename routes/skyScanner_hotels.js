// https://github.com/jkbrzt/httpie
module.exports = function (app, router, config, Trip, moment) {
  const skyscanner = require('skyscannerjs')
  const api = new skyscanner.API('prtl6749387986743898559646983194')

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

  router.get('/room/session/:ids', (req, res, next) => {
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

  router.get('/rooms', (req, res, next) => {
    let {destination, checkIn, checkOut} = req.query
    // console.log(destination, checkIn, checkOut)

    api.hotels.autosuggest({
      market: 'UK', currency: 'GBP', locale: 'en-GB', query: destination.split(/[\s,]/ig)[0]
    }).then((response) => {
      // console.log(response)
      // console.log('autosuggest')
      const {results, places} = response.data
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
          console.log(obj.hotelIds.length != i + 1)
          console.log(obj.hotelIds.length, i)
          // Dont include comma at end of str
          str += (obj.hotelIds.length != i + 1)
            ? `${h},`
            : `${h}`
        })

        return api.hotels.livePrices.details.session(obj.session, {HotelIds: str}).then((session) => {
          console.log('foo', session)
          return session
        }).then((session) => {
          console.log('bar', session)
          console.log('appse', obj)
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

  app.use('/api/v1/hotels', router)
}
