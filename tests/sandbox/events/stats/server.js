'use strict';

var http = require('http');
var sqlite3 = require('sqlite3').verbose();

var server = http.createServer(function (request, response) {
    switch (request.url) {
        case '/stats':
            handleStats(request, response);
            break;
    }
});
server.listen(3901);

var db, fields;
var dbName = 'tmp/log.db';

function handleStats(request, response) {

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

    response.writeHead(200, headers);

    db = new sqlite3.Database(dbName);
    db.all('SELECT * FROM log', function (err, data) {
        for (var i = 0; i < data.length; i++) {
            data[ i ].event = JSON.parse(data[ i ].event);
        }
        response.write(JSON.stringify(data));
        response.end();
        db.close();
    });
}

//create db with log table
db = new sqlite3.Database(dbName);
fields = {
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