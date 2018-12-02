var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var bodyParser = require('body-parser');
const http = require("http");

const appConfig = require('./config/config');

const port = appConfig.port;

var app = express();

const start = async () => {
    try {

        const db = await mongodb.MongoClient.connect(appConfig.mongoUrl);

        app.use(logger('dev'));
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(cookieParser());
        app.use(express.static(path.join(__dirname, 'public')));

        const server = http.createServer(app);

        server.listen(port, () => console.log(`Listening on port ${port}`));

        require("./routes/users")(app, db, appConfig, __dirname);
        require("./routes/chat")(app, db, server);

        module.exports = app;

    } catch (e) {
        console.log(e)
    }
    console.log('test');
};
start();

