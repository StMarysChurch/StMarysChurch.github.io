let fs = require('fs');
let express = require('express');
let path = require("path");
let router = express.Router();

let partialsMap = new Map();
// Gets the list of files in view/
fs.readdir(path.resolve('views/'), (err, files) => {
    // For each file reads the contents and store in appropriate variables.
    files.forEach((element, index, array) => {
        fs.readFile(path.resolve('views/', element), 'utf8', (err, contents) => {
            partialsMap.set(element, contents);
        });
    });
});

/* GET fragments based on elements parameter.
 * https://expressjs.com/en/guide/routing.html#route-parameters*/
router.get('/fragment/:element', function (req, res, next) {
    res.send(partialsMap.get(req.params.element + '.html'));
});

module.exports = router;