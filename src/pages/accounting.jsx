import React, { useEffect, useState } from "react";

// library
import {
    useLocation
} from "react-router-dom"
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

// components
import Report from "./components/report.jsx"

export default (props) => {

    // the below stuff are for the summary
    // get the list of months to be included in summary
    const d = new Date()
    const currentMonth = d.getMonth() + 1  // + 1 because getMonth() return int 0-11 so dec is 11 so + 1
    let listOfMonthsToSummary = []
    const getListOfMonthsToSummary = (givenCurrentMonth) => {
        for (let i = 0; i < 5; i++) {
            listOfMonthsToSummary.push(givenCurrentMonth)
            givenCurrentMonth--
            // if == 0 means it is dec
            if (givenCurrentMonth == 0) {
                givenCurrentMonth = 12
            }
        }
    }
    getListOfMonthsToSummary(currentMonth)
    // get the actual data of the five months
    const [dataOfMonthsToSummary, setDataOfMonthsToSummary] = useState([0, 0, 0, 0, 0])


    const location = useLocation().pathname
    const currentAccountingName = location.split("/")[2]
    
    const userId = window.localStorage.getItem("uid")
    const databaseLocation = "users_stuff/" + userId + "/" + currentAccountingName
    
    const [type, setType] = useState("i")            // set if amount is income (i) or expenses (e)
    
    const [date, setDate] = useState("")             // String
    const [stuff, setStuff] = useState("")           // String
    const [amount, setAmount] = useState(0)          // Number
    const [forWhat, setForWhat] = useState("")       // String: types: Education...
    const [dateRecorded, setDateRecorded] = useState() // for edit function

    // split date into year month day
    const tempDateArr = date.split("-")
    const year = tempDateArr[0]
    const month = tempDateArr[1]
    const day = tempDateArr[2]

    /**
     * write stuff
     * 
     * @returns Error if input is invalid
     */
    const writeStuff = () => {
        if (Number.isNaN(parseFloat(amount))) { // make sure amount is a number
            return (
                alert("Error: Amount must be a positive integer!")
            )
        } else if (date !== "" && stuff !== "" && amount !== 0) {
            addDoc(collection(props.db, databaseLocation), {
                date: date,
                dateTimestamp: Timestamp.fromDate(new Date(year, month - 1, day)),
                stuff: stuff,
                amount: type=="i"?parseFloat(amount):-parseFloat(amount), // positive for i (income), negative for e (expenses)
                type: forWhat,
                dateRecorded: serverTimestamp()
            })
    
            // reset to default
            setDate("")
            setStuff("")
            setAmount(0)
            setForWhat("")
        } else {
            return (
                alert("Error: Field cannot be empty!")
            )
        }
    }

    /**
     * edit stuff
     * 
     */
    const [editWindow, setEditWindow] = useState(false)
    const [currentEditStuffId, setCurrentEditStuffId] = useState("")

    const editStuff = () => {
        if (date !== "" && stuff !== "" && amount !== 0) {
            setDoc(doc(props.db, databaseLocation, currentEditStuffId), {
                date: date,
                dateTimestamp: Timestamp.fromDate(new Date(year, month - 1, day)),
                stuff: stuff,
                amount: type=="i"?parseFloat(amount):-parseFloat(amount),
                type: forWhat,
                dateRecorded: dateRecorded
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

    // for only getting one doc
    // const unsubscribe = onSnapshot(doc(props.db, "users_stuff/RPOpC81pnGfjWcU0kRRUsyrfEU12/chase", "WJRatHWgPfo6vL51JQ4y"), (doc) => {
    //     console.log("Current data: ", doc.data())
    // })

    /**
     * read stuff: for getting multiple doc in a collection
     * 
     */
    const [docs, setDocs] = useState([])
    const [num, setNum] = useState(0)
    useEffect(() => {
        setTimeout(() => {
            const q = query(collection(props.db, databaseLocation), orderBy("dateTimestamp", "desc"))  // desc and asc
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const tempDocs = []
                querySnapshot.forEach((doc) => {
                    const tempObj = {
                        docId: doc.id,
                        date: doc.data().date,
                        stuff: doc.data().stuff,
                        amount: doc.data().amount,
                        type: doc.data().type,
                        dateRecorded: doc.data().dateRecorded
                    }
                    tempDocs.push(tempObj)
                    
                    // if the month of the doc we are currently reading is in the list of months to be in the summary
                    const monthOfTheDocCurrentlyReading = parseInt(doc.data().date.split("-")[1])
                    setSummaryData(monthOfTheDocCurrentlyReading, doc.data().amount)
                    
                })
                
                setDocs(tempDocs)
            })
        }, 100);
    }, [currentAccountingName])
    
    /**
     * delete stuff
     * @param {*} docId 
     */
    const deleteStuff = (docId) => {
        deleteDoc(doc(props.db, databaseLocation, docId))
    }

    let data = [0, 0, 0, 0, 0]
    const setSummaryData = (monthOfTheDocCurrentlyReading, amount) => {
        // if the month of the doc we are currently reading is in the list of months to be in the summary
        // stupidest code i ever written
        if (listOfMonthsToSummary.includes(monthOfTheDocCurrentlyReading)) {
            if (monthOfTheDocCurrentlyReading == listOfMonthsToSummary[0]) {
                // meaning current doc month is also current month
                data[0] += amount
            } else if (monthOfTheDocCurrentlyReading == listOfMonthsToSummary[1]) {
                // meaning current doc month is last month
                data[1] += amount
            } else if (monthOfTheDocCurrentlyReading == listOfMonthsToSummary[2]) {
                // meaning current doc month is last last month
                data[2] += amount
            } else if (monthOfTheDocCurrentlyReading == listOfMonthsToSummary[3]) {
                // meaning current doc month is last month
                data[3] += amount
            } else if (monthOfTheDocCurrentlyReading == listOfMonthsToSummary[4]) {
                // meaning current doc month is last month
                data[4] += amount
            }
        }
        setDataOfMonthsToSummary(data)
    }


    return (
        <div>
            {
                props.signedIn ?
                    <div>
                        <h3>{currentAccountingName}</h3>

                        <form>
                            Date: <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                            &nbsp; {/*space*/}
                            Stuff: <input value={stuff} onChange={(e) => setStuff(e.target.value)} />
                            &nbsp; {/*space*/}
                            Amount: <input value={amount} onChange={(e) => setAmount(e.target.value)} />
                            &nbsp; {/*space*/}

                            <br />

                            <input type="radio" name="type" onChange={() => setType("i")} />Income
                            <br />
                            <input type="radio" name="type" onChange={() => setType("e")} />Expenses

                            <br />

                            {
                                type === "i" ?
                                <div>Please choose:&nbsp;
                                    <select value={forWhat} onChange={(e) => setForWhat(e.target.value)}>
                                        <option value=""></option>
                                        <option value="Salary">Salary</option>
                                        <option value="Other Income">Other Income</option>
                                    </select>
                                </div>
                                :
                                <div>Please choose:&nbsp;
                                    <select value={forWhat} onChange={(e) => setForWhat(e.target.value)}>
                                        <option value=""></option>
                                        <option value="Education">Education</option>
                                        <option value="Groceries">Groceries</option>
                                        <option value="Food">Food</option>
                                        <option value="Entertainment">Entertainment</option>
                                        <option value="Other Expenses">Other Expenses</option>
                                    </select>
                                </div>
                            }

                            <br />

                            <button onClick={(e) => {writeStuff(); e.preventDefault()}}>Submit</button>
                        </form>

                        <br />

                        {
                            editWindow ?
                            <form>
                                <h4>Edit:</h4>
                                Date: <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                                &nbsp; {/*space*/}
                                Stuff: <input value={stuff} onChange={(e) => setStuff(e.target.value)} />
                                &nbsp; {/*space*/}
                                Amount: <input value={amount} onChange={(e) => setAmount(e.target.value)} />
                                &nbsp; {/*space*/}

                                <br />

                                <input type="radio" name="type" onChange={() => setType("i")} />Income
                                <br />
                                <input type="radio" name="type" onChange={() => setType("e")} />Expenses

                                <br />

                                {
                                    type === "i" ?
                                    <div>Please choose:&nbsp;
                                        <select value={forWhat} onChange={(e) => setForWhat(e.target.value)}>
                                            <option value=""></option>
                                            <option value="Salary">Salary</option>
                                            <option value="Other Income">Other Income</option>
                                        </select>
                                    </div>
                                    :
                                    <div>Please choose:&nbsp;
                                        <select value={forWhat} onChange={(e) => setForWhat(e.target.value)}>
                                            <option value=""></option>
                                            <option value="Education">Education</option>
                                            <option value="Groceries">Groceries</option>
                                            <option value="Food">Food</option>
                                            <option value="Entertainment">Entertainment</option>
                                            <option value="Other Expenses">Other Expenses</option>
                                        </select>
                                    </div>
                                }

                                <br />

                                <button onClick={(e) => {editStuff(); e.preventDefault()}}>Submit</button>
                                &nbsp; {/*space*/}
                                <button onClick={() => setEditWindow(false)}>Cancel</button>
                            </form>
                            :
                            <div>
                            </div>
                        }

                        <Report dataOfMonthsToSummary={dataOfMonthsToSummary} />

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
                                                setDateRecorded(oneDoc.dateRecorded)
                                                
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
                    </div>
            }
        </div>
    )
}