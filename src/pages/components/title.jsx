import React from "react"

export default (props) => {
    return (
        // "title" and "containers" are from accounting.css
        <div className="container-fluid title containers">
            <div className="row">
                <h2 style={{fontWeight: "bold"}}>{props.name}</h2>
            </div>
        </div>
    )
}