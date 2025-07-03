import React, { useState } from 'react';
import { createCoin } from '../zora/coinCreate';

function CoinCreateForm() {
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    alert(`Create coin: ${name} (${symbol})`);
    await createCoin({ name, symbol, signer: null }); // TODO: pass real signer
    setName('');
    setSymbol('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ margin: '24px 0' }}>
      <h2>Create Coin</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
        required
        style={{ width: '100%', marginBottom: 8 }}
      />
      <input
        type="text"
        placeholder="Symbol"
        value={symbol}
        onChange={e => setSymbol(e.target.value)}
        required
        style={{ width: '100%', marginBottom: 8 }}
      />
      <button type="submit">Create</button>
    </form>
  );
}

export default CoinCreateForm; 