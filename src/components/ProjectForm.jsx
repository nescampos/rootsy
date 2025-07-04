import React, { useState } from 'react';
import { useAccount, useChainId, useWalletClient } from 'wagmi';
import { createCoin } from '../zora/coinCreate';
// import * as w3up from '@web3-storage/w3up-client';
import { supabase } from '../supabaseClient';
import axios from 'axios';

const BASE_SEPOLIA_CHAIN_ID = 84532;

function ProjectForm({ addProject }) {
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [description, setDescription] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [image, setImage] = useState(null);
  // const [imageUri, setImageUri] = useState('');
  const [uploading, setUploading] = useState(false);
  const [currency, setCurrency] = useState('ZORA');
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: walletClient } = useWalletClient();
  const [validationError, setValidationError] = useState('');
  const [validating, setValidating] = useState(false);

  // Commented out IPFS upload logic
  // const handleImageChange = async (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;
  //   setUploading(true);
  //   try {
  //     // Set up w3up client and space
  //     const client = await w3up.create();
  //     await client.login(import.meta.env.VITE_W3UP_EMAIL);
  //     await client.setCurrentSpace(import.meta.env.VITE_W3UP_SPACE);
  //     // Upload file
  //     const cid = await client.uploadFile(file);
  //     const uri = `ipfs://${cid}`;
  //     setImageUri(uri);
  //     setImage(file);
  //   } catch (err) {
  //     alert('Image upload failed');
  //     alert(err);
  //   } finally {
  //     setUploading(false);
  //   }
  // };

  // Only keep local file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
  };

  // Helper: Detect if URL is a PR or repo, and extract info
  function parseGitHubUrl(url) {
    // PR: github.com/{owner}/{repo}/pull/{number}
    const prMatch = url.match(/github.com[/:]([^/]+)\/([^/]+)\/pull\/(\d+)/i);
    if (prMatch) {
      return { type: 'pr', owner: prMatch[1], repo: prMatch[2].replace(/\.git$/, ''), number: prMatch[3] };
    }
    // Repo: github.com/{owner}/{repo}
    const repoMatch = url.match(/github.com[/:]([^/]+)\/([^/]+)(?:$|[?#/])/i);
    if (repoMatch) {
      return { type: 'repo', owner: repoMatch[1], repo: repoMatch[2].replace(/\.git$/, '') };
    }
    return null;
  }

  // Validate wallet address in PR body or README
  async function validateGitHubOwnership(githubUrl, walletAddress) {
    const info = parseGitHubUrl(githubUrl);
    if (!info) return false;
    if (info.type === 'pr') {
      // Check PR body
      try {
        const prRes = await axios.get(`https://api.github.com/repos/${info.owner}/${info.repo}/pulls/${info.number}`);
        if ((prRes.data?.body || '').toLowerCase().includes(walletAddress.toLowerCase())) {
          return true;
        }
      } catch {}
      return false;
    } else if (info.type === 'repo') {
      // Check README
      try {
        const readmeRes = await axios.get(`https://raw.githubusercontent.com/${info.owner}/${info.repo}/main/README.md`);
        if (readmeRes?.data && readmeRes.data.toLowerCase().includes(walletAddress.toLowerCase())) {
          return true;
        }
      } catch {}
      return false;
    }
    return false;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    setValidating(true);
    if (!name || !symbol || !description || !githubUrl || !image || !address || !chainId || !walletClient) {
      setValidating(false);
      return;
    }
    // Validate GitHub ownership (README or PR)
    const valid = await validateGitHubOwnership(githubUrl, address);
    setValidating(false);
    if (!valid) {
      setValidationError('Your wallet address was not found in the repository README or the pull request body. Please add your address to the README or PR description.');
      return;
    }
    let coinResult;
    try {
      coinResult = await createCoin({
        name,
        symbol,
        payoutRecipient: address,
        chainId,
        description,
        image,
        repo: githubUrl,
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
        repo: githubUrl,
        image_uri: image ? image.name : '', // Just store the file name or leave blank
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
    addProject({ name, symbol, description, repo: githubUrl, image, payoutRecipient: address, chainId, coinAddress, currency: chainId === BASE_SEPOLIA_CHAIN_ID ? 'ETH' : currency });
    setName('');
    setSymbol('');
    setDescription('');
    setGithubUrl('');
    setImage(null);
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
        placeholder="GitHub Repository or Pull Request URL"
        value={githubUrl}
        onChange={e => setGithubUrl(e.target.value)}
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
      {validationError && <div style={{ color: '#b91c1c', marginBottom: 12 }}>{validationError}</div>}
      <button type="submit" disabled={!isConnected || uploading || !image || !walletClient || validating}>
        {validating ? 'Validating GitHub...' : 'Add Project'}
      </button>
    </form>
  );
}

export default ProjectForm; 