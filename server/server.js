var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');
var morgan = require('morgan');
var db = require('./db-config.js');
var User = require('./app/user-model.js');

var Room = require('./app/room-model.js');

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
    socket.broadcast.emit('newUserSignedUp', {username: data.username} );
    console.log('socket on data: ', data.username);
  });
});



///////////////////////



app.get('/api/users', function(req, res) {
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

app.get('/api/rooms', function(req, res) {
  Room.find({}, function(err, rooms) {
  	console.log(users)
    var allrooms = {};
    users.forEach(function(room) {
    	console.log('ID', room._id)
      allrooms[room._id] = room;
    });
    res.json(allrooms);
  });
});


app.post('/api/users/addRoom', function(req, res) {
	var roomname = req.body.roomname;
	Room.findOne({roomname:roomname}).exec(function(err, room) {
		if(err) {
			res.send(err);
		} else if(room) {
			res.send('room exists')
		} else {
			var newRoom = Room({
			})
		}
	})
})


app.post('/api/signup', function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	User.findOne({username: username}).exec(function(err, user) {

		if(err) {
			res.send(err);
		} else if(user) {
			res.send();
		} else {
			var newUser = User({
				username: username,
				password: password
			})
			newUser.save(function(err, user) {
				if(err) {
					res.status(500).json(new Error('Error on save'));
				} else {
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
		if(err || !user) {
			console.log("login error: ", err)
			return res.send(new Error('login error'));
		} else {
			user.auth(password, user.password).then(function(match) {
				if(match) {
					res.send(user);	
				} else {
					res.status(401).end();
				}
			})
		}
	})
})



http.listen(8080, function() {
  console.log('Listening to port 8080');
});




