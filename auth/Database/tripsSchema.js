module.exports = function(mongoose) {
  const Schema = mongoose.Schema
  return new Schema({
    _creator: {
      type: Schema.Types.ObjectId,
      ref: 'user'
    },
    to: String,
    // from: {type: String, default: },
    created: {
      type: Date,
      default: Date.now
    },
    updated: {
      type: Date,
      default: Date.now
    },
    tripDate: {
      type: Date,
      date: Date
    },
    past: Boolean,
    budget: Number,
    meta: {
      votes: Number,
      favs: Number
    }
    // invitees: {}
  }, {collection: 'Trips'})

  // const Trip = mongoose.model('trip', TripModel)
  //
  // // remove all trips
  // Trip.remove({}, function(err) {
  //   console.log('collection removed')
  // })
  //
  // // test creating new trip
  // Trip.create({
  //   '_creator': '5817256e3309cb0d41f25310',
  //   'to': 'Cassis, France',
  //   'tripDate': new Date(Date.parse("January 21, 2017")).toString(),
  //   'budget': '1500',
  //   'past': false,
  //   'meta': {
  //     'favs': 10
  //   }
  // }, (err, doc) => {
  //   if (err) {
  //     console.log(err)
  //   } else {
  //     console.log(`New trip created ${doc}`)
  //   }
  // })
  //
  // // Populating is similar to joining a table in SQL it will pop on the model at type: Schema.Types.ObjectId,
  // const promise = Trip.find({}).populate('_creator').exec()
  // promise.then((trips) => {
  //   console.log(`All trips include ${trips}`)
  // })

}
