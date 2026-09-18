import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDril05f5QheB8DMOXK6uP5x7W8XWiDDkM",
  authDomain: "campusbridge-61601.firebaseapp.com",
  projectId: "campusbridge-61601",
  storageBucket: "campusbridge-61601.firebasestorage.app",
  messagingSenderId: "33050438653",
  appId: "1:33050438653:web:928afb9ecf3f10af2a8794"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
