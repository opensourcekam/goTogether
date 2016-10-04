module.exports = function(express, app, passport, config) {
  const router = express.Router()
  const Search = require('../Search/search.js')

  app.get('/', (req, res) => {
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

  var securePages = (req, res, next) => {
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

  router.get('/home', securePages, (req, res, next) => {
    res.render('index', {
      user: req.user,
      config: config
    })
  })

  router.post('/newTrip',(req,res,next) => {
    if (req.method.toLowerCase() === 'post') {
        const location = req.body.location
        const route = `/#/newTrip`
        res.send({redirect: route, location: location})
    }
  })

  router.get('/logout', securePages, (req, res, next) => {
    // console.log(req.user)
    req.logout()
    res.redirect('/')
  })

  // Search interesting places API

  /**
  example use in front end with jQuery
  $.getJSON("/searchPlace", {
      loc: "New York",
      format: "jsonp"
    },
    function(data) {
      console.log(data)
    });
   */

  router.get('/searchPlace', (req, res, next) => {
    const obscurePlaces = require('../public/places/atlasObscurePlaces.json')
    const response = Search.getPlacesByLocation({
      json: obscurePlaces,
      selectAll: 'name',
      where: req.query.loc
    }).value

    res.json(response)

  })

  app.use('/', router)
}
