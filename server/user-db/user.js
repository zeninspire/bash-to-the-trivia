// CREATE A USER SCHEMA HERE
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-promised');
var Promise = require('bluebird');


var userSchema = mongoose.Schema({
  username: { type: String, required: true, index: {unique: true }},
  password: { type: String, required: true},
  channels: { type: Array },
  avatarUrl: { type: String },
  age: { type: Number, min: 4, max: 100 },
  // admin: Boolean,
  created_at: Date,
  updated_at: Date
});

var roomSchema = mongoose.Schema({
  roomname: String,
  admin: String, // username
  users: [],
  created_at: Date,
  updated_at: Date
});


var User = mongoose.model('User', userSchema);


userSchema.pre('save', function(next) {
	return bcrypt.hash(this.password, null).then(function(hash) {
		this.password = hash;
	})
	next();
})

User.prototype.checkPass = function(input, expected) {
	return new Promise (function(resolve, reject) {
    bcrypt.compare(input, expected, function (err, isMatch) {
      if (err) {
        reject(err);
      } else {
        resolve(isMatch);
      }
    })
  }) 
}


// User.prototype.addChanel = function()

exports.module = User;