import React, { Component } from "react";

import { AllowPrincipalTransfer } from "../CreditorForm/AllowPrincipalTransfer";
import { FillLoan } from "../CreditorForm/FillLoan";

import { creditorAddress } from "../../constants";

export default class Fill extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hasGrantedTransfer: false
        };

        this.handleAllowPrincipalTransfer = this.handleAllowPrincipalTransfer.bind(this);
    }

    async handleAllowPrincipalTransfer(event) {
        event.preventDefault();

        const { loanRequest } = this.props;

        /*
         * Step 4:
         * Similar to how the borrower needed to authorize the transfer of the collateral,
         * the lender will also need to authorize the transfer of the principal:
         */

        // your code here

        this.setState({ hasGrantedTransfer: true });
    }

    render() {
        const { fillLoanRequest, loanRequest, updateBlockchainStatus } = this.props;
        const { hasGrantedTransfer } = this.state;

        const disableAllowTransfer = !loanRequest || hasGrantedTransfer;

        return (
            <div className="FillTutorial container Tutorial" id="fill-loan">
                <header className="App-header">
                    <h3 className="App-title">Fill a Loan on Dharma</h3>
                </header>

                <AllowPrincipalTransfer
                    handleAllowPrincipalTransfer={this.handleAllowPrincipalTransfer}
                    loanRequest={loanRequest}
                    disabled={disableAllowTransfer}
                />

                <FillLoan
                    fillLoanRequest={fillLoanRequest}
                    loanRequest={loanRequest}
                    disabled={!hasGrantedTransfer}
                    updateBlockchainStatus={updateBlockchainStatus}
                />
            </div>
        );
    }
}
