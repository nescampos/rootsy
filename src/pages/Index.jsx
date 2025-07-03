import React from 'react';
import { Link } from 'react-router-dom';

function Index() {
  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
      <h1>Welcome to Rootsy</h1>
      <div className="card" style={{ marginBottom: 32 }}>
        <h2 style={{ color: '#6366f1', marginBottom: 12 }}>Empowering Open Source Innovation</h2>
        <p>
          <b>Rootsy</b> is a next-generation platform designed to help open source developers fund, launch, and grow their projects using the power of blockchain and decentralized finance. We believe that open source is the backbone of digital progress, but too often, creators struggle to find sustainable funding.
        </p>
        <p>
          <b>What can you do on Rootsy?</b>
        </p>
        <ul style={{ marginLeft: 20, marginBottom: 16 }}>
          <li><b>Submit your open source project</b> and instantly create your own ERC-20 coin ("Creator Coin") on the Zora protocol.</li>
          <li><b>Fund projects you believe in</b> by purchasing or trading their coins using ETH or ZORA.</li>
          <li><b>Track your profile</b> and see your balances for all coins created on the platform.</li>
          <li><b>Explore detailed project and coin analytics</b> powered by Zora's onchain data.</li>
        </ul>
        <p>
          <b>Why fund open source?</b><br/>
          Open source software powers the internet, science, and innovation. By funding open source projects, you support the creators who build the tools and infrastructure we all rely on. Your support helps projects grow, stay secure, and remain free for everyone.
        </p>
        <p>
          <b>Why use Zora Creator Coins?</b><br/>
          Zora Creator Coins are ERC-20 tokens deployed on the Zora protocol, designed for creators and communities. They enable:
        </p>
        <ul style={{ marginLeft: 20, marginBottom: 16 }}>
          <li><b>Direct, transparent funding</b>—Support projects by buying their coins, with all transactions onchain.</li>
          <li><b>Tradable project tokens</b>—Coins can be traded, held, or used for community rewards and governance.</li>
          <li><b>Programmable incentives</b>—Creators can build new experiences, rewards, or access using their coins.</li>
          <li><b>Open, permissionless access</b>—Anyone can create, fund, or trade coins without gatekeepers.</li>
        </ul>
        <p>
          <b>Get started:</b> Connect your wallet, browse projects, or launch your own. Join us in building a more sustainable, community-driven future for open source!
        </p>
      </div>
      <ul>
        <li><Link to="/projects">View Projects</Link></li>
        <li><Link to="/create">Create a Project</Link></li>
        <li><Link to="/trade">Trade Coins</Link></li>
        <li><Link to="/profile">Your Profile</Link></li>
      </ul>
    </div>
  );
}

export default Index; 