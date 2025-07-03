import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { getDefaultConfig, RainbowKitProvider, ConnectButton } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { mainnet, goerli, zora, base, baseSepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Index from './pages/Index';
import Projects from './pages/Projects';
import CreateProject from './pages/CreateProject';
import UpdateProject from './pages/UpdateProject';
import './styles.css';

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'rootsy-zora-funding';

const config = getDefaultConfig({
  appName: 'Rootsy',
  projectId,
  chains: [base, baseSepolia, mainnet],
  ssr: false,
});
const queryClient = new QueryClient();

function App() {
  const [projects, setProjects] = useState([]);

  const addProject = (project) => {
    setProjects((prev) => [...prev, project]);
  };

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider chains={config.chains}>
          <Router>
            <div>
              <div className="app-header">Rootsy</div>
              <nav className="navbar">
                <Link to="/">Home</Link>
                <Link to="/projects">Projects</Link>
                <Link to="/create">Create</Link>
                <Link to="/update">Update</Link>
              </nav>
              <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
                <ConnectButton />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/projects" element={<Projects projects={projects} />} />
                  <Route path="/create" element={<CreateProject addProject={addProject} />} />
                  <Route path="/update" element={<UpdateProject />} />
                </Routes>
              </div>
            </div>
          </Router>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App; 