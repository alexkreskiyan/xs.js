'use strict';

var http = require('http');
var sqlite3 = require('sqlite3').verbose();
var url = require('url');

var server = http.createServer(function (request, response) {
    var location = url.parse(request.url, true);

    switch (location.pathname) {
        case '/stats':
            handleStats(request, location, response);
            break;
    }
});
server.listen(3901);

var dbNames = [
    'domEventsTests',
    'xsEventsTests'
];

function handleStats(request, url, response) {

    var headers = {
        'Access-Control-Allow-Origin': request.headers.origin,
        'Access-Control-Allow-Methods': 'OPTIONS,GET,HEAD,POST,PUT,DELETE',
        'Access-Control-Allow-Headers': 'Content-Type'
    };

    if (request.method === 'OPTIONS') {
        response.writeHead(200, headers);
        response.end();

        return;
    }

    headers[ 'Content-Type' ] = 'application/json';

    var name = url.query.db;

    if (dbNames.indexOf(name) < 0) {
        response.writeHead(404, headers);
        response.end();

        return;
    }

    response.writeHead(200, headers);

    var db = new sqlite3.Database(getDbPath(name));
    db.all('SELECT * FROM log', function (err, data) {
        for (var i = 0; i < data.length; i++) {
            data[ i ].event = JSON.parse(data[ i ].event);
        }
        response.write(JSON.stringify(data));
        response.end();
        db.close();
    });
}

//create dbs with log table
dbNames.forEach(function (name) {
    var db = new sqlite3.Database(getDbPath(name));
    var fields = {
        user: 'TEXT',
        device: 'TEXT',
        time: 'TEXT',
        test: 'TEXT',
        stage: 'TEXT',
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
});

function getDbPath(name) {
    return 'tmp/' + name + '.db';
}