var mongoose = require('mongoose')
  
var personSchema = mongoose.Schema({
  _id     : Number,
  name    : String,
  age     : Number,
  stories : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Story' }]
});

var storySchema = mongoose.Schema({
  _creator : { type: Number, ref: 'Person' },
  title    : String,
  fans     : [{ type: Number, ref: 'Person' }]
});

var Story  = mongoose.model('Story', storySchema);
var Person = mongoose.model('Person', personSchema);


var aaron = new Person({ _id: 0, name: 'Aaron', age: 100 });

aaron.save(function (err) {
  if (err) return new Error(err);
  
  var story1 = new Story({
    title: "Once upon a timex.",
    _creator: aaron._id    // assign the _id from the person
  });
  
  story1.save(function (err) {
    if (err) return new Error(err);
    // thats it!
  });
});


// app.get('/api/people', function(req, res) {
//   play.Person.find({}, function(err, people) {
//     var allPeople = {};
//     people.forEach(function(person) {
//       people[person._id] = person;
//     });
//     res.json(allPeople);
//   });
// });

// app.get('/api/stories', function(req, res) {
//   play.Story.find({}, function(err, stories) {
//     var allStories = {};
//     stories.forEach(function(story) {
//       stories[story._id] = story;
//     });
//     res.json(allStories);
//   });
// });


// Story
// .findOne({ title: 'Once upon a timex.' })
// .populate('_creator')
// .exec(function (err, story) {
//   if (err) return handleError(err);
//   console.log('The creator is %s', story._creator.name);
//   // prints "The creator is Aaron"
// });


module.exports = {
	Story: Story,
	Person: Person
}