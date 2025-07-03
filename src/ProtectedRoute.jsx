import React from 'react';
import { useAccount } from 'wagmi';
import { Navigate } from 'react-router';

function ProtectedRoute({ children }) {
  const { isConnected } = useAccount();
  if (!isConnected) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default ProtectedRoute; 