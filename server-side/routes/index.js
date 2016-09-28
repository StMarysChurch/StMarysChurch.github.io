var express = require("express");
var router = express.Router();
var path = require("path");
var firebase = require("firebase");
var client = require("firebase-tools");
var handlebars = require("handlebars");
var deployToken, serviceAccount, db;
var logging = require(path.resolve(__dirname, "../lib/logging"));
const fs = require("fs");

if (process.env.NODE_ENV === 'production') {
    var gcs = require('@google-cloud/storage')({
        projectId: process.env.GCLOUD_PROJECT
    });
} else {
    var gcs = require('@google-cloud/storage')({
        projectId: 'church-tools',
        keyFilename: path.resolve(__dirname, "../key.json"),
    });
}

var secrets = gcs.bucket('church-tools.appspot.com');

secrets.file('secret/church-tools-key.json').download((err, contents) => {
    if (!err) {
        logging.info("index.js ", "deploy-token.json -- Success");
        logging.info("index.js church-tools-key.json ", contents.toString());
        serviceAccount = JSON.parse(contents.toString());
        firebase.initializeApp({
            databaseURL: "https://church-tools.firebaseio.com",
            serviceAccount: serviceAccount
        });
        db = firebase.database();
    } else {
        logging.error("index.js ", "deploy-token.json -- Error ", err);
    }
});
secrets.file('secret/deploy-token.json').download((err, contents) => {
    if (!err) {
        logging.info("app.js ", "deploy-token.json -- Success");
        logging.info("app.js deploy-token.json ", contents.toString());
        deployToken = JSON.parse(contents.toString());
    } else {
        logging.error("index.js ", "deploy-token.json -- Error ", err);
    }
});

router.get("/", (req, res) => {
    res.send("Welcome Home");
});

router.get("/_ah/health", (req, res) => {
    res.sendStatus(200);
});

/* GET home page. */
router.get("/render", (req, res) => {
    logging.info("index.js ", __dirname);
    var ref = db.ref("/schedule");
    ref.once("value", (snapshot) => {
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
                    token: deployToken.token,
                    cwd: path.resolve(__dirname, "../deploy/")
                }).then(() => {
                    logging.info("index.js ", "Firebase Hosting Deployed -- Success");
                }).catch((err) => {
                    // handle error
                    logging.error("index.js ", "Firebase Hosting Deployed -- Error " + err);
                });
            });
        });
    });
});

module.exports = router;
