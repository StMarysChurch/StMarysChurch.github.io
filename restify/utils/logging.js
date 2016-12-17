let logging;
let path = require("path");
let metadata = require('.././metadata.json');

if (process.env.NODE_ENV === 'production') {
    logging = require('@google-cloud/logging')({
        projectId: 'church-tools'
    });
} else {
    logging = require('@google-cloud/logging')({
        projectId: 'church-tools',
        keyFilename: path.resolve(__dirname, '../key.json')
    });
}

let log = logging.log('restify');

function entry(data) {
    return log.entry({resource: {type: 'global'}}, {data: data, sha: metadata.sha});
}

function handler(err, apiResponse) {
    if (!err) {
        console.log("working")
    } else {
        console.log("not wokring ", err, apiResponse);
    }
}

module.exports = {
    entry: entry,
    log: log,
    handler: handler
};
