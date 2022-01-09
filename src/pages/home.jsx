import React, {useState} from "react";

// library
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
import google from "./src/google.png"

export default (props) => {

    // START OF HOMEPAGE <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    return (
        // "title" and "containers" are from accounting.css
        <div className="container-fluid title containers">
            {
                props.signedIn ?
                <div>
                    {
                        props.newUser ?
                        <h1>Welcome! {props.name}</h1>
                        :
                        <h1>Hi, {props.name}!</h1>
                    }
                    <img src="https://media.giphy.com/media/Wj7lNjMNDxSmc/giphy.gif" />
                    <br />

                    <h6>Note:</h6>
                    <p>
                        There is a known bug where if you add/edit an item in all "accounting" pages, 
                        the summary's graph data will be incorrect. To get the actual data, you 
                        need to refresh the page.
                    </p>
                    
                    <Button color="warning" style={{marginTop: "5%"}}
                     onClick={props.signOutWithGoogle}>Sign out</Button>
                </div>
                :
                <div>
                    <Button outline color="primary" onClick={props.signInWithGoogle} style={{margin: "1%", backgroundColor:"rgb(242, 242, 242)"}}>
                        <img src={google} style={{width: "20px", marginRight: "5px"}} />
                        Log in with Google
                    </Button>
                    <br />
                    <img src="https://media.giphy.com/media/YpkBkJ6cPrFijHAaUt/giphy.gif" width="100px" style={{marginLeft: "4%"}} />
                    <br /><br /><br />
                    <a href="https://github.com/jonathansh1115/jonadoingaccounting" target="_blank">Github Repo（程式码在此）</a>
                </div>
            }
        </div>
    )
}