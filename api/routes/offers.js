const { Offer } = require('../models');

module.exports = {
  init(app) {
    app.get('/api/offers', async (req, res) => {
      const items = await Offer.find({ status: { $in: ['selling', 'bidding'] } })
        .sort('-updatedAt')
        .limit(100);

      return res.json(items.map(x => x.toJSON()));
    });

    app.get('/api/my/offers', async (req, res) => {
      if (!req.user) {
        return res.json([]);
      }

      const offers = await Offer.find({ userDid: req.user.did }).sort('-updatedAt');
      return res.json(offers.map(x => x.toJSON()));
    });

    app.get('/api/offers/:id', async (req, res) => {
      const item = await Offer.findById(req.params.id);

      // FIXME: check if the asset is still available
      // TODO: add asset transaction history

      return res.json(item.toJSON());
    });
  },
};
