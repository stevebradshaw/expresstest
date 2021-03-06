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

  app.use(function(req,res,next) {
    req.sessionStatus = {'auth': true} ;
	next() ;
  }) ;

  var router = express.Router();

  router.get('/user/:username?', function(req,res) {
console.log(req.sessionStatus) ;
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

	if (req.params.username) {
	  var q = { username: req.params.username } ;

	  UserModel.remove(q, function (err, c) {
       if (err) throw err;

	   if (c == 0)
		   res.status(404) ;
	   else
		   res.status(204) ;
       res.end() ;
	  }) ;
	} else {
      res.status(400) ;
      res.end() ;
    }
  })

  .put('/user/:username', function(req,res) {
	if (req.params.username && JSON.stringify(req.body)!='{}') {
	  var q = { username: req.params.username } ;
      if (req.body.email && req.body.full_name) {
        UserModel.update(q,req.body,{ multi: true }, function (err,c) {
	      if (err) {
		 	res.status(500) ;
			res.send(err) ;
			res.end() ;
		  } else {
		    res.status(200) ;
		    res.end() ;
		  }
	    }) ;
	  } else {
		  res.status(400) ;
		  res.end() ;
	  }
	} else {
      res.status(400) ;
	  res.end() ;
	}
	res.end() ;
  })

  .patch('/user/:username', function(req,res) {
	if (req.params.username && JSON.stringify(req.body)!='{}') {
	  var q = { username: req.params.username } ;
      if (req.body.email || req.body.full_name) {
        UserModel.update(q,req.body,{ multi: true }, function (err,c) {
	      if (err) {
		 	res.status(500) ;
			res.send(err) ;
			res.end() ;
		  } else {
		    res.status(200) ;
		    res.end() ;
		  }
	    }) ;
	  } else {
	    res.status(400) ;
		res.end() ;
	  }
	} else {
      res.status(400) ;
	  res.end() ;
	}
  }) ; 

app.use('/api/user', function(req,res,next) {
	console.log('before the request - %s %s', req.method, req.url) ;
	next() ;
}) ;
  app.use('/api', router) ;

  var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
  });

});
