import React, { Component } from "react";

export class FillLoan extends Component {
    constructor(props) {
        super(props);

        this.handleFillLoan = this.handleFillLoan.bind(this);
    }

    async handleFillLoan(event) {
        event.preventDefault();

        const { fillLoanRequest, updateBlockchainStatus } = this.props;
        await loanRequest.fill(creditorAddress);
        await fillLoanRequest();
        await updateBlockchainStatus();
    }

    render() {
        const { disabled } = this.props;

        return (
            <form className="request-form" onSubmit={this.handleFillLoan}>
                <div className="form-group">
                    <input
                        type="submit"
                        value="Fill"
                        className="btn btn-primary request-form-submit"
                        disabled={disabled}
                    />
                </div>
            </form>
        );
    }
}
