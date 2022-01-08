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
 * Write stuff
 * 
 * @returns Error if input is invalid
 */
const writeStuff = (db, databaseLocation, amount, date, stuff, type, forWhat) => {
    // split date into year month day
    const tempDateArr = date.split("-")
    const year = tempDateArr[0]
    const month = tempDateArr[1]
    const day = tempDateArr[2]

    if (Number.isNaN(parseFloat(amount))) { // make sure amount is a number
        return (
            alert("Error: Amount must be a positive integer!")
        )
    } else if (date !== "" && stuff !== "" && amount !== 0) {
        addDoc(collection(db, databaseLocation), {
            date: date,
            dateTimestamp: Timestamp.fromDate(new Date(year, month - 1, day)),
            stuff: stuff,
            amount: type=="i"?parseFloat(amount):-parseFloat(amount), // positive for i (income), negative for e (expenses)
            type: forWhat,
            dateRecorded: serverTimestamp()
        })
    } else {
        return (
            alert("Error: Field cannot be empty!")
        )
    }
}

export default writeStuff;