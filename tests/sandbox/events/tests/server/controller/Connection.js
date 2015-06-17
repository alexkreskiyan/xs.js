'use strict';

var Message = {
    Incoming: require('../message/Incoming'),
    Outgoing: require('../message/Outgoing')
};

var TestsController = require('./Tests');
var LogController = require('./Log');

var Controller = function (connection) {
    var me = this;

    me.tests = new TestsController();
    me.log = new LogController();
    me.connection = connection;

    console.log('connection controller created', me.tests);

    connection.on('message', function (message) {
        me.handle(new Message.Incoming(message));
    });
};
module.exports = Controller;

Controller.prototype.handle = function (message) {
    var me = this;
    console.log('handle incoming message', message.toString());

    var handler;

    switch (message.controller) {
        case 'tests':
            handler = me.tests;
            break;
        case 'log':
            handler = me.log;
            break;
        default:
            console.log('no handler for incoming message', message.toString(), '. message is ignored');

            return;
    }

    handler.handle(message).then(function (response) {
        console.log('send outgoing message', response.toString());
        me.connection.send(response.toString());
    });
};