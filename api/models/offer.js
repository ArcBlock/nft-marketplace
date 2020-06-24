const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema({
  userDid: { type: String, required: true },
  assetDid: { type: String, required: true },
  operation: { type: String, enum: ['sell', 'auction'], default: 'sell' },
  price: { type: Number, required: true, comment: 'Starting price of the NFT' },
  expireTime: {
    type: Number,
    default: -1,
    comment: 'When the offer will expire, defaults to never',
  },
  issuerDid: { type: String, required: true },
  issuerPk: { type: String, required: true },
  issuerName: { type: String, required: true },
  issueDate: { type: Date, required: true },
  vcDid: { type: Date, required: true },
  holderDid: { type: Date, required: true },
  types: { type: Array, default: [] },
  moniker: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  display: { type: String, required: true },
  readOnly: { type: Boolean, default: false },
  transferrable: { type: Boolean, default: true },
  status: {
    type: String,
    enum: ['created', 'delegated', 'bidding', 'selling', 'locked', 'sold', 'invalid'],
    default: 'created',
  },
  highestBid: { type: Number, default: 0 },
  createdAt: { type: Date },
  updatedAt: { type: Date },
});

const Offer = mongoose.model('Offer', OfferSchema);

module.exports = Offer;
