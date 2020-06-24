/* eslint-disable no-console */
require('dotenv').config();

// eslint-disable-next-line import/no-extraneous-dependencies
const ForgeSDK = require('@arcblock/forge-sdk');
const { toTypeInfo } = require('@arcblock/did');
const { WalletType, fromSecretKey } = require('@arcblock/forge-wallet');
const { wallet: app } = require('../api/libs/auth');
const env = require('../api/libs/env');

const { fromBase64, fromBase58 } = ForgeSDK.Util;

const ensureIssuer = () => {
  if (!process.env.ISSUER_SK) {
    throw new Error('ISSUER_SK is required to do restricted declare');
  }
  if (!process.env.ISSUER_DID) {
    throw new Error('ISSUER_DID is required to do restricted declare');
  }

  const type = WalletType(toTypeInfo(process.env.ISSUER_DID));
  try {
    return fromSecretKey(fromBase58(process.env.ISSUER_SK), type);
  } catch (err) {
    // Do nothing
  }

  try {
    return fromSecretKey(fromBase64(process.env.ISSUER_SK), type);
  } catch (err) {
    // Do nothing
  }

  throw new Error('ISSUER_SK is neither base64_url nor base58 format!');
};

(async () => {
  try {
    const issuer = ensureIssuer();

    console.log('App wallet', app.toAddress());

    const tx1 = await ForgeSDK.prepareDeclare(
      {
        issuer: issuer.toAddress(),
        moniker: 'nft_marketplace',
        wallet: app,
      },
      { conn: env.chainId }
    );
    const tx2 = await ForgeSDK.finalizeDeclare(
      {
        tx: tx1,
        wallet: issuer,
      },
      { conn: env.chainId }
    );

    const hash = await ForgeSDK.sendDeclareTx(
      { tx: tx2, wallet: issuer },
      { conn: env.chainId }
    );
    console.log('App declared on chain', hash);

    process.exit(0);
  } catch (err) {
    console.log(
      Array.isArray(err.errors) ? err.errors.map(x => x.message).join('; ') : err.message
    );
    process.exit(1);
  }
})();
