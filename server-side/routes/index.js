var express = require('express');
var router = express.Router();
var firebase = require("firebase");
var handlebars = require("handlebars");

firebase.initializeApp({
    serviceAccount: "../Church Tools-57d50b5b341e.json",
    databaseURL: "https://church-tools.firebaseio.com"
});

/* GET home page. */
router.get('/', function (req, res, next) {
    // res.render('index', { title: 'Express'});
    var db = firebase.database();
    var ref = db.ref("schedule/");
    ref.once("value").then(function (snapshot) {
        // res.render('index', {schedule: snapshot.val(), layout: null});
        res.render('index', {schedule: snapshot.val(), layout: null}, function (err, html) {
            res.send(html);
            console.log(html)
        });
        //console.log(res.render('index', {schedule: snapshot.val(), layout: null}));
        // snapshot.forEach(function (childSnapshot) {
        //     var key = childSnapshot.key;
        //     var childData = childSnapshot.val();
        //     console.log(key);
        //     console.log(childData);
        // });
    });
    //res.render('index', {schedule: snapshot.val(), layout: null});
});

module.exports = router;
