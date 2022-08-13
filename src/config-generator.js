// config-generator.js

const fs = require('fs');
if (fs.existsSync(process.cwd() + '/config.json'))
    console.log('Config file config.json already present. Rename or delete to create a new one.');
else {
    console.log('Generate a config file proxy-config.json in ' + process.cwd());
    fs.copyFileSync(__dirname + '/../default-config.json', process.cwd() + '/config.json')
}
