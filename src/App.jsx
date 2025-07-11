import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import { getDefaultConfig, RainbowKitProvider, ConnectButton } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Index from './pages/Index';
import Projects from './pages/Projects';
import CreateProject from './pages/CreateProject';
import Profile from './pages/Profile';
import TradeCoinForm from './components/TradeCoinForm';
import ProjectDetail from './pages/ProjectDetail';
import { supabase } from './supabaseClient';
import './styles.css';

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'rootsy-zora-funding';

const config = getDefaultConfig({
  appName: 'Rootsy',
  projectId,
  chains: [base, baseSepolia],
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
              <nav className="navbar">
                <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
                <NavLink to="/projects" className={({ isActive }) => isActive ? 'active' : ''}>Projects</NavLink>
                <NavLink to="/create" className={({ isActive }) => isActive ? 'active' : ''}>Create</NavLink>
                <NavLink to="/trade" className={({ isActive }) => isActive ? 'active' : ''}>Trade</NavLink>
                <NavLink to="/profile" className={({ isActive }) => isActive ? 'active' : ''}>Profile</NavLink>
                <span style={{ marginLeft: 'auto' }}><ConnectButton /></span>
              </nav>
              <div className="main-content">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/projects" element={<Projects projects={projects} />} />
                  <Route path="/create" element={<CreateProject addProject={handleProjectAdded} />} />
                  <Route path="/trade" element={<TradeCoinForm />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/project/:coinAddress" element={<ProjectDetail />} />
                </Routes>
              </div>
              <footer className="footer">
                &copy; {new Date().getFullYear()} Rootsy &mdash; Funding Open Source with Zora Creator Coins
              </footer>
            </div>
          </Router>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App; 