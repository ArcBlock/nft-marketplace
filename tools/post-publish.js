/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
const axios = require('axios');
const { execSync } = require('child_process');

const { name, version } = require('../package.json');

(async () => {
  try {
    const res = await axios.put(`https://npm.taobao.org/sync/${name}?sync_upstream=true`);
    console.log('trigger cnpm sync success', name, res.data);
  } catch (err) {
    console.error('trigger cnpm sync failed', name, err);
  }
  if (process.env.SLACK_WEBHOOK) {
    try {
      const command = `curl -s -X POST --data-urlencode "payload={\\"text\\": \\"${name} v${version} is published\\"}" ${process.env.SLACK_WEBHOOK}`;
      const result = execSync(command);
      console.log('send slack notification', result.toString('utf8'));
    } catch (err) {
      console.error('send slack notification failed', name, err);
    }
  }
})();

(async () => {
  try {
    const res = await axios.post('https://api.netlify.com/build_hooks/5d71fd6472feae0bb5d28671');
    console.log('trigger blocklets build success:', res.status);
  } catch (error) {
    console.error('trigger blocklets build failed:', error);
  }
})();
