// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// const firebaseConfig = {
//   apiKey: "AIzaSyBOCWlIhe-1WLOm4A26QP3HpZ6-qWr0l-o",
//   authDomain: "test-yodhaa.firebaseapp.com",
//   projectId: "test-yodhaa",
//   storageBucket: "test-yodhaa.appspot.com",
//   messagingSenderId: "639891776396",
//   appId: "1:639891776396:web:c42706e6c23e42583beca9"
// };

const firebaseConfig = {
  apiKey: "AIzaSyB4AEEI215rFjys0gJaelaF-WTyGpJkhNE",
  authDomain: "test-yodha-01.firebaseapp.com",
  projectId: "test-yodha-01",
  storageBucket: "test-yodha-01.firebasestorage.app",
  messagingSenderId: "73266695919",
  appId: "1:73266695919:web:c1549231a631bbcf39d51a",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
