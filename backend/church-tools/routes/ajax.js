var express = require('express');
var path = require("path");
var router = express.Router();

/* GET home page. */
router.get('/fragment/members', function (req, res, next) {
    res.send(`
<div class="mdl-cell mdl-cell--12-col">
<h5 id="subheading">Members</h5>
<table class="mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp" style="margin-left: auto;
    margin-right: auto;
    margin-top: 4vh;">
  <thead>
    <tr>
      <th class="mdl-data-table__cell--non-numeric">Name</th>
      <th class="mdl-data-table__cell--non-numeric">Email</th>
      <th>Phone #</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="mdl-data-table__cell--non-numeric">Roney Thomas</td>
      <td class="mdl-data-table__cell--non-numeric">roneythomas6@gmail.com</td>
      <td>6478962420</td>
    </tr>
    <tr>
      <td class="mdl-data-table__cell--non-numeric">Tibin Paul</td>
      <td class="mdl-data-table__cell--non-numeric">roneythomas6@gmail.com</td>
      <td>6478962420</td>
    </tr>
    <tr>
      <td class="mdl-data-table__cell--non-numeric">Nathen</td>
      <td class="mdl-data-table__cell--non-numeric">roneythomas6@gmail.com</td>
      <td>6478962420</td>
    </tr>
  </tbody>
</table>
<!-- Colored FAB button with ripple -->
<button class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored" style="
    position: fixed;
    right: 14px;
    bottom: 14px;"
    onclick="notifyNav('addMembers')">
  <i class="material-icons">add</i>
</button>
</div>`);
});

router.get('/fragment/addMembers', function (req, res, next) {
    res.send(`
<h5 id="subheading">Add Member</h5>
<form action="#">
      <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
        <input class="mdl-textfield__input" type="text" id="sample3">
        <label class="mdl-textfield__label" for="sample3">Text...</label>
      </div>
    </form>
`);
});

module.exports = router;

