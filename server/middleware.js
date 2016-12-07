var mongoose = require('mongoose');
var User = require('./app/user-model.js');
var Room = require('./app/room-model.js');




// var mid1 = function(req, res, next) {
// 	return User.find({}, function(err, users) {
// 		if(err) {
// 			return err;
// 		} else {
// 			users.forEach(function(user) {
// 				lobby.users.push(user.username)
// 			})
// 			console.log('lobby', lobby)
// 		}
// 	}).then(function() {
// 		
// 	})
// } 


// module.exports = mid1;
