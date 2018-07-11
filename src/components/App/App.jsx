import React, { Component } from "react";
import Dharma from "@dharmaprotocol/dharma.js";

// Constants
import { creditorAddress, debtorAddress } from "../../constants";

// BlockchainStatus
import Header from "../Header/Header";

import Tutorials from "../Tutorials/Tutorials";
import TutorialStatus from "../TutorialStatus/TutorialStatus";

// Instantiate a new instance of Dharma, passing in the host of the local blockchain.
const dharma = new Dharma("http://localhost:8545");

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isAwaitingBlockchain: false,
            balances: {}
        };

        this.createLoanRequest = this.createLoanRequest.bind(this);
        this.fillLoanRequest = this.fillLoanRequest.bind(this);
        this.updateBlockchainStatus = this.updateBlockchainStatus.bind(this);
    }

    async componentDidMount() {
        this.updateBlockchainStatus();
    }

    async updateBlockchainStatus() {
        const { loan } = this.state;

        const repAddress = await dharma.contracts.getTokenAddressBySymbolAsync("REP");
        const wethAddress = await dharma.contracts.getTokenAddressBySymbolAsync("WETH");

        const debtorREP = await dharma.token.getBalanceAsync(repAddress, debtorAddress);
        const debtorWETH = await dharma.token.getBalanceAsync(wethAddress, debtorAddress);

        const creditorREP = await dharma.token.getBalanceAsync(repAddress, creditorAddress);
        const creditorWETH = await dharma.token.getBalanceAsync(wethAddress, creditorAddress);

        // WETH never gets collateralized in this example.
        const collateralizerWETH = 0;

        let collateralizerREP = 0;
        if (loan) {
            collateralizerREP = await loan.getCurrentCollateralAmount();
        }

        this.setState({
            balances: {
                debtorREP: debtorREP
                    .div(10 ** 18)
                    .toNumber()
                    .toLocaleString(),
                debtorWETH: debtorWETH
                    .div(10 ** 18)
                    .toNumber()
                    .toLocaleString(),
                creditorREP: creditorREP
                    .div(10 ** 18)
                    .toNumber()
                    .toLocaleString(),
                creditorWETH: creditorWETH
                    .div(10 ** 18)
                    .toNumber()
                    .toLocaleString(),
                collateralizerREP,
                collateralizerWETH
            }
        });
    }

    async createLoanRequest(formData) {
        this.setState({
            isAwaitingBlockchain: true
        });

        const { LoanRequest } = Dharma.Types;

        const { principal, collateral, termLength, interestRate } = formData;

        const accounts = await dharma.blockchain.getAccounts();

        if (!accounts) {
            console.error("No acccounts detected from web3 -- ensure a local blockchain is running.");

            this.setState({ isAwaitingBlockchain: false });

            return;
        }

        const debtorAddressString = accounts[0];

        try {
            const loanRequest = await LoanRequest.create(dharma, {
                principalAmount: principal,
                principalToken: "WETH",
                collateralAmount: collateral,
                collateralToken: "REP",
                interestRate: interestRate,
                termDuration: termLength,
                termUnit: "months",
                debtorAddress: debtorAddressString,
                expiresInDuration: 1,
                expiresInUnit: "weeks"
            });

            /*
             * Step 2:
             * In the first part of our tutorial, we had you create a web form that allowed users to
             * create a Dharma Debt Order.
             *
             * To prepare this debt order to be filled, there’s one more step to complete:
             *
             * Allow the collateral to be transferred from the borrower to the Dharma Protocol smart contract.
             */

            // your code here

            this.setState({
                isAwaitingBlockchain: false,
                loanRequest
            });
        } catch (e) {
            console.error(e);

            this.setState({
                isAwaitingBlockchain: false,
                loanRequest: null
            });
        }
    }

    async fillLoanRequest() {
        this.setState({
            isAwaitingBlockchain: true
        });

        const { loanRequest } = this.state;

        try {
            /*
             * Step 5:
             * With the principal and collateral permissions enabled, the last step
             * is to actually call fill on the loan order:
             */

            // your code here

            const loan = await loanRequest.generateLoan();

            this.setState({
                isAwaitingBlockchain: false,
                loan
            });
        } catch (e) {
            console.error(e);

            this.setState({
                isAwaitingBlockchain: false
            });
        }
    }

    render() {
        const { balances, loanRequest, isAwaitingBlockchain } = this.state;

        return (
            <div className="App">
                <Header />

                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-7">
                            <Tutorials
                                createLoanRequest={this.createLoanRequest}
                                fillLoanRequest={this.fillLoanRequest}
                                loanRequest={loanRequest}
                                dharma={dharma}
                                isAwaitingBlockchain={isAwaitingBlockchain}
                                updateBlockchainStatus={this.updateBlockchainStatus}
                            />
                        </div>

                        <div className="col-sm-5">
                            <TutorialStatus balances={balances} loanRequest={loanRequest} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
