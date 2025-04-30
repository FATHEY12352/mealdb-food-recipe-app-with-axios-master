// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// استبدل هذا الكائن بالكائن الذي نسخته من Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyAxIDlJSsl-xuylZ07hSOZqi4LwoMgxseM",
    authDomain: "fathey-ca5f9.firebaseapp.com",
    projectId: "fathey-ca5f9",
    storageBucket: "fathey-ca5f9.firebasestorage.app",
    messagingSenderId: "511386146447",
    appId: "1:511386146447:web:1e16702370156066b6c2fa",
    measurementId: "G-54Q0NRX88J"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore and get references to the services
const auth = getAuth(app);
const db = getFirestore(app); // db هو اختصار لقاعدة البيانات (database)

// قم بتصدير الخدمات التي ستحتاجها في باقي التطبيق
export { auth, db };