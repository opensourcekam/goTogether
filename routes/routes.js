module.exports = function(express, app, passport, config, rooms) {
  var router = express.Router();

  app.get('/',
    function(req, res) {
      res.render('index', {
        user: req.user
      });
    });

  function securePages(req, res, next) {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.redirect('/')
    }
  }

  router.get('/auth/facebook', passport.authenticate('facebook'));
  router.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/chatrooms',
    failureRedirect: '/'
  }));

  /*
  {
  BREAKS production
  failureRedirect: '/',
  failureFlash : false
  }),
  function(req, res) {
  // Successful authentication, redirect home.
  res.redirect('/chatrooms');
  }
  */

  router.get('/chatrooms', securePages, function(req, res, next) {
    // console.log(config)
    res.render('chatrooms', {
      user: req.user,
      config: config
    });
  });


  router.get('/room/:id', function(req, res, next) {
    var room_name = findRoomName(req.params.id);
    res.render('room', {
      user: req.user,
      roomNum: req.params.id,
      roomName: room_name,
      config: config,
    });
  });

  function findRoomName(roomID) {
      var n = 0;
      while (n < rooms.length) {
        if(rooms[n].roomNum == roomID){
          return rooms[n].roomName;
          break;
        } else {
          n++;
          continue;
        }
      }
  }

  router.get('/logout', securePages, function(req, res, next) {
    //console.log(req.user)
    req.logout();
    res.redirect('/')
  });

  app.use('/', router);
}
