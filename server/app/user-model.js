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

// const resolveResultOrReject = (res, rej) => {
//    (err, res) => (err ? rej(err) : res(res))
// }

// const resolveResultOrRejectPrint = (res, rej) => {
//    (err, res) => (err ? console.log(err) || rej(err) : console.log(res) || res(res))
// }


var User = mongoose.model('User', userSchema);

userSchema.pre('save', function(next) {
  var user = this;
  if (!user.isNew || !user.isModified) return next();
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
      console.log("PASSWARS", plain, hash)
      if(err) {
        console.log("ERR", err)
        reject(err);
      } else {
        console.log("RES", res)
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






