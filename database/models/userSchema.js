module.exports = function (mongoose) {
  const Schema = mongoose.Schema
  return new mongoose.Schema({
    profileID: String,
    fullName: String,
    profilePic: String,
    trips: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Trips'
      }
    ],
    country: String,
    currency: String,
    locale: String,
    market: String
  })
}
