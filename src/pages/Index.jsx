import React from 'react';
import { Link } from 'react-router-dom';
import { FaSeedling } from 'react-icons/fa';

function Index() {
  return (
    <>
      <div className="card" style={{ textAlign: 'center', marginTop: 24, marginBottom: 40, background: 'linear-gradient(120deg, #6366f1 0%, #7c3aed 100%)', color: 'white', boxShadow: '0 8px 32px rgba(99,102,241,0.18)' }}>
        <FaSeedling size={48} style={{ marginBottom: 16, color: '#a5b4fc' }} />
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: 8 }}>Welcome to Rootsy</h1>
        <h2 style={{ color: '#e0e7ff', marginBottom: 18, fontWeight: 600 }}>Empowering Open Source Innovation</h2>
        <p style={{ fontSize: '1.15rem', marginBottom: 18, color: '#f8fafc' }}>
          <b>Rootsy</b> is a next-generation platform to help open source developers fund, launch, and grow their projects using blockchain and decentralized finance.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 18, flexWrap: 'wrap' }}>
          <Link to="/projects"><button>View Projects</button></Link>
          <Link to="/create"><button>Create a Project</button></Link>
          <Link to="/trade"><button>Trade Coins</button></Link>
          <Link to="/profile"><button>Your Profile</button></Link>
        </div>
      </div>
      <div className="card" style={{ marginBottom: 32 }}>
        <h2 style={{ color: '#6366f1', marginBottom: 12 }}>How It Works</h2>
        <ul style={{ marginLeft: 20, marginBottom: 16 }}>
          <li><b>Submit your open source project</b> and instantly create your own ERC-20 coin ("Creator Coin") on the Zora protocol.</li>
          <li><b>Fund projects you believe in</b> by purchasing or trading their coins using ETH or ZORA.</li>
          <li><b>Track your profile</b> and see your balances for all coins created on the platform.</li>
          <li><b>Explore detailed project and coin analytics</b> powered by Zora's onchain data.</li>
        </ul>
        <h3 style={{ color: '#6366f1', marginBottom: 8 }}>Why fund open source?</h3>
        <p style={{ marginBottom: 12 }}>
          Open source software powers the internet, science, and innovation. By funding open source projects, you support the creators who build the tools and infrastructure we all rely on.
        </p>
        <h3 style={{ color: '#6366f1', marginBottom: 8 }}>Why use Zora Creator Coins?</h3>
        <ul style={{ marginLeft: 20, marginBottom: 16 }}>
          <li><b>Direct, transparent funding</b>—Support projects by buying their coins, with all transactions onchain.</li>
          <li><b>Tradable project tokens</b>—Coins can be traded, held, or used for community rewards and governance.</li>
          <li><b>Programmable incentives</b>—Creators can build new experiences, rewards, or access using their coins.</li>
          <li><b>Open, permissionless access</b>—Anyone can create, fund, or trade coins without gatekeepers.</li>
        </ul>
        <p style={{ color: '#6366f1', fontWeight: 600, marginTop: 18 }}>
          Get started: Connect your wallet, browse projects, or launch your own. Join us in building a more sustainable, community-driven future for open source!
        </p>
      </div>
    </>
  );
}

export default Index; 