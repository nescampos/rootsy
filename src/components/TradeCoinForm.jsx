import React, { useState, useEffect } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { tradeCoin, setApiKey } from '@zoralabs/coins-sdk';
import { supabase } from '../supabaseClient';
import { parseEther } from 'viem';

setApiKey(import.meta.env.VITE_ZORA_API);

function TradeCoinForm() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [coins, setCoins] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState('');
  const [direction, setDirection] = useState('eth-to-coin');
  const [amount, setAmount] = useState('');
  const [slippage, setSlippage] = useState(1);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  // Base mainnet chain ID
  const BASE_MAINNET_CHAIN_ID = "8453";
  const isBaseMainnet = chainId === BASE_MAINNET_CHAIN_ID;

  useEffect(() => {
    const fetchCoins = async () => {
      const { data, error } = await supabase.from('projects').select('coin_address, name, symbol, chain_id');
      if (!error && data) setCoins(data.filter(c => c.coin_address && c.chain_id === BASE_MAINNET_CHAIN_ID));
    };
    fetchCoins();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    setError('');
    if (!isConnected || !address || !selectedCoin || !amount || !chainId) {
      setError('Please fill all fields and connect your wallet.');
      return;
    }
    try {
      setStatus('Preparing transaction...');
      // Prepare trade parameters
      let tradeParameters;
      if (direction === 'eth-to-coin') {
        tradeParameters = {
          sell: { type: 'eth' },
          buy: { type: 'erc20', address: selectedCoin },
          amountIn: parseEther(amount),
          slippage: Number(slippage) / 100,
          sender: address,
        };
      } else {
        tradeParameters = {
          sell: { type: 'erc20', address: selectedCoin },
          buy: { type: 'eth' },
          amountIn: parseEther(amount), // User must enter correct decimals
          slippage: Number(slippage) / 100,
          sender: address,
        };
      }
      // Get walletClient and publicClient from wagmi
      // (Assume window.ethereum is injected and use viem for walletClient)
      const { createWalletClient, createPublicClient, http } = await import('viem');
      const { base } = await import('viem/chains');
      const walletClient = createWalletClient({
        chain: base,
        transport: http(),
        account: address,
      });
      const publicClient = createPublicClient({
        chain: base,
        transport: http(),
      });
      setStatus('Sending transaction...');
      const receipt = await tradeCoin({
        tradeParameters,
        walletClient,
        account: address,
        publicClient,
      });
      setStatus('Trade successful! Tx hash: ' + receipt?.transactionHash);
    } catch (err) {
      setError('Trade failed: ' + (err?.message || err));
      setStatus('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card" style={{ margin: '32px 0' }}>
      <h2>Trade Coin</h2>
      <div style={{ marginBottom: 12 }}>
        <label>Coin:</label>
        <select value={selectedCoin} onChange={e => setSelectedCoin(e.target.value)} style={{ width: '100%', marginBottom: 8 }} required>
          <option value="">Select a coin</option>
          {coins.map((coin, idx) => (
            <option key={coin.coin_address} value={coin.coin_address}>
              {coin.name} ({coin.symbol})
            </option>
          ))}
        </select>
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>Option:</label>
        <select value={direction} onChange={e => setDirection(e.target.value)} style={{ width: '100%', marginBottom: 8 }}>
          <option value="eth-to-coin">Buy</option>
          <option value="coin-to-eth">Sell</option>
        </select>
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>Amount:</label>
        <input type="number" min="0" step="any" value={amount} onChange={e => setAmount(e.target.value)} required style={{ width: '100%' }} />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>Slippage (%):</label>
        <input type="number" min="0" max="99" step="0.01" value={slippage} onChange={e => setSlippage(e.target.value)} required style={{ width: '100%' }} />
      </div>
      {status && <div style={{ color: '#059669', marginBottom: 8 }}>{status}</div>}
      {error && <div style={{ color: '#b91c1c', marginBottom: 8 }}>{error}</div>}
      {!isBaseMainnet && (
        <div style={{ color: '#b91c1c', marginBottom: 8 }}>
          Trading is only available on Base mainnet. Please switch your wallet network to Base.
        </div>
      )}
      <button type="submit" disabled={!isConnected || !selectedCoin || !amount || !isBaseMainnet}>Trade</button>
    </form>
  );
}

export default TradeCoinForm; 