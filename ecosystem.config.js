module.exports = {
  apps: [
    {
      name: 'nft-marketplace',
      script: 'api/index.js',
      args: '',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        DEBUG: '@arcblock/*',
        NODE_ENV: 'production',
        ROOT_PATH: process.cwd(),
      },
    },
  ],
};
