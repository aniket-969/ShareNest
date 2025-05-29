import admin from "firebase-admin";
import serviceAccount from "../../secrets/serviceAccountKey.json"  assert { type: "json" };;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const fcm = admin.messaging();
