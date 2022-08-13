# Selenium Reverse Proxy

Node.js reverse proxy which allows inserting an authorization header into requests sent to a Selenium server or grid.

## Installation

Installing the CLI tool globally:

```bash
$ npm i selenium-reverse-proxy -g
```

Alternatively, you may want to install the CLI tool within an existing Node.js project:

```bash
$ npm install selenium-reverse-proxy
```

## Configuration

To generate a config.json proxy configuration file the first time, run `selenium-proxy --generate-config`.  

Set Selenium server or grid settings in config.json. For instance, if your grid is located at https://grid.example.com, then the configuration would look like this:

config.json
```json
{
    "grid": {
        "protocol": "https",
        "hostname": "grid.example.com",
        "port": 443,
        "path": ""
    }
}
```

NOTE: Replace grid.example.com with the URL to your Selenium grid or server.

For running tests on a local Selenium server, grid, or Docker container image, there's also a localhost configuration, included by default:

```json
{
    "localhost": {
        "protocol": "http",
        "hostname": "localhost",
        "port": 4444,
        "path": ""
    }
```

We assume that for remote setups, we're using the default https port 443, and that we are using HTTPS. For local configurations, we'll assume we're running the Selenium server or grid on port 4444 and with HTTP.

To use a specific configuration, set it as the environment variable `SELENIUM_PROXY_PROFILE`. For instance, if you have a configuration called "grid", then run:

```bash
$ export SELENIUM_PROXY_PROFILE=grid   # to connect to the remote server
$ selenium-proxy
```

Or use the command line arguments:

```bash
$ selenium-proxy --proxy-profile grid
```


## Starting the server

If you have Selenium running locally, then to start the proxy server and configuring it to use the default configuration, which forwards requests to localhost:4444, simply run the following command:

```bash
$ selenium-proxy
```


Note that the program first looks in the current directory for a config.json file, so the `--proxy-config` flag is only needed if the configuration file uses a different name or is in a different folder. For example:

```bash
$ selenium-proxy --proxy-config ../another_config.json
```

The proxy assumes the profile is called "localhost" by default, so to use the "grid" profile you created, pass in the name as an environment variable:

```bash
$ SELENIUM_PROXY_PROFILE=grid selenium-proxy
```

The proxy listens on port 3100 by default. To use another port, set the port as the `SELENIUM_PROXY_PORT` environment variable:

```bash
$ SELENIUM_PROXY_PROFILE=grid SELENIUM_PROXY_PORT=8100 selenium-proxy
```

Or use command line arguments:

```bash
$ selenium-proxy --proxy-port 8100 --proxy-profile grid --proxy-config config.json
```

Since the main use case of the reverse proxy server is to allow testing frameworks, such as Selenium, to access a Selenium grid secured with an authorization token, we will need to configure the server to add the authorization header to all requests to the Selenium server or grid:

```bash
$ SELENIUM_PROXY_ACCESS_TOKEN=<YOUR_TOKEN_HERE> SELENIUM_PROXY_PROFILE=grid selenium-proxy
```

## License

Copyright (c) James Mortensen, 2022 MIT License
