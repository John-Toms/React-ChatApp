var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var path = require('path');
var mongodb = require('mongodb');
var bodyParser = require('body-parser');

var dbConn = mongodb.MongoClient.connect('mongodb://localhost:27017/mdb');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

app.post('/login', (req, res) => {
  dbConn.then(function (db) {
    var query = { username: req.body.username };
    db.collection('userlist').find(query).toArray().then(function (response) {
      // data = JSON.parse(response);
      if (response.length != 0) {
        if (response[0].userpassword == req.body.userpassword) {
          res.send('Successful');
        } else {
          res.status(202);
          res.send('WrongPassword');
        }
      } else {
        res.status(201);
        res.send('InvalidUsername');
      }
    });
  });
});
app.post('/regester', (req, res) => {

  dbConn.then(function (db) {
    var query = { username: req.body.username };
    db.collection('userlist').find(query).toArray().then(function (response) {
      if (response.length == 0) {
        console.log(response)
        delete req.body._id;
        db.collection('userlist').insertOne(req.body);
        console.log(req.body);
        res.send('Successful' );
      } else {
        res.status(201);
        res.send('Exist');
      }
    });
  });
});

app.post('/usercheck', (req, res) => {

  dbConn.then(function (db) {
    var query = { username: req.body.username };
    db.collection('userlist').find(query).toArray().then(function (response) {
      if (response.length == 0) {
        console.log(response)
        res.send('New' );
      } else {
        res.send('Exist');
      }
    });
  });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
