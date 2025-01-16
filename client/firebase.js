// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAJg5IooJE-d8r7ihvE3NSRE8kCbBBE7Us",
  authDomain: "mypro-ad713.firebaseapp.com",
  projectId: "mypro-ad713",
  storageBucket: "mypro-ad713.appspot.com",
  messagingSenderId: "391615459733",
  appId: "1:391615459733:web:f1d2ef7ff41cb999bd469c",
  measurementId: "G-4VEHG17JR4"
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage
const storage = getStorage(app);

export { storage, ref, uploadBytes, getDownloadURL};


