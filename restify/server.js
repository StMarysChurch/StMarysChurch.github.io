let admin = require("firebase-admin");
let cheerio = require('cheerio');
let client = require("firebase-tools");
let fs = require("fs");
let path = require("path");
let logging = require(path.resolve(__dirname, './utils/logging.js'));
let restify = require('restify');

let gcs;
if (process.env.NODE_ENV === 'production') {
    gcs = require('@google-cloud/storage')({
        projectId: 'church-tools'
    });
} else {
    gcs = require('@google-cloud/storage')({
        projectId: 'church-tools',
        keyFilename: path.resolve(__dirname, './key.json')
    });
}

let secrets = gcs.bucket('church-tools.appspot.com');
let deployToken, serviceAccount;

// Downloading service account credential
secrets.file('secret/church-tools-key.json').download((err, contents) => {
    if (!err) {
        serviceAccount = JSON.parse(contents.toString());
        console.log("church-tools-key.json", serviceAccount);
        logging.log.info(logging.entry({"server.js": "church-tools-key.json downloaded --Success"}), logging.handler);
    } else {
        console.log("Error downloading church-tools-key.json", err);
        logging.log.alert(logging.entry({
            "server.js": "church-tools-key.json downloaded --Error",
            "error": err
        }), logging.handler);
    }
});

// Downloading Firebase deploy token
secrets.file('secret/deploy-token.json').download((err, contents) => {
    if (!err) {
        deployToken = JSON.parse(contents.toString());
        console.log("deploy-token.json", deployToken);
        logging.log.info(logging.entry({"server.js": "deploy-token.json downloaded --Success"}), logging.handler);
    } else {
        console.log("Error downloading deploy-token.json", err);
        logging.log.alert(logging.entry({
            "server.js": "deploy-token.json downloaded --Error",
            "error": err
        }), logging.handler);
    }
});

// Configuring Firebase credentials
let config;
if (process.env.NODE_ENV === 'production') {
    config = {
        credential: admin.credential.applicationDefault(),
        databaseURL: "https://church-tools.firebaseio.com/"
    };
} else {
    serviceAccount = require("./key.json");
    config = {
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://church-tools.firebaseio.com/"
    };
}

// Initialize the default app & db
admin.initializeApp(config);
let db = admin.database();


// Renders web page on request
function render(req, res, next) {
    if (req.params.ref === 'schedule') {
        let ref = db.ref('schedule');
        fs.readFile(path.resolve(__dirname, "./views/index.html"), "utf8", (err, data) => {
            if (err) throw err;
            $ = cheerio.load(data);
            let scheduleElement = $('#upcoming_events');
            ref.once("value", function (snapshot) {
                snapshot.forEach(function (childSnapshot) {
                    console.log(childSnapshot);
                    console.log(childSnapshot.val().title);
                    let title = "<b>" + childSnapshot.val().title + "</b><br>";
                    scheduleElement.append(title);
                    for (let x = 0, y = childSnapshot.val().events.length; x < y; x++) {
                        console.log(childSnapshot.val().times[x] + ":", childSnapshot.val().events[x]);
                        let event = childSnapshot.val().times[x] + ": " + childSnapshot.val().events[x] + "<br>";
                        scheduleElement.append(event);
                    }
                });
                res.end($.html());
            });
            fs.writeFile(path.resolve(__dirname, "./deploy/hosting/index.html"), $.html(), (err) => {
                if (err) throw err;
                console.log("It\"s saved!");
                client.deploy({
                    project: "church-tools",
                    token: deployToken.token,
                    cwd: path.resolve(__dirname, "../deploy/")
                }).then(() => {
                    logging.log.info(logging.entry({"server.js": "Firebase Hosting Deployed --Success"}), logging.handler);
                }).catch((err) => {
                    logging.log.alert(logging.entry({
                        "server.js": "Firebase Hosting Deployed --Error",
                        "error": err
                    }), logging.handler);
                });
            });
        });
    } else {
        return next(new restify.InvalidArgumentError("Invalid ref"));
    }
    next();
}

let server = restify.createServer({name: 'church-api'});
server.get('/render/:ref', render);
server.head('/render/:ref', render);

server.listen(8080, function () {
    console.log('%s listening at %s', server.name, server.url);
});

server.on('uncaughtException', function (req, res, route, err) {
    console.log('uncaughtException', err.stack);
});
