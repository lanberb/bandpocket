import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

if (!firebase.apps.length) {
  firebase.initializeApp(
    {
        apiKey: "AIzaSyBEdsRA8YDQqcPhhwmtYRqnzh6jOCY8YPk",
        authDomain: "band-pocket-398e1.firebaseapp.com",
        projectId: "band-pocket-398e1",
        storageBucket: "band-pocket-398e1.appspot.com",
        messagingSenderId: "195446915784",
        appId: "1:195446915784:web:e430f1742fae294f43dbfd",
        measurementId: "G-B3LEXVPDHM"
    }
  );
}

firebase.auth().languageCode = 'jp';
export default firebase;