import React from "react";

// library
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
    deleteDoc
} from 'firebase/firestore';

export default (props) => {

    // for only getting one doc
    // const unsubscribe = onSnapshot(doc(props.db, "chase", "HGLNI7XHWt6rRAsXH2Qy"), (doc) => {
    //     console.log("Current data: ", doc.data())
    // })

    return (
        <div>
            {
                props.signedIn ?
                    <div>
                        <h3>Test</h3>
                    </div>
                    :
                    <div>
                        <br />
                        <img src="https://media.giphy.com/media/MgBJ3UifivIY/giphy.gif" />
                        <br />
                        <h4>pls sign in</h4>
                    </div>
            }
        </div>
    )
}