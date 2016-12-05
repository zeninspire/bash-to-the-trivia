var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
// var Promise = require('bluebird');


var userSchema = mongoose.Schema({
  username: { type: String, required: true, index: {unique: true }},
  password: { type: String, required: true},
  channels: { type: Array },
  avatarUrl: { type: String },
  age: { type: Number, min: 12, max: 65 },
  created_at: Date,
  updated_at: Date
})

var channelSchema = mongoose.Schema({
  name: {type: String, required: true, index: {unique: true}}
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


module.exports = User;






