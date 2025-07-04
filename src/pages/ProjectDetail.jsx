import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCoin, setApiKey } from '@zoralabs/coins-sdk';
import { supabase } from '../supabaseClient';

setApiKey(import.meta.env.VITE_ZORA_API);

const CHAIN_NAMES = {
  8453: 'Base',
  84532: 'Base Sepolia'
};

function isAddress(str) {
  return /^0x[a-fA-F0-9]{40}$/.test(str);
}

function getZoraUrl(chainId, address) {
  if (!address) return null;
  if (chainId === "8453") return `https://zora.co/coin/base:${address}`;
  if (chainId === "84532") return `https://testnet.zora.co/coin/bsep:${address}`;
  return null;
}

function ProjectDetail() {
  const { coinAddress } = useParams();
  const [project, setProject] = useState(null);
  const [coin, setCoin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        let projectData, projectError;
        if (isAddress(coinAddress)) {
          // Fetch by coin_address
          ({ data: projectData, error: projectError } = await supabase.from('projects').select('*').eq('coin_address', coinAddress).single());
        } else {
          // Fetch by name (slugified)
          const name = coinAddress.replace(/-/g, ' ');
          ({ data: projectData, error: projectError } = await supabase.from('projects').select('*').ilike('name', name));
          if (Array.isArray(projectData)) projectData = projectData[0];
        }
        if (projectError || !projectData) {
          setError('Project not found.');
          setLoading(false);
          return;
        }
        setProject(projectData);
        // Fetch coin details from Zora SDK if coin_address exists
        if (projectData.coin_address) {
          const coinRes = await getCoin({ address: projectData.coin_address, chain: projectData.chain_id });
          setCoin(coinRes?.data?.zora20Token);
        } else {
          setCoin(null);
        }
      } catch (err) {
        setError('Could not fetch project or coin details.');
      } finally {
        setLoading(false);
      }
    };
    if (coinAddress) fetchData();
  }, [coinAddress]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: '#b91c1c' }}>{error}</div>;
  if (!project) return null;

  const zoraUrl = getZoraUrl(project.chain_id, project.coin_address);

  return (
    <>
      <div className="card" style={{ animation: 'fadeInUp 0.7s cubic-bezier(.4,0,.2,1)' }}>
        <h2 style={{ fontWeight: 800 }}>{project.name} <span style={{ color: '#6366f1', fontWeight: 400 }}>({project.symbol})</span></h2>
        <div style={{ marginBottom: 8 }}>{project.description}</div>
        <a href={project.repo} target="_blank" rel="noopener noreferrer" style={{ color: '#7c3aed', fontWeight: 600 }}>Repository</a>
        <div style={{ fontSize: 13, color: '#666', marginTop: 8 }}>Payout: {project.payout_recipient}</div>
        <div style={{ fontSize: 13, color: '#666' }}>Chain: {CHAIN_NAMES[project.chain_id] || project.chain_id}</div>
        <div style={{ fontSize: 13, color: '#666' }}>Coin Address: {project.coin_address}</div>
        <div style={{ fontSize: 13, color: '#666' }}>Currency: {project.currency}</div>
        {zoraUrl && (
          <a href={zoraUrl} target="_blank" rel="noopener noreferrer">
            <button style={{ marginTop: 16, width: '100%', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '0.01em' }}>View/Trade on Zora Platform</button>
          </a>
        )}
      </div>
      {coin && (
        <div className="card" style={{ animation: 'fadeInUp 0.7s cubic-bezier(.4,0,.2,1)' }}>
          <h3 style={{ fontWeight: 700 }}>Coin Details</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12 }}>
            <tbody>
              <tr>
                <td style={{ fontWeight: 600, padding: '6px 8px', color: '#6366f1' }}>Total Supply</td>
                <td style={{ padding: '6px 8px', textAlign: 'right' }}>{Number(coin.totalSupply).toLocaleString()}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600, padding: '6px 8px', color: '#6366f1' }}>Market Cap</td>
                <td style={{ padding: '6px 8px', textAlign: 'right' }}>{coin.marketCap ? (Number(coin.marketCap) / 1e18).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }) : '-'}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600, padding: '6px 8px', color: '#6366f1' }}>24h Volume</td>
                <td style={{ padding: '6px 8px', textAlign: 'right' }}>{coin.volume24h ? (Number(coin.volume24h) / 1e18).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }) : '-'}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600, padding: '6px 8px', color: '#6366f1' }}>Unique Holders</td>
                <td style={{ padding: '6px 8px', textAlign: 'right' }}>{coin.uniqueHolders ? Number(coin.uniqueHolders).toLocaleString() : '-'}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600, padding: '6px 8px', color: '#6366f1' }}>Creator</td>
                <td style={{ padding: '6px 8px', textAlign: 'right', fontFamily: 'monospace' }}>{coin.creatorAddress}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600, padding: '6px 8px', color: '#6366f1' }}>Created At</td>
                <td style={{ padding: '6px 8px', textAlign: 'right' }}>{coin.createdAt ? new Date(coin.createdAt).toLocaleString() : '-'}</td>
              </tr>
            </tbody>
          </table>
          {coin.mediaContent?.previewImage && (
            <img src={coin.mediaContent.previewImage.medium} alt={coin.symbol} style={{ width: 120, borderRadius: 8, marginTop: 12 }} />
          )}
        </div>
      )}
    </>
  );
}

export default ProjectDetail; 