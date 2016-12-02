var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');
var db = require('./db-config.js');
var User = require('./app/user-model.js')


var app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client')));


app.listen(8080, function() {
  console.log('Listening to port 8080');
});