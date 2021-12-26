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
                    <h1>Hi, {props.name}</h1>
                    <img src="https://media.giphy.com/media/Wj7lNjMNDxSmc/giphy.gif" />
                    <br />
                    <button onClick={props.signOutWithGoogle}>Sign out</button>
                </div>
                :
                <div>
                    <button onClick={props.signInWithGoogle}>log in</button>
                    <br />
                    <img src="https://media.giphy.com/media/YpkBkJ6cPrFijHAaUt/giphy.gif" width="100px" />
                </div>
            }
        </div>
    )
}