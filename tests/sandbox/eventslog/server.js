'use strict';

var http = require('http');
var fs = require('fs');
var path = require('path');

var server = http.createServer(handleRequest);
server.listen(3900);

function handleRequest(request, response) {

    var headers = {
        'Access-Control-Allow-Origin': request.headers.origin,
        'Access-Control-Allow-Methods': 'OPTIONS,GET,HEAD,POST,PUT,DELETE'
    };

    if (request.method === 'OPTIONS') {
        response.writeHead(200, headers);
        response.end();

        return;
    }

    response.writeHead(200, headers);

    var body = '';
    request.on('data', function (data) {
        body += data;
    });

    request.on('end', function () {
        response.write(body);
        response.end();
        logRequest(JSON.parse(body));
    });
}

function logRequest(body) {
    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database('tmp/log.db');
    db.serialize(function () {
        var fields = [
            'category TEXT',
            'name TEXT',
            'userAgent TEXT',
            'browserName TEXT',
            'browserVersion TEXT',
            'browserMajor INTEGER',
            'browserMinor INTEGER',
            'cpu INTEGER',
            'engineName TEXT',
            'engineVersion TEXT',
            'engineMajor INTEGER',
            'engineMinor INTEGER',
            'osName TEXT',
            'osVersion INTEGER',
            'event TEXT'
        ];

        db.run('CREATE TABLE if not exists log (' + fields.join(', ') + ')');
        var stmt = db.prepare('INSERT INTO log VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
        stmt.run.apply(stmt, [
            body.category,
            body.name,
            body.userAgent.userAgent,
            body.userAgent.browser.name,
            body.userAgent.browser.version,
            body.userAgent.browser.major,
            body.userAgent.browser.minor,
            body.userAgent.cpu.architecture,
            body.userAgent.engine.name,
            body.userAgent.engine.version,
            body.userAgent.engine.major,
            body.userAgent.engine.minor,
            body.userAgent.os.name,
            body.userAgent.os.version,
            JSON.stringify(body.event)
        ]);
        stmt.finalize();
    });

    db.close();
}