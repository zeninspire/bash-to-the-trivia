var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');
var morgan = require('morgan');
var db = require('./db-config.js');
var User = require('./app/user-model.js');

var app = express();

//Set up socket.io
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client')));
app.use(morgan('dev'));


//SOCKET.IO MANAGEMENT//

io.on('connection', function(socket) {
  console.log('connected');
  socket.on('signUp', function(data) {
    socket.broadcast.emit('newUserSignedUp');
    console.log('socket on data: ', data.username);
  });
});



///////////////////////


app.get('/api/usersdb', function(req, res) {
  User.find({}, function(err, users) {
  	console.log(users)
    var allUsers = {};
    users.forEach(function(user) {
    	console.log('ID', user._id)
      allUsers[user._id] = user;
    });
    res.json(allUsers);
  });
});

// app.get('/api/profile/:user', function(req, res) {
// })

app.post('/api/signup', function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	User.findOne({username: username}).exec(function(err, user) {
		if(user) {
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
					// next() broadcasting with socket
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



http.listen(8080, function() {
  console.log('Listening to port 8080');
});




