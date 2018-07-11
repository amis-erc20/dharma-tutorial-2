import React, { Component } from "react";
import Balances from "../Balances/Balances";
import LoanSummary from "../LoanSummary/LoanSummary";

import "./TutorialStatus.css";

export default class TutorialStatus extends Component {
    render() {
        const { loanRequest, balances } = this.props;

        return (
            <div className="TutorialStatus">
                <LoanSummary loanRequest={loanRequest} />
                <Balances balances={balances} />
            </div>
        );
    }
}
