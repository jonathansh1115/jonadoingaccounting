import React, {useState} from "react";

// library
// import { getAuth } from "firebase/auth";

// const auth = getAuth()

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
                    <button onClick={props.signInWithGoogle}>log in</button>
                    <br />
                    <img src="https://media.giphy.com/media/YpkBkJ6cPrFijHAaUt/giphy.gif" width="100px" />
                    <br /><br /><br />
                    <a href="https://github.com/jonathansh1115/jonadoingaccounting" target="_blank">Github Repo</a>
                </div>
            }
        </div>
    )
}