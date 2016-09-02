var express = require("express");
var router = express.Router();
var path = require("path");
var firebase = require("firebase");
var client = require("firebase-tools");
var handlebars = require("handlebars");
var deployToken = require(path.resolve(__dirname, "../deploy-token.json"));
const fs = require("fs");

firebase.initializeApp({
    serviceAccount: path.resolve(__dirname, "../church-tools-key.json"),
    databaseURL: "https://church-tools.firebaseio.com"
});

/* GET home page. */
router.get("/", (req, res, next) => {
    // res.render("index", { title: "Express"});
    console.log(__dirname);
    var db = firebase.database();
    var ref = db.ref("schedule/");
    ref.once("value").then((snapshot) => {
        fs.readFile(path.resolve(__dirname, "../views/index.hbs"), "utf8", (err, data) => {
            if (err) throw err;
            var template = handlebars.compile(data);
            var response = template(snapshot.val());
            res.send(response);
            fs.writeFile(path.resolve(__dirname, "../deploy/hosting/index.html"), template(snapshot.val()), (err) => {
                if (err) throw err;
                console.log("It\"s saved!");
                client.deploy({
                    project: "church-tools",
                    // token: process.env.FIREBASE_TOKEN,
                    token: deployToken.token,
                    cwd: path.resolve(__dirname, "../deploy/")
                }).then(() => {
                    console.log("Rules have been deployed!")
                }).catch((err) => {
                    // handle error
                });
            });
        });
    });
    next();
});

module.exports = router;
