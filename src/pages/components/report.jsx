import React, { useState, useEffect } from "react"
import "./css/report.css"

// library
import {
    Navbar,
    Button,
    Input,
    InputGroupText,
    InputGroup,
    Table
} from "reactstrap"


export default (props) => {

    return (
        <div className="container-fluid summary">
            <div className="row">
                <div className="col-12">
                    <h4>Summary:</h4>
                </div>
            </div>
            
            <div className="row">
                <div className="col-4 chart">
                    Account Balance: {props.accBalance}
                </div>

                <div className="col-4 chart">
                    Past 5 Months' incomes:
                    {
                        props.past5MonthsIncomes.map((data) => 
                            <div>
                                {data}
                            </div>
                        )
                    }
                </div>

                <div className="col-4 chart">
                    Past 5 Months' expenses:
                    {
                        props.past5MonthsExpenses.map((data) => 
                            <div>
                                {data}
                            </div>
                        )
                    }
                </div>
            </div>

        </div>
    )
}