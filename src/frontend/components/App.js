import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom"
import './App.css';
import Navigation from './Navbar';
import Home from './Home';
import Swap from './Swap';

import { useState } from 'react'
import { ethers } from 'ethers'
import { Spinner } from 'react-bootstrap'

import TokenAbi from '../contractsData/Token.json'
import TokenAddress from '../contractsData/Token-address.json'

function App() {
  const [loading, setLoading] = useState(true)
  const [account, setAccount] = useState(null)
  const [token, setToken] = useState({})
  const [ethBalance, setEthBalance] = useState("0")
  const [tokenBalance, setTokenBalance] = useState("0")

  // MetaMask Login/Connect
  const web3Handler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0])

    const provider = new ethers.providers.Web3Provider(window.ethereum)

    const signer = provider.getSigner()

    const token = new ethers.Contract(TokenAddress.address, TokenAbi.abi, signer)

    setTokenBalance((await token.balanceOf(accounts[0])).toString())
    setEthBalance((await provider.getBalance(accounts[0])).toString())
    setToken(token)
    setLoading(false)
  }

  const buyTokens = (etherAmount) => {
    this.setState({ loading: true })
    this.state.ethSwap.methods.buyTokens().send({ value: etherAmount, from: account }).on('transactionHash', (hash) => { this.setState({ loading: false }) })
  }

  const sellTokens = (tokenAmount) => {
    this.setState({ loading: true })
    this.state.token.methods.approve(this.state.ethSwap.address, tokenAmount).send({ from: account }).on('transactionHash', (hash) => { 
      this.state.ethSwap.methods.sellTokens(tokenAmount).send({ from: this.state.account}).on('transactionHash', (hash) => { 
        this.setState({ loading: false }) })
      })
  }

  return (
    <BrowserRouter>
      <div className="App">
        <Navigation web3Handler={web3Handler} account={account} balance={tokenBalance} />
        { loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh'}}>
            <Spinner animation="border" style={{ display: 'flex' }} />
            <p className='mx-3 my-0'>Awaiting MetaMask Connection...</p>
          </div>
        ) : (
          <Routes>
            <Route path="/" element={
              <Home account={account} token={token} balance={tokenBalance} />
            } />
            <Route path="/swap" element={
              <Swap 
                ethBalance={ethBalance}
                tokenBalance={tokenBalance}
                buyTokens={buyTokens}
                sellTokens={sellTokens} 
              />
            } />
          </Routes>
        ) }
      </div>
    </BrowserRouter>
  );
}

export default App;
