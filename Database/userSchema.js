module.exports = function(mongoose) {
    return new mongoose.Schema({
    profileID: String,
    fullName: String,
    profilePic: String
  })
}
