import React, { useState } from 'react';
import { useAccount, useChainId, useWalletClient } from 'wagmi';
import { createCoin } from '../zora/coinCreate';
import * as w3up from '@web3-storage/w3up-client';
import { supabase } from '../supabaseClient';

const BASE_SEPOLIA_CHAIN_ID = 84532;

function ProjectForm({ addProject }) {
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [description, setDescription] = useState('');
  const [repo, setRepo] = useState('');
  const [image, setImage] = useState(null);
  const [imageUri, setImageUri] = useState('');
  const [uploading, setUploading] = useState(false);
  const [currency, setCurrency] = useState('ZORA');
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: walletClient } = useWalletClient();

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      // Set up w3up client and space
      const client = await w3up.create();
      await client.login(import.meta.env.VITE_W3UP_EMAIL);
      await client.setCurrentSpace(import.meta.env.VITE_W3UP_SPACE);
      // Upload file
      const cid = await client.uploadFile(file);
      const uri = `ipfs://${cid}`;
      setImageUri(uri);
      setImage(file);
    } catch (err) {
      alert('Image upload failed');
      alert(err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !symbol || !description || !repo || !imageUri || !address || !chainId || !walletClient) return;
    let coinResult;
    try {
      coinResult = await createCoin({
        name,
        symbol,
        payoutRecipient: address,
        chainId,
        description,
        image,
        repo,
        currency: chainId === BASE_SEPOLIA_CHAIN_ID ? 'ETH' : currency,
        signer: walletClient
      });
    } catch (err) {
      alert('Error creating coin: ' + (err?.message || err));
      return;
    }
    const coinAddress = coinResult?.address;
    if (!coinAddress) {
      alert('Coin creation failed: No address returned.');
      return;
    }
    const { error } = await supabase.from('projects').insert([
      {
        name,
        symbol,
        description,
        repo,
        image_uri: imageUri,
        payout_recipient: address,
        chain_id: chainId,
        coin_address: coinAddress,
        currency: chainId === BASE_SEPOLIA_CHAIN_ID ? 'ETH' : currency,
      }
    ]);
    if (error) {
      alert('Error saving project to Supabase: ' + error.message);
      return;
    }
    addProject({ name, symbol, description, repo, imageUri, payoutRecipient: address, chainId, coinAddress, currency: chainId === BASE_SEPOLIA_CHAIN_ID ? 'ETH' : currency });
    setName('');
    setSymbol('');
    setDescription('');
    setRepo('');
    setImage(null);
    setImageUri('');
    setCurrency('ZORA');
  };

  const isBaseSepolia = chainId === BASE_SEPOLIA_CHAIN_ID;

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
      <input
        type="text"
        placeholder="Symbol (e.g. ROOT)"
        value={symbol}
        onChange={e => setSymbol(e.target.value)}
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
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        required
        style={{ width: '100%', marginBottom: 8 }}
      />
      <div style={{ marginBottom: 12 }}>
        <label>Currency:</label>
        <select
          value={isBaseSepolia ? 'ETH' : currency}
          onChange={e => setCurrency(e.target.value)}
          disabled={isBaseSepolia}
          style={{ width: '100%', marginBottom: 8 }}
        >
          <option value="ZORA">ZORA</option>
          <option value="ETH">ETH</option>
        </select>
        {isBaseSepolia && <div style={{ color: '#6366f1', fontSize: 13 }}>Only ETH is supported on Base Sepolia.</div>}
      </div>
      {uploading && <div style={{ color: '#6366f1', marginBottom: 8 }}>Uploading image to IPFS...</div>}
      {imageUri && <div style={{ color: '#059669', marginBottom: 8 }}>Image uploaded: {imageUri}</div>}
      <button type="submit" disabled={!isConnected || uploading || !imageUri || !walletClient}>Add Project</button>
    </form>
  );
}

export default ProjectForm; 