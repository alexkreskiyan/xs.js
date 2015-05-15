'use strict';

var ws = require('ws');

//connected clients list
var connections = {};

//create new server
var server = new ws.Server({
    port: 3001
});

server.on('connection', function (connection) {

    var id = Math.round(Math.random() * 1000);
    connections[ id ] = connection;
    console.log('new connection', id);

    connection.on('message', function (message) {
        console.log('message', message);

        connection.send(message);
    });

    connection.on('close', function () {
        console.log('connection closed', + id);
        delete connections[ id ];
    });

});