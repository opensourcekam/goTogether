module.exports = function (passport, FacebookStrategy, config, mongoose) {

  var chatUser = new mongoose.Schema({
    profileID: String,
    fullName: String,
    profilePic: String
  })

  var UserModel = mongoose.model('chatUser', chatUser)
  passport.use(new FacebookStrategy({
    clientID: config.fb.appID,
    clientSecret: config.fb.appSecret,
    callbackURL: config.fb.callbackURL,
    profileFields: ['id', 'displayName', 'link', 'picture.type(large)', 'email']
  },
    function (accessToken, refreshToken, profile, cb) {
      console.log(`Access token ${accessToken} refreshToken ${refreshToken}`)
      console.log(profile)
        // I was overwriting the scope in line 20 by passing in profile again... good example of closures!
      UserModel.findOne({
        'profileID': profile.id
      }, function (err, user) {
        if (err) {
          console.log(err)
        }
        if (user) {
          return cb(null, user)
        } else {
          // if not create user and return profile
          var NewChatUser = new UserModel({
            profileID: profile.id,
            fullName: profile.displayName,
            profilePic: profile.photos[0].value || ''
          })

          NewChatUser.save(function (err) {
            (err) ? console.error(err) : cb(null, NewChatUser)
          })
        }
      })
      return cb(null, profile)
    }))

  // Configure Passport authenticated session persistence.
  //
  // In order to restore authentication state across HTTP requests, Passport needs
  // to serialize users into and deserialize users out of the session.  In a
  // production-quality application, this would typically be as simple as
  // supplying the user ID when serializing, and querying the user record by ID
  // from the database when deserializing.  However, due to the fact that this
  // example does not have a database, the complete Twitter profile is serialized
  // and deserialized.
  passport.serializeUser(function (user, cb) {
    // console.log(user)
    cb(null, user)
  })

  passport.deserializeUser(function (obj, cb) {
    cb(null, obj)
  })

  //, function(accessToken, refreshToken, profile, done) {
  //     //Check if user exists in DB
  //     UserModel.findOne({
  //       'profileID': profile.id
  //     }, function(err, user) {
  //       if (user) {
  //         return done(err, user);
  //       } else {
  //         // if not create user and return profile
  //         var NewChatUser = new UserModel({
  //           profileID: profile.id,
  //           fullName: profile.displayName,
  //           profilePic: profile.photos[0].value || ''
  //         });
  //
  //         NewChatUser.save(function(err) {
  //           done(null, NewChatUser);
  //         });
  //       }
  //     });
  //     // if user exist return profile
  //     // return done(null, profile);
  //   }));
  // }
}
