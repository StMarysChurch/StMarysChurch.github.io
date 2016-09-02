var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var gcs = require("@google-cloud/storage")();

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /deploy
//app.use(favicon(path.join(__dirname, 'deploy', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// Activate Google Cloud Trace and Debug when in production
if (process.env.NODE_ENV === 'production') {
    require('@google/cloud-trace').start();
    require('@google/cloud-debug');
}

// var secrets = gcs.bucket("church-tools.appspot.com");
// var firebaseKey = secrets.bucket("secret/church-tools-key.json");
// var deployKey = secrets.bucket("secret/deploy-token.json");
// firebaseKey.download({
//     destination: path.resolve(__dirname, "../church-tools-key.json")
// }, function (err) {
// });
//
// deployKey.download({
//     destination: path.resolve(__dirname, "../deploy-token.json")
//     /Users/roneythomas/code/StMarysChurch.github.io/server-side/deploy-token.json
// }, function (err) {
// });

module.exports = app;
