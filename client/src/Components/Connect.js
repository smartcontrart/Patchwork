import React, { Component } from "react";
import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import { Button } from "react-bootstrap";
import { AccountInfoContext } from '../Context/AccountInfo'
import Patchwork  from "../contracts/Patchwork.json";
// import ClockMint  from "../contracts/ClockMint.json";

class Connect extends Component {
  
  static contextType =  AccountInfoContext
  
  componentDidMount = async () => {

    if (window.ethereum) {
      this.web3 = new Web3(window.ethereum);
    } else if (window.web3) {
      this.web3  = new Web3(window.web3.currentProvider);
    };
    if(this.web3){
      await this.setNetwork();
      await this.getContractsInstances();
      await this.setAccount();
      this.context.updateAccountInfo({web3: this.web3})
    }
  }

  async getContractsInstances(){
    this.networkId = await this.web3.eth.net.getId();
    this.PatchworkInstance = new this.web3.eth.Contract(
      Patchwork.abi,
      parseInt(process.env.REACT_APP_MAINNET_NETWORK) && process.env.REACT_APP_MAINNET_CONTRACT_ADDRESS
    )
    // this.ClockMintInstance = new this.web3.eth.Contract(
    //   ClockMint.abi,
    //   parseInt(process.env.REACT_APP_MAINNET_MINT_ADDRESS) && process.env.REACT_APP_MAINNET_MINT_ADDRESS
    // )
    this.context.updateAccountInfo({PatchworkInstance: this.PatchworkInstance})
    this.getMintInfo();
  }


  async setAccount(){
    if(this.context.networkId !== null){
      let accounts = await this.web3.eth.getAccounts();
      await this.context.updateAccountInfo({account: accounts[0]});
      if(this.context.account) this.getAccountsData()
    }else{
      this.resetAccountData();
    }
  }

  resetAccountData(){
    this.context.updateAccountInfo({
      account: null,
    })
  }

  async setNetwork(){
    if(this.web3){
      let networkId = await this.web3.eth.net.getId();
      this.context.updateAccountInfo({networkId: networkId})
    }
  }

  async getAccountsData(){

    if(this.context.networkId === parseInt(process.env.REACT_APP_MAINNET_NETWORK) ){
      this.context.updateAccountInfo({walletETHBalance: await this.web3.eth.getBalance(this.context.account)});
      // this.context.updateAccountInfo({dropOpened: await this.ClockMintInstance.methods._publicMintOpened().call()})
    }
  }

  async getMintInfo(){
    if(this.context.networkId === parseInt(process.env.REACT_APP_MAINNET_NETWORK) ){
      // this.context.updateAccountInfo({mintPrice: parseFloat(await this.ClockMintInstance.methods._publicMintPrice().call())})
      // this.context.updateAccountInfo({lastClockId: parseFloat(await this.BlockClockInstance.methods._tokenId().call())})
    }
  }

  async connectWallet(){
    this.context.updateAccountInfo({transactionInProgress: true})
    try{
      window.ethereum.enable()
    }catch(error){
      console.log(error)
    }
    this.context.updateAccountInfo({transactionInProgress: false})
  }

  getAccountStr(account){
    let response = account.slice(0, 5) +  '...' + account.substring(account.length - 2)
    return response
  }

  renderUserInterface(){
    if(!this.context.account){
      if(!window.ethereum){
        return <div style={{fontSize: '20px'}}>No wallet detected</div>
      }else{
        return(
          <div className='d-flex align-items-center justify-content-center mb-3'>
            <Button className='button' variant="light" onClick={() => this.connectWallet()}>Connect</Button>
          </div>
        )
      }
    }else if(parseInt(this.context.networkId) !== parseInt(this.context.contractNetwork)){
      return <p>Please connect to Ethereum Mainnet</p>
    }else return <div variant="outline-light">Connected as {this.context.account}</div>
  }

  render() {
    if(this.web3){
      window.ethereum.on('accountsChanged', async () => {
        await this.setAccount()
      })
      window.ethereum.on('networkChanged', async () => {
        await this.setNetwork()
        await this.setAccount();
      });
    }
    return this.renderUserInterface()
  }
  
}


export default Connect;
