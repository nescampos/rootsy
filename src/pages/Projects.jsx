import React from 'react';
import ProjectList from '../components/ProjectList';

function Projects({ projects }) {
  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
      <h2>Available Projects</h2>
      <ProjectList projects={projects} />
    </div>
  );
}

export default Projects; 