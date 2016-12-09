var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var request = require('request');
var morgan = require('morgan');


var mongoose = require('mongoose');
var db = require('./db-config.js');
var User = require('./app/user-model.js');
var Room = require('./app/room-model.js');
var Question = require('./app/question-model.js');
var questionApi = 'https://www.opentdb.com/api.php?amount=10&difficulty=easy&type=multiple';

var app = express();

//Set up socket.io
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client')));
app.use(morgan('dev'));


var connections =[];
var users =[];
//SOCKET.IO MANAGEMENT//

// SEVDA VERSION //
io.on('connection', function(socket) {
  socket.on('signUp', function(user) {
  	connections.push(socket);
    socket.username = user.username;
    socket.roomname = 'Profile';
    users.push(socket.username)
    socket.join('Profile');
    console.log(socket.username+' connected to '+socket.roomname)
    console.log('#connections=', connections.length);
  });

   socket.on('disconnect', function() {
   	connections.splice(connections.indexOf(socket), 1);
    if (socket.roomname !== 'Profile') {
      socket.broadcast.to(socket.roomname).emit('UserLeft', socket.username);
    }
    socket.leave(socket.roomname);
  });


  socket.on('signIn', function(user) {
    socket.username = user.username;
    socket.roomname = 'Profile';
    socket.join('Profile');
  });

  socket.on('changeRoom', function(newRoom) {
    if (socket.roomname !== 'Profile') {
      socket.broadcast.to(socket.roomname).emit('UserLeft', socket.username);
    }
    socket.leave(socket.roomname);
    socket.roomname = newRoom.roomname;
    socket.join(socket.roomname);

    if (socket.roomname !== 'Profile') {
      io.sockets.in(socket.roomname).emit('UserJoined', socket.username);
    }
  });

  socket.on('addNewRoom', function(newRoom) {
    if (socket.roomname !== 'Profile') {
      socket.broadcast.to(socket.roomname).emit('UserLeft', socket.username);
    }
    socket.leave(socket.roomname);
    socket.roomname = newRoom.roomname;
    socket.join(socket.roomname);
  });

  // function updateActiveUsers() {
  // 	socket.emit('updateView', {activeUsers: users});
  // }

  socket.on('addNewPlayer', function(room, newPlayerUsername) {
    io.sockets.emit('PlayerAdded', room, newPlayerUsername);
  });  

  socket.on('startNewGame', function(allQuestions) {
    io.sockets.in(socket.roomname).emit('SendQuestions', allQuestions);
  });


});




////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

app.get('/api/users', function(req, res) {
  User.find({}, function(err, users) {
    var allUsers = {};
    users.forEach(function(user) {
      allUsers[user._id] = user;
    });
    res.json(allUsers);
  });
});

app.get('/api/rooms', function(req, res) {
  Room.find({}, function(err, rooms) {
    var allrooms = {};
    rooms.forEach(function(room) {
      allrooms[room._id] = room;
    });
    res.json(allrooms);
  });
});

// Gets user info for a specific room
app.get('/api/users/:username', function(req, res) {
	var username = req.params.username;
	User.findOne( {username: username}, function(err, user) {
		res.json({username: username, rooms: user.rooms, avatar: user.avatarUrl})
	})
})

// Gets spcific room info in current user scope
app.get('/api/users/:username/:roomname', function(req, res) {
	var username = req.params.username;
	var roomname = req.params.roomname;
	Room.findOne({roomname: roomname}).exec(function(err, room) {
		res.send(objectifyResp(room, username))
	})
})


app.post('/api/users/addRoom', function(req, res) {
	var roomname = req.body.roomname;
	var admin = req.body.currentUser;
	Room.findOne({roomname:roomname}).exec(function(err, room) {
		if(err || room) {
			res.status(400).send('bad request');
		} else {
			var newRoom = Room({
				roomname: roomname,
				admin: admin,
				users: [admin]
			});
			newRoom.save(function(err, room) {
				if(err) {
					return res.status(400).send(new Error('saveRoom error'))
				}
			}).then(function(room) {
				User.findOne({username: admin}).exec(function(err, adminUser) {
					if(err || !adminUser) {
						return res.send(new Error('addRoom error'));
					} else {
						adminUser.rooms.push(newRoom.roomname);
						adminUser.save(function(err, user) {
							if(err) {
								res.status(500).send(new Error('Error on save Admin'));
							}
						}).then(function(resp) {
								console.log("resp", resp)
								res.sendStatus(201);
						})
					}
				});
			})
		}
	})
});

