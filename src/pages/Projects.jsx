import React from 'react';
import ProjectList from '../components/ProjectList';

function Projects({ projects }) {
  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
      <h2>Available Projects</h2>
      {projects.length === 0 ? (
        <p>No projects yet.</p>
      ) : (
        projects.map((project, idx) => (
          <div key={project.id || idx} className="card">
            {project.image_uri && (
              <img src={project.image_uri.replace('ipfs://', 'https://ipfs.io/ipfs/')} alt={project.name} style={{ width: '100%', borderRadius: 8, marginBottom: 12 }} />
            )}
            <h3>{project.name} <span style={{ color: '#6366f1', fontWeight: 400 }}>({project.symbol})</span></h3>
            <p>{project.description}</p>
            <a href={project.repo} target="_blank" rel="noopener noreferrer">Repo</a>
            <p style={{ fontSize: 13, color: '#666' }}>Payout: {project.payout_recipient}</p>
            <p style={{ fontSize: 13, color: '#666' }}>Chain ID: {project.chain_id}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Projects; 