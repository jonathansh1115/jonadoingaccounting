import React, { useState, useEffect } from "react"

export default (props) => {

    return (
        <div>
            <h3>Summary:</h3>
            
            Past 5 Months' incomes:
            {
                props.past5MonthsIncomes.map((data) => 
                    <div>
                        {data}
                    </div>
                )
            }

            Past 5 Months' expenses:
            {
                props.past5MonthsExpenses.map((data) => 
                    <div>
                        {data}
                    </div>
                )
            }
        </div>
    )
}