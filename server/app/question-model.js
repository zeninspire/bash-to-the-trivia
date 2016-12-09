var mongoose = require('mongoose');


var questionSchema = mongoose.Schema({
  question: { type: String, require: true, index: { unique: true }},
  correctAnswer: String,
  incorrectAnswer: Array
});

var Question = mongoose.model('Question', questionSchema);

module.exports = Question;