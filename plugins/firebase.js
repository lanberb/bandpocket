import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
if (!firebase.apps.length) {
    firebase.initializeApp({
        apiKey: process.env.FIREBASE_ApiKey,
        authDomain: process.env.FIREBASE_AuthDomain,
        projectId: process.env.FIREBASE_ProjectID,
        storageBucket: process.env.FIREBASE_StorageBucket,
        messagingSenderId: process.env.FIREBASE_MessagingSenderID,
        appId: process.env.FIREBASE_AppID,
        measurementId: process.env.FIREBASE_MeasurementID
    })
};
firebase.auth().languageCode = 'jp';
export default firebase;