const Mcrypto = require('@arcblock/mcrypto');
const ForgeSDK = require('@arcblock/forge-sdk');
const MongoStorage = require('@arcblock/did-auth-storage-mongo');
const { fromSecretKey, WalletType } = require('@arcblock/forge-wallet');
const SwapMongoStorage = require('@arcblock/swap-storage-mongo');
const {
  WalletAuthenticator,
  AppAuthenticator,
  AppHandlers,
  SwapHandlers,
  WalletHandlers,
} = require('@arcblock/did-auth');
const env = require('./env');

const netlifyPrefix = '/.netlify/functions/app';
const isNetlify = process.env.NETLIFY && JSON.parse(process.env.NETLIFY);

const type = WalletType({
  role: Mcrypto.types.RoleType.ROLE_APPLICATION,
  pk: Mcrypto.types.KeyType.ED25519,
  hash: Mcrypto.types.HashType.SHA3,
});

if (env.chainHost) {
  ForgeSDK.connect(env.chainHost, {
    chainId: env.chainId,
    name: env.chainId,
    default: true,
  });
}

const wallet = fromSecretKey(process.env.APP_SK, type);
const walletJSON = wallet.toJSON();

const walletAuth = new WalletAuthenticator({
  wallet: walletJSON,
  baseUrl: isNetlify ? env.baseUrl.replace(netlifyPrefix, '') : env.baseUrl,
  appInfo: {
    name: env.appName,
    description: env.appDescription,
    icon: `${
      isNetlify
        ? env.baseUrl.replace(netlifyPrefix, '')
        : env.baseUrl.replace(process.env.PORT || '3030', '8000')
    }/images/icon.png`,
    link: isNetlify
      ? env.baseUrl.replace(netlifyPrefix, '')
      : env.baseUrl.replace(process.env.PORT || '3030', '8000'),
  },
  chainInfo: {
    host: env.chainHost,
    id: env.chainId,
  },
});

const tokenStorage = new MongoStorage({ url: process.env.MONGO_URI });

const walletHandlers = new WalletHandlers({
  authenticator: walletAuth,
  tokenGenerator: () => Date.now().toString(),
  tokenStorage,
});

const appAuth = new AppAuthenticator(walletJSON);
const appHandlers = new AppHandlers(appAuth);

const swapStorage = new SwapMongoStorage({ url: process.env.MONGO_URI });

const swapHandlers = new SwapHandlers({
  authenticator: walletAuth,
  tokenStorage,
  swapStorage,
  swapContext: {
    offerChainId: env.chainId,
    offerChainHost: env.chainHost,
    demandChainId: env.chainId,
    demandChainHost: env.chainHost,
  },
  options: {
    swapKey: 'tid',
  },
});

module.exports = {
  authenticator: walletAuth,
  handlers: walletHandlers,
  appAuth,
  appHandlers,
  swapHandlers,
  wallet,
  walletJSON,
  swapStorage,
};
