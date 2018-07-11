import React, { Component } from "react";

import "./LoanSummary.css";

export default class LoanSummary extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isFilled: false,
            isCreated: false
        };
    }

    componentWillReceiveProps(nextProps) {
        const { loanRequest } = nextProps;

        if (!loanRequest) {
            return {};
        }

        this.getLoanSummary(loanRequest).then(data => {
            this.setState(data);
        });
    }

    async getLoanSummary(loanRequest) {
        const isFilled = await loanRequest.isFilled();

        return { isFilled, isCreated: true };
    }

    render() {
        const { isFilled, isCreated } = this.state;

        const successClass = "check text-success";
        const dangerClass = "times text-danger";

        return (
            <div>
                <h3>Loan Request Summary</h3>

                <table className="table table-bordered table-hover">
                    <tbody>
                        <tr>
                            <th>Created</th>
                            <td className="check-box-row">
                                <i className={`summary-check fa fa-${isCreated ? successClass : dangerClass}`} />
                            </td>
                        </tr>
                        <tr>
                            <th>Filled</th>
                            <td className="check-box-row">
                                <i className={`summary-check fa fa-${isFilled ? successClass : dangerClass}`} />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}
