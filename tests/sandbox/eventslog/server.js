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
    time: 'TEXT',
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
db.close();

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
        pool.add(JSON.parse(body));
    });
}

var pool = (function (dbName) {
    var me = {};
    var db;
    var isProcessing = false;
    var stack = [];

    me.add = function (message) {
        //console.log('stack contains', stack.length, 'items. adding');
        stack.push(message);
        if (!isProcessing) {
            //console.log('start stack processing');
            isProcessing = true;
            db = new sqlite3.Database(dbName);
            process();
        } else {
            //console.log('stack is already processing');
        }
    };

    var process = function () {
        if (stack.length) {
            //console.log('stack is not empty, write next message');
            write(stack.shift(), process);
        } else {
            //console.log('stack processing ended');
            isProcessing = false;
            db.close();
        }
    };

    var write = function (data, callback) {
        //console.log('check existing data');
        db.get('SELECT COUNT(*) AS count FROM log WHERE user=$user AND device=$device AND category=$category AND name=$name AND userAgent=$userAgent', {
            $user: data.user,
            $device: data.device,
            $category: data.category,
            $name: data.name,
            $userAgent: data.userAgent.userAgent
        }, function (err, row) {
            //console.log('fetched count:', row.count);
            if (row && row.count >= 10) {

                //console.log('too much data. end');
                callback();
                return;
            }

            //console.log('add new log entry');
            var sql = 'INSERT INTO log VALUES (' + Object.keys(fields).map(function (name) {
                    return '$' + name;
                }).join(', ') + ')';
            db.run(sql, {
                $user: data.user,
                $device: data.device,
                $time: data.time,
                $category: data.category,
                $name: data.name,
                $userAgent: data.userAgent.userAgent,
                $browserName: data.userAgent.browser.name,
                $browserVersion: data.userAgent.browser.version,
                $browserMajor: data.userAgent.browser.major,
                $browserMinor: data.userAgent.browser.minor,
                $cpu: data.userAgent.cpu.architecture,
                $engineName: data.userAgent.engine.name,
                $engineVersion: data.userAgent.engine.version,
                $engineMajor: data.userAgent.engine.major,
                $engineMinor: data.userAgent.engine.minor,
                $osName: data.userAgent.os.name,
                $osVersion: data.userAgent.os.version,
                $event: JSON.stringify(data.event)
            }, function () {
                //console.log('new log entry added. end');
                callback();
            });
        });
    };

    return me;
})('tmp/log.db');