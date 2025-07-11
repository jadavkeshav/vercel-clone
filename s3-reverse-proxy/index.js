const express = require('express');
const httpProxy = require('http-proxy');

const app = express();
const PORT = 8000;

const BASE_PATH = "https://vc-build-server.s3.us-east-1.amazonaws.com/__output";

const proxy = httpProxy.createProxy();

app.use((req, res) => {
    const hostname = req.hostname;
    const subdomain = hostname.split('.')[0];
    const resolvesTo = `${BASE_PATH}/${subdomain}`

    return proxy.web(req, res, { target: resolvesTo, changeOrigin: true });

})

proxy.on('proxyReq', (proxyReq, req, res) => {
    const url = req.url;
    if (url === '/')
        proxyReq.path += 'index.html'

})

proxy.on('error', (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).send('Something went wrong while processing your request.');
});

app.listen(PORT, () => console.log(`Proxy Running On PORT : ${PORT}`));