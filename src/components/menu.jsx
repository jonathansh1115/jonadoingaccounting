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
    serverTimestamp,
    where
} from 'firebase/firestore';

export default (props) => {

    const [newAccountingForm, setNewAccountingForm] = useState(false)
    const [newAccountingName, setNewAccountingName] = useState("")

    const databaseLocation = "users_stuff"

    const [signedIn, setSignedIn] = useState(false)

    onAuthStateChanged(props.auth, (user) => {
        if (user) {
            // Signed in
            setSignedIn(true)
            // setCount(count + 1)
        } else {
            // Not Signed in
            setSignedIn(false)
        }
    })

    // get all docs for nav(menu)
    const [collections, setCollections] = useState([])
    const [currentUserData, setCurrentUserData] = useState([]) // 0: uid; 1: email; 2: userRegTime
    
    useEffect(() => {
        setTimeout(() => {
            const userId = window.localStorage.getItem("uid")
            const q = query(collection(props.db, databaseLocation), where("uid", "==", userId))
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const tempCollection = []
                querySnapshot.forEach((doc) => {
                    const temp = doc.data().collections // an array
                    for (let i = 0; i < temp.length; ++i) {
                        tempCollection.push(temp[i])
                    }

                    // get current user data for createNewCollection() to use
                    const tempCurrentUserData = []
                    tempCurrentUserData.push(doc.data().uid)
                    tempCurrentUserData.push(doc.data().email)
                    tempCurrentUserData.push(doc.data().userRegTime)
                    setCurrentUserData(tempCurrentUserData)
                }) // technically should only run once
    
                setCollections(tempCollection)

            })
            // console.log(signedIn)
        }, 100);
    }, [props.signedIn, signedIn])
    

    //  create new collection (accounting page)
    const createNewCollection = (collectionName) => {
        // add to on screen "collections"(the "collections" state)
        let tempCollection = collections
        tempCollection.push(collectionName)
        setCollections(tempCollection)

        const userIdLOCAL = window.localStorage.getItem("uid")
        
        // replace server "collections" with on screen "collections"(the "collections state")
        setDoc(doc(props.db, "users_stuff", userIdLOCAL), {
            uid: currentUserData[0],
            email: currentUserData[1],
            userRegTime: currentUserData[2],
            collections: collections
        })
        setDoc(doc(props.db, "users_stuff/" +userIdLOCAL + "/" + collectionName, "dummy_doc_pls_ignore"), {
        })
    }

    return (
        <div>
            {
                props.signedIn ?
                    <div>
                        <Link to="/">Home</Link>
                        &nbsp; {/*space*/}
                        <Link to="/settings">Settings</Link>
                        &nbsp; {/*space*/}

                        {
                            collections.map((collection) =>
                                <div>
                                    <Link to={"/accounting/" + collection}>{collection}</Link>
                                </div>
                            )
                        }

                        <button onClick={() => setNewAccountingForm(true)}>Create new</button>

                        {
                            newAccountingForm ?
                                <form>
                                    New accounting: <input value={newAccountingName} onChange={(e) => setNewAccountingName(e.target.value)} />
                                    &nbsp; {/*space*/}
                                    <button onClick={(e) => { e.preventDefault();
                                                              createNewCollection(newAccountingName); 
                                                              setNewAccountingForm(false);
                                                            }}>Submit</button>
                                    &nbsp; {/*space*/}
                                    <button onClick={() => { setNewAccountingForm(false) }}>Cancel</button>
                                </form>
                                :
                                <div></div>
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