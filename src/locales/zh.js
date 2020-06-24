/* eslint global-require:"off" */
const flatten = require('flat');

module.exports = flatten({
  title: 'Arcblock | 区块链 3.0',
  description: 'Born for blockchain 3.0',
  keywords: 'blockchain, platform, cloud, developer, arcblock',

  menu: {
    offers: '浏览',
    sell: '出售',
    faq: '常见问题',
    profile: '我的',
    login: '登录',
    logout: '退出',
  },

  footer: {
    source: '源代码',
    abtnode: 'ABT 节点',
    blocklets: '基石程序',
    framework: '区块链框架',
  },
});
