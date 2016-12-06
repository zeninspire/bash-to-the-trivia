var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var User = require('./user-model.js')

var roomSchema = mongoose.Schema({
  roomname: String,
  admin: String, // usernameIdref
  users: [],
  created_at: Date,
  updated_at: Date
});



// roomSchema.pre('save', function(next) {
// 	var room = this;
// 	User.findOne({username: this.admin}).exec(function(err, user) {

// 	})
// }
var Room = mongoose.model('Room', roomSchema);

module.exports = Room;
