import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebase from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyBhjbJsXG_u4bCy3pFqRIgreYU_aNG_2uM",
  authDomain: "re-again-b7bb2.firebaseapp.com",
  projectId: "re-again-b7bb2",
  //使用量を抑えるために停止語尾のmを削除
  storageBucket: "re-again-b7bb2.appspot.co",
  messagingSenderId: "1096224012505",
  appId: "1:1096224012505:web:5b3338ddf3e4f36e1d26c8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { auth, firestore, storage,firebase };