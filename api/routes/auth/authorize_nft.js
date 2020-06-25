/* eslint-disable no-console */
const ForgeSDK = require('@arcblock/forge-sdk');
const { verifyTxAsync } = require('@arcblock/tx-util');
const { toDelegateAddress } = require('@arcblock/did-util');

const env = require('../../libs/env');
const { Offer } = require('../../models');
const { wallet } = require('../../libs/auth');

module.exports = {
  action: 'authorize_nft',
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
      signature: async ({ userDid, extraParams: { oid } }) => {
        const item = await Offer.findById(oid);
        if (!item) {
          throw new Error('Offer does not exist');
        }

        const address = toDelegateAddress(userDid, wallet.toAddress());

        const myOffers = await Offer.find({
          userDid: item.userDid,
          status: { $in: ['selling', 'bidding'] },
        });

        const limitRule = myOffers
          .concat([item])
          .map(x => `itx.assets == ["${x.assetDid}"]`)
          .join(' or ');

        return {
          type: 'DelegateTx',
          data: {
            itx: {
              address,
              to: wallet.toAddress(),
              ops: [
                {
                  typeUrl: 'fg:t:transfer',
                  rules: [limitRule],
                },
              ],
            },
          },
          description: 'Sign the authorization to list your NFT for sale',
        };
      },
    },
  ],

  onAuth: async ({
    claims,
    userDid,
    extraParams: { oid, price, operation, title, description },
  }) => {
    const item = await Offer.findById(oid);
    if (!item) {
      throw new Error('Offer does not exist');
    }

    const claim = claims.find(x => x.type === 'signature');
    const tx = ForgeSDK.decodeTx(claim.origin);
    const user = ForgeSDK.Wallet.fromAddress(userDid);

    const hash = await ForgeSDK.sendDelegateTx({
      tx,
      wallet: user,
      signature: claim.sig,
    });

    console.info('delegate.send', { claims, userDid, hash });

    await verifyTxAsync({ hash, chainId: env.chainId, chainHost: env.chainHost });

    // update offer record as authorized
    // FIXME: for bidding offers
    try {
      item.price = price;
      item.operation = operation;
      item.title = title;
      item.description = description;
      item.status = 'selling';
      item.updatedAt = new Date();
      const result = await item.save();
      console.log('offer listed', result);
    } catch (err) {
      console.error(err);
    }

    return { hash, tx: claim.origin };
  },
};
