module.exports = (app, db, appConfig, publicPath) => {
  const UserModel = require('../models/user');
  const { ObjectId } = require('mongodb');
  var nodemailer = require('nodemailer');
  var smtpTransport = require('nodemailer-smtp-transport');
  var handlebars = require('handlebars');
  const fs = require('fs');

  var userModel = new UserModel(db, ObjectId);

  // app.post('/getUser', (req, res) => {
  //   return userModel.getUser().then(user => {
  //     res.send(user);
  //   });
  // })

  app.post('/login', (req, res) => {
    userModel.getUserlist("useremail", req.body.useremail).then(user => {
      console.log(req.body)
      console.log(user)
      if (user.length != 0) {
        if (user[0].userpassword === req.body.userpassword) {
          res.send({msg:'Successful',data:user[0]});
        } else {
          res.status(202);
          res.send({msg:'WrongPassword'});
        }
      } else {
        res.status(201);
        res.send({msg:'InvalidUserEmail'});
      }
    });
  });

  app.post('/regester', (req, res) => {
    userModel.getUserlist("useremail", req.body.useremail).then(user => {
      if (user.length == 0) {
        delete req.body._id;
        userModel.insertUser(req.body).then(userid => {
          res.send('Successful');
        });
      } else {
        res.send('Exist');
      }
    });
  });

  app.post('/usercheck', (req, res) => {
    userModel.getUserlist("useremail", req.body.useremail).then(user => {
      if (user.length == 0) {
        res.send('New');
      } else {
        res.send('Exist');
      }
    });
  });

  app.post('/re-password', (req, res) => {
    userModel.getUserlist("useremail", req.body.useremail).then(user => {
      if (user.length == 0) {
        res.status(202);
        res.send('Invalid UserEmail!');
      } else {
        sendEmail(req.body.useremail, res);
      }
    });

  });

  app.post('/pswupdate', (req, res) => {

    var email = Buffer.from(req.body.useremail, 'base64').toString('ascii');console.log(email)
    userModel.updateValue("useremail",email,"userpassword",req.body.userpassword).then(user=>{console.log(user)
      if (user.length == 0) {
        res.send('Error');
      } else {
        res.send('Successful');
      }
    });
  });

  const readHTMLFile = async (path, callback) => {
    fs.readFile(path, { encoding: 'utf-8' }, (err, html) => {
      if (err) {
        throw err;
        callback(err);
      }
      else {
        callback(null, html);
      }
    });
  };

  const sendEmail = async (email, res) => {

    var path = require('path');
    var mailOpts, smtpTrans;
    smtpTrans = nodemailer.createTransport(appConfig.emailer.transport);

    readHTMLFile(publicPath + '/public/email.html', (err, html) => {

      var template = handlebars.compile(html);
      var replacements = {
        userlink: appConfig.originUrl + "/pswupdate/" + Buffer.from(email).toString('base64')
      };
      var htmlToSend = template(replacements);

      var mailOptions = {
        from: appConfig.emailer.from,
        to: email,
        subject: appConfig.emailer.subject,
        html: htmlToSend
      };

      return smtpTrans.sendMail(mailOptions, function (error, response) {
        if (error) {
          return res.send("Server Error, Please retry later!");
        }
        if (response) {
          return res.send("Please check your mailbox!");
        }
      });
    });
  }
}