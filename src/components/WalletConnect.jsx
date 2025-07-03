import React from 'react';
import { getDefaultWallets, RainbowKitProvider, ConnectButton } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { mainnet, goerli, zora } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

const { chains, publicClient } = configureChains(
  [zora, goerli, mainnet],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'Rootsy Zora Funding',
  projectId: 'rootsy-zora-funding',
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

function WalletConnect() {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <ConnectButton />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default WalletConnect; 