var express = require('express');
var router = express.Router();
var firebase = require("firebase");
var handlebars = require("handlebars");
const fs = require('fs');

firebase.initializeApp({
    serviceAccount: "../Church Tools-57d50b5b341e.json",
    databaseURL: "https://church-tools.firebaseio.com"
});

/* GET home page. */
router.get('/', function (req, res, next) {
    // res.render('index', { title: 'Express'});
    var db = firebase.database();
    var ref = db.ref("schedule/");
    ref.once("value").then((snapshot) => {
        fs.readFile("../views/index.hbs", "utf8", (err, data) => {
            if (err) throw err;
            var template = handlebars.compile(data);
            var response = template(snapshot.val());
            res.send(response);
            fs.writeFile('../../public/index.html', template(snapshot.val()), (err) => {
                if (err) throw err;
                console.log('It\'s saved!');
            });
        });
    });
});

module.exports = router;
