const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);


exports.dailyClean = functions.pubsub.topic('daily-tick').onPublish((event) => {
    let ref = admin.database().ref("schedule");
    ref.once("value", function (snapshot) {
        console.log(Date.now());
        snapshot.forEach(function (childSnapshot) {
            console.log(childSnapshot.val().expiryDate);
            // Add 24 hours to current unix time. So that we only delete next day
            if (childSnapshot.val().expiryDate + (1000 * 60 * 60 * 24) < Date.now()) {
                console.log("Deleting child ", childSnapshot.val().title);
                ref.child(childSnapshot.key).remove();
                return null;
            }
        });
    });
});
