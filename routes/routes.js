module.exports = function(express, app, passport, config, rooms) {
  var router = express.Router()

  app.get('/', function(req, res) {

    if (req.user) {
      res.render('home', {
        user: req.user,
        config: config
      })
    } else {
      res.render('index', {
        user: "Travler"
      })
    }
  })

  function securePages(req, res, next) {
    if (req.isAuthenticated()) {
      next()
    } else {
      res.redirect('/')
    }
  }

  router.get('/auth/facebook', passport.authenticate('facebook'))
  router.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/#/home',
    failureRedirect: '/'
  }))

  router.get('/home', securePages, function(req, res, next) {
    res.render('index', {
      user: req.user,
      config: config
    })
  })

  router.get('/logout', securePages, function(req, res, next) {
    // console.log(req.user)
    req.logout()
    res.redirect('/')
  })

  app.use('/', router)
}
