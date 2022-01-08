import React, { useState, useEffect } from "react"
import "./css/settings.css"

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
    serverTimestamp,
    where
} from 'firebase/firestore';
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

// src
import deleteIcon from "./src/delete.png"

export default (props) => {

    const userId = window.localStorage.getItem("uid")
    const databaseLocation = "users_stuff"
    
    const [signedIn, setSignedIn] = useState(false)
    
    // get all docs
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
     * Edit collection name
     * 
     * @param {*} collectionToBeDeleted 
     */
    // TODO
    
    /**
     * Delete a collection: remove the collection in the "collections" object and delete every doc in 
     * the collection, ie the collection itself isnt deleted
     * 
     * @param {*} collectionToBeDeleted 
     */
    const deleteStuff = (collectionToBeDeleted) => {
        const indexOfCollectionToBeDeleted = collections.indexOf(collectionToBeDeleted)
        // delete the collection from the collections state
        // console.log(collections)
        if (indexOfCollectionToBeDeleted > -1) {
            const tempCollections = collections
            tempCollections.splice(indexOfCollectionToBeDeleted, 1)  // 1 means only one item
            setCollections(tempCollections)
        }
        // console.log(collections)
        
        // replace the collection with the exact same collections but without the collection that is being deleted
        setDoc(doc(props.db, databaseLocation, userId), {
            uid: currentUserData[0],
            email: currentUserData[1],
            userRegTime: currentUserData[2],
            collections: collections
        })

        // to grab a list of all documents in the collectionToBeDeleted
        const collectionLocation = "users_stuff/" + currentUserData[0] + "/" + collectionToBeDeleted
        const q = query(collection(props.db, collectionLocation), orderBy("dateRecorded", "desc")) // i use dateRecorded because everything must have a dateRecorded
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            // delete every doc in the collection
            querySnapshot.forEach((docu) => {
                console.log(docu.id)
                console.log("hi")
                deleteDoc(doc(props.db, collectionLocation, docu.id))
            })
        })

        // Close delete modal
        setDeleteModal(false)
    }
    
    // Delete modal
    const [deleteModal, setDeleteModal] = useState(false)
    const [collection2bDeleted, setCollection2bDeleted] = useState("")
    
    return (
        <div>
            {/* The "title" and "containers" classname is from accounting.css */}
            <div className="container-fluid title containers">
                <div className="row">
                    <h2 style={{fontWeight: "bold"}}>Settings</h2>
                </div>

                
            </div>

            <div className="container-fluid title containers">
                <div className="row">
                    <h5>Your accounting documents:</h5>
                </div>
            </div>

            <div className="container-fluid title containers">
                {
                    collections.map((collection) =>
                        <div className="row tabNames">
                            <div className="col-2">
                                <p>{collection.substring(1, collection.length)}</p>
                            </div>
                            <div className="col-2">
                                <Button outline color="danger" className="btn-sm" onClick={() => {
                                    setDeleteModal(true)
                                    setCollection2bDeleted(collection)
                                }}>
                                    <img src={deleteIcon} style={{width: "15px"}} />
                                </Button>
                            </div>
                        </div>
                    )
                }
            </div>

            {/* DELETE MODAL */}
            <Modal isOpen={deleteModal} toggle={() => setDeleteModal(false)}>
                <ModalHeader>Delete {collection2bDeleted.substring(1, collection2bDeleted.length)}?</ModalHeader>
                
                <ModalFooter>
                    <Button color="danger" onClick={() => deleteStuff(collection2bDeleted)}>Delete</Button>
                    <Button color="primary" onClick={() => setDeleteModal(false)}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>
    )
}