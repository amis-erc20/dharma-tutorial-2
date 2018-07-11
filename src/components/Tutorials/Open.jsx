import React, { Component } from "react";

import { RequestLoanForm } from "../RequestLoanForm/RequestLoanForm";

export default class Open extends Component {
    render() {
        const { createLoanRequest, disableForm } = this.props;

        return (
            <div className="OpenTutorial container Tutorial" id="open-loan">
                <header className="App-header">
                    <h3 className="App-title">Request a Loan on Dharma</h3>
                </header>

                <RequestLoanForm createLoanRequest={createLoanRequest} disableForm={disableForm} />
            </div>
        );
    }
}
