var mongoose = require('mongoose');

var currentDB = process.env.MONGODB_URI || 'mongodb://localhost/users';

// 'mongodb://zeninspire:bash2thet@ds127948.mlab.com:27948/heroku_fzshsnrq'

//set the connect URL to currentDB;
mongoose.connect(currentDB);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	// *** uncomment line below to reset db
	// db.dropDatabase();
  console.log('db connected with mongoose');
});

