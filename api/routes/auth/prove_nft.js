const ForgeSDK = require('@arcblock/forge-sdk');
const { toTypeInfo } = require('@arcblock/did');

const { Offer } = require('../../models');
const { getRandomMessage } = require('../../libs/util');

module.exports = {
  action: 'prove_nft',
  authPrincipal: false,
  claims: [
    {
      authPrincipal: async ({ extraParams: { oid } }) => {
        const item = await Offer.findById(oid);
        if (!item) {
          throw new Error('Offer does not exist');
        }

        return {
          description: 'Please prove that you own the DID',
          target: item.ownerDid,
        };
      },
    },
    {
      signature: async ({ extraParams: { oid } }) => {
        const item = await Offer.findById(oid);
        if (!item) {
          throw new Error('Offer does not exist');
        }

        return {
          type: 'mime:text/plain',
          description: 'Please prove that you are the NFT Owner',
          data: getRandomMessage(),
        };
      },
    },
  ],

  onAuth: async ({ userDid, userPk, claims, extraParams: { oid } }) => {
    const item = await Offer.findById(oid);
    if (!item) {
      throw new Error('Offer does not exist');
    }

    if (userDid !== item.ownerDid) {
      throw new Error('Invalid signer');
    }

    const type = toTypeInfo(userDid);
    const user = ForgeSDK.Wallet.fromPublicKey(userPk, type);
    const claim = claims.find(x => x.type === 'signature');

    if (claim.origin) {
      if (user.verify(claim.origin, claim.sig, claim.method !== 'none') === false) {
        throw new Error('Invalid signature to prove did ownership');
      }
    }

    // update offer record as verified
    item.status = 'verified';
    item.updatedAt = new Date();
    await item.save();
  },
};
