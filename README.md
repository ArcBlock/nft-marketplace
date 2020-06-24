# NFT Marketplace

> Built upon forge-xmark-starter

## Getting started

### 0. Requirements

- Get mongodb up and running
- Node.js v10.x (recommended)

### 1. Get the code

Clone the code and install dependencies.

```shell
git clone git@github.com:ArcBlock/nft-marketplace.git
cd nft-marketplace
make init
```

### 2. Create Configuration

Put following content in `.env` file at your repo root

```ini
SKIP_PREFLIGHT_CHECK=true

# server only
MONGO_URI="mongodb://127.0.0.1:27017/nft-marketplace"
APP_TOKEN_SECRET="37915b1ae3a42a5cca96368eb75ffbda0353734a6ded1bc788"
APP_TOKEN_TTL="1d"
APP_SK="0xeef0f8aa177bcf947980727389164b60411cac8a200b2d3cb6954fb2c5223dcb8b0d24b1db433b346396230d5833bbb9fac58768efde4c998de6473c9d78cfa7"
APP_PORT="3030"

# both client and server
GATSBY_CHAIN_ID="xenon-2020-01-15"
GATSBY_CHAIN_HOST="https://xenon.abtnetwork.io/api"
GATSBY_APP_NAME="NFT Marketplace"
GATSBY_APP_DESCRIPTION="The marketplace to sell and buy valuable blockchain NFTs"
GATSBY_APP_ID="zNKa7xm99TypbudJoGPBgUHLUYg4GozSHhM1"
GATSBY_BASE_URL="http://192.168.1.4:3030"
GATSBY_API_PREFIX=""
```

**Please remember to change GATSBY_BASE_URL to your local IP in the config file.**

### 3. Start the App

```shell
make run
```

If the command does not exit with error, you can now preview the app at: http://localhost:8000/
