'use strict';

/**
 * Module dependencies.
 */
var express   = require('express'),
    mongoose  = require('mongoose'),
    expressValidator = require('express-validator'),
    bodyParser     = require('body-parser'),
    config    = require('./config/config');

var app = express();
//connecting mongodb
var db = mongoose.connect(config.mongodbConfig.driver + '://' + config.mongodbConfig.host + ':' + config.mongodbConfig.port + '/' + config.mongodbConfig.dbName, function (err) {
    if (err) {
        console.log("[Server] Unable to connect to MongoDB using connection string:" + config.mongodbConfig.driver + '://' + config.mongodbConfig.host + ':' + config.mongodbConfig.port + '/' + config.mongodbConfig.dbName, err);
        throw err;
    }
});
mongoose.connection.on('connected', function () {
    console.info("[Server] MongoDB connection established successfully");
});

mongoose.connection.on('error', function (err) {
    console.error('[Server] Connection to mongo failed ', err);
});

mongoose.connection.on('disconnected', function () {
    console.log('[Server] MongoDB connection closed');
});


//including models
var models_path = __dirname + '/app/models';

app.use(expressValidator());
app.use(bodyParser.json({limit: '50mb'}));
//Defining routes
require('./config/routes')(app);

//Start the app by listening on <port>
var port = config.port;
var server = app.listen(port);
console.log('Server started on port ' + port);
require('./controllers/external/SocketController')(server);

//exposed app
exports = module.exports = app;