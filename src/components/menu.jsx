import React, { useState, useEffect } from "react";
import "./css/menu.css"

// libraries
import { Link } from "react-router-dom"
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
import {
    Button,
    Input,
    InputGroupText,
    InputGroup,
    Table,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Tooltip
} from "reactstrap"

// src
import home from "./icons/home.png"
import settings from "./icons/settings.png"
import createNew from "./icons/createnew.png"
import info from "./icons/info2.png"

export default (props) => {

    const [newTabForm, setNewTabForm] = useState(false)
    const [newTabName, setNewTabName] = useState("")
    const [newTabType, setNewTabType] = useState("") // a: accounting, p: stock portfolio, t: 2-in-1

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

    /**
     * get all docs for nav(menu)
     * 
     */
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
    

    /**
     * Create new collection (accounting page)
     * 
     * @param {*} collectionName - new tab name
     * @param {*} collectionType - new tab type
     */
    const createNewCollection = (collectionName, collectionType) => {
        // add to on screen "collections"(the "collections" state)
        let tempCollection = collections
        tempCollection.push(collectionType + collectionName)
        setCollections(tempCollection)

        const userIdLOCAL = window.localStorage.getItem("uid")
        
        // replace server "collections" with on screen "collections"(the "collections state")
        setDoc(doc(props.db, "users_stuff", userIdLOCAL), {
            uid: currentUserData[0],
            email: currentUserData[1],
            userRegTime: currentUserData[2],
            collections: collections
        })
        setDoc(doc(props.db, "users_stuff/" + userIdLOCAL + "/" + collectionType + collectionName, "dummy_doc_pls_ignore"), {
        })

        // reset newtabname and newtabtype
        setNewTabName("")
        setNewTabType("")
    }

    /**
     * Get the type of page to be inserted in url
     * 
     * @param {*} type 
     * @returns accounting for "a"; portfolio for "p"; twoinone for "t"
     */
    const getType = (type) => {
        if (type === "a") return "accounting"
        if (type === "p") return "portfolio"
        if (type === "t") return "twoinone"
    }
    
    // Info modal
    const [infoModalWindow, setInfoModalWindow] = useState(false)
    
    return (
        <div>
            {
                props.signedIn ?
                    <div>
                        <Link to="/">
                            <div className="tab">
                                <img src={home} style={{height: "20px"}}/>
                                <p>&nbsp;Home</p>
                            </div>
                        </Link>
                        
                        <br />

                        {
                            collections.map((collection) =>
                                <Link to={"/" + getType(collection[0]) + "/" + collection.substring(1, collection.length)}>
                                    <div className="tab">
                                        {collection.substring(1, collection.length)}
                                    </div>
                                </Link>
                            )
                        }

                        <div className="tab" onClick={() => setNewTabForm(true)}>
                            <img src={createNew} style={{width: "15px", paddingTop: "3px"}} />
                            <div>&nbsp;Create new</div>
                        </div>

                        {/* CREATE NEW MODAL */}
                        <Modal isOpen={newTabForm} toggle={() => setNewTabForm(false)}>
                            {/* the block below is actually ModalHeader basically same thing but just one CSS difference
                                that is width 100% */}
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    Create new accounting page
                                </h5>
                                <img src={info} className="infoIcon" onClick={() => setInfoModalWindow(true)} />
                            </div>

                            <ModalBody>
                                <InputGroup className="newTabInput">
                                    <Input type="radio" name="type" onChange={() => setNewTabType("a")} />
                                        &nbsp;Accounting
                                </InputGroup>
                                {/* <InputGroup className="newTabInput">
                                    <Input type="radio" name="type" onChange={() => setNewTabType("p")} />
                                        &nbsp;Stock Portfolio (coming soon 😆)
                                </InputGroup> */}
                                <InputGroup className="newTabInput">
                                    <Input type="radio" name="type" onChange={() => setNewTabType("t")} />
                                        &nbsp;2-in-1
                                </InputGroup>

                                <br />
                                
                                <InputGroup className="newTabInput">
                                    <InputGroupText>Tab name</InputGroupText>
                                    <Input value={newTabName} onChange={(e) => setNewTabName(e.target.value)} />
                                </InputGroup>
                            </ModalBody>

                            <ModalFooter>
                                <Button color="primary"
                                    onClick={(e) => { 
                                            e.preventDefault();
                                            createNewCollection(newTabName, newTabType); 
                                            setNewTabForm(false);
                                        }}>Submit</Button>
                                <Button onClick={() => {setNewTabForm(false)}}>Cancel</Button>
                            </ModalFooter>
                        </Modal>
                        
                        <br />

                        {/* INFO MODAL HEREEEEEEEEEEEEEEEE */}
                        <Modal isOpen={infoModalWindow} toggle={() => setInfoModalWindow(false)}>
                            <ModalHeader>Accounting pages type</ModalHeader>

                            <ModalBody>
                                Accounting - To record transactions of an account.
                                <hr />
                                {/* Stock portfolio - Coming soon! 😆
                                <hr /> */}
                                2-in-1 - Imagine having a bank account but some portion of the balance is for college and the other
                                         is for personal use, that's exactly what this type is for! IDK what to name it 🤣
                            </ModalBody>

                            <ModalFooter>
                                <Button color="primary" onClick={() => setInfoModalWindow(false)}>Done</Button>
                            </ModalFooter>
                        </Modal>

                        <Link to="/settings">
                            <div className="tab" id="settingsTab">
                                <img src={settings} style={{height: "20px"}}/>
                                <p>&nbsp;Settings</p>
                            </div>
                        </Link>

                    </div>
                    :
                    <div>

                    </div>
            }

        </div>
    )
}