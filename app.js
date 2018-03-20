var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var path = require('path');
var mongodb = require('mongodb');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var handlebars = require('handlebars');
var fs = require('fs');

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

var readHTMLFile = function(path, callback) {
  fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
      if (err) {
          throw err;
          callback(err);
      }
      else {
          callback(null, html);
      }
  });
};

app.post('/login', (req, res) => {
  dbConn.then(function (db) {
    var query = { useremail: req.body.useremail };
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
        res.send('InvalidUserEmail');
      }
    });
  });
});

app.post('/regester', (req, res) => {

  dbConn.then(function (db) {
    var query = { useremail: req.body.useremail };
    db.collection('userlist').find(query).toArray().then(function (response) {
      if (response.length == 0) {
        delete req.body._id;
        db.collection('userlist').insertOne(req.body);
        res.send('Successful' );
      } else {
        res.send('Exist');
      }
    });
  });
});

app.post('/usercheck', (req, res) => {
  dbConn.then(function (db) {
    var query = { useremail: req.body.useremail };
    db.collection('userlist').find(query).toArray().then(function (response) {
      if (response.length == 0) {
        res.send('New' );
      } else {
        res.send('Exist');
      }
    });
  });
});

app.post('/re-password', (req, res) => {
  var email = req.body.useremail;
  dbConn.then(function (db) {
    var query = { useremail: email };
    db.collection('userlist').find(query).toArray().then(function (response) {
      if (response.length == 0) {
        res.status(202);
        res.send('Invalid UserEmail!' );
      } else {
          var mailOpts, smtpTrans;
          smtpTrans = nodemailer.createTransport({
              service: 'Gmail',
              auth: {
                  user: "toms199363@gmail.com",
                  pass: "tomsite1" 
              }
          });
          
          readHTMLFile(__dirname + '/public/email.html', function(err, html) {

              var template = handlebars.compile(html);
              var replacements = {
                  userlink: "http://localhost:3000/pswupdate/"+Buffer.from(email).toString('base64')
              };
              var htmlToSend = template(replacements);
              var mailOptions = {
                  from: 'toms199363@gmail.com',
                  to : email,
                  subject : 'User verification link',
                  html : htmlToSend
              };
              smtpTrans.sendMail(mailOptions, function (error, response) {
                  if (error) {
                      res.status(203)
                      res.send("Server Error, Please retry later!");
                  }
                  if(response){
                      res.status(201)
                      res.send("Please check your mailbox!")
                  }
              });
          });
        }
    });
  });
});

app.post('/pswupdate', (req, res) => {
 
  var email = Buffer.from(req.body.useremail, 'base64').toString('ascii');

  dbConn.then(function (db) {
    var query = { useremail: email };
    var data = {$set: {userpassword:req.body.userpassword}};
    db.collection('userlist').update(query,data).then(function (response) {
      if (response.length == 0) {
        res.send('Error' );
      } else {
        res.send('Successful');
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
