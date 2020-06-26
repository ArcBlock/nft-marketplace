const sortBy = require('lodash/sortBy');
const { Offer, Order } = require('../models');
const { swapStorage } = require('../libs/auth');
const { getTokenInfo } = require('../libs/util');

module.exports = {
  init(app) {
    app.post('/api/orders', async (req, res) => {
      if (!req.user) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const { oid: offerId } = req.body;
      const offer = await Offer.findById(offerId);
      if (!offer) {
        return res.status(400).json({ error: 'Offer not found' });
      }
      if (['selling', 'bidding'].includes(offer.status) === false) {
        return res.status(400).json({ error: 'Offer not available' });
      }

      // TODO: verify the asset of the offer

      const order = new Order({
        userDid: req.user.did,
        assetDid: offer.assetDid,
        offerId,
        operation: 'buy',
        amount: offer.price,
        status: 'created',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await order.save();
      console.log('create order', result);

      // FIXME: enable this in production
      // offer.status = 'locked';
      // offer.updatedAt = new Date();
      // await offer.save();

      return res.json({ order: order.toJSON() });
    });

    app.get('/api/my/orders', async (req, res) => {
      if (!req.user) {
        return res.json([]);
      }

      const orders = await Order.find({ userDid: req.user.did }).sort('-updatedAt');
      return res.json(orders.map(x => x.toJSON()));
    });

    app.get('/api/orders', async (req, res) => {
      const tokenInfo = await getTokenInfo();
      if (req.user) {
        const orders = await swapStorage.listByDemandAddress(req.user.did);

        res.json({
          user: req.user,
          orders: sortBy(orders, x => x.createdAt).reverse(),
          tokenInfo,
        });
      } else {
        res.json({
          user: null,
          orders: [],
          tokenInfo,
        });
      }
    });
  },
};
