const { Offer } = require('../models');

module.exports = {
  init(app) {
    app.get('/api/offers', async (req, res) => {
      const items = await Offer.find({ status: { $in: ['selling', 'bidding'] } })
        .sort('-updatedAt')
        .limit(100);

      return res.json(items.map(x => x.toJSON()));
    });
  },
};
