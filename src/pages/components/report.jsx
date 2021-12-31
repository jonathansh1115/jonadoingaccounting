import React, { useState, useEffect } from "react"

export default (props) => {

    return (
        <div>
            <h3>Summary:</h3>
            
            {
                props.dataOfMonthsToSummary.map((data) => 
                    <div>
                        {data}
                    </div>
                )
            }
        </div>
    )
}