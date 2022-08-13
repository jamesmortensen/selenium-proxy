// config-handler.js

function getConfigFilePath(_configFileExists) {
    configFileExists = _configFileExists || configFileExists;

    if (process.env.SELENIUM_PROXY_CONFIG) {
        const startChar = process.env.SELENIUM_PROXY_CONFIG.charAt(0) === '/' ? '' : process.cwd() + '/';
        const filePath = startChar + '' + process.env.SELENIUM_PROXY_CONFIG;
        console.log(`Looking for ${filePath} file.`);
        if (configFileExists(filePath))
            return filePath;
        else
            throw new Error(`No config file found: ${filePath}. To generate a config file, run selenium-proxy --generate-config`);
    }

    console.log('Looking for local config.json file in current directory.');
    if (configFileExists('config.json'))
        return process.cwd() + '/config.json';

    console.warn('Using default-config.json within module.');
    return '../default-config.json';
}

function configFileExists(path) {
    const fs = require('fs');
    return (fs.existsSync(path));
}

module.exports = getConfigFilePath;
