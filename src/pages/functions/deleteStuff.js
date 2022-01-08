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

/**
 * delete stuff
 * @param {*} docId 
 */
const deleteStuff = (db, databaseLocation, docId) => {
    deleteDoc(doc(db, databaseLocation, docId))
}

export default deleteStuff;