import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { getDefaultConfig, RainbowKitProvider, ConnectButton } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { mainnet, goerli, zora, base, baseSepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Index from './pages/Index';
import Projects from './pages/Projects';
import CreateProject from './pages/CreateProject';
import Profile from './pages/Profile';
import TradeCoinForm from './components/TradeCoinForm';
import { supabase } from './supabaseClient';
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

  // Fetch projects from Supabase
  const fetchProjects = async () => {
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (!error) setProjects(data || []);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Refetch projects after a new one is added
  const handleProjectAdded = () => {
    fetchProjects();
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
                <Link to="/trade">Trade</Link>
                <Link to="/profile">Profile</Link>
              </nav>
              <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
                <ConnectButton />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/projects" element={<Projects projects={projects} />} />
                  <Route path="/create" element={<CreateProject addProject={handleProjectAdded} />} />
                  <Route path="/trade" element={<TradeCoinForm />} />
                  <Route path="/profile" element={<Profile />} />
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