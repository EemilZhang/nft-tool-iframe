import React, { Component } from 'react';
import { Menu, Container, Card, Ref, Header, Segment } from 'semantic-ui-react'
import './App.css';
import EZNFTLogo from './Assets/Brand_Assets/EZNFT-Logo.png';
import Web3 from "web3";
import getWeb3 from './Utility/getWeb3';
import getNFT from './Utility/getNFT';
import ERC721ABI from './Utility/ERC721ABI';

import pollForTransaction from './Utility/pollForTransaction';
import getUsersTokens from './Utility/getUsersTokens';
import mintToken from './Utility/mintToken';

import Dashboard from './Pages/Dashboard';
import Token from './Pages/Token';
import Axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      web3: null,
      network: null,
      EtherZaarContractAddress: "0x8CdBc929fafbd07a5C5DE2de095B7F5d0f391c90",
      EZNFTBalance: null,
      EZNFTTokens: null,
      EZNFTArray: null,
      EZNFTMetadata: {},
      shouldFetchMetadata: true,
      tokenMetadata: {},
      account: null, 
      activeItem: "Dashboard",
      isLoading: true,
      showArticles: false,
      isIframe: true
    }
    
    this.web3Sync = this.web3Sync.bind(this);
    this.unlockWeb3 = this.unlockWeb3.bind(this);
    this.createToken = this.createToken.bind(this);

    this.triggerAppUpdate = this.triggerAppUpdate.bind(this);
  }

  componentDidMount = async () => {
      getWeb3()
        .then((web3) => {
          this.web3Sync(web3)
          if(web3.currentProvider.publicConfigStore) {
            web3.currentProvider.publicConfigStore.on('update', this.web3Sync(web3));
          }
        })
        .catch((error)=>{
          if (error === "No web3") {
            this.setState({web3: false});
          } else {
            this.setState({web3Locked: true})}
          })
  }

  componentDidUpdate = () => {
    if (this.state.web3 === false) {return}
    if (this.state.network !== 1) {return}

    if (this.state.pendingTransaction === true) {
      const hash = localStorage.getItem('pendingTransaction');
      pollForTransaction(this.state.web3, hash, 2000, async (error, transaction) => {
        if (error) {}
        if (transaction) {
          let EZNFTBalance = await getNFT.balanceOf(this.state.web3, this.state.EtherZaarContractAddress, this.state.account);
          let EZNFTArray = await getUsersTokens(this.state.web3, ERC721ABI, this.state.EtherZaarContractAddress, EZNFTBalance, this.state.account);
          let EZNFTTokens = JSON.stringify(EZNFTArray);

          this.setState({EZNFTBalance: EZNFTBalance, EZNFTArray: EZNFTArray, EZNFTTokens: EZNFTTokens, pendingTransaction: false})
          localStorage.removeItem('pendingTransaction');
        }
      })
    }

    if (this.state.EZNFTArray.length > 0 && this.state.shouldFetchMetadata) {
      Axios.post('https://eznft-metadata.etherzaar.com/v1/batchmetadata', { idArray: this.state.EZNFTArray })
        .then((result) => {
          var parsedResponse = JSON.parse(result.data);
          var tokenMetadata = parsedResponse.Responses['EZNFT-Metadata']

          var metaDataArray = {};
          for (let metadata of tokenMetadata) { 
            metaDataArray[metadata.id] = metadata
          };

          this.setState({shouldFetchMetadata: false, EZNFTMetadata: metaDataArray})
      })
    }
  }

  web3Sync = async (web3, selectedAddress) => {
      const network = await web3.eth.net.getId();
      if (network === 1) {
        const accounts = await web3.eth.getAccounts();
        const account = (selectedAddress) ? selectedAddress : accounts[0];
        const EZNFTBalance = await getNFT.balanceOf(web3, this.state.EtherZaarContractAddress, account);
        const EZNFTArray = await getUsersTokens(web3, ERC721ABI, this.state.EtherZaarContractAddress, EZNFTBalance, account);
        const EZNFTTokens = JSON.stringify(EZNFTArray);
        const hash = localStorage.getItem('pendingTransaction');
        const pendingTransaction = hash ? true : false;
        this.setState({web3, network, account: account, EZNFTBalance, EZNFTTokens, EZNFTArray, pendingTransaction, web3Locked: false, isLoading: false});
      } else {
        this.setState({web3, network, isLoading: false});
      }
  }

  unlockWeb3 = async () => {
    window.ethereum.enable()
      .then(() => this.web3Sync(new Web3(window.ethereum)))
      .catch()
  }
  
  createToken = async (event) => {
    event.preventDefault();
    const { web3, EtherZaarContractAddress, account} = this.state;

    mintToken(web3, ERC721ABI, EtherZaarContractAddress, account)
      .then((hash) => {
        localStorage.setItem('pendingTransaction', hash);
        this.setState({pendingTransaction: true});
      })
      .catch((error) => {})
  }

  handleTokenClick = (tokenId) => {
    this.setState({activeItem: 'Token', activeToken: tokenId});
  }

  handleArticleClick = (articleId) => {
    this.setState({activeItem: 'Article', activeArticle: articleId});
  }

  handleTokenClickBack = () => {
    this.setState({activeItem: 'Dashboard', activeToken: null, tokenMetadata: {template: false} });
  }

  handleArticleClickBack = () => {
    this.setState({activeItem: 'Dashboard', activeArticle: null});
  }

  triggerAppUpdate = (tokenId, tokenMetadata) => {
    var metadataObject = this.state.EZNFTMetadata;
    metadataObject[tokenId] = tokenMetadata;

    this.setState({activeItem: 'Token', activeToken: tokenId, shouldUpdateMetadata: true });
  }


  render() {

    const { activeItem } = this.state

    return(
      <div>
      <Card className='main-iframe'>
          <Container style={{maxHeight: '100%', overflow: 'scroll', padding: '1em 0.1em', marginTop: '1em'}}>
            <Dashboard
              web3={this.state.web3}
              network={this.state.network}
              activeItem={this.state.activeItem}
              account={this.state.account} 
              EZNFTArray={this.state.EZNFTArray} 
              pendingTransaction={this.state.pendingTransaction} 
              createToken={this.createToken} 
              handleTokenClick={this.handleTokenClick}
              handleArticleClick={this.handleArticleClick}
              EZNFTMetadata={this.state.EZNFTMetadata}
              shouldFetchMetadata={this.state.shouldFetchMetadata}
              isLoading={this.state.isLoading}
              unlockWeb3={this.unlockWeb3}
              web3Locked={this.state.web3Locked}
              showArticles={this.state.showArticles}
            />
            <Token 
              activeItem={this.state.activeItem} 
              handleTokenClickBack={this.handleTokenClickBack} 
              activeToken={this.state.activeToken}
              updateMetadata={this.updateMetadata}
              EZNFTMetadata={this.state.EZNFTMetadata}
              shouldFetchMetadata={this.state.shouldFetchMetadata}
              tokenMetadata={this.state.tokenMetadata}
              web3={this.state.web3}
              account={this.state.account}
              ERC721ABI={ERC721ABI}
              contractAddress={this.state.EtherZaarContractAddress}
              triggerAppUpdate={this.triggerAppUpdate}
              isIframe={this.state.isIframe}
            />
          </Container>
      </Card>
      </div>
    )
  }
}
  export default App