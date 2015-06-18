'use strict';

var ws = require('ws');
var Controller = require('./controller/Connection');

//connected clients list
var connections = {};

//create new server
var server = new ws.Server({
    port: 3903
});

server.on('connection', function (connection) {
    var id = Math.round(Math.random() * 1000);

    connections[ id ] = new Controller(connection);

    connection.on('close', function () {

        delete connections[ id ];
    });
});