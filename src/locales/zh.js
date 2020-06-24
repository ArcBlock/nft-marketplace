/* eslint global-require:"off" */
const flatten = require('flat');

module.exports = flatten({
  title: 'Arcblock | 区块链 3.0',
  description: 'Born for blockchain 3.0',
  keywords: 'blockchain, platform, cloud, developer, arcblock',

  menu: {
    speakers: '演讲者',
    schedule: '日程',
    partners: '合作伙伴',
    tickets: '门票',
    workshop: '工作室',
    hackathon: '黑客松',
    faq: '常见问题',
    myBadges: '我的徽章',
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
