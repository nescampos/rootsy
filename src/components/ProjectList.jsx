import React from 'react';

function ProjectList({ projects }) {
  const fundProject = (wallet) => {
    alert(`Fund this project at wallet: ${wallet}`);
  };

  if (projects.length === 0) return <p>No projects yet.</p>;

  return (
    <div>
      <h2>Projects</h2>
      {projects.map((project, idx) => (
        <div key={idx} style={{ border: '1px solid #ccc', padding: 12, marginBottom: 12 }}>
          <h3>{project.name}</h3>
          <p>{project.description}</p>
          <a href={project.repo} target="_blank" rel="noopener noreferrer">Repo</a>
          <p>Wallet: {project.wallet}</p>
          <button onClick={() => fundProject(project.wallet)}>Fund</button>
        </div>
      ))}
    </div>
  );
}

export default ProjectList; 