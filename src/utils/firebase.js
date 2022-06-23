import firebase from "firebase";

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_WEBAPP_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_WEBAPP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_WEBAPP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_WEBAPP_STORAGE_KEY,
  messagingSenderId: process.env.REACT_APP_FIREBASE_WEBAPP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_WEBAPP_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_WEBAPP_MEASUREMENTID,
};

firebase.initializeApp(config);
const auth = firebase.auth();
const messaging = firebase.messaging.isSupported()
  ? firebase.messaging()
  : null;
export { auth, messaging, firebase };

const firebaseConfig = new URLSearchParams({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
}).toString();

const swUrl = `${process.env.PUBLIC_URL}/firebase-messaging-sw.js?${firebaseConfig}`;
