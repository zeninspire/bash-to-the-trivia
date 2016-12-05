var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');
var morgan = require('morgan');
var db = require('./db-config.js');
var User = require('./app/user-model.js')


var app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client')));
app.use(morgan('dev'));


app.get('/api/usersdb', function(req, res) {
  User.find({}, function(err, users) {
  	console.log(users)
    var userObj = {};
    users.forEach(function(user) {
    	console.log('ID', user._id)
      userObj[user._id] = user;
    });
    res.send(userObj);
  });
});

// app.get('/api/profile/:user', function(req, res) {
// })

app.post('/api/signup', function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
  console.log("username: ", username);
	User.findOne({username: username}).exec(function(err, user) {
		if(user) {
			console.log('USER EXSITS')
			res.send('user exists');
		} else {
			var newUser = User({
				username: username,
				password: password
			})
			newUser.save(function(err, user) {
				if(err) {
					res.status(500).json(new Error('ERRRORRR'));
				} else {
					console.log('USER', user)
					// next()
					res.json(user);
				}
			})
		}
	})
})

app.post('/api/signin', function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	User.findOne({username: username}).exec(function(err, user) {
		if(err) {
			console.log("ERROR LOGIN", err)
			// next(err);
			return res.send('false');
		}
		if(!user) {
			// next(new Error('User does not exist'));
			console.log('NEWUSER')
			res.send('newUser')
		} else {
			user.auth(password, user.password).then(function(match) {
				if(match) {
					console.log('MATCH=TRUE')
					res.json(user);	
				} else {
					console.log('MATCH=TRUE')
					res.send('false');
				}
			})
		}
	})
})



app.listen(8080, function() {
  console.log('Listening to port 8080');
});




