const ForgeSDK = require('@arcblock/forge-sdk');
const { verifyTxAsync } = require('@arcblock/tx-util');
const { toTypeInfo } = require('@arcblock/did');

const env = require('../../libs/env');
const { Order, Offer } = require('../../models');
const { wallet } = require('../../libs/auth');

module.exports = {
  action: 'buy_nft',
  claims: [
    {
      signature: async ({ extraParams: { oid } }) => {
        const order = await Order.findById(oid);
        if (!order) {
          throw new Error('Order does not exist');
        }

        // TODO: check order expiration
        // TODO: check if the asset is available

        return {
          type: 'TransferTx',
          data: {
            itx: {
              to: wallet.toAddress(),
              value: (await ForgeSDK.fromTokenToUnit(order.amount)).toString(),
            },
          },
          description: 'Sign the authorization to pay for the purchase order',
        };
      },
    },
  ],

  onAuth: async ({ userDid, userPk, claims, extraParams: { oid } }) => {
    const order = await Order.findById(oid);
    if (!order) {
      throw new Error('Order does not exist');
    }

    const offer = await Offer.findById(order.offerId);
    const type = toTypeInfo(userDid);
    const user = ForgeSDK.Wallet.fromPublicKey(userPk, type);
    const claim = claims.find(x => x.type === 'signature');
    const tx = ForgeSDK.decodeTx(claim.origin);

    if (user.verify(claim.origin, claim.sig, claim.method !== 'none') === false) {
      throw new Error('Invalid tx signature');
    }

    // 收钱到中间人
    const hash = await ForgeSDK.sendTransferTx({
      tx,
      wallet: user,
      signature: claim.sig,
    });
    await verifyTxAsync({ hash, chainId: env.chainId, chainHost: env.chainHost });
    order.status = 'buyer_paid';
    order.tokenInputHash = hash;
    order.updatedAt = new Date();
    await order.save();

    // 转 NFT给买家
    const hash2 = await ForgeSDK.transfer({
      to: userDid,
      assets: [order.assetDid],
      delegator: offer.ownerDid,
      wallet,
      data: {
        source: 'NFTMarketplace',
        type: 'AssetOutput',
        orderId: oid,
      },
    });
    await verifyTxAsync({ hash: hash2, chainId: env.chainId, chainHost: env.chainHost });
    order.status = 'buyer_nft';
    order.assetOutputHash = hash2;
    order.updatedAt = new Date();
    await order.save();

    // 转钱给卖家
    const hash3 = await ForgeSDK.transfer({
      to: offer.userDid,
      token: order.amount * 0.99,
      wallet,
      data: {
        source: 'NFTMarketplace',
        type: 'TokenOutput',
        orderId: oid,
      },
    });
    await verifyTxAsync({ hash: hash3, chainId: env.chainId, chainHost: env.chainHost });
    order.status = 'seller_paid';
    order.tokenOutputHash = hash2;
    order.updatedAt = new Date();
    await order.save();

    // update offer record as sold
    offer.status = 'sold';
    offer.updatedAt = new Date();
    await offer.save();

    return { hash };
  },
};
