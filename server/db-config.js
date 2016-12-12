var mongoose = require('mongoose');

var currentDB = process.env.MONGOLAB_PUCE_URI || 'mongodb://localhost/users';

// 'mongodb://zeninspire:bash2thet@ds127948.mlab.com:27948/heroku_fzshsnrq'

// 'mongodb://heroku_kktw8x15:5d30s1qij57q26i6sttj2hlc1v@ds133378.mlab.com:33378/heroku_kktw8x15'

//set the connect URL to currentDB;
mongoose.connect(currentDB);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	// *** uncomment line below to reset db
	// db.dropDatabase();
  console.log('db connected with mongoose');
});

