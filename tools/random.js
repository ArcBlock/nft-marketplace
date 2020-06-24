/* eslint-disable no-console */
require('dotenv').config();

// Generates a random wallet for the application
// Run this script and save the secret key to `.env` of project root
const Mcrypto = require('@arcblock/mcrypto');
const { fromRandom, WalletType } = require('@arcblock/forge-wallet');

const type = WalletType({
  role: Mcrypto.types.RoleType.ROLE_APPLICATION,
  pk: Mcrypto.types.KeyType.ED25519,
  hash: Mcrypto.types.HashType.SHA3,
});

const wallet = fromRandom(type);
console.log('Application wallet', wallet.toJSON());
