var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    morgan = require('morgan') ;

var dbURI = "mongodb://localhost:27017/test" ; 

mongoose.connect(dbURI, function(err) {
  if (err) throw err;

  console.log('Successfully connected to MongoDB');

  var Schema = mongoose.Schema ;

  var UserSchema = new Schema({
    email: { type: String ,
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
  app.use(morgan('combined'))

  var router = express.Router();

  router.get('/user/:username?', function(req,res) {
	var q ;
	if (req.params.username)
	  q = { username: req.params.username } ;
	else
      q = {} ;	

    UserModel.find(q)
	         .select("username full_name email")
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
  })

  .delete('/user/:username', function(req,res) {
	var q ;
	if (req.params.username) {
	  q = { username: req.params.username } ;
console.log(q) ;
//      var user = new UserModel() ;
	  UserModel.remove(q, function (err, c) {
       if (err) throw err;

	   if (c == 0)
		   res.status(404) ;
	   else
		   res.status(204) ;
console.log('removed ' + q) ;
console.log(c) ;
	  }) ;
		res.end() ;
	} else {
console.log('must specify user to remove') ;
      res.status(400) ;
      res.end() ;
    }
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

});
