import React from 'react';
import ProjectForm from '../components/ProjectForm';

function CreateProject({ addProject }) {
  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
      <h2>Create a New Project</h2>
      <ProjectForm addProject={addProject} />
    </div>
  );
}

export default CreateProject; 