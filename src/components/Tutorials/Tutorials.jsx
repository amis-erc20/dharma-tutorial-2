import React, { Component } from "react";
import Open from "./Open";
import Fill from "./Fill";

import "./Tutorials.css";

export default class Tutorials extends Component {
    render() {
        const {
            createLoanRequest,
            fillLoanRequest,
            loanRequest,
            dharma,
            isAwaitingBlockchain,
            updateBlockchainStatus
        } = this.props;

        const disableOpenForm = isAwaitingBlockchain || loanRequest;

        return (
            <div>
                <Open
                    className="Tutorial"
                    disableForm={disableOpenForm}
                    dharma={dharma}
                    loanRequest={loanRequest}
                    createLoanRequest={createLoanRequest}
                />
                <Fill
                    className="Tutorial"
                    fillLoanRequest={fillLoanRequest}
                    loanRequest={loanRequest}
                    updateBlockchainStatus={updateBlockchainStatus}
                />
            </div>
        );
    }
}
