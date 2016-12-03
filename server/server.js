var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');
var db = require('./db-config.js');
var User = require('./app/user-model.js')


var app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client')));

app.get('/usersdb', function(req, res) {
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


app.get('/signup', function(req, res) {
	res.end();
})

app.post('/signup', function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
  console.log("username: ", username);
	User.findOne({username: username}).exec(function(err, user) {
    console.log("user: ", user);
		if(user) {
			res.redirect('/login');
		} else {
			var newUser = User({
				username: username,
				password: password
			})
			newUser.save(function(err, user) {
				if(err) {
					res.status(500).end('ERRRORRR');
				} else {
					res.end(user);
				}
			})
		}
	})
})

app.post('/login', function(req, res) {
	var username = req.body.username;
	var password = req.body.password;

	User.findOne({username: username}).exec(function(err, user) {
		if(!user) {
			res.redirect('/login');
		}

		User.authenticate(password, user.password).then(function(match) {
			if(match) {
				res.redirect('/signup');
			} else {
				res.redirect('/profile');
			}
		})

	})
})


app.listen(8080, function() {
  console.log('Listening to port 8080');
});




