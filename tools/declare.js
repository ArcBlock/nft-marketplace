/* eslint-disable no-console */
require('dotenv').config();

// eslint-disable-next-line import/no-extraneous-dependencies
const ForgeSDK = require('@arcblock/forge-sdk');
const { wallet } = require('../api/libs/auth');

const env = require('../api/libs/env');

(async () => {
  try {
    const res = await ForgeSDK.sendDeclareTx({
      tx: {
        itx: {
          moniker: 'nft_marketplace',
        },
      },
      wallet,
    });
    console.log('Application wallet declared', wallet);
    console.log('Application wallet declared', res);
    if (env.assetChainId) {
      const hash = await ForgeSDK.declare(
        {
          moniker: 'nft_marketplace',
          wallet,
        },
        { conn: env.assetChainId }
      );
      console.log(`Application declared on chain ${env.assetChainId}`, hash);
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    console.error(err.errors);
    process.exit(1);
  }
})();
