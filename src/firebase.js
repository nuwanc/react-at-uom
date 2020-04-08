import firebase from "firebase";
import "firebase/firestore";

// Initialize Firebase
const config = {
    apiKey: "",
    authDomain: "react-at-uom.firebaseapp.com",
    databaseURL: "https://react-at-uom.firebaseio.com",
    projectId: "react-at-uom",
    storageBucket: "react-at-uom.appspot.com",
    messagingSenderId: "236579430153"
};
firebase.initializeApp(config);
let db = firebase.firestore();
let storage = firebase.storage();

export {db,storage};
