importScripts(
  "https://www.gstatic.com/firebasejs/10.6.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.6.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "__VITE_API__",
  authDomain: "__VITE_AUTH_DOMAIN__",
  projectId: "__VITE_PROJECT_ID__",
  storageBucket: "__VITE_STORAGE_BUCKET__",
  messagingSenderId: "__VITE_MESSAGING_SENDER_ID__",
  appId: "__VITE_APP_ID__",
  measurementId: "__VITE_MEASUREMENT_ID__",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(({ notification }) => {
  self.registration.showNotification(notification.title, {
    body: notification.body,
  });
});
