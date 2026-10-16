// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCIy_ZK0-60PLOSzwPgntkoi7-W8yW38io",
  authDomain: "morning-that-web.firebaseapp.com",
  projectId: "morning-that-web",
  storageBucket: "morning-that-web.firebasestorage.app",
  messagingSenderId: "631381551859",
  appId: "1:631381551859:web:4ec1e7b1602f375c9ba586",
  measurementId: "G-EFTZVNSE8T",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
