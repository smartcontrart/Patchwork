import React, { Component, createContext } from 'react';

export const AccountInfoContext = createContext();

class AccountInfoProvider extends Component {
    state = {
        BlockClockAddress: process.env.REACT_APP_MAINNET_CONTRACT_ADDRESS,
        BlockClockInstance: null,
        ClockMintAddress: process.env.REACT_APP_MAINNET_MINT_ADDRESS,
        ClockMintInstance: null,
        account: null,
        networkId: null,
        transactionInProgress: false,
        userFeedback: null,
        contractNetwork: process.env.REACT_APP_MAINNET_NETWORK,
        walletETHBalance: 0,
        mintPrice: 0,
        signedMessage: null,
        loadedNFTs: false,
        dropOpened: false,
        connectWallet: null,
        hasMinted: null,
        currentBlockNumber: null,
        backgroundColor: null,
        clockIdPath: null,
        lastClockId: null,
    }

    updateAccountInfo = (updatedData) =>{
        for (const [key, value] of Object.entries(updatedData)) {
            this.setState(prevState=>({
                ...prevState,
                [key]: value
            }))
        }
    }

    render(){
        return(
            <AccountInfoContext.Provider 
                value={{
                    ...this.state, 
                    updateAccountInfo: this.updateAccountInfo,
                    }}>
                {this.props.children}
            </AccountInfoContext.Provider>
        )
    }

}
export default AccountInfoProvider;