app.post('/api/users/addNewPlayer', function(req, res) {
	var roomname = req.body.roomname;
	var newPlayerUsername = req.body.newPlayerUsername;
	Room.findOne({roomname: roomname, users: newPlayerUsername}).exec(function(err, room) {
		if(room) {
			return res.status(400).send('User already in room');
		} else {
			Room.findOne({roomname: roomname}).exec(function(err, room) {
				if (err || room === null) {
					return res.status(400).send('Room doesn\'t exist');
				} 
				room.users.push(newPlayerUsername);
				room.save(function(err){
					if(err) {
						return res.status(400).send('Cannot save room updates');
					}
					User.findOne({username: newPlayerUsername}).exec(function(err, user) {
						if (user === null || err) {
							return res.status(400).send('User doesn\'t exist');
						} 
						user.rooms.push(roomname);
						user.save(function(err){
							if(err) {
								return res.status(400).send('Cannot save user updates');
							}
							res.status(201).send('Added new player succesfully');						
						});
					});
				});
			});
		}
	}); 
});

app.post('/api/signup', function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	User.findOne({username: username}).exec(function(err, user) {
		if(err) {
			res.send(err);
		} else if(user) {
			res.send();
		} else {
			var promise = new Promise(function(resolve, reject) {
				var newUser = new User({
					username: username,
					password: password
				})
				newUser.save(function(err, user) {
					console.log("ON SAVE", err, user)
					if(err) {
						reject(err);
					} else {
						resolve(user);
					}
				})
			})
			promise.then(function(user) {
				console.log('user', user)
				Room.findOne({roomname: "Lobby"}, function(err, room) {
					console.log('room', room)
					if(err) return res.sendStatus(500);
					room.users.push(user.username);
					room.save(function(err) {
						if(err) return res.send(err);
						var rooms = {};
						var user = {};
						var resp = {};
						rooms[room.roomname] = {
							roomname: room.roomname,
							users: room.users,
							admin: room.admin
						};
						user.username = username;
						resp.user = user;
						resp.rooms = rooms;
						res.json(resp);
					})
				})
			})
		}
	})
})


// query.where('comments').elemMatch(function (elem) {
//   elem.where('author', 'bnoguchi')
//   elem.where('votes').gte(5);
// });

app.post('/api/signin', function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	User.findOne({username: username}).exec(function(err, user) {
		if(err || !user) {
			return res.send(new Error('login error'));
		} else {
			user.auth(password, user.password).then(function(match) {
				if(match) {
					Room.find({users: username}, function(err, foundRooms) {
						console.log('ROOM FIND USERS', foundRooms)
						if(err) return res.sendStatus(500);
						// console.log('ROOMS/ERR', foundRooms.length)
						var rooms = {};
						var resp = {};
						var user = {};
						for(var i = 0; i < foundRooms.length; i++) {
							rooms[foundRooms[i].roomname] = {
								roomname: foundRooms[i].roomname,
								users: foundRooms[i].users,
								admin: foundRooms[i].admin
							};
						}
						user.username = username;
						resp.user = user;
						resp.rooms = rooms;
						console.log(resp)
						return res.json(resp);
					})
				} else {
					console.log('NO MATCH')
					res.status(401).end();
				}
			})
		}
	})
})







app.get('/api/questions', function(req, res) {  
  var promise = new Promise(function(resolve, reject) {
    request.get(questionApi, function (error, response, body) {
      if (error && !response.statusCode == 200) {
        reject(err);
      } else {
        resolve(body);
      }
    });
  })
  promise.then(function(body) {
    var temp = JSON.parse(body).results;
    res.json(temp);
      // for(var i = 0; i < 10; i++) {
      //   var qt = new Question({
      //     question: temp[i].question,
      //     correctAnswer: temp[i].correct_answer,
      //     incorrectAnswer: temp[i].incorrect_answers,
      //   });
      //   qt.save();
      // }
  }).catch(function(err) {
      res.status(404).json(err)
    })
})


app.get('/api/questionsdb', function(req, res) {
  Question.find({}, function(err, questions) {
    var allquestions = {};
    questions.forEach(function(question) {
    	console.log('ID', question._id)
      allquestions[question._id] = question;
    });
    res.json(allquestions);
  });
});


// HELPER FUNCTIONS
// function objectifyResp(selected, username) {
// 	var currentRoom = {}
// 	currentRoom[selected.roomname] = {
// 		roomname: selected.roomname,
// 		users: selected.users,
// 		admin: selected.admin
// 	};
// 	var currentUser = {};
// 	currentUser = {
// 		username: username,
// 		rooms:
// 	}

// 	return {
// 		currentUser: currentUser,
// 		currentRoom: currentRoom
// 	}
// }

function parser (string) {
	return string[0].toUpperCase() + string.slice(1).toLowerCase();
};



http.listen(8080, function() {
  console.log('Listening to port 8080');
});




