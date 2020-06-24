const ForgeSDK = require('@arcblock/forge-sdk');
const mongoose = require('mongoose');

const VerificationTokenSchema = new mongoose.Schema({
  userDid: { type: String, required: true },
  ticket: { type: String, required: true },
  email: { type: String, required: true },
  token: { type: String, required: true },
  expired: { type: Boolean, default: false },
  claimed: { type: Boolean, default: false },
  verified: { type: Boolean, default: false },
  createdAt: { type: Date },
  expiredAt: { type: Date },
  verifiedAt: { type: Date },
});

VerificationTokenSchema.statics.generate = async (email, ticket, userDid) => {
  const random = ForgeSDK.Wallet.fromRandom();
  const Model = mongoose.model('VerificationToken');
  const token = random.publicKey.replace(/^0x/, '').toUpperCase();

  const item = new Model({ email, ticket, userDid, token, createdAt: new Date() });
  await item.save();

  return token;
};

const DEFAULT_EXPIRE_TIME = 48 * 60 * 60 * 1000;

VerificationTokenSchema.statics.verify = async (token, options = {}) => {
  const timeout = options.timeout || DEFAULT_EXPIRE_TIME;
  const Model = mongoose.model('VerificationToken');

  if (!token || !ForgeSDK.Util.isHex(token)) {
    throw new Error('Invalid verification token');
  }

  const item = await Model.findOne({ token });
  if (!item) {
    throw new Error('Verification token not found');
  }

  if (item.expired) {
    throw new Error('Verification token expired');
  }

  if (+new Date() > +item.createdAt + timeout) {
    item.expired = true;
    item.expiredAt = new Date();
    await item.save();

    throw new Error('Verification token expired');
  }

  if (!item.verified) {
    item.verified = true;
    item.verifiedAt = new Date();
    await item.save();
  }

  return item.toJSON();
};

const VerificationToken = mongoose.model('VerificationToken', VerificationTokenSchema);

module.exports = VerificationToken;
