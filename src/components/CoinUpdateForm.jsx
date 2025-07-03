import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { updateCoin } from '../zora/coinUpdate';

function CoinUpdateForm() {
  const [tokenAddress, setTokenAddress] = useState('');
  const [newName, setNewName] = useState('');
  const [newSymbol, setNewSymbol] = useState('');
  const { isConnected } = useAccount();

  const handleSubmit = async (e) => {
    e.preventDefault();
    alert(`Update coin: ${tokenAddress} to ${newName} (${newSymbol})`);
    await updateCoin({ tokenAddress, newName, newSymbol, signer: null }); // TODO: pass real signer
    setTokenAddress('');
    setNewName('');
    setNewSymbol('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ margin: '24px 0' }}>
      <h2>Update Coin</h2>
      {!isConnected && <div style={{ color: '#b91c1c', marginBottom: 12 }}>Connect your wallet to update a coin.</div>}
      <input
        type="text"
        placeholder="Token Address"
        value={tokenAddress}
        onChange={e => setTokenAddress(e.target.value)}
        required
        style={{ width: '100%', marginBottom: 8 }}
      />
      <input
        type="text"
        placeholder="New Name"
        value={newName}
        onChange={e => setNewName(e.target.value)}
        required
        style={{ width: '100%', marginBottom: 8 }}
      />
      <input
        type="text"
        placeholder="New Symbol"
        value={newSymbol}
        onChange={e => setNewSymbol(e.target.value)}
        required
        style={{ width: '100%', marginBottom: 8 }}
      />
      <button type="submit" disabled={!isConnected}>Update</button>
    </form>
  );
}

export default CoinUpdateForm; 