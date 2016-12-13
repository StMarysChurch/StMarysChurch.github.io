var path = require("path");
var firebase = require("firebase");
var deployToken, serviceAccount;
var logging = require(path.resolve(__dirname, "./lib/logging"));

var gcloud = require('google-cloud');

if (process.env.NODE_ENV === 'production') {
    var gcs = gcloud.storage();
} else {
    var gcs = gcloud.storage({
        keyFilename: path.resolve(__dirname, "./key.json"),
        projectId: 'church-tools'
    });
}

var secrets = gcs.bucket('church-tools.appspot.com');

secrets.file('secret/church-tools-key.json').download((err, contents) => {
    if (!err) {
        logging.info("app.js ", "deploy-token.json -- Success");
        // logging.info("app.js church-tools-key.json ", contents.toString());
        serviceAccount = JSON.parse(contents.toString());
        firebase.initializeApp({
            databaseURL: "https://church-tools.firebaseio.com",
            serviceAccount: serviceAccount
        });
        var db = firebase.database();
        var ref = db.ref("/schedule");
        ref.once("value").then(function(snapshot) {
            console.log(snapshot.val());
        });
    } else {
        logging.error("app.js ", "deploy-token.json -- Error ", err);
    }
});
secrets.file('secret/deploy-token.json').download((err, contents) => {
    if (!err) {
        logging.info("app.js ", "deploy-token.json -- Success");
        // logging.info("app.js deploy-token.json ", contents.toString());
        deployToken = contents.toString();
    } else {
        logging.error("app.js ", "deploy-token.json -- Error ", err);
    }
});