import React, { useEffect, useState } from "react";
import "./css/accounting.css"

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
} from 'firebase/firestore';               // TODO remove unused imports
import {
    Navbar,
    Button,
    Input,
    InputGroupText,
    InputGroup,
    Table,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ButtonDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from "reactstrap"

// components
import Title from "./components/title.jsx"
import Report from "./components/twoinoneReport.jsx"

// functions
import writeStuff from "./functions/writeStuff.js"
import editStuff  from "./functions/editStuff.js"
import deleteStuff  from "./functions/deleteStuff.js"

// src
import editIcon from "./src/edit.png"
import deleteIcon from "./src/delete.png"
import optionsIcon from "./src/options.png"

import * as XLSX from "xlsx";

export default (props) => {

    const [items, setItems] = useState([]);

  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((d) => {
      setItems(d);
    });
  };
//   console.log(items)

  const enterData = () => {
    for (let i = 0; i < items.length; ++i) {
        let aTime = Date.parse("1899-12-31")
        let bTime = new Date(aTime + items[i].Date * 86400000)
        let ss = bTime.toLocaleString()
        let result = ss.split(",")
        result = result[0]
        let jona = result.split("/")
        let than = jona[2] + "-" + jona[0] + "-" + jona[1]
        console.log(than)

        let la = items[i].Stuff
        if (la[la.length - 1] === "#") {
            la = la.substring(0, la.length - 1)
        }
        console.log(la)
        
        
        let aaa = 0
        if (items[i].In === undefined) {
            aaa = -items[i].Out
        } else if (items[i].Out === undefined) {
            aaa = items[i].In
        }
        console.log(aaa)
        let tempttemp = aaa<0?-aaa:aaa

        let forwat = ""
        let typeee = ""
        if (aaa > 0) {
            // income
            if (items[i].Stuff[items[i].Stuff.length - 1] === "#") {
                // for college
                console.log("type: iFor college")
                forwat = "iFor college"
                typeee = "i"
            } else {
                // for spending
                console.log("type: iFor spending")
                forwat = "iFor spending"
                typeee = "i"
            }
        } else {
            // expenses
            if (items[i].Stuff[items[i].Stuff.length - 1] === "#") {
                // for college
                console.log("type: eFor college")
                forwat = "eFor college"
                typeee = "e"
            } else {
                // for spending
                console.log("type: eFor spending")
                forwat = "eFor spending"
                typeee = "e"
            }
        }
        
        exWriteStuff(tempttemp, than, la, typeee, forwat)
        
    }
  }
    
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
    const [past5MonthsIncomes, setPast5MonthsIncomes] = useState([0, 0, 0, 0, 0])
    const [past5MonthsExpenses, setPast5MonthsExpenses] = useState([0, 0, 0, 0, 0])


    const location = useLocation().pathname
    const currentAccountingName = location.split("/")[2]
    
    const userId = window.localStorage.getItem("uid")
    const databaseLocation = "users_stuff/" + userId + "/" + "t" + currentAccountingName
    
    const [type, setType] = useState("i")            // set if amount is income (i) or expenses (e)
    
    const [date, setDate] = useState("")             // String
    const [stuff, setStuff] = useState("")           // String
    const [amount, setAmount] = useState(0)          // Number
    const [forWhat, setForWhat] = useState("")       // String: types: Education...
    const [dateRecorded, setDateRecorded] = useState() // for edit function

    /**
     * Execute the writeStuff() function
     */
    const exWriteStuff = (amount, date, stuff, type, forWhat) => {
        writeStuff(props.db, databaseLocation, amount, date, stuff, type, forWhat)

        // Reset state to default
        setDate("")
        setStuff("")
        setAmount(0)
        setForWhat("")
    }

    /**
     * Execute the editStuff() function
     * 
     */
    const [editWindow, setEditWindow] = useState(false)
    const [currentEditStuffId, setCurrentEditStuffId] = useState("")

    const exEditStuff = () => {
        editStuff(props.db, databaseLocation, amount, type, date, stuff, currentEditStuffId, forWhat, dateRecorded)

        // reset to default
        setDate("")
        setStuff("")
        setAmount(0)
        setForWhat("s")
        setCurrentEditStuffId("")

        // Close edit modal
        setEditWindow(false)
    }
    
    /**
     * Execute the deteleStuff() function
     * 
     * @param {*} docId 
     */    
    const exDeleteStuff = (docId) => {
        deleteStuff(props.db, databaseLocation, docId)

        // reset
        setStuff("")
        setDocId("")
        setDeleteModal(false)
    }

    /**
     * For only getting one doc.
     *
     * 
     */
    // const unsubscribe = onSnapshot(doc(props.db, "users_stuff/RPOpC81pnGfjWcU0kRRUsyrfEU12/chase", "WJRatHWgPfo6vL51JQ4y"), (doc) => {
    //     console.log("Current data: ", doc.data())
    // })

    /**
     * read stuff: for getting multiple doc in a collection
     * 
     */
     const [docs, setDocs] = useState([])
     useEffect(() => {
         setTimeout(() => {
             const q = query(collection(props.db, databaseLocation), orderBy("dateTimestamp", "desc"))  // desc and asc
             const unsubscribe = onSnapshot(q, (querySnapshot) => {
                 const tempDocs = []
                 querySnapshot.forEach((doc) => {
                     const type = doc.data().type
                     const tempObj = {
                         docId: doc.id,
                         date: doc.data().date,
                         stuff: doc.data().stuff,
                         amount: doc.data().amount,
                         type: type,
                         dateRecorded: doc.data().dateRecorded
                     }
                     tempDocs.push(tempObj)
                     
                     // if the month of the doc we are currently reading is in the list of months to be in the summary
                     const monthOfTheDocCurrentlyReading = parseInt(doc.data().date.split("-")[1])
                     setSummaryData(monthOfTheDocCurrentlyReading, doc.data().amount, doc.data().type[0])
                     getAccBalance(doc.data().amount, type)
                     
                 })
                 
                 setDocs(tempDocs)
             })
         }, 100);
     }, [currentAccountingName])
    
    /**
     * Collect data for summary.
     * 
     */
    let incomes = [0, 0, 0, 0, 0]
    let expenses = [0, 0, 0, 0, 0]
    const setSummaryData = (monthOfTheDocCurrentlyReading, amount, type) => {
        // if the month of the doc we are currently reading is in the list of months to be in the summary
        if (listOfMonthsToSummary.includes(monthOfTheDocCurrentlyReading)) {
            for (let i = 0; i < 5; ++i) {
                if (monthOfTheDocCurrentlyReading == listOfMonthsToSummary[i]) {
                    // meaning current doc month is also current month
                    if (type === "i") {
                        incomes[i] += amount
                    } else if (type === "e") {
                        expenses[i] += amount
                    }
                }
            }
        }
        setPast5MonthsIncomes(incomes)
        setPast5MonthsExpenses(expenses)
    }

    /**
     * Get account balance.
     * 
     */
    const [accBalance, setAccBalance]= useState(0)
    const [collegeBalance, setCollegeBalance]= useState(0)
    const [spendingBalance, setSpendingBalance]= useState(0)
    let accBalanceVar = 0
    let collegeBalanceVar = 0
    let spendingBalanceVar = 0
    const getAccBalance = (amount, type) => {
        accBalanceVar += amount

        if (type.substring(1, type.length) === "For college") {
            // console.log(collegeBalanceVar)
            collegeBalanceVar += amount
        } else if (type.substring(1, type.length) === "For spending") {
            // console.log(spendingBalanceVar)
            spendingBalanceVar += amount
        }
        
        setAccBalance(accBalanceVar)
        setCollegeBalance(collegeBalanceVar)
        setSpendingBalance(spendingBalanceVar)
    }
    
    /**
     * Delete item modal
     * 
     */
    const [deleteModal, setDeleteModal] = useState(false)
    const [docId, setDocId] = useState("")

    return (
        <div>
<input
        type="file"
        onChange={(e) => {
          const file = e.target.files[0];
          readExcel(file);
        }}
      />
      <button onClick={() => enterData()}>hi</button>
            {
                props.signedIn ?
                    <div>
                        <Title name={currentAccountingName} />

                        <Report
                            listOfPast5Months={listOfMonthsToSummary}
                            past5MonthsIncomes={past5MonthsIncomes}
                            past5MonthsExpenses={past5MonthsExpenses} 
                            accBalance={accBalance}
                            forCollegeBalance={collegeBalance}
                            forSpendingBalance={spendingBalance} />

                        <hr />

                        <div className="container-fluid containers">
                            <div className="row">
{/* FORM COL HEREEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE */}
                                <div className="col-md-4 col-sm-12 col-12">
                                    <form className="form">
                                        <InputGroup className="input">
                                            <InputGroupText>Date</InputGroupText>
                                            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                                        </InputGroup>

                                        <InputGroup className="input">
                                            <InputGroupText>Stuff</InputGroupText>
                                            <Input value={stuff} onChange={(e) => setStuff(e.target.value)} />
                                        </InputGroup>

                                        <InputGroup className="input">
                                            <InputGroupText>Amount</InputGroupText>
                                            <Input value={amount} onChange={(e) => setAmount(e.target.value)} />
                                        </InputGroup>

                                        <InputGroup className="input">
                                            Income&nbsp;<Input type="radio" name="type" value={amount} onChange={() => setType("i")} />
                                        </InputGroup>

                                        <InputGroup className="input">
                                            Expenses&nbsp;<Input type="radio" name="type" value={amount} onChange={() => setType("e")} />
                                        </InputGroup>

                                        {
                                            type === "i" ?
                                            <InputGroup className="input">
                                                <InputGroupText>Please choose</InputGroupText>
                                                <Input type="select" value={forWhat} onChange={(e) => setForWhat(e.target.value)}>
                                                    <option value=""></option>
                                                    <option value="iFor college">For college</option>
                                                    <option value="iFor spending">For spending</option>
                                                </Input>
                                            </InputGroup>
                                            :
                                            <InputGroup className="input">
                                                <InputGroupText>Please choose</InputGroupText>
                                                <Input type="select" value={forWhat} onChange={(e) => setForWhat(e.target.value)}>
                                                    <option value=""></option>
                                                    <option value="eFor college">For college</option>
                                                    <option value="eFor spending">For spending</option>
                                                </Input>
                                            </InputGroup>
                                        }

                                        <Button color="primary" onClick={(e) => {exWriteStuff(); e.preventDefault()}}>Submit</Button>
                                    </form>

                                </div>

                                <Modal centered isOpen={editWindow} toggle={() => setEditWindow(false)}>
                                    <ModalHeader>Edit "{stuff}"</ModalHeader>

                                    <ModalBody>
                                        <InputGroup className="input">
                                            <InputGroupText>Date</InputGroupText>
                                            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                                        </InputGroup>

                                        <InputGroup className="input">
                                            <InputGroupText>Stuff</InputGroupText>
                                            <Input value={stuff} onChange={(e) => setStuff(e.target.value)} />
                                        </InputGroup>

                                        <InputGroup className="input">
                                            <InputGroupText>Amount</InputGroupText>
                                            <Input value={amount} onChange={(e) => setAmount(e.target.value)} />
                                        </InputGroup>

                                        <InputGroup className="input">
                                            Income&nbsp;<Input type="radio" name="type" value={amount} onChange={() => setType("i")} />
                                        </InputGroup>

                                        <InputGroup className="input">
                                            Expenses&nbsp;<Input type="radio" name="type" value={amount} onChange={() => setType("e")} />
                                        </InputGroup>

                                        {
                                            type === "i" ?
                                            <InputGroup className="input">
                                                <InputGroupText>Please choose</InputGroupText>
                                                <Input type="select" value={forWhat} onChange={(e) => setForWhat(e.target.value)}>
                                                    <option value=""></option>
                                                    <option value="iFor college">For college</option>
                                                    <option value="iFor spending">For spending</option>
                                                </Input>
                                            </InputGroup>
                                            :
                                            <InputGroup className="input">
                                                <InputGroupText>Please choose</InputGroupText>
                                                <Input type="select" value={forWhat} onChange={(e) => setForWhat(e.target.value)}>
                                                    <option value=""></option>
                                                    <option value="eFor college">For college</option>
                                                    <option value="eFor spending">For spending</option>
                                                </Input>
                                            </InputGroup>
                                        }
                                    </ModalBody>

                                    <ModalFooter>
                                        <Button color="primary" onClick={(e) => {exEditStuff(); e.preventDefault()}}>Submit</Button>
                                        <Button onClick={() => setEditWindow(false)}>Cancel</Button>
                                    </ModalFooter>
                                </Modal>
                                
{/* TABLE COL HEREEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE */}
                                <div className="col-md-8 col-sm-12 col-12">
                                    <Table>
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Stuff</th>
                                                <th>Amount</th>
                                                <th>Type</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {
                                                docs.map((oneDoc) => 
                                                    <tr key={oneDoc.docId}>{/* i really dunno the point of key but for the sake of no more warning in console i put it there for now */}
                                                        <td key={oneDoc.docId}>{oneDoc.date}</td>
                                                        <td>{oneDoc.stuff}</td>
                                                        <td>{oneDoc.amount}</td>
                                                        <td>{oneDoc.type.substring(1, oneDoc.type.length)}</td>

                                                        <td className="tdForButtons">
                                                            <Button className="btn-sm" outline color="primary" 
                                                                id="editButton"
                                                                onClick={() => {
                                                                    setDate(oneDoc.date)
                                                                    setStuff(oneDoc.stuff)
                                                                    setAmount(oneDoc.amount)
                                                                    setForWhat(oneDoc.type)
                                                                    setDateRecorded(oneDoc.dateRecorded)
                                                                    
                                                                    setCurrentEditStuffId(oneDoc.docId)
                                                                    
                                                                    setEditWindow(true)}
                                                                }
                                                            >
                                                                <img src={editIcon} style={{width: "15px"}} />
                                                            </Button>
                                                            
                                                            {/* <Button className="btn-sm" outline color="danger" 
                                                                onClick={() => deleteStuff(oneDoc.docId)}
                                                            >
                                                                <img src={deleteIcon} style={{width: "15px"}} />
                                                            </Button> */}
                                                            <Button className="btn-sm" outline color="danger" 
                                                                onClick={() => {
                                                                    setDeleteModal(true)
                                                                    setDocId(oneDoc.docId)
                                                                    setStuff(oneDoc.stuff)}
                                                                }
                                                            >
                                                                <img src={deleteIcon} style={{width: "15px"}} />
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                )
                                            }
                                        </tbody>

                                        {/* DELETE MODAL */}
                                        <Modal centered isOpen={deleteModal} toggle={() => setDeleteModal(!deleteModal)}>
                                            <ModalHeader>Delete {stuff}?</ModalHeader>

                                            <ModalFooter>
                                                <Button color="danger" onClick={() => {exDeleteStuff(docId)}}>Delete</Button>
                                                <Button color="primary" onClick={() => setDeleteModal(false)}>Cancel</Button>
                                            </ModalFooter>
                                        </Modal>

                                    </Table>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    :
                    <div>
                        pls sign in
                    </div>
            }
        </div>
    )
}