import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useChainId } from 'wagmi';

const CHAIN_NAMES = {
  8453: 'Base',
  84532: 'Base Sepolia'
};

function Projects({ projects }) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 30;
  const chainId = useChainId();

  // Only show projects for the connected chain
  const chainFiltered = projects.filter(project => String(project.chain_id) === String(chainId));

  // Filter projects by search
  const filtered = chainFiltered.filter(project =>
    project.name.toLowerCase().includes(search.toLowerCase()) ||
    project.symbol.toLowerCase().includes(search.toLowerCase()) ||
    project.description.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <>
      <h2 style={{ marginBottom: 24 }}>Available Projects</h2>
      <input
        type="text"
        placeholder="Search projects..."
        value={search}
        onChange={e => { setSearch(e.target.value); setPage(1); }}
        style={{ width: '100%', maxWidth: 400, marginBottom: 20, padding: 8, fontSize: 16, borderRadius: 8, border: '1px solid #ccc' }}
      />
      {paginated.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: paginated.length > 1 ? '1fr 1fr' : '1fr',
          gap: 24,
          marginBottom: 32
        }}>
          {paginated.map((project, idx) => (
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
      {/* Pagination controls */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 32 }}>
          <button onClick={() => setPage(page - 1)} disabled={page === 1}>&lt; Prev</button>
          <span style={{ alignSelf: 'center' }}>Page {page} of {totalPages}</span>
          <button onClick={() => setPage(page + 1)} disabled={page === totalPages}>Next &gt;</button>
        </div>
      )}
    </>
  );
}

export default Projects; 