// config-handler.test.js

const expect = require('chai').expect;

describe('Tests for managing config files', () => {

    const getConfigFilePath = require('../src/config-handler');

    it('should use the one from the environment if it is found', () => {
        process.env.SELENIUM_PROXY_CONFIG = './test/test-config.json';
        const result = getConfigFilePath();
        console.log(result);
        expect(result).to.equal(process.cwd() + '/./test/test-config.json');
    });

    it('should use the one from the environment if it is found and absolute path', () => {
        process.env.SELENIUM_PROXY_CONFIG = process.cwd() + '/test/test-config.json';
        const result = getConfigFilePath();
        console.log(result);
        expect(result).to.equal(process.cwd() + '/test/test-config.json');
    });

    it('should throw error if one from environment is not found', () => {
        process.env.SELENIUM_PROXY_CONFIG = './test/st-config.json';
        expect(getConfigFilePath).to.throw(Error);
    });

    it('should use the default-config if no environment set and no local config.json', () => {
        delete process.env.SELENIUM_PROXY_CONFIG;
        const result = getConfigFilePath();
        console.log(result);
        expect(result).to.equal('../default-config.json');
    });

    it('should use the local config.json if no environment set', () => {
        delete process.env.SELENIUM_PROXY_CONFIG;
        const result = getConfigFilePath((file) => file === 'config.json');
        console.log(result);
        expect(result).to.equal(process.cwd() + '/config.json');
    });
});
