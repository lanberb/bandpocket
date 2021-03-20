import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
if (!firebase.apps.length) {
    firebase.initializeApp({
        apiKey: 'AIzaSyBEdsRA8YDQqcPhhwmtYRqnzh6jOCY8YPk',
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