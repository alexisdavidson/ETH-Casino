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
import CoinFlip from './games/CoinFlip';

import { useState } from 'react'
import { ethers } from 'ethers'
import { Spinner } from 'react-bootstrap'
import { useEffect } from 'react'

import BankAbi from '../contractsData/Bank.json'
import BankAddress from '../contractsData/Bank-address.json'
import CoinFlipAbi from '../contractsData/CoinFlip.json'
import CoinFlipAddress from '../contractsData/CoinFlip-address.json'

const toWei = (num) => ethers.utils.parseEther(num.toString())
const fromWei = (num) => ethers.utils.formatEther(num)

function App() {
  const [loading, setLoading] = useState("Awaiting MetaMask Connection...")
  const [account, setAccount] = useState(null)
  const [bank, setBank] = useState({})
  const [coinflip, setCoinFlip] = useState({})
  const [ethBalance, setEthBalance] = useState("0")
  const [tokenBalance, setTokenBalance] = useState("0")
  const [bankBalance, setBankBalance] = useState("0")

  const GET_BALANCE_INTERVAL_MS = 5000;
  let provider;
  let interval;

    useEffect(() => {
      // This represents the unmount function, in which you need to clear your interval to prevent memory leaks
      return () => clearInterval(interval);
    }, [])

  // MetaMask Login/Connect
  const web3Handler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0])

    provider = new ethers.providers.Web3Provider(window.ethereum)

    const signer = provider.getSigner()

    const _bank = new ethers.Contract(BankAddress.address, BankAbi.abi, signer)
    const coinflip = new ethers.Contract(CoinFlipAddress.address, CoinFlipAbi.abi, signer)

    getPlayerBalance(_bank, accounts[0])
    setEthBalance(fromWei(await provider.getBalance(accounts[0])).toString())
    setBankBalance(fromWei(await provider.getBalance(_bank.address)).toString())
    setBank(_bank)
    setCoinFlip(coinflip)
    setLoading("")

    interval = setInterval(() => {
        getPlayerBalance(_bank, accounts[0])
    }, GET_BALANCE_INTERVAL_MS);
  }

  const getPlayerBalance = async (_bank, _account) => {
    if (_bank != null && _account != null) {
      const playerBalance = fromWei(await _bank.playerBalance(_account)).toString()
      console.log("getPlayerBalance: " + playerBalance)
      setTokenBalance(playerBalance)
      return playerBalance
    }
    console.log("getPlayerBalance null: " + _bank + ", " + _account)
    return ""
  }

  return (
    <BrowserRouter>
      <div className="App">
        <Navigation web3Handler={web3Handler} tokenBalance={tokenBalance} account={account} getPlayerBalance={getPlayerBalance} />
        { loading.length > 0 ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh'}}>
            <Spinner animation="border" style={{ display: 'flex' }} />
            <p className='mx-3 my-0'>{loading}</p>
          </div>
        ) : (
          <Routes>
            <Route path="/" element={
              <Home />
            } />
            <Route path="/swap" element={
              <Swap 
                ethBalance={ethBalance}
                tokenBalance={tokenBalance}
                bank={bank}
                account={account}
              />
            } />
            <Route path="/admin" element={
              <Admin bankBalance={bankBalance} bank={bank} account={account}/>
            } />
            <Route path="/coinflip" element={
              <CoinFlip coinflip={coinflip} provider={provider}/>
            } />
          </Routes>
        ) }
      </div>
    </BrowserRouter>
  );
}

export default App;
