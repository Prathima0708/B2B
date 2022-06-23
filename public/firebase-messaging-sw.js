importScripts("https://www.gstatic.com/firebasejs/8.0.2/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.0.2/firebase-messaging.js");

// Set Firebase configuration, once available
self.addEventListener("fetch", () => {
  const urlParams = new URLSearchParams(location.search);
  self.firebaseConfig = Object.fromEntries(urlParams);
});

// "Default" Firebase configuration (prevents errors)
const defaultConfig = {
  apiKey: true,
  projectId: true,
  messagingSenderId: true,
  appId: true,
};

// Initialize Firebase app
firebase.initializeApp(self.firebaseConfig || defaultConfig);
const messaging = firebase.messaging.isSupported() ? firebase.messaging() : null;

// Configure message handler (assumes backend is set up)
messaging.onBackgroundMessage((payload) => {
  const { icon, body, title } = payload.data;
  self.registration.showNotification(title, { body, icon });
});
