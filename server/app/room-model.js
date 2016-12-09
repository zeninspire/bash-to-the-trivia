var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var User = require('./user-model.js')
var Schema = mongoose.Schema;

var roomSchema = new Schema({
  roomname: { type: String, required: true, index: {unique: true }},
  admin: String, // usernameIdref
  users: [],
  created_at: Date,
  updated_at: Date
});

var Room = mongoose.model('Room', roomSchema);

var lobby = Room({
	roomname: 'Lobby'
});

lobby.save(function(err) {
	if(err) {
		return err;
	} else {
		console.log('SAVE lobby SUCCESFUL')
	}
});

module.exports = Room;









