module.exports = function(express, app, passport, config, user, UserModel) {
  const router = express.Router()
  const Search = require('../Search/search.js')
  const mongoose = require('mongoose')

  app.get('/', (req, res, next) => {

    //  console.log(JSON.stringify(req, null, ' '))
    if (req.user) {
      res.render('home', {
        user: req.user,
        config: config
      })
    } else {
      res.render('index', {user: "Travler"})
    }
  })

  var securePages = (req, res, next) => {
    if (req.isAuthenticated()) {
      next()
    } else {
      res.redirect('/')
    }
  }

  router.get('/auth/facebook', passport.authenticate('facebook'))
  router.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/#/tripIdeas',
    failureRedirect: '/'
  }))

  router.get('/home', securePages, (req, res, next) => {
    res.render('index', {
      user: req.user,
      config: config
    })
  })

  router.get('/usersTest', (req, res, next) => {
    UserModel.find({},(err, doc) => {
      res.setHeader('Content-Type', 'application/json')
      res.json(doc)
    })
  })

  router.post('/newTrip', (req, res, next) => {
    if (req.method.toLowerCase() === 'post') {
      const location = req.body.location
      // const route = `/#/newTrip`
      res.send({location: location})
    }
  })

  router.get('/logout', securePages, (req, res, next) => {
    // console.log(req.user)
    req.logout()
    res.redirect('/')
  })

  router.get('/searchPlace', (req, res, next) => {
    const obscurePlaces = require('../public/places/atlasObscurePlaces.json')
    const response = Search.getPlacesByLocation({json: obscurePlaces, selectAll: 'name', where: req.query.loc}).value

    res.json(response)
  })

  // // skyScanner API
  // const api = '/api/v1'
  // const SkyScanner = require('../api/skyScanner/Sky')
  // const skyScan = new SkyScanner(config)
  // const params = {
  //   "market": "UK",
  //   "currency": "GBP",
  //   "locale": "en-GB",
  //   "originPlace": "200",
  //   "destinationPlace": "MRS-sky",
  //   "outboundPartialDate": "2016-10",
  //   "inboundPartialDate": "2016-11",
  //   "q": "Mars",
  //   callback: (json) => json
  // }
  //
  // router.get(`${api}/locales`, (req, res, next) => {
  //   skyScan.getLocals().then((response) => {
  //     res.json(response.data)
  //   }).catch((err) => {
  //     console.log(err)
  //     res.json({})
  //   })
  // })
  //
  // router.get(`${api}/testCheap`, (req, res, next) => {
  //
  //   skyScan.getCheapFlights(params).then((response) => {
  //     res.json(response.data)
  //   }).catch((err) => {
  //     console.log(err)
  //     res.json({})
  //   })
  // })
  //
  // router.get(`${api}/testAuto`, (req, res, next) => {
  //   skyScan.getLocationAutoSuggest(params).then((response) => {
  //     res.json(response.data)
  //   }).catch((err) => {
  //     console.log(err)
  //     res.json({})
  //   })
  // })
  //
  // // end skyScanner API

  app.use('/', router)
}
