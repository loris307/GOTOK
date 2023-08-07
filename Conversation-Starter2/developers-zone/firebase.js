// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFunctions } from 'firebase/functions';


const firebaseConfig = {
  apiKey: "AIzaSyBI31bSzoMaTD8s6Ed_ss932NyXZQArkR0",
  authDomain: "gotok-ad170.firebaseapp.com",
  projectId: "gotok-ad170",
  storageBucket: "gotok-ad170.appspot.com",
  messagingSenderId: "664033849661",
  appId: "1:664033849661:web:3fd7bc4201d526c87a1554",
  measurementId: "G-Y2NDV4DR7E"
};

const app = initializeApp(firebaseConfig);


const auth = getAuth(app);
const functions = getFunctions(app);


export { auth, functions };

