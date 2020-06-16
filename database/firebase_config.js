import firebase from 'firebase';
import 'firebase/firestore';

let firebaseConfig = {
  apiKey: "AIzaSyACkdYnRVdMYXpaytQ6KKyeJQeamDB5VCA",
  authDomain: "sampledatabase-2c030.firebaseapp.com",
  databaseURL: "https://sampledatabase-2c030.firebaseio.com",
  projectId: "sampledatabase-2c030",
  storageBucket: "sampledatabase-2c030.appspot.com",
  messagingSenderId: "809542294609",
  appId: "1:809542294609:web:8eb00ba8a9532225342c70"
};

// Initialize Firebase
const Firebase = firebase.initializeApp(firebaseConfig)

export const db = firebase.firestore();

export default Firebase;