var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/users');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	// *** uncomment line below to reset db
	// db.dropDatabase();
  console.log('db connected with mongoose');
});


