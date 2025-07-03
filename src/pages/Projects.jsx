import React from 'react';
import { Link } from 'react-router-dom';
import ProjectList from '../components/ProjectList';

const CHAIN_NAMES = {
  8453: 'Base',
  84532: 'Base Sepolia',
  7777777: 'Zora',
};

function Projects({ projects }) {
  return (
    <>
      <h2 style={{ marginBottom: 24 }}>Available Projects</h2>
      {projects.length === 0 ? (
        <p>No projects yet.</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: projects.length > 1 ? '1fr 1fr' : '1fr',
          gap: 24,
          marginBottom: 32
        }}>
          {projects.map((project, idx) => (
            <Link key={project.id || idx} to={`/project/${project.coin_address}`} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ cursor: 'pointer', transition: 'box-shadow 0.2s, transform 0.2s', minHeight: 220 }}>
                <h3 style={{ fontWeight: 700, fontSize: '1.25rem', marginBottom: 6 }}>{project.name} <span style={{ color: '#6366f1', fontWeight: 400 }}>({project.symbol})</span></h3>
                <p style={{ color: '#666', marginBottom: 8 }}>{project.description}</p>
                <a href={project.repo} target="_blank" rel="noopener noreferrer" style={{ color: '#7c3aed', fontWeight: 600 }}>Repo</a>
                <p style={{ fontSize: 13, color: '#666', margin: '8px 0 0 0' }}>Payout: {project.payout_recipient}</p>
                <p style={{ fontSize: 13, color: '#666' }}>Chain: {CHAIN_NAMES[project.chain_id] || project.chain_id}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

export default Projects; 