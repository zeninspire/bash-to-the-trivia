// CREATE A USER SCHEMA HERE
var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
  username: { type: String, required: true, index: {unique: true }},
  password: { type: String, required: true},
});


var User = mongoose.model('User', userSchema);




exports.module = User;