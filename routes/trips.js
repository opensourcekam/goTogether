module.exports = (express, app, router, mongoose, TripModel, Trip, User, moment) => {
  // GET ALL
  // app.use((req, res, next) => {
  //   if(req.isAuthenticated()){
  //     next()
  //   } else {
  //     res.redirect('/')
  //   }
  // })
  //
  router.get('/trips/all', (req, res, next) => {
    // HTTP GET localhost:8080/api/v1/trip/all

    // console.log('Hey')
    const allTripsPromise = Trip.find({}).sort('-created').exec();

    allTripsPromise.then((doc) => {
      let docs = doc.map((t, i) => {
        // diff trip finish date and today, set in DB
        let datesDiff = moment(t.tripEndDate).diff(moment(), 'days');
        // compare finish date to today
        console.log(
          `There are ${datesDiff} days
          ${(datesDiff <= -1) ? 'since you went to ' : 'until you go to'}
          ${t.to.location}`
        );
        // if finish date has passed set trip.meta.past to true
        t.meta.past = Boolean(datesDiff <= -1);
        // save
        t.save((err) => {
          if (err) {
            console.log({'Save error': err});
          } else {
            console.log({'Updated': doc[i]['_id']});
          }
        });
        // return edited
        return t;
      });

      res.json(docs);
    });

    allTripsPromise.catch((err) => {
      res.json(err);
    });
  });

  router.get('/trips/all/:_creator', (req, res, next) => {
    // HTTP GET localhost:8080/api/v1/trips/all/1271008379610267
    const promise = Trip.find({'_creator': req.params._creator}).sort('-created').exec()
    .then((doc) => {
      let trips = doc.map((t, i) => {
        // diff trip finish date and today, set in DB
        let datesDiff = moment(t.tripEndDate).diff(moment(), 'days');
        // compare finish date to today
        console.log(
          `There are ${datesDiff} days
          ${(datesDiff <= -1) ? 'since you went to ' : 'until you go to'}
          ${t.to.location}`
        );
        // if finish date has passed set trip.meta.past to true
        t.meta.past = Boolean(datesDiff <= -1);
        // save
        t.save((err) => {
          if (err) {
            console.log({'Save error': err});
          } else {
            console.log({'Updated': doc[i]['_id']});
          }
        });
        // return edited
        return t;
      });

      res.json(trips);
    }).catch((err) => {
      res.json(err);
    });
  });

  // GET TRIP BY ID
  router.get('/trips/:_id', (req, res, next) => {
    if (req.params._id) {
      let promise = Trip.findOne({'_id': req.params._id}).exec();

      promise.then((doc) => {
        res.json(doc);
      });

      promise.catch((err) => {
        console.log('Does exist');
        res.json(err);
      });

      promise.then((trip) => {
        res.json(trip);
      });
    } else {
      res.json({'404': 'Trip not found'});
    }
  }).delete('/trips/:_id', (req, res, next) => {
    // takes an id finds and removes by it and responses with the object removed
    // HTTP delete localhost:8080/trips/delete/58263fd3d0d9ec8aaee1abe0
    Trip.findOneAndRemove({
      '_id': req.params._id
    }, function (err, obj) {
      if (obj !== null && obj !== undefined) {
        res.json({'Trip removed': obj});
      } else {
        res.json({'404': 'resource not found'});
      }
    });
  }).put('/trip/:_id', (req, res, next) => {
    console.log(req);
    Trip.findById({'_id': req.params._id}).then((doc, err) => {
      console.log(`PUT req on trip/:id ${doc}`);
      console.log(req.body);
      if (doc) {
        let update = `${req.body.update.toUpperCase()}`;

        switch (update) {
          case 'SAVED':
            doc.meta.saved = parseInt(req.body.amount) + parseInt(doc.meta.saved);
            break;
          case 'ACTIVITIES':
            doc.meta.activities.push({});
            break;
          case 'FROM':
            doc.from = req.body.from;
            break;
          case 'INVITEES':
            doc.meta.invitees.push({});
            break;
          default:
            return res.json({'err': 'NO PUT TYPE FOUND'});
        }

        doc.save((err) => {
          if (err) {
            res.json({'Save error': err});
          } else {
            res.json({'Updated': doc});
          }
        });
      } else {
        res.json({'No document error': err});
      }
    }).catch((err) => {
      res.json({'Find error': err});
    });
  });

  app.use('/api/v1', router);
};
