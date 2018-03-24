module.exports = {
    url: 'http: //localhost',
    port: process.env.PORT || 3333,
    originUrl: 'http://localhost:3000',
    mongoUrl: 'mongodb://localhost:27017/mdb',
    ISDEV: process.env.NODE_ENV !== 'production',
    emailer: {
      from: "YUC-COM <no-reply@chatapp.com>",
      subject: "Verification email to change your passwork from YUC-COM ",
      transport: {
        service: 'gmail',
        auth: {
          user: 'toms199363@gmail.com',
          pass: 'tomsite1'
        }
      }
    }
  }