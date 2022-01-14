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
import table from "./src/table.JPG"

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

                    <Button color="warning" style={{marginTop: "5%"}}
                     onClick={props.signOutWithGoogle}>Sign out</Button>

                    <div style={{marginTop: "20px"}}>
                        <h4>⚠️Note:</h4>
                    </div>
                    <div>
                        <p>1. User agreement: For the sake of transparency, I (the owner of this site) 
                            can view the database that stores all records and data of every user. However, 
                            I will not do so. Also, I do not have access to your account. By logging in 
                            with your Google Account, you agree to provide this site with your email address 
                            and name. This site only uses this information to identify and authenticate users.</p>
                        <p>2. There is a known bug where if you add/edit an item in all "accounting" pages, 
                        the summary's graph data will be incorrect. To get the actual data, you 
                        need to refresh the page.</p>
                        <p>3. The table looks like this on pc. IDK why it looks weird on phones and tablets.😅</p>
                        <img src={table} width="500px" />
                    </div>
                    
                    
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