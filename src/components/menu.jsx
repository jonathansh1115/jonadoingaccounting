import React, { useState, useEffect } from "react";

// libraries
import { Link } from "react-router-dom"
// library
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
    connectFirestoreEmulator,
    getFirestore,
    limit,
    query,
    setDoc,
    collection,
    getDocs,
    doc,
    addDoc,
    Timestamp,
    onSnapshot,
    orderBy,
    deleteDoc,
    serverTimestamp
} from 'firebase/firestore';

export default (props) => {

    const userId = window.localStorage.getItem("uid")
    const [collections, setCollections] = useState([])

    const [newAccountingForm, setNewAccountingForm] = useState(false)
    const [newAccountingName, setNewAccountingName] = useState("")

    // read all collection of this user
    const databaseLocation = "users_stuff"

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(props.db, databaseLocation, userId == null ? "x" : userId), (doc) => {
            if (doc.data().collections !== undefined) {
                // set collections to be printed out later
                setCollections(doc.data().collections)
            } else {
                // it is undefined, check firestore probably got problem there
            }
        })
    }, [])

    // control sign in sign out status function
    // const [signedIn, setSignedIn] = useState(false)
    // onAuthStateChanged(props.auth, (user) => {
    //     if (user) {
    //         // Signed in
    //         setSignedIn(true)
    //     } else {
    //         // Not Signed in
    //         setSignedIn(false)
    //     }
    // })

    return (
        <div>
            {
                props.signedIn ?
                <div>
                    <Link to="/">Home</Link>
                    &nbsp; {/*space*/}

                    {
                        collections.map((collection) =>
                            <div>
                                <Link to={"/" + collection}>{collection}</Link>
                            </div>
                        )
                    }
                </div>
                :
                <div>
                    
                </div>
            }
        </div>
    )
    
    // return (

    //     <div>

    //         <Link to="/">Home</Link>
    //         &nbsp; {/*space*/}

    //         {
    //             collections.map((collection) =>
    //                 <div>
    //                     <Link to={"/" + collection}>{collection}</Link>
    //                 </div>
    //             )
    //         }

    //         <button onClick={() => setNewAccountingForm(true)}>Create new</button>

    //         {
    //             newAccountingForm ?
    //                 <form>
    //                     New accounting: <input value={newAccountingName} onChange={(e) => setNewAccountingName(e.target.value)} />
    //                     &nbsp; {/*space*/}
    //                     <button onClick={() => { setNewAccountingForm(false) }}>Submit</button>
    //                     &nbsp; {/*space*/}
    //                     <button onClick={() => { setNewAccountingForm(false) }}>Cancel</button>
    //                 </form>
    //                 :
    //                 <div></div>
    //         }

    //     </div>
    // )
}