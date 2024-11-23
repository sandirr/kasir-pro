import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDi5dO-2tqx9ZF8zH9-fk1viZo9El3sZec",
  authDomain: "kasir-profesional.firebaseapp.com",
  projectId: "kasir-profesional",
  storageBucket: "kasir-profesional.firebasestorage.app",
  messagingSenderId: "820317341107",
  appId: "1:820317341107:web:34d00cb1225e48907977c6",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore };
