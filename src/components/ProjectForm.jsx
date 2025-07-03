import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { createCoin } from '../zora/coinCreate';

function ProjectForm({ addProject }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [repo, setRepo] = useState('');
  const [wallet, setWallet] = useState('');
  const { isConnected } = useAccount();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !description || !repo || !wallet) return;
    // Generate a default symbol from the project name
    const symbol = name.slice(0, 4).toUpperCase();
    // Create the coin
    alert(`Creating coin for project: ${name} (${symbol})`);
    await createCoin({ name, symbol, signer: null }); // TODO: pass real signer
    // Add the project
    addProject({ name, description, repo, wallet, symbol });
    setName('');
    setDescription('');
    setRepo('');
    setWallet('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ margin: '24px 0' }}>
      <h2>Submit Your Project</h2>
      {!isConnected && <div style={{ color: '#b91c1c', marginBottom: 12 }}>Connect your wallet to create a project.</div>}
      <input
        type="text"
        placeholder="Project Name"
        value={name}
        onChange={e => setName(e.target.value)}
        required
        style={{ width: '100%', marginBottom: 8 }}
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        required
        style={{ width: '100%', marginBottom: 8 }}
      />
      <input
        type="url"
        placeholder="Repository Link"
        value={repo}
        onChange={e => setRepo(e.target.value)}
        required
        style={{ width: '100%', marginBottom: 8 }}
      />
      <input
        type="text"
        placeholder="Wallet Address"
        value={wallet}
        onChange={e => setWallet(e.target.value)}
        required
        style={{ width: '100%', marginBottom: 8 }}
      />
      <button type="submit" disabled={!isConnected}>Add Project</button>
    </form>
  );
}

export default ProjectForm; 