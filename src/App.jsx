import React, { useState } from 'react';
import WalletConnect from './components/WalletConnect';
import ProjectForm from './components/ProjectForm';
import ProjectList from './components/ProjectList';

function App() {
  const [projects, setProjects] = useState([]);

  const addProject = (project) => {
    setProjects((prev) => [...prev, project]);
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
      <h1>Rootsy</h1>
      <WalletConnect />
      <ProjectForm addProject={addProject} />
      <ProjectList projects={projects} />
    </div>
  );
}

export default App; 