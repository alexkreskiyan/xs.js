'use strict';

var ws = require('ws');
var Controller = require('./controller/Connection');

//connected clients list
var connections = {};

//create new server
var server = new ws.Server({
    port: 3903
});
console.log('start');
server.on('connection', function (connection) {
    var id = Math.round(Math.random() * 1000);
    console.log('new connection', id);
    connections[ id ] = new Controller(connection);

    connection.on('close', function () {
        console.log('connection', id, 'closed');
        delete connections[ id ];
    });
});