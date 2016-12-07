var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
// var Promise = require('bluebird');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: { type: String, required: true, index: {unique: true }},
  password: { type: String, required: true},
  rooms: {type: Array, default: ["Lobby"]},
  avatarUrl: {type: String },
  age: { type: Number, min: 3, max: 65 },
  created_at: Date,
  updated_at: Date
})


var User = mongoose.model('User', userSchema);

userSchema.pre('save', function(next) {
  var user = this;
  return new Promise (function(resolve, reject) {
    bcrypt.hash(user.password, null, null, function(err, hash) {
      if(err) {
        reject(err);
      } else {
        resolve(hash);
      }
    })
  })
  .then(function(hash) {
    user.password = hash;
    next();
  })
})    

User.prototype.auth = function (plain, hash) {
  return new Promise(function(resolve, reject) {
    bcrypt.compare(plain, hash, function(err, res) {
      if(err) {
        reject(err);
      } else {
        resolve(res);
      }
    })
  })
}


User.prototype.addRoom = function(roomname) {
  var user = this;
  return new Promise(function(resolve, reject) {
    if(err) {
      reject(err);
    } else {
      user.rooms.push(roomname)
      resolve(room)
    }
  })
}

module.exports = User;






