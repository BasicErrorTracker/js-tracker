const http = require('http');
const fs = require('fs');
const url = require('url');

const server = http.createServer(function (request, response) {
    const urlData = url.parse(request.url);
    let body;

    if (urlData.path === '/dist/error-tracker.min.js') {
        body = fs.readFileSync('dist/error-tracker.min.js');
        const content_length = body.length;

        response.writeHead(200, {
            'Content-Length': content_length,
            'Content-Type': 'application/javascript'
        });
    } else {
        body = fs.readFileSync('selenium/index.html');
        const content_length = body.length;

        response.writeHead(200, {
            'Content-Length': content_length,
            'Content-Type': 'text/html'
        });
    }

    response.end(body);
});

module.exports = server;
