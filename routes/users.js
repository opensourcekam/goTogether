module.exports = (app, router, User) => {
  router.get('/user/:_id', (req, res, next) => {
    // HTTP GET localhost:8080/api/v1/trip/all
    const promise = User.findOne({'profileID': req.params._id});
    promise.then((doc) => {
      res.json(doc);
    }).catch((err) => {
      res.json(err);
    });
  }).put('/user/:profileID', (req, res, next) => {
    User.findOne({'profileID': req.params.profileID}).then((doc, err) => {
      console.log(req.body);
      let { type, value } = req.body.update;
      if (doc) {
        let update = `${type.toUpperCase()}`;

        switch (update) {
          case 'COUNTRY':
            doc.country = value;
            break;
          case 'CURRENCY':
            doc.currency = value;
            break;
          case 'LOCALE':
            doc.locale = value;
            break;
          default:
            return res.json({'err': 'NO PUT TYPE FOUND'});
        }
        // save updates
        doc.save((err) => {
          if (err) {
            res.json({'Save error': err});
          } else {
            res.json({'Updated': doc});
          }
        });
      } else {
        res.json({'Document error': err});
      }
    }).catch((err) => {
      res.json({'Find user error': err});
    });
  });

  app.use('/api/v1', router);
};
