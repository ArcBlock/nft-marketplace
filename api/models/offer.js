const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema({
  userDid: { type: String, required: true },
  assetDid: { type: String, required: true },
  ownerDid: { type: String, required: true },
  operation: { type: String, enum: ['sell', 'bid'], default: 'sell' },
  price: { type: Number, default: 0, comment: 'Starting price of the NFT' },
  expireTime: {
    type: Number,
    default: -1,
    comment: 'When the offer will expire, defaults to never',
  },
  issuerDid: { type: String, required: true },
  issuerPk: { type: String, required: true },
  issuerName: { type: String, required: true },
  issuanceDate: { type: Date, required: true },
  nftTypes: { type: Array, default: [] },
  nftMoniker: { type: String, required: true },
  nftTitle: { type: String, required: true },
  nftDescription: { type: String, required: true },
  nftDisplay: { type: Object, required: true },
  readOnly: { type: Boolean, default: false },
  transferrable: { type: Boolean, default: true },
  status: {
    type: String,
    enum: ['created', 'verified', 'authorized', 'bidding', 'selling', 'locked', 'sold', 'invalid'],
    default: 'created',
  },
  title: { type: String, required: false, default: '', comment: 'User filled offer title' },
  description: {
    type: String,
    required: false,
    default: '',
    comment: 'User filled offer description',
  },
  highestBid: { type: Number, default: 0 },
  createdAt: { type: Date },
  updatedAt: { type: Date },
});

const Offer = mongoose.model('Offer', OfferSchema);

module.exports = Offer;
