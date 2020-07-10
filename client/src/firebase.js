import firebase from 'firebase'

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAoCGlt16kV6-q1KPUcvfwjjPgwGo_ioN0",
    authDomain: "istagram-clone.firebaseapp.com",
    databaseURL: "https://istagram-clone.firebaseio.com",
    projectId: "istagram-clone",
    storageBucket: "istagram-clone.appspot.com",
    messagingSenderId: "834939347524",
    appId: "1:834939347524:web:966a0694341760b1491211"
})

const db = firebaseApp.firestore()
const auth = firebase.auth()
const storage = firebase.storage()

export {db, auth, storage}