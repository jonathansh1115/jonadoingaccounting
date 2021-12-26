import React from "react";

export default (props) => { // TODO chase.jsx type check
    return (
        <div>
            {
                props.signedIn ?
                <div>
                    <h3>Invest</h3>
                </div>
                :
                <div>
                    <br />
                    <img src="https://media.giphy.com/media/W4X6HuX1ZVIEGFSvVD/giphy.gif" />
                    <br />
                    <h4>pls sign in</h4>
                </div>
            }
        </div>
    )
}