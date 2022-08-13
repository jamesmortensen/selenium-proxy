#!/usr/bin/env node

const args = require('argumently');


if (args.hasHelp()) {
    require('./src/help');
    process.exit(0);
}

if (args.has('--proxy-port')) {
    process.env.SELENIUM_PROXY_PORT = args.get('--proxy-port');
}

if (args.has('--proxy-profile')) {
    process.env.SELENIUM_PROXY_PROFILE = args.get('--proxy-profile');
    console.warn(`Using Selenium proxy profile ${process.env.SELENIUM_PROXY_PROFILE}`)
}

if (args.has('--proxy-config')) {
    process.env.SELENIUM_PROXY_CONFIG = args.get('--proxy-config');
    console.warn(`Using Selenium proxy config file: ${process.env.SELENIUM_PROXY_CONFIG}`)
}

if(args.has('--generate-config')) {
    require('./src/config-generator');
    process.exit(0);
}

if (args.hasNoMatchingArguments())
    console.warn('No matching arguments provided. Using defaults. See --help for instructions.');

try {
    require('./src/server');
} catch(e) {
    console.error('Server Error: ' + e.message);
}
