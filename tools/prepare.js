const fs = require('fs');
const path = require('path');

const packageFile = path.join(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageFile).toString());

const {
  name,
  version,
  description,
  publishConfig,
  files,
  keywords,
  author,
  repository,
  bugs,
  blocklet,
} = packageJson;

fs.writeFileSync(
  packageFile,
  JSON.stringify(
    {
      name,
      version,
      description,
      publishConfig,
      files,
      keywords,
      author,
      repository,
      bugs,
      blocklet,
    },
    null,
    2
  )
);

// eslint-disable-next-line no-console
console.log('package.json is updated');
