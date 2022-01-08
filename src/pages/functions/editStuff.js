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

const editStuff = (db, databaseLocation, amount, type, date, stuff, currentEditStuffId, forWhat, dateRecorded) => {
    // split date into year month day
    const tempDateArr = date.split("-")
    const year = tempDateArr[0]
    const month = tempDateArr[1]
    const day = tempDateArr[2]

    // make sure amount sign is correct, ie positive for income and negative for expenses
    let tempAmount = amount
    if (type === "i") {
        if (tempAmount < 0) {
            tempAmount = -tempAmount
        }
    } else if (type === "e") {
        if (tempAmount > 0) {
            tempAmount = -tempAmount
        }
    }

    // the actual edit function
    if (date !== "" && stuff !== "" && amount !== 0) {
        setDoc(doc(db, databaseLocation, currentEditStuffId), {
            date: date,
            dateTimestamp: Timestamp.fromDate(new Date(year, month - 1, day)),
            stuff: stuff,
            amount: parseFloat(tempAmount),
            type: forWhat,
            dateRecorded: dateRecorded
        })
    } else {
        return (
            alert("Error: Field cannot be empty!")
        )
    }
}

export default editStuff;