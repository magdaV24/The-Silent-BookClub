import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'
import 'firebase/compat/storage'

const firebaseConfig = {
    apiKey: "AIzaSyBFl39b-pnrBEEbIsEtZrcppzxnS2c2MdM",
    authDomain: "thesilentbookclub.firebaseapp.com",
    projectId: "thesilentbookclub",
    storageBucket: "thesilentbookclub.appspot.com",
    messagingSenderId: "451220460527",
    appId: "1:451220460527:web:be90a602fa899f3ed59c1a"
};

//initialize firebase:

firebase.initializeApp(firebaseConfig)

//initialize services:

const projectFirestore = firebase.firestore()
const projectAuth = firebase.auth()
const projectStorage = firebase.storage()

const timestamp = firebase.firestore.Timestamp

export { projectFirestore, projectAuth, projectStorage, timestamp }