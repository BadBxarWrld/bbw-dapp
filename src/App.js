import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import BBW from './contracts/BBW.json';
import './App.css';

function App() {
  const [tokenData, setTokenData] = useState({
    name: '',
    symbol: '',
    totalSupply: '',
  });
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('');
  const [transferAddress, setTransferAddress] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [bbwContract, setBBWContract] = useState(null);

  const bbwAddress = process.env.REACT_APP_BBW_ADDRESS;

  useEffect(() => {
    if (window.ethereum) {
      loadBlockchainData();
    } else {
      alert('Please install MetaMask to use this dApp!');
    }
  }, []);

  async function loadBlockchainData() {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const accountAddress = await signer.getAddress();
      setAccount(accountAddress);

      const contract = new ethers.Contract(bbwAddress, BBW, signer);
      setBBWContract(contract);
      const name = await contract.name();
      const symbol = await contract.symbol();
      const totalSupply = await contract.totalSupply();

      setTokenData({
        name,
        symbol,
        totalSupply: ethers.formatEther(totalSupply),
      });

      const userBalance = await contract.balanceOf(accountAddress);
      setBalance(ethers.formatEther(userBalance));
    } catch (error) {
      console.error('Error loading blockchain data:', error);
    }
  }

  async function transferTokens(event) {
    event.preventDefault();
    if (bbwContract && transferAddress && transferAmount) {
      try {
        const tx = await bbwContract.transfer(
          transferAddress,
          ethers.parseEther(transferAmount)
        );
        await tx.wait();
        alert('Transfer successful!');
        // Update balance
        const userBalance = await bbwContract.balanceOf(account);
        setBalance(ethers.formatEther(userBalance));
      } catch (error) {
        console.error('Transfer failed:', error);
        alert('Transfer failed!');
      }
    }
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center">
        {tokenData.name} ({tokenData.symbol})
      </h1>
      <p className="text-center">Total Supply: {tokenData.totalSupply} {tokenData.symbol}</p>
      <p className="text-center">Your Account: {account}</p>
      <p className="text-center">Your Balance: {balance} {tokenData.symbol}</p>

      <div className="row justify-content-center">
        <div className="col-md-12">
          <form onSubmit={transferTokens}>
            <div className="mb-3">
              <label htmlFor="address" className="form-label">
                Recipient Address
              </label>
              <input
                type="text"
                className="form-control"
                id="address"
                value={transferAddress}
                onChange={(e) => setTransferAddress(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="amount" className="form-label">
                Amount to Transfer
              </label>
              <input
                type="number"
                step="any"
                className="form-control"
                id="amount"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Transfer Tokens
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;