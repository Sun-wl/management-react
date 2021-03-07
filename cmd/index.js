const fs = require('fs-extra')
const path = require('path')
const argv = [...process.argv];
const parameters = argv.splice(2);




const env = parameters[0] || 'dev';

content_env = `import { url } from 'config';\nexport default url.${env};`;
fs.writeFileSync(path.join(__dirname, './../src/utils/url.config.js'), content_env);
console.log('设置环境'+env)