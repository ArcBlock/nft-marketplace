/* eslint global-require:"off" */
const flatten = require('flat');

module.exports = flatten({
  title: 'Arcblock | Blockchain 3.0',
  description: 'Born for blockchain 3.0',
  keywords: 'blockchain, platform, cloud, developer, arcblock',

  menu: {
    offers: 'Explore',
    sell: 'Sell',
    faq: 'FAQ',
    profile: 'Profile',
    login: 'Login',
    logout: 'Logout',
  },

  footer: {
    source: 'GitHub',
    abtnode: 'ABT Node',
    blocklets: 'Blocklets',
    framework: 'Blocklets Framework',
  },
});
