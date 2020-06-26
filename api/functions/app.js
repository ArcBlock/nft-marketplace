/* eslint-disable no-console */
const path = require('path');
const fs = require('fs');
const nocache = require('nocache');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const bearerToken = require('express-bearer-token');
const ForgeSDK = require('@arcblock/forge-sdk');

const { decode } = require('../libs/jwt');
const { handlers, wallet, swapHandlers } = require('../libs/auth');

const isProduction = process.env.NODE_ENV === 'production';
const isNetlify = process.env.NETLIFY && JSON.parse(process.env.NETLIFY);

if (!process.env.MONGO_URI) {
  throw new Error('Cannot start application without process.env.MONGO_URI');
}

// Connect to database
let isConnectedBefore = false;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, autoReconnect: true });
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
mongoose.connection.on('disconnected', () => {
  console.log('Lost MongoDB connection...');
  if (!isConnectedBefore) {
    mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, autoReconnect: true });
  }
});
mongoose.connection.on('connected', () => {
  isConnectedBefore = true;
  console.log('Connection established to MongoDB');
});
mongoose.connection.on('reconnected', () => {
  console.log('Reconnected to MongoDB');
});

// Create and config express application
const server = express();
server.use(compression());
server.use(cookieParser());
server.use(bodyParser.json({ limit: '5 mb' }));
server.use(bodyParser.urlencoded({ extended: true, limit: '5 mb' }));
server.use(cors());

server.use(
  morgan((tokens, req, res) => {
    const log = [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'),
      '-',
      tokens['response-time'](req, res),
      'ms',
    ].join(' ');

    if (isProduction) {
      // Log only in AWS context to get back function logs
      console.log(log);
    }

    return log;
  })
);

server.use(bearerToken());
server.use((req, res, next) => {
  if (!req.token) {
    next();
    return;
  }

  decode(req.token)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(() => {
      next();
    });
});

const router = express.Router();

handlers.attach(Object.assign({ app: router }, require('../routes/auth/login')));
handlers.attach(Object.assign({ app: router }, require('../routes/auth/select_nft')));
handlers.attach(Object.assign({ app: router }, require('../routes/auth/prove_nft')));
handlers.attach(Object.assign({ app: router }, require('../routes/auth/authorize_nft')));
handlers.attach(Object.assign({ app: router }, require('../routes/auth/buy_nft')));
swapHandlers.attach(Object.assign({ app: router }, require('../routes/auth/pickup_swap')));
require('../routes/session').init(router);
require('../routes/orders').init(router);
require('../routes/offers').init(router);

// Check for application account
ForgeSDK.getAccountState({ address: wallet.toAddress() })
  .then(res => {
    if (!res.state) {
      console.log('\n----------');
      console.error('Application account not declared on chain, abort!');
      console.error('Please run `node tools/declare.js` then start the application again');
      console.log('----------\n');
      process.exit(1);
    } else {
      console.error('Application account declared on chain');
    }
  })
  .catch(err => {
    console.error(err);
    console.log('\n----------');
    console.error('Application account check failed, abort!');
    console.log('----------\n');
    process.exit(1);
  });

if (isProduction) {
  if (isNetlify) {
    server.use('/.netlify/functions/app', router);
  } else {
    server.use(router);

    server.use(
      express.static(path.join(process.env.ROOT_PATH, 'public'), {
        maxAge: '7d',
        index: ['index.html'],
      })
    );

    server.get('*', nocache(), (req, res) => {
      res.send(
        fs.readFileSync(path.join(process.env.ROOT_PATH, 'public', 'zh', 'index.html')).toString()
      );
    });
  }

  server.use((req, res) => {
    res.status(404).send('404 NOT FOUND');
  });

  // eslint-disable-next-line no-unused-vars
  server.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });
} else {
  server.use(router);
}

// Make it serverless
exports.handler = serverless(server);
exports.server = server;
