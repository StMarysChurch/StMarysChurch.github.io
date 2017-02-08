var express = require('express');
var path = require("path");
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.sendFile('login.html', {root: './public'});
});

router.get('/donors', function (req, res, next) {
    if (req.query.spf==='navigate'){
        console.log("Seems like working");
        res.type('json');
        res.json({
            "title": "Page Title",
            "body": {
                "page-content":"<h1>Yes Yes</h1>"
            }
        });
    } else {
        // Send the whole page
        res.send();
    }
});

module.exports = router;
