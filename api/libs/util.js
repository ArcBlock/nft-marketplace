/* eslint-disable indent */
/* eslint-disable object-curly-newline */
const ForgeSDK = require('@arcblock/forge-sdk');
const Mcrypto = require('@arcblock/mcrypto');
const {
  createZippedSvgDisplay,
  createCertSvg,
  createTicketSvg,
} = require('@arcblock/nft-template');
const { NFTRecipient } = require('@arcblock/nft');
const { NFTType } = require('@arcblock/nft/lib/enum');
const moment = require('moment');

const env = require('./env');
const {
  createFreeTicketSvg,
  createPremiumTicketSvg,
  createProCert,
  createFreeCertSvg,
} = require('../libs/nft_templates');

const { getBadge } = require('../libs/badge_templates');

const getTransferrableAssets = async (userDid, assetCount, chainId) => {
  const { assets } = await ForgeSDK.listAssets(
    { ownerAddress: userDid, paging: { size: 400 } },
    { conn: chainId }
  );
  if (!assets || assets.length === 0) {
    throw new Error('You do not have any asset, use other test to earn one');
  }

  const goodAssets = assets.filter(x => x.transferrable);
  if (!goodAssets.length) {
    throw new Error('You do not have any asset that can be transferred to me');
  }

  if (assetCount && assetCount < 5 && goodAssets.length < assetCount) {
    throw new Error('You do not have enough assets that can be transferred to me');
  }

  return goodAssets.slice(0, assetCount);
};

const getTokenInfo = async () => {
  const [{ getForgeState: data }, { getForgeState: data2 }] = await Promise.all([
    ForgeSDK.doRawQuery(
      `{
      getForgeState {
        code
        state {
          token {
            decimal
            symbol
          }
        }
      }
    }`,
      { conn: env.chainId }
    ),
    ForgeSDK.doRawQuery(
      `{
      getForgeState {
        code
        state {
          token {
            decimal
            symbol
          }
        }
      }
    }`,
      { conn: env.assetChainId }
    ),
  ]);

  return {
    [env.chainId]: data.state.token,
    [env.assetChainId]: data2.state.token,
    local: data.state.token,
    foreign: data2.state.token,
  };
};

const getAccountBalance = async userDid => {
  const [{ getAccountState: data }, { getAccountState: data2 }] = await Promise.all([
    ForgeSDK.doRawQuery(
      `{
      getAccountState(address: "${userDid}") {
        code
        state {
          balance
        }
      }
    }`,
      { conn: env.chainId }
    ),
    ForgeSDK.doRawQuery(
      `{
      getAccountState(address: "${userDid}") {
        code
        state {
          balance
        }
      }
    }`,
      { conn: env.assetChainId }
    ),
  ]);

  return {
    [env.chainId]: data.state ? data.state.balance : 0,
    [env.assetChainId]: data2.state ? data2.state.balance : 0,
    local: data.state ? data.state.balance : 0,
    foreign: data2.state ? data2.state.balance : 0,
  };
};

const ensureAsset = async (
  factory,
  {
    userPk,
    userDid,
    type,
    name,
    description,
    backgroundUrl,
    logoUrl,
    startTime,
    endTime,
    location = 'China',
    vcType = '',
    isPro = false,
    sessionID,
    certType,
  }
) => {
  const methods = {
    badge: factory.createBadge.bind(factory),
    ticket: factory.createTicket.bind(factory),
    certificate: factory.createCertificate.bind(factory),
  };
  const data = {
    name,
    description,
    reason: description,
    logoUrl,
    location,
    type: vcType,
    issueTime: Date.now(),
    startTime,
    endTime,
    expireTime: endTime,
    recipient: new NFTRecipient({
      wallet: ForgeSDK.Wallet.fromPublicKey(userPk),
      name: userDid,
      location: 'China, Beijing',
    }),
  };

  let display;
  if (vcType === 'DevCon2020FreeTicket') {
    display = createZippedSvgDisplay(createFreeTicketSvg({ data }));
  } else if (vcType === 'DevCon2020PaidTicket') {
    display = createZippedSvgDisplay(createPremiumTicketSvg({ data }));
  } else if (vcType.indexOf('DevCon2020SessionCertificate') > -1) {
    display = createZippedSvgDisplay(
      isPro
        ? createProCert({
            data,
            issueDate: moment(data.issueTime).format('YYYY-MM-DD HH:mm:ss'),
            userDid,
            certType,
          })
        : createFreeCertSvg({
            data,
            userDid,
            issueDate: moment(data.issueTime).format('YYYY-MM-DD HH:mm:ss'),
          })
    );
  } else if (vcType.indexOf('DevCon2020SessionBadge') > -1) {
    display = createZippedSvgDisplay(getBadge(isPro, data, userDid, sessionID));
  } else {
    display = createZippedSvgDisplay(
      type === 'ticket' ? createTicketSvg({ data }) : createCertSvg({ data })
    );
  }

  const [asset] = await methods[type]({
    display,
    backgroundUrl,
    data,
  });
  return asset;
};

const getRandomMessage = (len = 16) => {
  const hex = Mcrypto.getRandomBytes(len);
  return hex.replace(/^0x/, '').toUpperCase();
};

const transferVCTypeToAssetType = str => {
  let types = str;
  if (!Array.isArray(str)) {
    types = [str];
  }
  if (types.indexOf('NFTCertificate') > -1) {
    return NFTType.certificate;
  }
  if (types.indexOf('NFTTicket') > -1) {
    return NFTType.ticket;
  }
  if (types.indexOf('WalletPlaygroundAchievement') > -1 || types.indexOf('NFTBadge') > -1) {
    return NFTType.badge;
  }
  return NFTType.other;
};

function getAssetsByTargetType(assets, userDiD, targetType, strictMode = false) {
  if (!assets || assets.length === 0) {
    return [];
  }
  return assets.filter(item => {
    if (item.owner !== userDiD) {
      return false;
    }
    if (item.data.typeUrl !== 'vc') {
      return false;
    }
    const value = JSON.parse(item.data.value);
    if (strictMode) {
      if (value.credentialSubject.id !== userDiD) {
        return false;
      }
    }
    let types = value.type;
    if (!Array.isArray(types)) {
      types = [types];
    }
    types = types.filter(type => type.indexOf(targetType) > -1);
    if (types.length === 0) {
      return false;
    }
    return true;
  });
}

module.exports = {
  getTransferrableAssets,
  getTokenInfo,
  getAccountBalance,
  transferVCTypeToAssetType,
  getRandomMessage,
  ensureAsset,
  getAssetsByTargetType,
};
