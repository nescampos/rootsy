// coinCreate.js
// Functions to create new coins with Zora SDK

import { createCoin as zoraCreateCoin, createMetadataBuilder, createZoraUploaderForCreator, DeployCurrency, setApiKey } from '@zoralabs/coins-sdk';
import { createPublicClient, http } from 'viem';
import { base, baseSepolia, mainnet, goerli, zora } from 'wagmi/chains';

// Set Zora SDK API key from env
setApiKey(import.meta.env.VITE_ZORA_API);

const chainMap = {
  [base.id]: base,
  [baseSepolia.id]: baseSepolia,
  [mainnet.id]: mainnet,
};

/**
 * Create a new Zora coin (ERC-20) with metadata upload.
 * @param {Object} params
 * @param {string} params.name - Coin name
 * @param {string} params.symbol - Coin symbol
 * @param {string} params.payoutRecipient - Address to receive creator earnings
 * @param {number} params.chainId - Chain ID to deploy on
 * @param {string} params.description - Coin/project description
 * @param {File} params.image - Image file for metadata
 * @param {string} params.repo - Project repository link
 * @param {string} [params.currency] - 'ZORA' or 'ETH'
 * @param {object} params.signer - Wallet client (viem)
 * @returns {Promise<Object>} Coin creation result
 */
export async function createCoin({ name, symbol, payoutRecipient, chainId, description = '', image, repo = '', currency = 'ZORA', signer }) {
  try {
    // 1. Build and upload metadata
    const metadataBuilder = createMetadataBuilder()
      .withName(name)
      .withSymbol(symbol)
      .withDescription(description)
      .withProperties({
        "repo": repo
      })
    if (image) {
      metadataBuilder.withImage(image);
    }
    const { createMetadataParameters } = await metadataBuilder.upload(
      createZoraUploaderForCreator(payoutRecipient)
    );

    // 2. Set up viem public client for the selected chain
    const chain = chainMap[chainId];
    if (!chain) throw new Error('Unsupported chain');
    const publicClient = createPublicClient({
      chain,
      transport: http(),
    });

    // 3. Prepare coin creation parameters
    const coinParams = {
      ...createMetadataParameters,
      payoutRecipient,
      chainId,
      currency: currency === 'ETH' ? DeployCurrency.ETH : DeployCurrency.ZORA,
    };

    // 4. Call Zora SDK to create the coin
    const result = await zoraCreateCoin(coinParams, signer, publicClient, {
      gasMultiplier: 120,
    });

    return result;
  } catch (error) {
    console.error('Error creating coin:', error);
    throw error;
  }
} 