// CREATE A USER SCHEMA HERE
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-promised');
var Promise = require('bluebird');


var userSchema = mongoose.Schema({
  username: { type: String, required: true, index: {unique: true }},
  password: { type: String, required: true},
  channels: { type: Array },
  avatarUrl: { type: String },
  age: { type: Number, min: 12, max: 65 },
  created: Date,
  updated: { type: Date, default: Date.now }



var User = mongoose.model('User', userSchema);

userSchema.pre('save', function(next) {
  return bcrypt.hash(this.password, null).then(function(hash) {
    this.password = hash;
  })
  next();
})