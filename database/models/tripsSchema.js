module.exports = function (mongoose) {
  const Schema = mongoose.Schema
  let TripSchema = new Schema({
    _creator: {
      type: Number,
      ref: 'User'
    },
    to: {
      location: {
        type: String,
        default: 'Heaven'
      },
      geometry: {
        lat: {
          type: Number,
          default: 0
        },
        lng: {
          type: Number,
          default: 0
        }
      },
      skyscanner: {
        PlaceId: String,
        PlaceName: String,
        CountryId: String,
        RegionId: String,
        CityId: String,
        CountryName: String
      }
    },
    from: {
      location: {
        type: String
      },
      skyscanner: {
        PlaceId: String,
        PlaceName: String,
        CountryId: String,
        RegionId: String,
        CityId: String,
        CountryName: String
      }
    },
    tripDate: {
      type: Date,
      date: Date
    },
    tripEndDate: {
      type: Date,
      date: Date
    },
    meta: {
      budget: {
        type: Number,
        default: 100
      },
      saved: {
        type: Number,
        default: 0
      },
      created: {
        type: Date,
        default: Date.now
      },
      updated: {
        type: Date,
        default: Date.now
      },
      past: {
        type: Boolean,
        default: false
      },
      votes: {
        type: Number,
        default: 0
      },
      favs: Array,
      unlocked: {
        type: Boolean,
        default: false
      },
      percantagePlanned: {
        type: Number,
        default: 0
      },
      planeBooked: {
        type: Boolean,
        default: false
      },
      trainBooked: {
        type: Boolean,
        default: false
      },
      busBooked: {
        type: Boolean,
        default: false
      },
      hotelBooked: {
        type: Boolean,
        default: false
      },
      hostelBooked: {
        type: Boolean,
        default: false
      },
      stayingWithFamilyOrFriend: {
        type: Boolean,
        default: false
      },
      activities: [
      ],
      invitees: [
        {
          type: Schema.Types.ObjectId,
          ref: 'user'
        }
      ]
    },
    flights: [{
      type: Schema.Types.Mixed
    }]
  }, {collection: 'Trips'})

  // TripSchema.pre('save', true, (next, done) => {
  // // calling next kicks off the next middleware in parallel
  // next()
  // })
  //
  // TripSchema.post('save', (doc) => {
  //   console.log('%s has been saved', doc._id)
  // })

  return TripSchema
}
