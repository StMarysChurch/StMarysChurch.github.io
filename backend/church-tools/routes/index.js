var express = require('express');
var path = require("path");
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.sendFile('login.html', {root: './public'});
});

/* Get donor page. */
router.get('/donors', function (req, res, next) {
    if (req.query.spf==='navigate'){
        console.log("Seems like working");
        res.type('json');
        res.json({
            "title": "Donors",
            "body": {
                "page-content":`<script>
firebase.database.enableLogging(true);
</script>
<h3>Donors</h3><div class="mdl-grid">
                <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
  <thead>
    <tr>
      <th class="mdl-data-table__cell--non-numeric">Name</th>
      <th class="mdl-data-table__cell--non-numeric">Email</th>
      <th>Phone N.O</th>
    </tr>
  </thead>
  <tbody id="tableBody">
    <tr>
      <td class="mdl-data-table__cell--non-numeric">Acrylic (Transparent)</td>
      <td>25</td>
      <td>$2.90</td>
    </tr>
    <tr>
      <td class="mdl-data-table__cell--non-numeric">Plywood (Birch)</td>
      <td>50</td>
      <td>$1.25</td>
    </tr>
    <tr>
      <td class="mdl-data-table__cell--non-numeric">Laminate (Gold on Blue)</td>
      <td>10</td>
      <td>$2.35</td>
    </tr>
  </tbody>
</table>
<script>
let tableBody =  document.getElementById('tableBody');
firebase.database().ref('donors').once('value', function(snapshot) {
  for (var x = 0, y = childSnapshot.val().events.length; x < y; x++) {
                console.log(childSnapshot.val().times[x] + ":", childSnapshot.val().events[x]);
                var event = childSnapshot.val().times[x] + ": " + childSnapshot.val().events[x] + "<br>";
                scheduleElement.insertAdjacentHTML('beforeend', event);
            }
});
</script>
                </div>`
            },
            "foot": "<script>componentHandler.upgradeDom();</script>"
        });
    } else {
        // Send the whole page
        res.send();
    }
});

router.get('/addDonor', function (req, res, next) {
    if (req.query.spf==='navigate'){
        console.log("Seems like working");
        res.type('json');
        res.json({
            "title": "Add Donor",
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
