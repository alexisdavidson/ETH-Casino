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
import SwapAbi from '../contractsData/Swap.json'
import SwapAddress from '../contractsData/Swap-address.json'

const toWei = (num) => ethers.utils.parseEther(num.toString())
const fromWei = (num) => ethers.utils.formatEther(num)

function App() {
  const [loading, setLoading] = useState("Awaiting MetaMask Connection...")
  const [account, setAccount] = useState(null)
  const [token, setToken] = useState({})
  const [swap, setSwap] = useState({})
  const [ethBalance, setEthBalance] = useState("0")
  const [tokenBalance, setTokenBalance] = useState("0")

  // MetaMask Login/Connect
  const web3Handler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0])

    const provider = new ethers.providers.Web3Provider(window.ethereum)

    const signer = provider.getSigner()

    const token = new ethers.Contract(TokenAddress.address, TokenAbi.abi, signer)
    const swap = new ethers.Contract(SwapAddress.address, SwapAbi.abi, signer)

    setTokenBalance(fromWei(await token.balanceOf(accounts[0])).toString())
    setEthBalance(fromWei(await provider.getBalance(accounts[0])).toString())
    setToken(token)
    setSwap(swap)
    setLoading("")
  }

  const buyTokens = async (etherAmount) => {
    setLoading("Buying Tokens...")
    await swap.buyTokens({ value: etherAmount, from: account })
    setLoading("")
  }

  const sellTokens = async (tokenAmount) => {
    setLoading("Selling Tokens...")
    await token.approve(swap.address, tokenAmount)
    swap.sellTokens(tokenAmount)
    setLoading("")
  }

  return (
    <BrowserRouter>
      <div className="App">
        <Navigation web3Handler={web3Handler} account={account} balance={tokenBalance} />
        { loading.length > 0 ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh'}}>
            <Spinner animation="border" style={{ display: 'flex' }} />
            <p className='mx-3 my-0'>{loading}</p>
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
