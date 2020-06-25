/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
const ForgeSDK = require('@arcblock/forge-sdk');
const { verifyPresentation } = require('@arcblock/vc');

const { Offer } = require('../../models');

const trustedIssuers = ['zNKhZLG3rbjCoh7DC5NcVzBScEVkCyB35GcC'];
const type = 'NFTBadge';

module.exports = {
  action: 'select_nft',
  claims: {
    // FIXME: we need to support more types here
    verifiableCredential: () =>
      ({
        description: 'Please select NFT you want to sell',
        item: type,
        trustedIssuers,
      }),
  },

  onAuth: async ({ userDid, claims, challenge, token, storage }) => {
    console.log('select_nft.onAuth', { userDid, claims });

    const claim = claims.find(x => x.type === 'verifiableCredential');
    const presentation = JSON.parse(claim.presentation);

    // Verify presentation
    if (challenge !== presentation.challenge) {
      throw Error('Invalid presentation');
    }
    const vc = JSON.parse(presentation.verifiableCredential);
    if (vc.type !== type && vc.type.indexOf('NFTBadge') === -1) {
      throw Error('Invalid NFT type, expect NFTBadge');
    }

    // Verify asset
    if (!claim.assetDid) {
      throw new Error('Invalid NFT select response, no asset did');
    }
    const { state } = await ForgeSDK.getAssetState({ address: claim.assetDid });
    if (!state) {
      throw new Error('Invalid asset for the NFT');
    }
    if (!state.transferrable) {
      throw new Error('Asset is not transferable so can not be listed');
    }

    const createOffer = async status => {
      const offer = new Offer({
        userDid,
        assetDid: claim.assetDid,
        ownerDid: state.owner,
        status,
        issuerDid: vc.issuer.id,
        issuerPk: vc.issuer.pk,
        issuerName: vc.issuer.name,
        issuanceDate: vc.issuanceDate,
        nftTypes: vc.type,
        nftMoniker: state.moniker,
        nftTitle: vc.credentialSubject.name,
        nftDescription: vc.credentialSubject.description,
        nftDisplay: vc.credentialSubject.display,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await offer.save();
      console.log('create offer', result);

      return offer._id.toString();
    };

    // 能够出售的情况：有三种
    // 1. Asset 取得之后原封不动：Owner 和 VC 都是确定的
    if (vc.credentialSubject.id === userDid) {
      verifyPresentation({ presentation, trustedIssuers, challenge });
      const offerId = await createOffer('verified');
      await storage.update(token, { oid: offerId });
    } else {
      // 2. Assets 取得之后通过 Marketplace 卖给了其他人：Owner 是确定的
      if (state.owner === userDid) {
        const offerId = await createOffer('verified');
        await storage.update(token, { oid: offerId });
        return;
      }

      // 3. Asset 取得之后通过其他方式比如线下卖给了其他人：Owner 是不确定的：这个时候要要求持有 owner 的 did
      const offerId = await createOffer('created');
      await storage.update(token, { oid: offerId, proof: true });
    }
  },
};
