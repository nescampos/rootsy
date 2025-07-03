// coinCreate.js
// Functions to create new coins with Zora SDK

import { createCoin as zoraCreateCoin, createMetadataBuilder, createZoraUploaderForCreator, DeployCurrency } from '@zoralabs/coins-sdk';
import { createWalletClient, createPublicClient, http } from 'viem';
import { base } from 'viem/chains';

/**
 * Create a new Zora coin (ERC-20) with metadata upload.
 * @param {Object} params
 * @param {string} params.name - Coin name
 * @param {string} params.symbol - Coin symbol
 * @param {string} params.payoutRecipient - Address to receive creator earnings
 * @param {object} params.signer - Wallet client (viem)
 * @param {string} [params.description] - Coin description
 * @param {File} [params.image] - Optional image file for metadata
 * @returns {Promise<Object>} Coin creation result
 */
export async function createCoin({ name, symbol, payoutRecipient, signer, description = '', image = undefined }) {
  try {
    // 1. Build and upload metadata
    const metadataBuilder = createMetadataBuilder()
      .withName(name)
      .withSymbol(symbol)
      .withDescription(description || `A coin for ${name}`);
    if (image) {
      metadataBuilder.withImage(image);
    }
    const { createMetadataParameters } = await metadataBuilder.upload(
      createZoraUploaderForCreator(payoutRecipient)
    );

    // 2. Set up viem clients (public client for base chain)
    const publicClient = createPublicClient({
      chain: base,
      transport: http(), // Uses default RPC, can be customized
    });

    // 3. Prepare coin creation parameters
    const coinParams = {
      ...createMetadataParameters,
      payoutRecipient,
      chainId: base.id,
      currency: DeployCurrency.ZORA, // or DeployCurrency.ETH
    };

    // 4. Call Zora SDK to create the coin
    const result = await zoraCreateCoin(coinParams, signer, publicClient, {
      gasMultiplier: 120, // Optional: 20% gas buffer
    });

    // 5. Return result (includes tx hash, coin address, deployment info)
    return result;
  } catch (error) {
    console.error('Error creating coin:', error);
    throw error;
  }
} 