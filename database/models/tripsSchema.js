module.exports = function (mongoose) {
  const Schema = mongoose.Schema
  return new Schema({
    _creator: {
      type: Number,
      ref: 'User'
    },
    to: {
      type: String,
      default: 'Heaven'
    },
    from: {
      type: String
    },
    tripDate: {
      type: Date,
      date: Date
    },
    tripEndDate: {
      type: Date,
      date: Date
    },
    budget: {
      type: Number,
      default: 100
    },
    meta: {
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
      invitees: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
      }]
    }
  }, {collection: 'Trips'})
}
