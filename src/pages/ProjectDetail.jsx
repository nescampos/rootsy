import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCoin, setApiKey } from '@zoralabs/coins-sdk';
import { supabase } from '../supabaseClient';

setApiKey(import.meta.env.VITE_ZORA_API);

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
        // Fetch project from Supabase
        const { data: projectData, error: projectError } = await supabase.from('projects').select('*').eq('coin_address', coinAddress).single();
        if (projectError || !projectData) {
          setError('Project not found.');
          setLoading(false);
          return;
        }
        setProject(projectData);
        // Fetch coin details from Zora SDK
        const coinRes = await getCoin({ address: coinAddress, chain: projectData.chain_id });
        setCoin(coinRes?.data?.zora20Token);
      } catch (err) {
        setError('Could not fetch project or coin details.');
      } finally {
        setLoading(false);
      }
    };
    if (coinAddress) fetchData();
  }, [coinAddress]);

  if (loading) return <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>Loading...</div>;
  if (error) return <div style={{ maxWidth: 600, margin: '0 auto', padding: 24, color: '#b91c1c' }}>{error}</div>;
  if (!project) return null;

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
      <div className="card">
        {project.image_uri && (
          <img src={project.image_uri.replace('ipfs://', 'https://ipfs.io/ipfs/')} alt={project.name} style={{ width: '100%', borderRadius: 12, marginBottom: 16 }} />
        )}
        <h2>{project.name} <span style={{ color: '#6366f1', fontWeight: 400 }}>({project.symbol})</span></h2>
        <div style={{ marginBottom: 8 }}>{project.description}</div>
        <a href={project.repo} target="_blank" rel="noopener noreferrer">Repository</a>
        <div style={{ fontSize: 13, color: '#666', marginTop: 8 }}>Payout: {project.payout_recipient}</div>
        <div style={{ fontSize: 13, color: '#666' }}>Chain ID: {project.chain_id}</div>
        <div style={{ fontSize: 13, color: '#666' }}>Coin Address: {project.coin_address}</div>
        <div style={{ fontSize: 13, color: '#666' }}>Currency: {project.currency}</div>
      </div>
      {coin && (
        <div className="card">
          <h3>Coin Details</h3>
          <div><b>Name:</b> {coin.name}</div>
          <div><b>Symbol:</b> {coin.symbol}</div>
          <div><b>Description:</b> {coin.description}</div>
          <div><b>Total Supply:</b> {coin.totalSupply}</div>
          <div><b>Market Cap:</b> {coin.marketCap}</div>
          <div><b>24h Volume:</b> {coin.volume24h}</div>
          <div><b>Creator:</b> {coin.creatorAddress}</div>
          <div><b>Created At:</b> {coin.createdAt}</div>
          <div><b>Unique Holders:</b> {coin.uniqueHolders}</div>
          {coin.mediaContent?.previewImage && (
            <img src={coin.mediaContent.previewImage} alt={coin.symbol} style={{ width: 120, borderRadius: 8, marginTop: 12 }} />
          )}
        </div>
      )}
    </div>
  );
}

export default ProjectDetail; 