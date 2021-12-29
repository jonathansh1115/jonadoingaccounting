import React, { useState, useEffect } from "react"

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

    const databaseLocation = "users_stuff"
    const [signedIn, setSignedIn] = useState(false)
    
    // get all docs for nav(menu)
    const [collections, setCollections] = useState([])
    
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

                }) // technically should only run once
    
                setCollections(tempCollection)
            })
            // console.log(signedIn)
        }, 100);
    }, [props.signedIn, signedIn])


    // remove the collection in the "collections" object and delete every doc in 
    // the collection, ie the collection itself isnt deleted
    const deleteStuff = (collectionToBeDeleted) => {
        const indexOfCollectionToBeDeleted = collections.indexOf(collectionToBeDeleted)
        // delete the collection from the collections state
        console.log(collections)
        if (indexOfCollectionToBeDeleted > -1) {
            const tempCollections = collections
            tempCollections.splice(indexOfCollectionToBeDeleted, 1)  // 1 means only one item
            setCollections(tempCollections)
        }
        console.log(collections)
        
        // replace the collection with the exact same collections but without the collection that is being deleted

        
        // delete every doc in the collection

        
    }
    
    return (
        <div>
            <h3>Settings</h3>

            <p>Your accounting documents:</p>
            <br />

            {
                collections.map((collection) =>
                    <div>
                        <p>{collection}</p>
                        <button>Edit name</button>&nbsp;
                        <button onClick={() => deleteStuff(collection)}>Delete</button>&nbsp;
                    </div>
                )
            }
        </div>
    )
}