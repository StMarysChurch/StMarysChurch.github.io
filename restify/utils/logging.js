let logging;
let restify = require('restify');
let path = require("path");

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
let client = restify.createJSONClient({
    headers: {'Metadata-Flavor': 'Google'},
    url: 'http://metadata.google.internal/computeMetadata/v1'
});
let metadata;
if (process.env.NODE_ENV === 'production') {
    client.get('/project/?recursive=true', (err, req, res, obj) => {
        if (!err) {
            console.log(err);
        }
        console.log('%j', obj);
    });

    client.get('/instance/?recursive=true', (err, req, res, obj) => {
        if (!err) {
            console.log(err);
        }
        console.log('%j', obj);
        metadata = obj;
    });
} else {
    metadata = {
        resource: {
            type: 'gce_instance',
            labels: {
                zone: 'global',
                instance_id: '3'
            }
        }
    };
}

function entry(data) {
    return log.entry(metadata, data);
}

function handler(err, apiResponse) {
    if (!err) {
        console.log("working")
    } else {
        console.log("not wokring");
    }
}

module.exports = {
    entry: entry,
    log: log,
    handler: handler
};
