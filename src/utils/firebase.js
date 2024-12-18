import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  deleteDoc,
  initializeFirestore,
  persistentLocalCache,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { checkInternetConnection } from "./connection";

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
const firestore = initializeFirestore(app, {
  localCache: persistentLocalCache(),
});

const dbPOST = async (ref, values) => {
  const isOnline = await checkInternetConnection();
  const body = {
    ...values,
    created_at: serverTimestamp() || new Date(),
  };
  if (isOnline) {
    return await setDoc(ref, body);
  } else {
    console.warn("operasi offline");
    setDoc(ref, body).catch((err) =>
      console.warn("Error creating offline:", err),
    );
    return Promise.resolve();
  }
};

const dbUPDATE = async (ref, values) => {
  const isOnline = await checkInternetConnection();
  const body = {
    ...values,
    updated_at: serverTimestamp() || new Date(),
  };
  if (isOnline) {
    return await updateDoc(ref, body);
  } else {
    console.warn("operasi offline");
    updateDoc(ref, body).catch((err) =>
      console.warn("Error updating offline:", err),
    );
    return Promise.resolve();
  }
};

const dbDELETE = async (ref) => {
  const isOnline = await checkInternetConnection();
  if (isOnline) {
    return await deleteDoc(ref);
  } else {
    console.warn("operasi offline");
    deleteDoc(ref).catch((err) => console.warn("Error deleting offline:", err));
    return Promise.resolve();
  }
};

export { auth, firestore, dbPOST, dbUPDATE, dbDELETE };
