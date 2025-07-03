import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { getProfile, getProfileBalances, setApiKey } from '@zoralabs/coins-sdk';
import { supabase } from '../supabaseClient';

// Set Zora SDK API key from env
setApiKey(import.meta.env.VITE_ZORA_API);

function Profile() {
  const { address, isConnected } = useAccount();
  const [identifier, setIdentifier] = useState('');
  const [profile, setProfile] = useState(null);
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [projectCoinAddresses, setProjectCoinAddresses] = useState([]);
  const [userProjects, setUserProjects] = useState([]);

  // Fetch all project coin addresses from Supabase
  const fetchProjectCoinAddresses = async () => {
    const { data, error } = await supabase.from('projects').select('coin_address');
    if (!error && data) {
      setProjectCoinAddresses(data.map(p => p.coin_address?.toLowerCase()).filter(Boolean));
    }
  };

  // Fetch projects created by the user
  const fetchUserProjects = async (userAddress) => {
    if (!userAddress) return;
    const { data, error } = await supabase.from('projects').select('*').ilike('payout_recipient', userAddress);
    if (!error && data) setUserProjects(data);
    else setUserProjects([]);
  };

  const fetchProfile = async (id) => {
    setLoading(true);
    setError('');
    setProfile(null);
    setBalances([]);
    try {
      const response = await getProfile({ identifier: id });
      const prof = response?.data?.profile;
      setProfile(prof);
      // Fetch balances
      const balRes = await getProfileBalances({ identifier: id, count: 50 });
      const balProfile = balRes?.data?.profile;
      console.log(balProfile);
      let balList = balProfile?.coinBalances?.edges?.map(edge => edge.node) || [];
      // Filter balances to only those in projects table
      if (projectCoinAddresses.length > 0) {
        balList = balList.filter(bal =>
          bal.token?.address && projectCoinAddresses.includes(bal.token.address.toLowerCase())
        );
      }
      setBalances(balList);
    } catch (err) {
      setError('Could not fetch profile or balances.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectCoinAddresses();
  }, []);

  useEffect(() => {
    if (isConnected && address && projectCoinAddresses.length > 0) {
      setIdentifier(address);
      fetchProfile(address);
      fetchUserProjects(address);
    }
    // eslint-disable-next-line
  }, [isConnected, address, projectCoinAddresses.length]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (identifier) {
      fetchProfile(identifier);
      fetchUserProjects(identifier);
    }
  };

  return (
    <>
      <h2 style={{ marginBottom: 24 }}>Profile</h2>
      <form onSubmit={handleSearch} style={{ marginBottom: 24, display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
        <input
          type="text"
          placeholder="Wallet address or Zora handle"
          value={identifier}
          onChange={e => setIdentifier(e.target.value)}
          style={{ width: '70%', maxWidth: 340 }}
        />
        <button type="submit">Search</button>
      </form>
      {loading && <div>Loading profile...</div>}
      {error && <div style={{ color: '#b91c1c' }}>{error}</div>}
      {profile && (
        <div className="card" style={{ animation: 'fadeInUp 0.7s cubic-bezier(.4,0,.2,1)' }}>
          {profile.avatar?.medium && (
            <img src={profile.avatar.medium} alt="Profile" style={{ width: 80, height: 80, borderRadius: '50%', marginBottom: 16, objectFit: 'cover' }} />
          )}
          <h3 style={{ marginBottom: 4, fontWeight: 700 }}>{profile.displayName || profile.handle || profile.address}</h3>
          {profile.handle && <div style={{ color: '#6366f1', marginBottom: 8 }}>@{profile.handle}</div>}
          {profile.bio && <div style={{ marginBottom: 8 }}>{profile.bio}</div>}
          <div style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>Address: {profile.address}</div>
        </div>
      )}
      {balances.length > 0 && (
        <div className="card" style={{ animation: 'fadeInUp 0.7s cubic-bezier(.4,0,.2,1)' }}>
          <h4 style={{ marginBottom: 12, fontWeight: 700 }}>Coin Balances (Created Projects Only)</h4>
          {balances.map((bal, idx) => (
            <div key={bal.id || idx} style={{ marginBottom: 16, borderBottom: '1px solid #eee', paddingBottom: 10 }}>
              <div style={{ fontWeight: 600 }}>{bal.token?.name} <span style={{ color: '#6366f1' }}>({bal.token?.symbol})</span></div>
              <div style={{ fontSize: 13, color: '#666' }}>Address: {bal.token?.address}</div>
              <div style={{ fontSize: 13, color: '#666' }}>Chain ID: {bal.token?.chainId}</div>
              <div style={{ fontSize: 13, color: '#666' }}>Balance: {bal.amount?.amountDecimal} ({bal.amount?.amountRaw})</div>
              {bal.valueUsd && <div style={{ fontSize: 13, color: '#059669' }}>Value: ${parseFloat(bal.valueUsd).toFixed(2)}</div>}
              {bal.token?.media?.previewImage && (
                <img src={bal.token.media.previewImage} alt={bal.token?.symbol} style={{ width: 48, height: 48, borderRadius: 8, marginTop: 8 }} />
              )}
            </div>
          ))}
        </div>
      )}
      {balances.length === 0 && !loading && (
        <div className="card" style={{ textAlign: 'center', color: '#666', animation: 'fadeInUp 0.7s cubic-bezier(.4,0,.2,1)' }}>
          No balances for coins created in this platform's projects.
        </div>
      )}

      {/* User's created projects */}
      <h3 style={{ margin: '40px 0 18px 0', fontWeight: 800, color: '#6366f1' }}>Your Created Projects</h3>
      {userProjects.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', color: '#666' }}>No projects created yet.</div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: userProjects.length > 1 ? '1fr 1fr' : '1fr',
          gap: 24,
          marginBottom: 32
        }}>
          {userProjects.map((project, idx) => (
            <a key={project.id || idx} href={`/project/${project.coin_address}`} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ cursor: 'pointer', transition: 'box-shadow 0.2s, transform 0.2s', minHeight: 220 }}>
                <h3 style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 6 }}>{project.name} <span style={{ color: '#6366f1', fontWeight: 400 }}>({project.symbol})</span></h3>
                <p style={{ color: '#666', marginBottom: 8 }}>{project.description}</p>
                <a href={project.repo} target="_blank" rel="noopener noreferrer" style={{ color: '#7c3aed', fontWeight: 600 }}>Repo</a>
                <p style={{ fontSize: 13, color: '#666', margin: '8px 0 0 0' }}>Payout: {project.payout_recipient}</p>
                <p style={{ fontSize: 13, color: '#666' }}>Chain: {project.chain_id}</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </>
  );
}

export default Profile; 