module.exports = (express, app, mongoose, TripModel, Trip, UserModel) => {
  const tripsRouter = express.Router()
  // const TripModel = require('../auth/Database/tripsSchema')(mongoose)
  // const Trip = mongoose.model('Trips', TripModel)

  // req users for checking db for users

  // GET ALL
  tripsRouter.get('/trip/all/:_creator', (req, res, next) => {

    // uncomment to wipe development database
    // Need to write development.db.tests.js
    // Trip.remove({}, function(err) {
    //   res.json([{}])
    // })

    const promise = Trip.find({'_creator': req.params._creator}).sort('-created').populate('_creator').exec()
      promise.then((trips) => {
        res.json(trips)
      })
    })

  // CREATE NEW
  tripsRouter.post('/trip/newTrip', (req, res, next) => {
    //HTTP POST localhost:8080/trip/newTrip _creator=5815288f0a9eb70645b1901a to='Kawasaki Ward, Japan' tripDate='Dec 29, 2017' budget=5000

    const checkIfUserExistPromise = UserModel.find({'_id': req.body._creator})

      checkIfUserExistPromise.then((user) => {
        console.log('Does exist')
        console.log(user)
      })

      checkIfUserExistPromise.catch(err => {
        console.log('Does exist')
        console.log(err)
      })

      let source = req.body,
        createTripJSON = {}
      for (let key in source) {
        if (source.hasOwnProperty(key)) {
          createTripJSON[key] = source[key]
        }
      }

      // Mutate tripDate on the createTripJSON obj
      createTripJSON.tripDate = new Date(req.body.tripDate)
      Trip.create(createTripJSON, (err, doc) => {
        if (err) {
          res.json({'409': 'Document create fail'})
        } else {
          res.json(doc)
        }
      })

    }) // tripsRouter newTrip post

    // GET TRIP BY ID
    tripsRouter.get('/trip/trips/:_id', (req, res, next) => {
      if (req.params._id) {
        let promise = Trip.findOne({'_id': req.params._id}).populate('_creator').exec()

        promise.then((trip) => {
          res.json(trip)
        })
      } else {
        res.json({'404': 'Trip not found'})
      }
    }) // get by id

    // Delete trip by ID
    tripsRouter.delete('/trip/delete/:_id', (req, res, next) => {
      // takes an id finds and removes by it and responses with the object removed
      Trip.findOneAndRemove({
        '_id': req.params._id
      }, function(err, obj) {
        if (obj !== null && obj !== undefined) {
          res.json({'Trip removed': obj})
        } else {
          res.json({'404': 'resource not found'})
        }
      })
    })

    // Reset database
    // tripsRouter.get('/resetDB/1', (req, res, next) => {
    //   Trip.remove({}, function(err) {
    //     res.json([{}])
    //   })
    // })

    app.use('/', tripsRouter)
  }
