import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom"
import './App.css';
import Navigation from './Navbar';
import Home from './Home';
import Swap from './Swap';
import Admin from './Admin';

import { useState } from 'react'
import { ethers } from 'ethers'
import { Spinner } from 'react-bootstrap'

import BankAbi from '../contractsData/Bank.json'
import BankAddress from '../contractsData/Bank-address.json'

const toWei = (num) => ethers.utils.parseEther(num.toString())
const fromWei = (num) => ethers.utils.formatEther(num)

function App() {
  const [loading, setLoading] = useState("Awaiting MetaMask Connection...")
  const [account, setAccount] = useState(null)
  const [bank, setBank] = useState({})
  const [ethBalance, setEthBalance] = useState("0")
  const [tokenBalance, setTokenBalance] = useState("0")
  const [bankBalance, setBankBalance] = useState("0")

  // MetaMask Login/Connect
  const web3Handler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0])

    const provider = new ethers.providers.Web3Provider(window.ethereum)

    const signer = provider.getSigner()

    const bank = new ethers.Contract(BankAddress.address, BankAbi.abi, signer)

    // setTokenBalance(fromWei(await token.balanceOf(accounts[0])).toString())
    setTokenBalance(fromWei(await bank.playerBalance(accounts[0])).toString())
    setEthBalance(fromWei(await provider.getBalance(accounts[0])).toString())
    setBankBalance(fromWei(await provider.getBalance(bank.address)).toString())
    setBank(bank)
    setLoading("")
  }

  const withdrawBalance = async () => {
    setLoading("Withdraw Balance...")
    await bank.withdraw({ from: account })
    setLoading("")
  }

  const buyTokens = async (etherAmount) => {
    setLoading("Buying Tokens...")
    await bank.buyTokens({ value: etherAmount, from: account })
    setLoading("")
  }

  const sellTokens = async (tokenAmount) => {
    setLoading("Selling Tokens...")
    bank.sellTokens(tokenAmount)
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
              <Home account={account} balance={tokenBalance} />
            } />
            <Route path="/swap" element={
              <Swap 
                ethBalance={ethBalance}
                tokenBalance={tokenBalance}
                buyTokens={buyTokens}
                sellTokens={sellTokens} 
                withdrawBalance={withdrawBalance} 
              />
            } />
            <Route path="/admin" element={
              <Admin withdrawBalance={withdrawBalance} bankBalance={bankBalance}/>
            } />
          </Routes>
        ) }
      </div>
    </BrowserRouter>
  );
}

export default App;
