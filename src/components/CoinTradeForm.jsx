import React, { useState } from 'react';
import { tradeCoin } from '../zora/coinTrade';

function CoinTradeForm() {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [tokenAddress, setTokenAddress] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    alert(`Trade coin: ${amount} to ${recipient} (token: ${tokenAddress})`);
    await tradeCoin({ recipient, amount, tokenAddress, signer: null }); // TODO: pass real signer
    setRecipient('');
    setAmount('');
    setTokenAddress('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ margin: '24px 0' }}>
      <h2>Trade Coin</h2>
      <input
        type="text"
        placeholder="Recipient Address"
        value={recipient}
        onChange={e => setRecipient(e.target.value)}
        required
        style={{ width: '100%', marginBottom: 8 }}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        required
        style={{ width: '100%', marginBottom: 8 }}
      />
      <input
        type="text"
        placeholder="Token Address"
        value={tokenAddress}
        onChange={e => setTokenAddress(e.target.value)}
        required
        style={{ width: '100%', marginBottom: 8 }}
      />
      <button type="submit">Trade</button>
    </form>
  );
}

export default CoinTradeForm; 