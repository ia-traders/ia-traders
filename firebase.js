const firebaseConfig = {
  apiKey: "AIzaSyCztPslObnYjnj7ZqD0kmse6s-_SdOUbAQ",
  authDomain: "ia-traders.firebaseapp.com",
  projectId: "ia-traders",
  storageBucket: "ia-traders.firebasestorage.app",
  messagingSenderId: "366586172551",
  appId: "1:366586172551:web:6acbea9e1bb7d9c2fc9422",
  measurementId: "G-CMP393T3KY"
};

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  addDoc,
  collection,
  serverTimestamp,
  getDocs,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

export {
  app,
  db,
  auth,
  onAuthStateChanged,
  signOut,
  addDoc,
  collection,
  serverTimestamp,
  getDocs,
  doc,
  updateDoc
};
