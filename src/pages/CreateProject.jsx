import React from 'react';
import ProjectForm from '../components/ProjectForm';

function CreateProject({ addProject }) {
  return (
    <div style={{ maxWidth: '90%', margin: '0 auto', padding: 24 }}>
      <ProjectForm addProject={addProject} />
    </div>
  );
}

export default CreateProject; 