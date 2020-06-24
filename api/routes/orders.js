const sortBy = require('lodash/sortBy');
const { swapStorage } = require('../libs/auth');
const { getTokenInfo } = require('../libs/util');

module.exports = {
  init(app) {
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
