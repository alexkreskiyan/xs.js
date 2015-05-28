'use strict';

var http = require('http');
var fs = require('fs');
var path = require('path');
var sqlite3 = require('sqlite3').verbose();

var server = http.createServer(handleRequest);
server.listen(3900);

//create db with log table
var db = new sqlite3.Database('tmp/log.db');
var fields = {
    user: 'TEXT',
    device: 'TEXT',
    category: 'TEXT',
    name: 'TEXT',
    userAgent: 'TEXT',
    browserName: 'TEXT',
    browserVersion: 'TEXT',
    browserMajor: 'INTEGER',
    browserMinor: 'INTEGER',
    cpu: 'INTEGER',
    engineName: 'TEXT',
    engineVersion: 'TEXT',
    engineMajor: 'INTEGER',
    engineMinor: 'INTEGER',
    osName: 'TEXT',
    osVersion: 'INTEGER',
    event: 'TEXT'
};

db.run('CREATE TABLE if not exists log (' + Object.keys(fields).map(function (name) {
        return name + ' ' + fields[ name ];
    }) + ')');

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
    var db = new sqlite3.Database('tmp/log.db');
    db.get('SELECT name FROM log WHERE user=$user AND device=$device AND category=$category AND name=$name AND userAgent=$userAgent', {
        $user: body.user,
        $device: body.device,
        $category: body.category,
        $name: body.name,
        $userAgent: body.userAgent.userAgent
    }, function (err, row) {
        if (row) {

            return;
        }

        var sql = 'INSERT INTO log VALUES (' + Object.keys(fields).map(function (name) {
                return '$' + name;
            }).join(', ') + ')';
        db.run(sql, {
            $user: body.user,
            $device: body.device,
            $category: body.category,
            $name: body.name,
            $userAgent: body.userAgent.userAgent,
            $browserName: body.userAgent.browser.name,
            $browserVersion: body.userAgent.browser.version,
            $browserMajor: body.userAgent.browser.major,
            $browserMinor: body.userAgent.browser.minor,
            $cpu: body.userAgent.cpu.architecture,
            $engineName: body.userAgent.engine.name,
            $engineVersion: body.userAgent.engine.version,
            $engineMajor: body.userAgent.engine.major,
            $engineMinor: body.userAgent.engine.minor,
            $osName: body.userAgent.os.name,
            $osVersion: body.userAgent.os.version,
            $event: JSON.stringify(body.event)
        });
    });

    db.close();
}