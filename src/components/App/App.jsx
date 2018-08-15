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

        const amisAddress = await dharma.contracts.getTokenAddressBySymbolAsync("AMIS");
        const wethAddress = await dharma.contracts.getTokenAddressBySymbolAsync("WETH");

        const debtorAMIS = await dharma.token.getBalanceAsync(amisAddress, debtorAddress);
        const debtorWETH = await dharma.token.getBalanceAsync(wethAddress, debtorAddress);

        const creditorAMIS = await dharma.token.getBalanceAsync(amisAddress, creditorAddress);
        const creditorWETH = await dharma.token.getBalanceAsync(wethAddress, creditorAddress);

        // WETH never gets collateralized in this example.
        const collateralizerWETH = 0;

        let collateralizerAMIS = 0;
        if (loan) {
            collateralizerAMIS = await loan.getCurrentCollateralAmount();
        }

        this.setState({
            balances: {
                debtorAMIS: debtorAMIS
                    .div(10 ** 9)
                    .toNumber()
                    .toLocaleString(),
                debtorWETH: debtorWETH
                    .div(10 ** 18)
                    .toNumber()
                    .toLocaleString(),
                creditorAMIS: creditorAMIS
                    .div(10 ** 9)
                    .toNumber()
                    .toLocaleString(),
                creditorWETH: creditorWETH
                    .div(10 ** 18)
                    .toNumber()
                    .toLocaleString(),
                collateralizerAMIS,
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
                collateralToken: "AMIS",
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

            await loanRequest.allowCollateralTransfer(debtorAddress)

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
