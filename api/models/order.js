const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  offerId: { type: String, required: true },
  assetDid: { type: String, required: true },
  userDid: { type: String, required: true },
  traceId: { type: String, default: '', required: false },
  operation: { type: String, enum: ['buy', 'bid'], default: 'buy' },
  amount: { type: Number, required: true, comment: 'Payment amount from the buyer' },
  status: {
    type: String,
    enum: ['created', 'expired', 'buyer_paid', 'buyer_nft', 'seller_paid', 'error'],
    default: 'created',
  },
  tokenInputHash: { type: String, default: '', comment: '买家付款记录' },
  tokenOutputHash: { type: String, default: '', comment: '付款给卖家的记录' },
  assetOutputHash: { type: String, default: '', comment: '转 NFT 给买家的记录' },
  createdAt: { type: Date },
  updatedAt: { type: Date },
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
