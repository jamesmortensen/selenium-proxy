// server.js

const http = require('http');
const nodeUrl = require('url');

const PARSE_QUERY_STRING = true;
const SELENIUM_PROXY_PORT = process.env.SELENIUM_PROXY_PORT || 3100;

const getConfigFilePath = require('./config-handler');
const configFilePath = getConfigFilePath();

const config = require(configFilePath)[process.env.SELENIUM_PROXY_PROFILE || 'localhost'];

handleNoProfileFound(config);


http.createServer(function (proxyReq, proxyRes) {
    const urlObj = nodeUrl.parse(proxyReq.url, PARSE_QUERY_STRING);
    const pathname = urlObj.pathname;

    console.log('proxyReq.method: ');
    console.log(proxyReq.method);
    console.log('proxyReq.headers: ');
    console.log(proxyReq.headers);

    if (pathname.match('/wd/hub|/.*') !== null) {
        console.log('process ' + proxyReq.method);
        proxyReq.pathname = pathname;

        if (proxyReq.method === 'GET' || proxyReq.method === 'DELETE') {
            forwardRequest(proxyReq, proxyRes, config);

        } else {
            let body = '';
            proxyReq.on('data', chunk => {
                body += chunk.toString(); // convert Buffer to string
            });
            proxyReq.on('end', () => {
                console.log('proxyReq.on end');
                console.log(body);
                proxyReq.body = body;
                forwardRequest(proxyReq, proxyRes, config);
            });
        }

        return;
    }

}).listen(SELENIUM_PROXY_PORT);

console.info(`Selenium Proxy Server listening on http://localhost:${SELENIUM_PROXY_PORT}`);
console.info(`Forwarding requests to server at ${config.protocol}://${config.hostname}:${config.port}${config.path}`);

function forwardRequest(proxyReq, proxyRes, config) {
    const pathname = proxyReq.pathname;
    const port = config.port ? `:${config.port}` : '';
    const forwardRequestPath = `${config.protocol}://${config.hostname}${port}${config.path}${pathname}`;
    console.log(forwardRequestPath);

    const axios = initializeWithModifiedHeaders(proxyReq);
    logModifiedRequestHeaders(axios.defaults.headers.common);

    console.log('proxyReq.body: ');
    console.log(proxyReq.body);
    axios[proxyReq.method.toLowerCase()](forwardRequestPath,
        proxyReq.body
    ).then((upstreamRes) => {
        forwardRequestToUpstreamServer(proxyRes, upstreamRes);
    }).catch((err) => {
        upstreamRequestError(err);
    });
}

function initializeWithModifiedHeaders(req) {
    const axios = require('axios').default;
    delete axios.defaults.headers.common['Accept'];
    delete axios.defaults.headers.common['content-length'];

    const reqHeadersKeysToAdd = Object.keys(req.headers);
    reqHeadersKeysToAdd.forEach((name) => {
        axios.defaults.headers.common[name] = req.headers[name];
        console.log('add/overwrite header -> ' + name + ': ' + req.headers[name]);
    });
    axios.defaults.headers.common['host'] = config.hostname;
    if (process.env.SELENIUM_PROXY_ACCESS_TOKEN !== undefined)
        axios.defaults.headers.common['authorization'] = 'Bearer ' + process.env.SELENIUM_PROXY_ACCESS_TOKEN;

    axios.defaults.timeout = 120000;

    return axios;
}

function logModifiedRequestHeaders(headers) {
    console.log('proxy request headers: ');
    console.log(Object.entries(headers).map(header => {
        if (header[0].toLowerCase() === 'authorization')
            header[1] = header[1].replace(new RegExp('Bearer .*', 'i'), '*****');
        return header;
    }));
}

function forwardRequestToUpstreamServer(proxyRes, upstreamRes) {
    try {
        console.log('upstreamRes.data: ', upstreamRes.data);
        console.log('upstreamRes.headers: ', upstreamRes.headers);
        proxyRes.end(JSON.stringify(upstreamRes.data));
    } catch (e) {
        console.error('Error: ');
        console.error(e.message.replace(new RegExp('Bearer .*', 'i'), '*****'));
    }
}

function upstreamRequestError(err) {
    console.error('Upstream Request Error: ');
    // BUG: Wipes out all of the headers. Should just mask auth tokens instead.
    maskedErr = JSON.parse(
        JSON.stringify(err).replace(new RegExp('Bearer .+?"', 'ig'), '*****"')
    );
    maskedErr = err;
    console.error(maskedErr);
}

// seems like a hackjob way of dealing with ECONNRESET - https://github.com/nodejs/help/issues/705#issuecomment-757578500
process.on('uncaughtException', (err) => {
    if (err.code === 'ECONNRESET')
        console.log('node js process error ' + err.code);
    else
        console.log('node js process error\n', err);
});

function handleNoProfileFound(config) {
    if (typeof (config) === 'undefined')
        throw new Error(`Selenium proxy profile "${process.env.SELENIUM_PROXY_PROFILE || 'localhost'}" not found.
        Check the config file to make sure you're referencing a valid config name.`);
}
