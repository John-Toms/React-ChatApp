module.exports = (app,db) => {
  const UserModel = require('../models/user');
  const {ObjectId} = require('mongodb');
  var userModel = new UserModel(db,ObjectId);
  
  app.post('/getUser', (req, res) => {
    return userModel.getUser().then(user=>{
      res.send(user);
    });
  })
    
  app.post('/login', (req, res) => {
    userModel.getUserlist("useremail",req.body.useremail).then(user =>{
      if (user.length != 0) {
          if (user[0].userpassword === req.body.userpassword) {
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

  app.post('/regester', (req, res) => {
    userModel.getUserlist("useremail",req.body.useremail).then(user=>{
      if (user.length == 0) {
        delete req.body._id;
        userModel.insertUser(req.body).then(userid=>{
          res.send('Successful' );
        });
      } else {
        res.send('Exist');
      }
    });
  });

  app.post('/usercheck', (req, res) => {
    userModel.getUserlist("useremail",req.body.useremail).then(user=>{
      if (user.length == 0) {
        res.send('New' );
      } else {
        res.send('Exist');
      }
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
}