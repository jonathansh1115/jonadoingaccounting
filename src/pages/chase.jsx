import React, { useEffect, useState } from "react";

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
    deleteDoc,
    serverTimestamp
} from 'firebase/firestore';

export default (props) => {

    const userId = window.localStorage.getItem("uid")
    const databaseLocation = "users_stuff/" + userId + "/mychase"
    
    const [date, setDate] = useState("")             // String
    const [stuff, setStuff] = useState("")           // String
    const [amount, setAmount] = useState(0)          // Number
    const [forWhat, setForWhat] = useState("s")      // c = for college; s = for spending (default)

    // write stuff
    const writeStuff = () => {
        if (date !== "" && stuff !== "" && amount !== 0) {
            addDoc(collection(props.db, databaseLocation), {
                date: date,
                stuff: stuff,
                amount: parseFloat(amount),
                type: forWhat,
                dateRecorded: serverTimestamp()
            })
    
            // reset to default
            setDate("")
            setStuff("")
            setAmount(0)
            setForWhat("s")
        } else {
            return (
                alert("Error: Field cannot be empty!")
            )
        }
    }


    // for only getting one doc
    // const unsubscribe = onSnapshot(doc(props.db, "users_stuff/RPOpC81pnGfjWcU0kRRUsyrfEU12/chase", "WJRatHWgPfo6vL51JQ4y"), (doc) => {
    //     console.log("Current data: ", doc.data())
    // })

    // read stuff: for getting multiple doc in a collection
    const [docs, setDocs] = useState([])

    useEffect(() => { // use useEffect to prevent infinite re-render
        // const q = query(collection(props.db, "chase"), orderBy("date", "desc"))  // desc and asc
        const q = query(collection(props.db, databaseLocation), orderBy("date", "desc"))  // desc and asc
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const tempDocs = []
            querySnapshot.forEach((doc) => {
                const tempObj = {
                    docId: doc.id,
                    date: doc.data().date,
                    stuff: doc.data().stuff,
                    amount: doc.data().amount,
                    type: doc.data().type,
                }
                tempDocs.push(tempObj)
            })
            
            setDocs(tempDocs)
    
        })
    }, [])

    
    // edit stuff
    const [editWindow, setEditWindow] = useState(false)
    const [currentEditStuffId, setCurrentEditStuffId] = useState("")

    const editStuff = () => {
        if (date !== "" && stuff !== "" && amount !== 0) {
            setDoc(doc(props.db, databaseLocation, currentEditStuffId), {
                date: date,
                stuff: stuff,
                amount: parseFloat(amount),
                type: forWhat,
            })
    
            // reset to default
            setDate("")
            setStuff("")
            setAmount(0)
            setForWhat("s")
            setCurrentEditStuffId("")

            setEditWindow(false)
        } else {
            return (
                alert("Error: Field cannot be empty!")
            )
        }
    }
    

    // delete stuff
    const deleteStuff = (docId) => {
        deleteDoc(doc(props.db, databaseLocation, docId))
    }

    return (
        <div>
            {
                props.signedIn ?
                    <div>
                        <h3>Jona Chase</h3>

                        <form>
                            Date: <input value={date} onChange={(e) => setDate(e.target.value)} />
                            &nbsp; {/*space*/}
                            Stuff: <input value={stuff} onChange={(e) => setStuff(e.target.value)} />
                            &nbsp; {/*space*/}
                            Amount: <input value={amount} onChange={(e) => setAmount(e.target.value)} />
                            &nbsp; {/*space*/}

                            <br />

                            <input type="radio" name="type" onChange={() => setForWhat("c")} />For College
                            <br />
                            <input type="radio" name="type" onChange={() => setForWhat("s")} />For Spending

                            <br />

                            <button onClick={(e) => {writeStuff(); e.preventDefault()}}>Submit</button>
                        </form>

                        <br />

                        {
                            editWindow ?
                            <form>
                                <h4>Edit:</h4>
                                Date: <input value={date} onChange={(e) => setDate(e.target.value)} />
                                &nbsp; {/*space*/}
                                Stuff: <input value={stuff} onChange={(e) => setStuff(e.target.value)} />
                                &nbsp; {/*space*/}
                                Amount: <input value={amount} onChange={(e) => setAmount(e.target.value)} />
                                &nbsp; {/*space*/}

                                <br />

                                <input type="radio" name="type" onChange={() => setForWhat("c")} />For College
                                <br />
                                <input type="radio" name="type" onChange={() => setForWhat("s")} />For Spending

                                <br />

                                <button onClick={(e) => {editStuff(); e.preventDefault()}}>Submit</button>
                                &nbsp; {/*space*/}
                                <button onClick={() => setEditWindow(false)}>Cancel</button>
                            </form>
                            :
                            <div>
                            </div>
                        }

                        <br />

                        <table><tbody>
                            <tr>
                                <th>Date</th>
                                <th>Stuff</th>
                                <th>Amount</th>
                                <th>Type</th>
                            </tr>

                            {
                                docs.map((oneDoc) => 
                                    <tr key={oneDoc.docId}>{/* i really dunno the point of key but for the sake of no more warning in console i put it there for now */}
                                        <td key={oneDoc.docId}>{oneDoc.date}</td>
                                        <td>{oneDoc.stuff}</td>
                                        <td>{oneDoc.amount}</td>
                                        <td>{oneDoc.type}</td>

                                        <td>
                                            <button onClick={() => {
                                                setDate(oneDoc.date)
                                                setStuff(oneDoc.stuff)
                                                setAmount(oneDoc.amount)
                                                setForWhat(oneDoc.type)
                                                
                                                setCurrentEditStuffId(oneDoc.docId)
                                                
                                                setEditWindow(true)
                                            }}>Edit</button>
                                            &nbsp; {/*space*/}
                                            <button onClick={() => deleteStuff(oneDoc.docId)}>Delete</button>
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody></table>
                        
                    </div>
                    :
                    <div>
                        <br />
                        <img src="https://media.giphy.com/media/YOkrK8agZLEk2cXeLi/giphy.gif" />
                        <br />
                        <h4>pls sign in</h4>
                    </div>
            }
        </div>
    )
}