/* eslint global-require:"off" */
const flatten = require('flat');

module.exports = flatten({
  title: 'Arcblock | Blockchain 3.0',
  description: 'Born for blockchain 3.0',
  keywords: 'blockchain, platform, cloud, developer, arcblock',

  menu: {
    speakers: 'Speakers',
    schedule: 'Schedule',
    partners: 'Partners',
    tickets: 'Tickets',
    workshop: 'Workshop',
    hackathon: 'Hackathon',
    faq: 'FAQ',
    myBadges: 'Badges',
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
