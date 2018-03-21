module.exports = {
    url: 'http: //localhost',
    port: process.env.PORT || 3333,
    originUrl: 'http://localhost:3333',
    mongoUrl: 'mongodb://localhost:27017/mdb',
    ISDEV: process.env.NODE_ENV !== 'production',
  }