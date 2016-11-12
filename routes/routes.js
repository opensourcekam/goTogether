module.exports = function (express, app, router, passport, config, User, Trip) {
  const Search = require('../placesData/searchPlaces/search')
  const mongoose = require('mongoose')

  app.get('/', (req, res, next) => {
    console.log(`

      Router get ${req.baseUrl}

      ${JSON.stringify(req.user, null, 10)}

      `)
    if (req.user) {
      res.render('index', {
        user: req.user,
        config: config
      })
    } else {
      res.render('index', {user: 'Travler'})
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
    successRedirect: '/#/myTrips',
    failureRedirect: '/'
  }))

  router.get('/home', securePages, (req, res, next) => {
    console.log(res.user[0].id)
    res.render('index', {
      user: req.user,
      config: config
    })
  })

  router.get('/usersTest', (req, res, next) => {
    // UserModel.find({}).populate('_creator').exec((err, doc)=> {
    //   res.setHeader('Content-Type', 'application/json')
    //   res.json(doc)
    // })

    const promise = User.find({}).populate('trips').exec()
    promise.then((doc) => {
      res.json(doc)
    })

    promise.catch((err) => {
      console.log('Does exist')
      res.json(err)
    })
  })

  router.get('/userById/:profileId', (req, res, next) => {
    console.log(`{'profileID': ${req.params.profileId}}`)

    const promise = User.findOne({'profileID': req.params.profileId}).populate('trips').exec()

    promise.then((doc) => {
      res.json(doc)
    })

    promise.catch((err) => {
      console.log('Does exist')
      res.json(err)
    })
  })

  router.get('/user/trips/:profileId', (req, res, next) => {
    console.log(`{'profileID': ${req.user}}`)

    const promise = User.findOne({'profileID': req.params.profileId}).populate('trips').exec()

    promise.then((doc) => {
      res.json(doc.trips)
    })

    promise.catch((err) => {
      console.log('Does exist')
      res.json(err)
    })
  })

  router.post('/newTrip', (req, res, next) => {
    // HTTP POST localhost:8080/newTrip _creator=1271008379610267 to='Kawasaki Ward, Japan' tripDate='Dec 29, 2017' budget=5000
    if (req.method.toLowerCase() === 'post' && req.user.id) {
      console.log(`MAKING A NEW TRIPPPPPP ${JSON.stringify(req.user, null, 10)}`)

      User.find({'profileID': req.user.id}).then((user) => {
        console.log(`${req.user.id} Does exist`)
        req.body._creator = req.user.id

        Trip.create(req.body, (err, doc) => {
          if (err) {
            return next({'409': 'Document create fail'})
          } else {
            user[0].trips.push(doc)
            user[0].save((err, doc) => {
              console.log(`Saved trip ${doc}`)
            })
            res.json(doc)
          }
        })
      }).catch(err => {
        res.send(err)
      })
    }
  })

  router.get('/logout', securePages, (req, res, next) => {
    // console.log(req.user)
    req.logout()
    res.redirect('/')
  })

  router.get('/searchPlace', (req, res, next) => {
    const obscurePlaces = require('../public/places/atlasObscurePlaces.json')
    const response = Search.getPlacesByLocation({json: obscurePlaces, selectAll: 'name', where: req.query.location}).value

    res.json(response)
  })

  app.use('/', router)
}
