var mongoose = require('mongoose');


// var request = require('request');
// var questionApi = 'https://www.opentdb.com/api.php?amount=50&difficulty=easy&type=multiple';

// request(questionApi, function (error, response, body) {
//   if (!error && response.statusCode == 200) {
//     var temp = JSON.parse(body).results;
//     for(var i = 0; i < 50; i++) {
//         // console.log('Qt is ', temp[i].question);
//       var qt = new Question({
//         question: temp[i].question,
//         correctAnswer: temp[i].correct_answer,
//         incorrectAnswer: temp[i].incorrect_answers,
//       });
//       qt.save();
//     }
//   }
// });



var questionSchema = mongoose.Schema({
  question: { type: String, require: true, index: { unique: true }},
  correctAnswer: String,
  incorrectAnswer: Array
});

var Question = mongoose.model('Question', questionSchema);

module.exports = Question;