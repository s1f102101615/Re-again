import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBhjbJsXG_u4bCy3pFqRIgreYU_aNG_2uM",
    authDomain: "re-again-b7bb2.firebaseapp.com",
    projectId: "re-again-b7bb2",
    storageBucket: "re-again-b7bb2.appspot.com",
    messagingSenderId: "1096224012505",
    appId: "1:1096224012505:web:5b3338ddf3e4f36e1d26c8"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  export const auth = getAuth(app);