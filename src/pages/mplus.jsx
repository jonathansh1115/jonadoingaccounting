import React from "react";

export default (props) => {
    return (
        <div>
            {
                props.signedIn ?
                    <div>
                        <h3>Mplus</h3>
                    </div>
                    :
                    <div>
                        <br />
                        <img src="https://media.giphy.com/media/TfS8MAR9ucLHW/giphy.gif" />
                        <br />
                        <h4>pls sign in</h4>
                    </div>
            }
        </div>
    )
}