import React, { useState } from 'react';

function ProjectForm({ addProject }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [repo, setRepo] = useState('');
  const [wallet, setWallet] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !description || !repo || !wallet) return;
    addProject({ name, description, repo, wallet });
    setName('');
    setDescription('');
    setRepo('');
    setWallet('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ margin: '24px 0' }}>
      <h2>Submit Your Project</h2>
      <input
        type="text"
        placeholder="Project Name"
        value={name}
        onChange={e => setName(e.target.value)}
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
        type="text"
        placeholder="Wallet Address"
        value={wallet}
        onChange={e => setWallet(e.target.value)}
        required
        style={{ width: '100%', marginBottom: 8 }}
      />
      <button type="submit">Add Project</button>
    </form>
  );
}

export default ProjectForm; 