var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose') ;

var dbURI = "mongodb://localhost:27017/test" ; 

mongoose.connect(dbURI, function(err) {
    if (err) throw err;
    console.log('Successfully connected to MongoDB');
});

var Schema = mongoose.Schema ;

var UserSchema = new Schema({
    email:  { type: String ,
              index: { unique: true },
              required: true
            },
    username: { type: String },
    full_name: { type: String }
})

var UserModel = mongoose.model('user', UserSchema );

var user = new UserModel() ;

var app = express() ;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var router = express.Router();

router.use(function(req, res, next) {
  // do logging
  d = new Date().toUTCString() ;
  console.log(d + ' - ' + req.method + ' ' + req.originalUrl);
  next(); // make sure we go to the next routes and don't stop here
});


router.get('/user/:username', function(req,res) {
        console.log(req.params.username) ;
         UserModel.find({ username: req.params.username })
                  .exec(function(err,users) {
    console.log('  Found - ' + users.length) ;
    if (users.length > 0) {
      res.json(users) ;
    } else {
      res.status(404) ;
    }
    res.end();
  }) ;
        
//        res.end() ;
       })

.get('/user', function(req,res) {
         UserModel.find()
                  .exec(function(err,users) {
    console.log('  Found - ' + users.length) ;
    if (users.length > 0) {
      res.json(users) ;
    } else {
      res.status(404) ;
    }
    res.end();
  }) ;

})

      .post('/user', function(req,res) {
        console.log(req) ;
        var user = new UserModel() ;
        user.email = req.body.email ;
        user.username = req.body.username;
        user.full_name = req.body.full_name ; 

        user.save(function (err, user) {
          if (err) {
            res.status(500) ;
            res.send(err) ;
            res.end() ;
          } else {
            res.status(201) ;
			res.setHeader('Location', req.headers.host + req.originalUrl + '/' + user.username) ;
            console.log(user.id) ;
            res.end() ;
          }
        });

//        res.end() ;
       })

      .delete('/user', function(req,res) {
        res.end() ;

       })

      .put('/user', function(req,res) {
        res.end() ;

       })
      .patch('/user', function(req,res) {
        res.end() ;
       }) ; 

app.use('/api', router) ;

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});

