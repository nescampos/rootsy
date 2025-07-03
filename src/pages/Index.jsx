import React from 'react';
import { Link } from 'react-router';

function Index() {
  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
      <h1>Rootsy</h1>
      <p>
        Welcome to Rootsy! This platform helps open source developers create their own coins and receive funding for their projects using the Zora protocol.
      </p>
      <ul>
        <li><Link to="/projects">View Projects</Link></li>
        <li><Link to="/create">Create a Project</Link></li>
      </ul>
    </div>
  );
}

export default Index; 