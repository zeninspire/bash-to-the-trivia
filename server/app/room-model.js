var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');


var roomSchema = mongoose.Schema({
  name: {type: String, required: true, index: {unique: true}}
})