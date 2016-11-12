module.exports = (express, app, router, mongoose, TripModel, Trip, User) => {
  // GET ALL
  router.get('/trips/all', (req, res, next) => {
    // HTTP GET localhost:8080/api/v1/trip/all
    const promise = Trip.find({}).sort('-created').exec().then((doc) => {
      res.json(doc)
    }).catch((err) => {
      res.json(err)
    })
  })

  router.get('/trips/all/:_creator', (req, res, next) => {
    // HTTP GET localhost:8080/api/v1/trip/all/1271008379610267
    const promise = Trip.find({'_creator': req.params._creator}).sort('-created').exec().then((trips) => {
      res.json(trips)
    }).catch((err) => {
      res.json(err)
    })
  })

  // GET TRIP BY ID
  router.get('/trips/:_id', (req, res, next) => {
    if (req.params._id) {
      let promise = Trip.findOne({'_id': req.params._id}).exec()

      promise.then((trip) => {
        res.json(trip)
      })
    } else {
      res.json({'404': 'Trip not found'})
    }
  }).delete('/trips/:_id', (req, res, next) => {
    // takes an id finds and removes by it and responses with the object removed
    // HTTP delete localhost:8080/trips/delete/58263fd3d0d9ec8aaee1abe0
    Trip.findOneAndRemove({
      '_id': req.params._id
    }, function(err, obj) {
      if (obj !== null && obj !== undefined) {
        res.json({'Trip removed': obj})
      } else {
        res.json({'404': 'resource not found'})
      }
    })
  }).put('/trips/:_id', (req, res, next) => {

    Trip.findById({'_id': req.params._id}).then((doc, err) => {
      console.log(`This is the doc ${doc}`)
      if (doc) {

        doc.meta.saved += req.params.amount

        doc.save((err) => {
          if (err) {
            res.json({'Save error': err})
          } else {
            res.json({'Updated': doc})
          }
        })
      } else {
        res.json({'No document error': err})
      }
    }).catch((err) => {
      res.json({'Find error': err})
    })
  })

  // Reset database
  router.get('/resetDB/1', (req, res, next) => {
    Trip.remove({}, function (err) {
      res.json([{}])
    })
  })

  app.use('/api/v1', router)
}
