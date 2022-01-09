import React, { useState, useEffect } from "react"
import "./css/accountingReport.css"

// library
import {
    Navbar,
    Button,
    Input,
    InputGroupText,
    InputGroup,
    Table
} from "reactstrap"
import { LineChart } from "react-chartkick"
import 'chartkick/chart.js'

export default (props) => {

    const summaryData = (past5MonthsIncomeOrExpenses, listOfPast5Months) => {
        const listOfMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

        let tempObj = {}

        for (let i = listOfPast5Months.length - 1; i >= 0; --i) {
            let key = listOfMonths[listOfPast5Months[i] - 1]
            let value = past5MonthsIncomeOrExpenses[i] > 0 ? past5MonthsIncomeOrExpenses[i] : -past5MonthsIncomeOrExpenses[i] // make sure it is positive
            tempObj[key] = value
        }
        
        return tempObj
    }
    
    return (
        <div className="container-fluid summaryContainer containers">
            <div className="row summaryRow">
                <div className="col-4 chart">
                    Total balance: {props.accBalance}
                    <br />
                    For college balance: {props.forCollegeBalance}
                    <br />
                    For spending balance: {props.forSpendingBalance}
                    <br />
                </div>

                <div className="col-4 chartBox">
                    <p style={{paddingLeft: "3%"}}>Past 5 Months' incomes:</p>
                    <LineChart data={summaryData(props.past5MonthsIncomes, props.listOfPast5Months)} height="100%" width="80%" />
                </div>

                <div className="col-4 chartBox">
                    <p style={{paddingLeft: "3%"}}>Past 5 Months' expenses:</p>
                    <LineChart data={summaryData(props.past5MonthsExpenses, props.listOfPast5Months)} height="100%" width="80%" />
                </div>
            </div>

        </div>
    )
}