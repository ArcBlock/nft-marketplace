const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  offerId: { type: String, required: true },
  userDid: { type: String, required: true },
  traceId: { type: String, default: '', required: false },
  operation: { type: String, enum: ['buy', 'bid'], default: 'buy' },
  price: { type: Number, required: true, comment: 'Price from the buyer' },
  status: {
    type: String,
    enum: ['created', 'expired', 'buyer_paid', 'seller_paid', 'done', 'error'],
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
