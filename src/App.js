import React, { useState } from 'react';
import './App.css';

// library
import { Route } from "react-router-dom"
import { initializeApp } from "firebase/app"
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  setPersistence,
  browserLocalPersistence,
  getUser
} from "firebase/auth";
import {
  getFirestore,
  doc,
  onSnapshot,
  connectFirestoreEmulator,
  limit,
  query,
  setDoc,
  collection,
  getDocs,
  addDoc,
  Timestamp,
  orderBy,
  deleteDoc,
  firestore,
  serverTimestamp
} from "firebase/firestore"
import {
  Button,
  Input,
  InputGroupText,
  InputGroup,
  Table
} from "reactstrap"
import 'bootstrap/dist/css/bootstrap.min.css'

// components
import Menu from "./components/menu.jsx"

// pages
import Home from "./pages/home.jsx"
import Accounting from "./pages/accounting.jsx"
import Portfolio from "./pages/portfolio.jsx"
import TwoInOne from "./pages/twoinone.jsx"
import Settings from "./pages/settings.jsx"
import JonaChase from "./pages/chase.jsx"

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDw1CQSGpqBHS-zJaFeBo6wNiDMJXokDc0",
  authDomain: "jonadoingaccounting.firebaseapp.com",
  projectId: "jonadoingaccounting",
  storageBucket: "jonadoingaccounting.appspot.com",
  messagingSenderId: "874461501894",
  appId: "1:874461501894:web:b39f11bb60a1eafab8bac7",
  measurementId: "G-9C6H62W8E8"
};
const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider()
const auth = getAuth()
setPersistence(auth, browserLocalPersistence)

// Initialize Firestore
const db = getFirestore(app);

// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
function App() {

  const [name, setName] = useState("")
  const [userId, setUserId] = useState("")
  const [newUser, setNewUser] = useState(false)

  /**
   * add new user function
   * 
   * @param {*} userId 
   * @param {*} email 
   */
  const addNewUser = (userId, email) => {
    // create new doc in users_stuff collection
    setDoc(doc(db, "users_stuff", userId), {
      uid: userId,
      email: email,
      userRegTime: serverTimestamp(),
      collections: []
    })
    setNewUser(true)
  }

  /**
   * sign in function
   * 
   */
  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        setName(user.displayName)
        setUserId(user.uid)

        // check where user exists in databse, if no then create new profile, by reading from "users" collection
        const unsubscribe = onSnapshot(doc(db, "users_stuff/" + user.uid), (doc) => {
          if (doc.data() == undefined) {
            // create new account ie create new doc in "users" collection
            addNewUser(user.uid, user.email)
          } else {
            // user already exists!
          }
        })
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
      });
  }

  /**
   * Sign out function
   * 
   */
  const signOutWithGoogle = () => {
    signOut(auth)
    window.localStorage.removeItem("uid")
  }

  /**
   * Control sign in sign out status function
   * 
   */
  const [signedIn, setSignedIn] = useState(false)
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // Signed in
      setSignedIn(true)
    } else {
      // Not Signed in
      setSignedIn(false)
    }
  })

  /**
   * Constantly make sure displayName and userId is working
   * 
   */
  if (signedIn) {
    setTimeout(() => {
      setName(auth.currentUser.displayName)
      // console.log(auth.currentUser.uid)
      setUserId(auth.currentUser.uid)
      window.localStorage.setItem("uid", auth.currentUser.uid)  // I dont think this is a very good idea
      // console.log(auth.currentUser.displayName)
    }, 100);
  }

  // START OF APP >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  return (
    <div className="container-fluid">
      <div className="row h-100">
        {/* Sidebar */}
        <div className="col-md-2">
          <Route path="/">
            <Menu signedIn={signedIn} db={db} auth={auth} userId={userId} />
          </Route>
        </div>
        
        {/* All the other stuff */}
        <div className="col-md-2">
          <Route exact path="/">
            <Home name={name}
              signedIn={signedIn}
              signInWithGoogle={signInWithGoogle}
              signOutWithGoogle={signOutWithGoogle}
              newUser={newUser} />
          </Route>

          <Route path="/accounting/:accountingName">
            <Accounting signedIn={signedIn} db={db} />
          </Route>

          <Route path="/twoinone/:twoinoneName">
            <TwoInOne signedIn={signedIn} db={db} />
          </Route>

          <Route path="/portfolio/:portfolioName">
            <Portfolio signedIn={signedIn} db={db} />
          </Route>

          <Route path="/settings">
            <Settings signedIn={signedIn} db={db} auth={auth} />
          </Route>

          <Route exact path="/jonachase">
            <JonaChase signedIn={signedIn} db={db} />
          </Route>
        </div>
      </div>

      

      

    </div>
  )
}

export default App;
