'use strict';

var http = require('http');
var fs = require('fs');
var path = require('path');

var server = http.createServer(function (request, response) {
    switch (request.url) {
        case '/upload':
            handleUpload(request, response);
            break;
        case '/download':
            handleDownload(request, response);
            break;
        case '/revert':
            handleRevert(request, response);
            break;
        default:
            handleFail(response);
            break;
    }
});
server.listen(3000);

function handleUpload(request, response) {

    if (request.method === 'OPTIONS') {
        response.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST,GET',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        response.end();

        return;
    }

    receiveFile(request, response);
}

function handleDownload(request, response) {

    if (request.method === 'OPTIONS') {
        response.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST,GET'
        });
        response.end();

        return;
    }

    sendFile(response);
}

function handleRevert(request, response) {

    if (request.method === 'OPTIONS') {
        response.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST,GET',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        response.end();

        return;
    }

    revertFile(request, response);
}

function handleFail(response) {
    response.writeHead(404, {
        'Content-Type': 'text/plain'
    });
    response.write('Use /download to test file download and /upload to test file upload');
    response.end();
}

function receiveFile(request, response) {
    request.on('data', function () {
        request.pause();
        setTimeout(function () {
            request.resume();
        }, 10);
    });

    request.on('end', function () {
        response.writeHead(200, {
            'Access-Control-Allow-Origin': '*'
        });
        response.end();
    });
}

function sendFile(response) {
    var filePath = path.join(__dirname, 'file');

    var size = fs.statSync(filePath).size;

    response.writeHead(200, {
        'Content-Type': 'application/octet-stream',
        'Access-Control-Allow-Origin': '*',
        'Content-Length': size
    });

    var readStream = fs.createReadStream(filePath);

    readStream.on('data', function (data) {
        response.write(data);
        readStream.pause();
        setTimeout(function () {
            readStream.resume();
        }, 10);
    });

    readStream.on('end', function () {
        response.end();
    });
}

function revertFile(request, response) {
    request.on('data', function () {
        request.pause();
        setTimeout(function () {
            request.resume();
        }, 10);
    });

    request.on('end', function () {
        var filePath = path.join(__dirname, 'file');

        var size = fs.statSync(filePath).size;

        response.writeHead(200, {
            'Content-Type': 'application/octet-stream',
            'Web-Server': 'node',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Expose-Headers': 'Web-Server',
            'Content-Length': size
        });

        var readStream = fs.createReadStream(filePath);

        readStream.on('data', function (data) {
            response.write(data);
            readStream.pause();
            setTimeout(function () {
                readStream.resume();
            }, 10);
        });

        readStream.on('end', function () {
            response.end();
        });
    });

}