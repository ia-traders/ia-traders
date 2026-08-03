// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
export { app, db };
