var admin = require("firebase-admin");

var serviceAccount = require("../../secrets/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = {
  fcm: admin.messaging()
};