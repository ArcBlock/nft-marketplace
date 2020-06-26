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
    orders: 'Orders',
    login: 'Login',
    logout: 'Logout',
  },

  footer: {
    source: 'GitHub',
    abtnode: 'ABT Node',
    blocklets: 'Blocklets',
    framework: 'Blockchain Framework',
  },

  detail: {
    title: 'Offer Detail',
  },

  my: {
    title: 'My Orders & Offers',
    offers: 'Offers',
    orders: 'Orders',
  },

  buy: {
    title: 'Purchase NFT',
    scan: 'Scan QRCode to complete the purchase',
    confirm: 'Review this operation on your ABT Wallet',
    success: 'Purchase success',
  },

  create: {
    title: 'List your Asset in Marketplace',
    steps: {
      select: 'Select Asset',
      config: 'Configure Order',
      authorize: 'Authorize',
      complete: 'Complete',
    },
    select: {
      title: 'Select NFT',
      scan: 'Scan QRCode to select NFT to sell',
      confirm: 'Review this operation on your ABT Wallet',
      success: 'NFT Selected',
    },
    proof: {
      title: 'Prove Ownership',
      scan: 'Scan QRCode to prove you are the owner of the NFT',
      confirm: 'Review this operation on your ABT Wallet',
      success: 'Ownership verified',
    },
    authorize: {
      title: 'Authorize Required',
      scan: 'Scan QRCode to authorize marketplace to send the NFT to buyer on your behalf',
      confirm: 'Review this operation on your ABT Wallet',
      success: 'Authorization granted',
    },

    congratulation: 'Congratulations! You offer is successfully listed',
    redirectButton: 'View my offer in marketplace',
    listMore: 'List More NFT',

    form: {
      title: "What's your NFT?",
      titleRequired: 'Offer name is required',
      titlePlaceholder: "What's your NFT",
      description: 'Why your NFT is valuable?',
      descriptionPlaceholder: 'Why your NFT is valuable?',
      descriptionRequired: 'Offer description is required',
      price: 'How much you want to sell for?',
      pricePlaceholder: 'Set a price price',
      priceRequired: 'Offer price is required',
      operation: 'Offer type',
      submit: 'Continue',
    },
  },
});
