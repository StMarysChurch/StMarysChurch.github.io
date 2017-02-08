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
            "title": "Donors",
            "body": {
                "page-content":`<script>
firebase.database.enableLogging(true);
function submitFirebase() {
    var myForm = document.getElementById("donorForm");
  for (var i = 0; i < myForm.elements.length; i++) {
    console.log(myForm.elements[i].value);
    }
    var donorRef = firebase.database().ref('donors').push();
    donorRef.set({
        'name' : myForm.elements[0].value,
    'email' : myForm.elements[1].value,
    'phoneNo' : myForm.elements[2].value
    });
}</script>
<h3>Add Donor</h3><div class="mdl-grid">
                <form id="donorForm">
  <div class="mdl-textfield mdl-js-textfield">
    <input class="mdl-textfield__input" type="text" id="name">
    <label class="mdl-textfield__label" for="sample1">Name</label>
  </div>
  <div class="mdl-textfield mdl-js-textfield">
    <input class="mdl-textfield__input" type="email" id="email">
    <label class="mdl-textfield__label" for="sample1">donor@gmail.com</label>
  </div>
  <div class="mdl-textfield mdl-js-textfield">
  <!--Fill the pattern for phone n.o-->
    <input class="mdl-textfield__input" type="text" pattern="" id="phoneNo">
    <label class="mdl-textfield__label" for="sample2">Number...</label>
    <span class="mdl-textfield__error">Input is not a number!</span>
  </div>
</form>
<button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect" onclick="submitFirebase()">
  Submit
</button>
                </div>`
            },
            "foot": "<script>componentHandler.upgradeDom();</script>"
        });
    } else {
        // Send the whole page
        res.send();
    }
});

module.exports = router;
