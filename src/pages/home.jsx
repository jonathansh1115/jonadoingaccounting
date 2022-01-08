import React, {useState} from "react";

// library
import {
    Button,
    Input,
    InputGroupText,
    InputGroup,
    Table
} from "reactstrap"

export default (props) => {

    // START OF HOMEPAGE <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    return (
        <div>
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
                        the summary section's data will be incorrect. To get the actual data, you 
                        need to refresh the page.
                    </p>
                    
                    <button onClick={props.signOutWithGoogle}>Sign out</button>
                </div>
                :
                <div>
                    <Button color="primary" onClick={props.signInWithGoogle} style={{margin: "1%"}}>log in</Button>
                    <br />
                    <img src="https://media.giphy.com/media/YpkBkJ6cPrFijHAaUt/giphy.gif" width="100px" />
                    <br /><br /><br />
                    <a href="https://github.com/jonathansh1115/jonadoingaccounting" target="_blank">Github Repo（程式码在此）</a>
                </div>
            }
        </div>
    )
}