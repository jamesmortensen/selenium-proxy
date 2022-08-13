// help.js

const PACKAGE = require('../package.json');
const BINARY = Object.keys(PACKAGE.bin)[0];

console.log(`
Usage: 
    ${BINARY} [[-h|--help] | [--proxy-profile {profile-name}] | [--proxy-port {port}] | [--proxy-config {config file path}]]

    -h                 Help (this output)

    --proxy-profile    Name of the profile from proxy-config.json to use as the Selenium
                           grid/server. Default: localhost

    --proxy-port       Port number for the Selenium proxy server to listen on. Default: 3100

    --proxy-config     Path to a config file referenced from working directory.

    
    Environment variables:
    - SELENIUM_PROXY_ACCESS_TOKEN=<access_token_value>

    To authenticate against a secured Selenium server or grid, pass the token 
    via the SELENIUM_PROXY_ACCESS_TOKEN
    `);
